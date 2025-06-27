-- Crear tabla de eventos deportivos
CREATE TABLE IF NOT EXISTS eventos_deportivos (
    id BIGSERIAL PRIMARY KEY,
    evento_id_externo VARCHAR(255) NOT NULL UNIQUE,
    nombre_evento VARCHAR(500) NOT NULL,
    liga VARCHAR(255),
    deporte VARCHAR(255),
    equipo_local VARCHAR(255),
    equipo_visitante VARCHAR(255),
    fecha_evento TIMESTAMP NOT NULL,
    estado VARCHAR(50) DEFAULT 'programado',
    temporada VARCHAR(255),
    descripcion TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_eventos_deportivos_fecha ON eventos_deportivos(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_deportivos_deporte ON eventos_deportivos(deporte);
CREATE INDEX IF NOT EXISTS idx_eventos_deportivos_liga ON eventos_deportivos(liga);
CREATE INDEX IF NOT EXISTS idx_eventos_deportivos_estado ON eventos_deportivos(estado);
CREATE INDEX IF NOT EXISTS idx_eventos_deportivos_externo ON eventos_deportivos(evento_id_externo);

-- Comentarios para documentación
COMMENT ON TABLE eventos_deportivos IS 'Tabla para almacenar eventos deportivos obtenidos de TheSportsDB API';
COMMENT ON COLUMN eventos_deportivos.evento_id_externo IS 'ID único del evento en TheSportsDB API';
COMMENT ON COLUMN eventos_deportivos.estado IS 'Estado del evento: programado, en_vivo, finalizado, cancelado';
COMMENT ON COLUMN eventos_deportivos.fecha_evento IS 'Fecha y hora del evento deportivo';
COMMENT ON COLUMN eventos_deportivos.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN eventos_deportivos.fecha_actualizacion IS 'Fecha de última actualización del registro';
