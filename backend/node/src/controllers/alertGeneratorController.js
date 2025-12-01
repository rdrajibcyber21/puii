import { generateSampleAlerts } from '../services/alertGeneratorService.js';
import { logger } from '../lib/logger.js';

/**
 * Generate sample alerts
 */
export const generateAlerts = async (req, res, next) => {
  try {
    const count = parseInt(req.query.count || '10', 10);
    const result = await generateSampleAlerts(count);
    
    return res.json({
      message: `Generated ${result.generated} sample alerts`,
      ...result,
    });
  } catch (error) {
    logger.error('Failed to generate alerts', { error: error.message });
    return next(error);
  }
};

