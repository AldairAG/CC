-- Script SQL para crear las tablas del sistema de cuotas dinámicas

-- Tabla de historial de cuotas
CREATE TABLE cuotas_historial (
    id BIGSERIAL PRIMARY KEY,
    cuota_evento_id BIGINT NOT NULL,
    evento_deportivo_id BIGINT NOT NULL,
    tipo_resultado VARCHAR(50) NOT NULL,
    valor_cuota_anterior DECIMAL(10,2) NOT NULL,
    valor_cuota_nueva DECIMAL(10,2) NOT NULL,
    fecha_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    razon_cambio VARCHAR(50) NOT NULL,
    porcentaje_cambio DECIMAL(5,2),
    volumen_apuestas_actual INTEGER,
    total_apostado_actual DECIMAL(15,2),
    detalles_cambio TEXT,
    CONSTRAINT fk_cuotas_historial_cuota_evento 
        FOREIGN KEY (cuota_evento_id) REFERENCES cuotas_evento(id),
    CONSTRAINT fk_cuotas_historial_evento_deportivo 
        FOREIGN KEY (evento_deportivo_id) REFERENCES eventos_deportivos(id)
);

-- Índices para cuotas_historial
CREATE INDEX idx_cuota_evento_fecha ON cuotas_historial(cuota_evento_id, fecha_cambio);
CREATE INDEX idx_evento_deportivo_fecha ON cuotas_historial(evento_deportivo_id, fecha_cambio);

-- Tabla de volumen de apuestas
CREATE TABLE volumen_apuestas (
    id BIGSERIAL PRIMARY KEY,
    evento_deportivo_id BIGINT NOT NULL,
    tipo_resultado VARCHAR(50) NOT NULL,
    numero_apuestas INTEGER NOT NULL DEFAULT 0,
    total_apostado DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    apuesta_promedio DECIMAL(10,2) DEFAULT 0.00,
    apuesta_maxima DECIMAL(10,2) DEFAULT 0.00,
    apuesta_minima DECIMAL(10,2) DEFAULT 0.00,
    porcentaje_distribucion DECIMAL(5,2) DEFAULT 0.00,
    tendencia_reciente VARCHAR(20),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_volumen_apuestas_evento_deportivo 
        FOREIGN KEY (evento_deportivo_id) REFERENCES eventos_deportivos(id),
    UNIQUE(evento_deportivo_id, tipo_resultado)
);

-- Índices para volumen_apuestas
CREATE INDEX idx_evento_tipo_resultado ON volumen_apuestas(evento_deportivo_id, tipo_resultado);
CREATE INDEX idx_fecha_actualizacion ON volumen_apuestas(fecha_actualizacion);

-- Tabla de políticas de cuotas
CREATE TABLE politicas_cuotas (
    id BIGSERIAL PRIMARY KEY,
    nombre_politica VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    variacion_maxima_porcentaje DECIMAL(5,2) DEFAULT 15.00,
    variacion_minima_tiempo_minutos INTEGER DEFAULT 5,
    cuota_minima DECIMAL(5,2) DEFAULT 1.01,
    cuota_maxima DECIMAL(5,2) DEFAULT 50.00,
    factor_volumen DECIMAL(5,4) DEFAULT 0.1000,
    factor_probabilidad DECIMAL(5,4) DEFAULT 0.7000,
    factor_mercado DECIMAL(5,4) DEFAULT 0.2000,
    margen_casa DECIMAL(5,2) DEFAULT 5.00,
    notificar_cambio_mayor_porcentaje DECIMAL(5,2) DEFAULT 10.00,
    notificar_usuarios_activos BOOLEAN DEFAULT TRUE,
    actualizar_automaticamente BOOLEAN DEFAULT TRUE,
    intervalo_actualizacion_minutos INTEGER DEFAULT 15,
    pausar_antes_evento_minutos INTEGER DEFAULT 30,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar política por defecto
INSERT INTO politicas_cuotas (
    nombre_politica, 
    descripcion,
    variacion_maxima_porcentaje,
    variacion_minima_tiempo_minutos,
    cuota_minima,
    cuota_maxima,
    factor_volumen,
    factor_probabilidad,
    factor_mercado,
    margen_casa,
    notificar_cambio_mayor_porcentaje,
    notificar_usuarios_activos,
    actualizar_automaticamente,
    intervalo_actualizacion_minutos,
    pausar_antes_evento_minutos,
    activa
) VALUES (
    'Política Estándar',
    'Política por defecto para cuotas dinámicas con configuración balanceada',
    15.00,  -- Máximo 15% de variación
    5,      -- Mínimo 5 minutos entre cambios
    1.01,   -- Cuota mínima
    50.00,  -- Cuota máxima
    0.1000, -- Factor de volumen 10%
    0.7000, -- Factor de probabilidad 70%
    0.2000, -- Factor de mercado 20%
    5.00,   -- Margen de casa 5%
    10.00,  -- Notificar cambios >10%
    TRUE,   -- Notificar usuarios activos
    TRUE,   -- Actualización automática habilitada
    15,     -- Actualizar cada 15 minutos
    30,     -- Pausar 30 minutos antes del evento
    TRUE    -- Política activa
);

-- Agregar columnas a la tabla eventos_deportivos si no existen
DO $$ 
BEGIN 
    -- Verificar si existe la columna estado
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'eventos_deportivos' AND column_name = 'estado'
    ) THEN
        ALTER TABLE eventos_deportivos ADD COLUMN estado VARCHAR(20) DEFAULT 'programado';
        UPDATE eventos_deportivos SET estado = 'programado' WHERE estado IS NULL;
    END IF;
END $$;

-- Comentarios para documentación
COMMENT ON TABLE cuotas_historial IS 'Historial de cambios de cuotas para event sourcing';
COMMENT ON TABLE volumen_apuestas IS 'Volumen de apuestas por evento y tipo de resultado';
COMMENT ON TABLE politicas_cuotas IS 'Configuración de políticas para cuotas dinámicas';

COMMENT ON COLUMN cuotas_historial.razon_cambio IS 'VOLUMEN_APUESTAS, ACTUALIZACION_AUTOMATICA, AJUSTE_MANUAL, FEED_EXTERNO, ANALISIS_PROBABILISTICO, GESTION_RIESGO, EVENTOS_MERCADO';
COMMENT ON COLUMN volumen_apuestas.tendencia_reciente IS 'SUBIENDO, BAJANDO, ESTABLE';
COMMENT ON COLUMN politicas_cuotas.factor_volumen IS 'Peso del factor de volumen en el cálculo (0-1)';
COMMENT ON COLUMN politicas_cuotas.factor_probabilidad IS 'Peso del factor de probabilidad en el cálculo (0-1)';
COMMENT ON COLUMN politicas_cuotas.factor_mercado IS 'Peso del factor de mercado externo en el cálculo (0-1)';
