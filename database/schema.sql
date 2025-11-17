CREATE TABLE IF NOT EXISTS network_events (
    id CHAR(36) PRIMARY KEY,
    source_ip VARCHAR(45) NOT NULL,
    destination_ip VARCHAR(45) NOT NULL,
    protocol ENUM('TCP','UDP','ICMP','HTTP','HTTPS') NOT NULL,
    payload_size INT UNSIGNED NOT NULL,
    metadata JSON NULL,
    threat_score DECIMAL(5,3) NOT NULL,
    threat_label ENUM('benign','suspicious','malicious') NOT NULL,
    response_action ENUM('allow','challenge','block_source') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id CHAR(36) PRIMARY KEY,
    event_id CHAR(36) NOT NULL,
    severity ENUM('low','medium','high','critical') NOT NULL,
    message VARCHAR(255) NOT NULL,
    acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES network_events(id)
);

CREATE TABLE IF NOT EXISTS response_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    threshold DECIMAL(5,3) NOT NULL,
    action ENUM('allow','challenge','block_source') NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS threat_reports (
    id CHAR(36) PRIMARY KEY,
    generated_by VARCHAR(120) NOT NULL,
    filters JSON,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blocked_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_ip VARCHAR(45) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
