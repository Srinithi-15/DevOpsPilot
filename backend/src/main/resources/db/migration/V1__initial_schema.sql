-- ==============================================================================
-- DevOpsPilot Initial Schema Migration V1
-- Creates: service_registry, deployment_records
-- ==============================================================================

-- 1. Service Registry Table
CREATE TABLE IF NOT EXISTS service_registry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    repository_url VARCHAR(255) NULL,
    environment VARCHAR(50) NOT NULL DEFAULT 'development',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_environment (environment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Deployment Records Table
CREATE TABLE IF NOT EXISTS deployment_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT NOT NULL,
    version VARCHAR(50) NOT NULL,
    deployment_status VARCHAR(50) NOT NULL,
    deployed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deployment_message TEXT NULL,
    CONSTRAINT fk_deployment_service
        FOREIGN KEY (service_id)
        REFERENCES service_registry(id)
        ON DELETE CASCADE,
    INDEX idx_deployment_service_id (service_id),
    INDEX idx_deployment_status (deployment_status),
    INDEX idx_deployment_deployed_at (deployed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
