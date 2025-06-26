-- Migración para crear las tablas de quinielas creadas por usuarios
-- Versión 3: Crear tablas de quinielas

-- Tabla principal de quinielas creadas por usuarios
CREATE TABLE quinielas_creadas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    creador_id BIGINT NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    precio_entrada DECIMAL(10, 2) NOT NULL,
    premio_total DECIMAL(10, 2),
    max_participantes INT,
    participantes_actuales INT NOT NULL DEFAULT 0,
    estado ENUM('ACTIVA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA') NOT NULL DEFAULT 'ACTIVA',
    tipo_distribucion VARCHAR(50) NOT NULL DEFAULT 'WINNER_TAKES_ALL',
    porcentaje_premio_primero INT DEFAULT 100,
    porcentaje_premio_segundo INT DEFAULT 0,
    porcentaje_premio_tercero INT DEFAULT 0,
    es_publica BOOLEAN NOT NULL DEFAULT TRUE,
    codigo_invitacion VARCHAR(20),
    es_crypto BOOLEAN NOT NULL DEFAULT FALSE,
    crypto_tipo VARCHAR(10),
    premios_distribuidos BOOLEAN NOT NULL DEFAULT FALSE,
    
    INDEX idx_creador_fecha (creador_id, fecha_creacion),
    INDEX idx_estado_fecha (estado, fecha_inicio),
    INDEX idx_publica_estado (es_publica, estado),
    INDEX idx_codigo_invitacion (codigo_invitacion)
);

-- Tabla de participaciones en quinielas
CREATE TABLE participaciones_quiniela (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiniela_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    fecha_participacion DATETIME NOT NULL,
    monto_pagado DECIMAL(10, 2) NOT NULL,
    puntos_obtenidos INT DEFAULT 0,
    posicion_final INT,
    premio_ganado DECIMAL(10, 2),
    premio_reclamado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_reclamo_premio DATETIME,
    estado ENUM('ACTIVA', 'ELIMINADA', 'FINALIZADA') NOT NULL DEFAULT 'ACTIVA',
    
    FOREIGN KEY (quiniela_id) REFERENCES quinielas_creadas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participacion (quiniela_id, usuario_id),
    INDEX idx_usuario_fecha (usuario_id, fecha_participacion),
    INDEX idx_quiniela_puntos (quiniela_id, puntos_obtenidos DESC),
    INDEX idx_premio_pendiente (premio_reclamado, usuario_id)
);

-- Tabla de eventos de quiniela
CREATE TABLE quiniela_eventos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiniela_id BIGINT NOT NULL,
    evento_id BIGINT NOT NULL,
    nombre_evento VARCHAR(255) NOT NULL,
    fecha_evento DATETIME NOT NULL,
    equipo_local VARCHAR(255) NOT NULL,
    equipo_visitante VARCHAR(255) NOT NULL,
    resultado_local INT,
    resultado_visitante INT,
    puntos_por_acierto INT NOT NULL DEFAULT 3,
    puntos_por_resultado_exacto INT NOT NULL DEFAULT 5,
    estado ENUM('PROGRAMADO', 'EN_VIVO', 'FINALIZADO', 'CANCELADO') NOT NULL DEFAULT 'PROGRAMADO',
    finalizado BOOLEAN NOT NULL DEFAULT FALSE,
    
    FOREIGN KEY (quiniela_id) REFERENCES quinielas_creadas(id) ON DELETE CASCADE,
    INDEX idx_quiniela_fecha (quiniela_id, fecha_evento),
    INDEX idx_finalizado (finalizado, fecha_evento)
);

-- Tabla de predicciones de usuarios
CREATE TABLE quiniela_predicciones (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    participacion_id BIGINT NOT NULL,
    evento_id BIGINT NOT NULL,
    prediccion_local INT,
    prediccion_visitante INT,
    fecha_prediccion DATETIME NOT NULL,
    puntos_obtenidos INT DEFAULT 0,
    es_resultado_exacto BOOLEAN NOT NULL DEFAULT FALSE,
    es_acierto_ganador BOOLEAN NOT NULL DEFAULT FALSE,
    
    FOREIGN KEY (participacion_id) REFERENCES participaciones_quiniela(id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES quiniela_eventos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_prediccion (participacion_id, evento_id),
    INDEX idx_participacion (participacion_id),
    INDEX idx_evento (evento_id)
);

-- Tabla de premios de quiniela
CREATE TABLE premios_quiniela (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiniela_id BIGINT NOT NULL,
    posicion INT NOT NULL,
    monto_premio DECIMAL(10, 2) NOT NULL,
    porcentaje_premio INT NOT NULL,
    usuario_ganador_id BIGINT,
    fecha_asignacion DATETIME,
    premio_reclamado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_reclamo DATETIME,
    descripcion VARCHAR(255),
    
    FOREIGN KEY (quiniela_id) REFERENCES quinielas_creadas(id) ON DELETE CASCADE,
    INDEX idx_quiniela_posicion (quiniela_id, posicion),
    INDEX idx_ganador (usuario_ganador_id),
    INDEX idx_reclamo_pendiente (premio_reclamado, usuario_ganador_id)
);

-- Datos iniciales de ejemplo
INSERT INTO quinielas_creadas (
    nombre, descripcion, creador_id, fecha_creacion, fecha_inicio, fecha_fin,
    precio_entrada, tipo_distribucion, es_publica
) VALUES 
(
    'Quiniela Copa del Mundo 2026', 
    'Participa en nuestra quiniela de la Copa del Mundo 2026. Predice los resultados y gana premios increíbles.',
    1, 
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    DATE_ADD(NOW(), INTERVAL 60 DAY),
    25.00,
    'TOP_3',
    TRUE
),
(
    'Liga Premium VIP', 
    'Quiniela exclusiva para usuarios VIP con premios en criptomonedas.',
    1, 
    NOW(),
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    DATE_ADD(NOW(), INTERVAL 14 DAY),
    0.01,
    'WINNER_TAKES_ALL',
    FALSE
);

-- Actualizar las quinielas con código de invitación para la privada
UPDATE quinielas_creadas 
SET codigo_invitacion = 'VIP2026A', es_crypto = TRUE, crypto_tipo = 'BTC'
WHERE nombre = 'Liga Premium VIP';
