-- Crear tabla de apuestas
CREATE TABLE IF NOT EXISTS apuestas (
    id_apuesta BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_evento BIGINT NOT NULL,
    tipo_apuesta VARCHAR(50) NOT NULL,
    estado_apuesta VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    monto_apuesta DECIMAL(10,2) NOT NULL,
    cuota_apuesta DECIMAL(5,2) NOT NULL,
    ganancia_potencial DECIMAL(10,2),
    ganancia_real DECIMAL(10,2),
    detalle_apuesta TEXT,
    prediccion_usuario TEXT,
    resultado_real TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    observaciones TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE,
    INDEX idx_usuario_fecha (id_usuario, fecha_creacion),
    INDEX idx_evento (id_evento),
    INDEX idx_estado (estado_apuesta),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- Agregar constraints para validaciones
ALTER TABLE apuestas ADD CONSTRAINT chk_monto_positivo CHECK (monto_apuesta > 0);
ALTER TABLE apuestas ADD CONSTRAINT chk_cuota_valida CHECK (cuota_apuesta >= 1.01);
ALTER TABLE apuestas ADD CONSTRAINT chk_ganancia_potencial CHECK (ganancia_potencial >= 0);

-- Crear índices adicionales para optimizar consultas
CREATE INDEX idx_apuestas_usuario_estado ON apuestas(id_usuario, estado_apuesta);
CREATE INDEX idx_apuestas_evento_tipo ON apuestas(id_evento, tipo_apuesta);
CREATE INDEX idx_apuestas_fecha_resolucion ON apuestas(fecha_resolucion);

-- Insertar datos de ejemplo para testing (opcional)
-- INSERT INTO apuestas (id_usuario, id_evento, tipo_apuesta, monto_apuesta, cuota_apuesta, prediccion_usuario, detalle_apuesta)
-- VALUES 
-- (1, 1, 'GANADOR_PARTIDO', 100.00, 2.50, 'Equipo Local', 'Apuesta en el equipo local para ganar'),
-- (1, 1, 'TOTAL_GOLES', 50.00, 1.90, 'Más de 2.5 goles', 'Apuesta en que habrá más de 2.5 goles en el partido');

-- Crear vista para estadísticas rápidas
CREATE OR REPLACE VIEW vista_estadisticas_apuestas AS
SELECT 
    u.id_usuario,
    u.email,
    COUNT(a.id_apuesta) as total_apuestas,
    COUNT(CASE WHEN a.estado_apuesta = 'GANADA' THEN 1 END) as apuestas_ganadas,
    COUNT(CASE WHEN a.estado_apuesta = 'PERDIDA' THEN 1 END) as apuestas_perdidas,
    COUNT(CASE WHEN a.estado_apuesta = 'PENDIENTE' THEN 1 END) as apuestas_pendientes,
    COALESCE(SUM(a.monto_apuesta), 0) as total_apostado,
    COALESCE(SUM(CASE WHEN a.estado_apuesta = 'GANADA' THEN a.ganancia_real ELSE 0 END), 0) as total_ganado,
    COALESCE(
        CASE 
            WHEN COUNT(CASE WHEN a.estado_apuesta IN ('GANADA', 'PERDIDA') THEN 1 END) > 0 
            THEN (COUNT(CASE WHEN a.estado_apuesta = 'GANADA' THEN 1 END) * 100.0) / COUNT(CASE WHEN a.estado_apuesta IN ('GANADA', 'PERDIDA') THEN 1 END)
            ELSE 0 
        END, 0
    ) as porcentaje_exito,
    COALESCE(MAX(CASE WHEN a.estado_apuesta = 'GANADA' THEN a.ganancia_real END), 0) as mayor_ganancia,
    COALESCE(MAX(CASE WHEN a.estado_apuesta = 'PERDIDA' THEN a.monto_apuesta END), 0) as mayor_perdida
FROM usuario u
LEFT JOIN apuestas a ON u.id_usuario = a.id_usuario
GROUP BY u.id_usuario, u.email;

-- Crear procedimiento almacenado para calcular estadísticas
DELIMITER //
CREATE PROCEDURE CalcularEstadisticasUsuario(IN p_id_usuario BIGINT)
BEGIN
    SELECT 
        total_apuestas,
        apuestas_ganadas,
        apuestas_perdidas,
        apuestas_pendientes,
        total_apostado,
        total_ganado,
        (total_ganado - total_apostado) as ganancia_neta,
        porcentaje_exito,
        mayor_ganancia,
        mayor_perdida
    FROM vista_estadisticas_apuestas 
    WHERE id_usuario = p_id_usuario;
END //
DELIMITER ;

-- Crear trigger para actualizar ganancia potencial automáticamente
DELIMITER //
CREATE TRIGGER tr_calcular_ganancia_potencial
BEFORE INSERT ON apuestas
FOR EACH ROW
BEGIN
    IF NEW.ganancia_potencial IS NULL THEN
        SET NEW.ganancia_potencial = NEW.monto_apuesta * NEW.cuota_apuesta;
    END IF;
END //
DELIMITER ;

-- Crear trigger para validar saldo antes de insertar apuesta
DELIMITER //
CREATE TRIGGER tr_validar_saldo_apuesta
BEFORE INSERT ON apuestas
FOR EACH ROW
BEGIN
    DECLARE saldo_actual DECIMAL(10,2);
    
    SELECT saldo_usuario INTO saldo_actual 
    FROM usuario 
    WHERE id_usuario = NEW.id_usuario;
    
    IF saldo_actual < NEW.monto_apuesta THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Saldo insuficiente para realizar la apuesta';
    END IF;
END //
DELIMITER ;
