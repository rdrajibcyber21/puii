import { v4 as uuid } from 'uuid';
import { query, closePool } from '../src/lib/db.js';

const SAMPLE_EVENTS = [
  {
    source_ip: '10.0.0.5',
    destination_ip: '172.16.0.2',
    protocol: 'HTTP',
    payload_size: 800,
    metadata: { byte_entropy: 5.2, failed_auth: 0 },
    threat_score: 0.21,
    threat_label: 'benign',
    response_action: 'allow',
  },
  {
    source_ip: '203.0.113.44',
    destination_ip: '172.16.0.10',
    protocol: 'TCP',
    payload_size: 1500,
    metadata: { byte_entropy: 7.4, failed_auth: 15 },
    threat_score: 0.74,
    threat_label: 'malicious',
    response_action: 'block_source',
  },
];

const run = async () => {
  try {
    for (const event of SAMPLE_EVENTS) {
      await query(
        `INSERT INTO network_events
         (id, source_ip, destination_ip, protocol, payload_size, metadata, threat_score, threat_label, response_action)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuid(),
          event.source_ip,
          event.destination_ip,
          event.protocol,
          event.payload_size,
          JSON.stringify(event.metadata),
          event.threat_score,
          event.threat_label,
          event.response_action,
        ],
      );
    }

    console.log('Seed data inserted.');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await closePool();
  }
};

run();
