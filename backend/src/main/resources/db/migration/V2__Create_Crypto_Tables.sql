-- Migración para módulo de criptomonedas
-- Archivo: V1__Create_Crypto_Tables.sql

-- Tabla de transacciones de criptomonedas
CREATE TABLE crypto_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('DEPOSIT', 'WITHDRAWAL') NOT NULL,
    crypto_type ENUM('BTC', 'ETH', 'SOL') NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    usd_amount DECIMAL(15, 2) NOT NULL,
    from_address VARCHAR(100) NOT NULL,
    to_address VARCHAR(100) NOT NULL,
    tx_hash VARCHAR(100) UNIQUE,
    status ENUM('PENDING', 'CONFIRMED', 'FAILED', 'PROCESSING') NOT NULL,
    confirmations INT NOT NULL DEFAULT 0,
    required_confirmations INT NOT NULL,
    fee DECIMAL(20, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    deposit_address VARCHAR(100),
    notes VARCHAR(500),
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_crypto_type (crypto_type),
    INDEX idx_tx_hash (tx_hash),
    INDEX idx_created_at (created_at)
);

-- Tabla de wallets de criptomonedas por usuario
CREATE TABLE crypto_wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    crypto_type ENUM('BTC', 'ETH', 'SOL') NOT NULL,
    balance DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    pending_deposits DECIMAL(20, 8) DEFAULT 0.00000000,
    pending_withdrawals DECIMAL(20, 8) DEFAULT 0.00000000,
    total_deposited DECIMAL(20, 8) DEFAULT 0.00000000,
    total_withdrawn DECIMAL(20, 8) DEFAULT 0.00000000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_crypto (user_id, crypto_type),
    INDEX idx_user_id (user_id),
    INDEX idx_crypto_type (crypto_type),
    INDEX idx_is_active (is_active)
);

-- Tabla de direcciones de depósito
CREATE TABLE crypto_deposit_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    crypto_type ENUM('BTC', 'ETH', 'SOL') NOT NULL,
    address VARCHAR(100) NOT NULL UNIQUE,
    private_key VARCHAR(100), -- Encriptado
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    transaction_id BIGINT NULL,
    notes VARCHAR(500),
    
    INDEX idx_user_id (user_id),
    INDEX idx_crypto_type (crypto_type),
    INDEX idx_address (address),
    INDEX idx_is_used (is_used),
    INDEX idx_is_active (is_active),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (transaction_id) REFERENCES crypto_transactions(id)
);

-- Tabla de configuración de redes (opcional)
CREATE TABLE crypto_networks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crypto_type ENUM('BTC', 'ETH', 'SOL') NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimals INT NOT NULL,
    confirmations_required INT NOT NULL,
    min_deposit DECIMAL(20, 8) NOT NULL,
    max_deposit DECIMAL(20, 8) NOT NULL,
    withdrawal_fee DECIMAL(20, 8) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rpc_url VARCHAR(255),
    explorer_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuración inicial de redes
INSERT INTO crypto_networks (crypto_type, name, symbol, decimals, confirmations_required, min_deposit, max_deposit, withdrawal_fee, rpc_url, explorer_url) VALUES
('BTC', 'Bitcoin', 'BTC', 8, 3, 0.00100000, 10.00000000, 0.00050000, 'https://bitcoin-mainnet.rpc.com', 'https://blockstream.info/tx/'),
('ETH', 'Ethereum', 'ETH', 18, 12, 0.01000000, 100.00000000, 0.00500000, 'https://ethereum-mainnet.rpc.com', 'https://etherscan.io/tx/'),
('SOL', 'Solana', 'SOL', 9, 1, 0.10000000, 1000.00000000, 0.01000000, 'https://api.mainnet-beta.solana.com', 'https://solscan.io/tx/');

-- Tabla de precios de criptomonedas (cache)
CREATE TABLE crypto_prices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crypto_type ENUM('BTC', 'ETH', 'SOL') NOT NULL UNIQUE,
    usd_price DECIMAL(15, 2) NOT NULL,
    change_percent_24h DECIMAL(5, 2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_crypto_type (crypto_type),
    INDEX idx_last_updated (last_updated)
);

-- Insertar precios iniciales
INSERT INTO crypto_prices (crypto_type, usd_price, change_percent_24h) VALUES
('BTC', 45000.00, 2.50),
('ETH', 3200.00, -1.20),
('SOL', 180.00, 5.80);

-- Agregar foreign key constraints si existe tabla de usuarios
-- ALTER TABLE crypto_transactions ADD CONSTRAINT fk_crypto_transactions_user_id 
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE crypto_wallets ADD CONSTRAINT fk_crypto_wallets_user_id 
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE crypto_deposit_addresses ADD CONSTRAINT fk_crypto_deposit_addresses_user_id 
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
