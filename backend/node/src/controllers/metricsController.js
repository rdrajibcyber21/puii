import { query } from '../lib/db.js';
import { logger } from '../lib/logger.js';

/**
 * Get IP request metrics and analysis
 */
export const getIPMetrics = async (req, res, next) => {
  // Extract parameters outside try block so they're available in catch
  const limit = parseInt(req.query.limit || '500', 10);
  const timeWindow = req.query.window || '24h'; // 1h, 24h, 7d

  try {
    // Calculate time threshold based on window
    let hoursAgo = 24;
    if (timeWindow === '1h') hoursAgo = 1;
    else if (timeWindow === '7d') hoursAgo = 168;

    // Get IP request statistics
    // Use MySQL DATE_SUB with string interpolation for hours (safe - hoursAgo is controlled)
    // Also interpolate limit to avoid prepared statement issues
    const ipStats = await query(
      `SELECT 
        source_ip,
        COUNT(*) as request_count,
        AVG(threat_score) as avg_threat_score,
        MAX(threat_score) as max_threat_score,
        MIN(threat_score) as min_threat_score,
        SUM(CASE WHEN threat_label = 'malicious' THEN 1 ELSE 0 END) as malicious_count,
        SUM(CASE WHEN threat_label = 'suspicious' THEN 1 ELSE 0 END) as suspicious_count,
        SUM(CASE WHEN threat_label = 'benign' THEN 1 ELSE 0 END) as benign_count,
        SUM(CASE WHEN response_action = 'block_source' THEN 1 ELSE 0 END) as blocked_count,
        AVG(payload_size) as avg_payload_size,
        MAX(created_at) as last_seen
      FROM network_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${hoursAgo} HOUR)
      GROUP BY source_ip
      ORDER BY request_count DESC
      LIMIT ${limit}`,
    );

    // Get destination IP statistics
    const destStats = await query(
      `SELECT 
        destination_ip,
        COUNT(*) as request_count,
        AVG(threat_score) as avg_threat_score,
        SUM(CASE WHEN threat_label = 'malicious' THEN 1 ELSE 0 END) as malicious_count
      FROM network_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${hoursAgo} HOUR)
      GROUP BY destination_ip
      ORDER BY request_count DESC
      LIMIT 50`,
    );

    // Get protocol distribution
    const protocolStats = await query(
      `SELECT 
        protocol,
        COUNT(*) as count,
        AVG(threat_score) as avg_threat_score
      FROM network_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${hoursAgo} HOUR)
      GROUP BY protocol
      ORDER BY count DESC`,
    );

    // Get time series data for requests
    const timeSeries = await query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as time_bucket,
        COUNT(*) as request_count,
        AVG(threat_score) as avg_threat_score
      FROM network_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${hoursAgo} HOUR)
      GROUP BY time_bucket
      ORDER BY time_bucket ASC`,
    );

    // Get top threat sources
    const topThreatSources = await query(
      `SELECT 
        source_ip,
        COUNT(*) as threat_count,
        AVG(threat_score) as avg_threat_score
      FROM network_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${hoursAgo} HOUR)
        AND threat_score > 0.7
      GROUP BY source_ip
      ORDER BY threat_count DESC, avg_threat_score DESC
      LIMIT 20`,
    );

    // Handle empty results gracefully
    if (!ipStats || ipStats.length === 0) {
      return res.json({
        ipStats: [],
        destStats: [],
        protocolStats: [],
        timeSeries: [],
        topThreatSources: [],
        totalIPs: 0,
        timeWindow,
        message: 'No network events found in the specified time window',
      });
    }

    res.json({
      ipStats: ipStats.map((stat) => ({
        ...stat,
        request_count: parseInt(stat.request_count, 10),
        avg_threat_score: parseFloat(stat.avg_threat_score || 0),
        max_threat_score: parseFloat(stat.max_threat_score || 0),
        min_threat_score: parseFloat(stat.min_threat_score || 0),
        malicious_count: parseInt(stat.malicious_count || 0, 10),
        suspicious_count: parseInt(stat.suspicious_count || 0, 10),
        benign_count: parseInt(stat.benign_count || 0, 10),
        blocked_count: parseInt(stat.blocked_count || 0, 10),
        avg_payload_size: parseFloat(stat.avg_payload_size || 0),
      })),
      destStats: destStats.map((stat) => ({
        ...stat,
        request_count: parseInt(stat.request_count, 10),
        avg_threat_score: parseFloat(stat.avg_threat_score),
        malicious_count: parseInt(stat.malicious_count, 10),
      })),
      protocolStats: protocolStats.map((stat) => ({
        ...stat,
        count: parseInt(stat.count, 10),
        avg_threat_score: parseFloat(stat.avg_threat_score),
      })),
      timeSeries: timeSeries.map((stat) => ({
        ...stat,
        request_count: parseInt(stat.request_count, 10),
        avg_threat_score: parseFloat(stat.avg_threat_score),
      })),
      topThreatSources: topThreatSources.map((stat) => ({
        ...stat,
        threat_count: parseInt(stat.threat_count, 10),
        avg_threat_score: parseFloat(stat.avg_threat_score),
      })),
      totalIPs: ipStats.length,
      timeWindow,
    });
  } catch (error) {
    logger.error('Failed to fetch IP metrics', { error: error.message });
    
    // Return empty data instead of throwing error to prevent 503
    // This allows the frontend to handle empty state gracefully
    return res.status(200).json({
      ipStats: [],
      destStats: [],
      protocolStats: [],
      timeSeries: [],
      topThreatSources: [],
      totalIPs: 0,
      timeWindow,
      message: 'Unable to fetch IP metrics. Database may be unavailable.',
      error: error.message,
    });
  }
};

