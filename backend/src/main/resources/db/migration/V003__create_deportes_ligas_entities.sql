-- Migración para crear las entidades Deporte y Liga separadas
-- Fecha: 2025-07-02

-- 1. Crear tabla deportes
CREATE TABLE IF NOT EXISTS deportes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    icono VARCHAR(255),
    color_primario VARCHAR(7), -- Para colores hex #FFFFFF
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear tabla ligas
CREATE TABLE IF NOT EXISTS ligas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    liga_id_externo VARCHAR(255), -- ID de TheSportsDB
    pais VARCHAR(255),
    temporada VARCHAR(255),
    descripcion TEXT,
    activa BOOLEAN NOT NULL DEFAULT true,
    logo_url VARCHAR(500),
    sitio_web VARCHAR(500),
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deporte_id BIGINT NOT NULL,
    CONSTRAINT fk_liga_deporte FOREIGN KEY (deporte_id) REFERENCES deportes(id)
);

-- 3. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_deportes_nombre ON deportes(nombre);
CREATE INDEX IF NOT EXISTS idx_deportes_activo ON deportes(activo);
CREATE INDEX IF NOT EXISTS idx_ligas_nombre ON ligas(nombre);
CREATE INDEX IF NOT EXISTS idx_ligas_activa ON ligas(activa);
CREATE INDEX IF NOT EXISTS idx_ligas_deporte ON ligas(deporte_id);
CREATE INDEX IF NOT EXISTS idx_ligas_pais ON ligas(pais);
CREATE INDEX IF NOT EXISTS idx_ligas_id_externo ON ligas(liga_id_externo);

-- 4. Insertar deportes básicos
INSERT INTO deportes (nombre, descripcion, activo, icono, color_primario) VALUES
('Soccer', 'Fútbol/Soccer - El deporte más popular del mundo', true, '⚽', '#00A650'),
('Basketball', 'Baloncesto - Deporte de canasta', true, '🏀', '#FF6B35'),
('American Football', 'Fútbol Americano - NFL', true, '🏈', '#8B4513'),
('Baseball', 'Béisbol - MLB', true, '⚾', '#FF0000'),
('Tennis', 'Tenis - Deporte de raqueta', true, '🎾', '#FFFF00'),
('Hockey', 'Hockey sobre hielo - NHL', true, '🏒', '#0066CC'),
('Volleyball', 'Voleibol - Deporte de equipo', true, '🏐', '#FF69B4'),
('Golf', 'Golf - Deporte individual', true, '⛳', '#228B22')
ON CONFLICT (nombre) DO NOTHING;

-- 5. Insertar ligas famosas de fútbol
INSERT INTO ligas (nombre, liga_id_externo, pais, descripcion, activa, deporte_id) VALUES
-- Ligas Europeas
('English Premier League', '4328', 'England', 'La liga de fútbol más competitiva del mundo', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),
('Spanish La Liga', '4335', 'Spain', 'Primera División de España', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),
('Italian Serie A', '4331', 'Italy', 'Primera División de Italia', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),
('German Bundesliga', '4334', 'Germany', 'Liga alemana de fútbol', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),
('French Ligue 1', '4346', 'France', 'Primera División de Francia', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),
('UEFA Champions League', '4480', 'Europe', 'Máxima competición europea de clubes', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),

-- Ligas Mexicanas
('Liga MX', '4299', 'Mexico', 'Primera División Mexicana', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),
('Liga de Expansión MX', '4300', 'Mexico', 'Segunda División Mexicana', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer')),
('Copa MX', '4301', 'Mexico', 'Copa Nacional de México', true, 
 (SELECT id FROM deportes WHERE nombre = 'Soccer'))

ON CONFLICT (nombre) DO NOTHING;

-- 6. Agregar columnas a eventos_deportivos para las nuevas relaciones
ALTER TABLE eventos_deportivos 
ADD COLUMN IF NOT EXISTS liga_id BIGINT,
ADD COLUMN IF NOT EXISTS deporte_id BIGINT;

-- 7. Crear las foreign keys para eventos_deportivos
ALTER TABLE eventos_deportivos 
ADD CONSTRAINT IF NOT EXISTS fk_evento_liga 
FOREIGN KEY (liga_id) REFERENCES ligas(id);

ALTER TABLE eventos_deportivos 
ADD CONSTRAINT IF NOT EXISTS fk_evento_deporte 
FOREIGN KEY (deporte_id) REFERENCES deportes(id);

-- 8. Migrar datos existentes (si existen)
-- Actualizar eventos existentes con las nuevas relaciones basadas en los nombres
UPDATE eventos_deportivos 
SET deporte_id = (SELECT id FROM deportes WHERE LOWER(nombre) = LOWER(eventos_deportivos.deporte))
WHERE deporte_id IS NULL AND deporte IS NOT NULL;

UPDATE eventos_deportivos 
SET liga_id = (SELECT id FROM ligas WHERE LOWER(nombre) = LOWER(eventos_deportivos.liga))
WHERE liga_id IS NULL AND liga IS NOT NULL;

-- 9. Crear índices para eventos_deportivos
CREATE INDEX IF NOT EXISTS idx_eventos_liga ON eventos_deportivos(liga_id);
CREATE INDEX IF NOT EXISTS idx_eventos_deporte ON eventos_deportivos(deporte_id);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos_deportivos(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON eventos_deportivos(estado);

-- 10. Comentarios para documentación
COMMENT ON TABLE deportes IS 'Catálogo de deportes disponibles en la plataforma';
COMMENT ON TABLE ligas IS 'Catálogo de ligas/competiciones deportivas';
COMMENT ON COLUMN deportes.color_primario IS 'Color principal del deporte en formato hex (#FFFFFF)';
COMMENT ON COLUMN ligas.liga_id_externo IS 'ID de la liga en APIs externas como TheSportsDB';

-- 11. Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Triggers para actualizar automáticamente fecha_actualizacion
DROP TRIGGER IF EXISTS update_deportes_updated_at ON deportes;
CREATE TRIGGER update_deportes_updated_at
    BEFORE UPDATE ON deportes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ligas_updated_at ON ligas;
CREATE TRIGGER update_ligas_updated_at
    BEFORE UPDATE ON ligas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de confirmación
SELECT 'Migración completada exitosamente. Se crearon las tablas deportes y ligas con sus relaciones.' as resultado;
