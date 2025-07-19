-- Script para actualizar tablas de criptomonedas
-- Ejecutar después de la implementación para asegurar compatibilidad

-- Actualizar tabla crypto_wallets si es necesario
ALTER TABLE crypto_wallets 
ADD COLUMN IF NOT EXISTS address VARCHAR(255) NOT NULL DEFAULT '';

-- Actualizar índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_user_crypto 
ON crypto_wallets(user_id, crypto_type);

CREATE INDEX IF NOT EXISTS idx_crypto_wallets_active 
ON crypto_wallets(is_active);

CREATE INDEX IF NOT EXISTS idx_crypto_transactions_user_status 
ON crypto_transactions(user_id, status);

CREATE INDEX IF NOT EXISTS idx_crypto_transactions_type_status 
ON crypto_transactions(type, status);

CREATE INDEX IF NOT EXISTS idx_crypto_transactions_status_created 
ON crypto_transactions(status, created_at);

-- Verificar que los enums incluyen los nuevos valores
-- Nota: Estos comandos son específicos para PostgreSQL
-- Para otros SGBD, ajustar según sea necesario

-- Insertar datos de ejemplo para testing (opcional)
-- INSERT INTO crypto_wallets (user_id, crypto_type, address, balance, pending_deposits, pending_withdrawals, total_deposited, total_withdrawn, is_active)
-- VALUES 
-- (1, 'BTC', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, true),
-- (1, 'ETH', '0x742d35cc6634c0532925a3b8d401301903f96e5b', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, true),
-- (1, 'SOL', '11111111111111111111111111111112', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, true),
-- (1, 'TRC20', 'TLsV52sRDL79HXGKw8bHKyirsqfpZmF6hL', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, true);

-- Verificar integridad de datos
SELECT 
    'crypto_wallets' as table_name,
    COUNT(*) as total_records,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT crypto_type) as crypto_types
FROM crypto_wallets
UNION ALL
SELECT 
    'crypto_transactions' as table_name,
    COUNT(*) as total_records,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT crypto_type) as crypto_types
FROM crypto_transactions;

-- Verificar tipos de criptomonedas soportadas
SELECT DISTINCT crypto_type FROM crypto_wallets
UNION
SELECT DISTINCT crypto_type FROM crypto_transactions;

-- Verificar estados de transacciones
SELECT 
    status,
    COUNT(*) as count
FROM crypto_transactions
GROUP BY status
ORDER BY count DESC;
