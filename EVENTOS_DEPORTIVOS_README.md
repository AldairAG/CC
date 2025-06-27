# Sistema de Eventos Deportivos

Este sistema sincroniza automáticamente eventos deportivos desde TheSportsDB API hacia la base de datos local.

## Características

- **Sincronización automática**: Todos los días a las 12:00 AM (medianoche)
- **Obtiene eventos de los próximos 7 días**
- **Limpieza automática**: Elimina eventos antiguos (más de 30 días) cada domingo a las 2:00 AM
- **API REST**: Endpoints para consultar eventos
- **Manejo de errores**: Logs detallados y manejo de excepciones

## Configuración

### Variables de entorno requeridas
```properties
# Base de datos (ya configuradas)
DB_URL=jdbc:postgresql://localhost:5432/casino_db
DB_USER_NAME=tu_usuario
DB_PASSWORD=tu_password
```

### Propiedades de TheSportsDB (ya configuradas en application.properties)
```properties
thesportsdb.api.key=722804
thesportsdb.api.base-url=https://www.thesportsdb.com/api/v1/json/722804
thesportsdb.api.timeout.connect=10000
thesportsdb.api.timeout.read=30000
```

## Tabla de Base de Datos

La tabla `eventos_deportivos` se crea automáticamente con la siguiente estructura:

```sql
- id: BIGSERIAL PRIMARY KEY
- evento_id_externo: VARCHAR(255) UNIQUE (ID de TheSportsDB)
- nombre_evento: VARCHAR(500)
- liga: VARCHAR(255)
- deporte: VARCHAR(255)
- equipo_local: VARCHAR(255)
- equipo_visitante: VARCHAR(255)
- fecha_evento: TIMESTAMP
- estado: VARCHAR(50) ('programado', 'en_vivo', 'finalizado', 'cancelado')
- temporada: VARCHAR(255)
- descripcion: TEXT
- fecha_creacion: TIMESTAMP
- fecha_actualizacion: TIMESTAMP
```

## Tareas Programadas

### Sincronización de Eventos
- **Frecuencia**: Diaria a las 12:00 AM
- **Zona horaria**: America/Mexico_City
- **Función**: Obtiene eventos de los próximos 7 días desde TheSportsDB

### Limpieza de Eventos Antiguos
- **Frecuencia**: Semanal (domingos a las 2:00 AM)
- **Zona horaria**: America/Mexico_City
- **Función**: Elimina eventos con más de 30 días de antigüedad

## API Endpoints

### Obtener eventos
```
GET /api/eventos-deportivos
Parámetros opcionales:
- fechaInicio: LocalDateTime (ISO format)
- fechaFin: LocalDateTime (ISO format)
- deporte: String
- liga: String
```

### Obtener eventos próximos (7 días)
```
GET /api/eventos-deportivos/proximos
```

### Obtener eventos por deporte
```
GET /api/eventos-deportivos/deporte/{deporte}
```

### Obtener eventos por liga
```
GET /api/eventos-deportivos/liga/{liga}
```

### Forzar sincronización manual
```
POST /api/eventos-deportivos/sincronizar
```

### Limpiar eventos antiguos
```
DELETE /api/eventos-deportivos/limpiar-antiguos
```

### Obtener estadísticas
```
GET /api/eventos-deportivos/estadisticas
```

## Logs

El sistema genera logs detallados:

- **INFO**: Inicio/fin de sincronizaciones y estadísticas
- **DEBUG**: Detalles de llamadas a API y procesamiento
- **ERROR**: Errores durante sincronización o procesamiento

## Ejemplos de Uso

### Consultar eventos de fútbol
```bash
curl "http://localhost:8080/api/eventos-deportivos/deporte/Soccer"
```

### Consultar eventos de una fecha específica
```bash
curl "http://localhost:8080/api/eventos-deportivos?fechaInicio=2024-01-01T00:00:00&fechaFin=2024-01-02T00:00:00"
```

### Forzar sincronización manual
```bash
curl -X POST "http://localhost:8080/api/eventos-deportivos/sincronizar"
```

## Monitoreo

Para monitorear el sistema:

1. **Logs de aplicación**: Buscar mensajes con "SINCRONIZACIÓN"
2. **Base de datos**: Consultar tabla `eventos_deportivos`
3. **API de estadísticas**: `/api/eventos-deportivos/estadisticas`

## Solución de Problemas

### La sincronización no funciona
1. Verificar que `@EnableScheduling` esté habilitado en `CcApplication`
2. Revisar logs por errores de conectividad a TheSportsDB
3. Verificar configuración de zona horaria

### No se obtienen eventos
1. Verificar API key de TheSportsDB
2. Revisar URL base de TheSportsDB
3. Verificar conectividad a internet

### Errores de base de datos
1. Verificar que la tabla `eventos_deportivos` existe
2. Revisar permisos de base de datos
3. Verificar configuración de conexión

## Notas Importantes

- La API de TheSportsDB tiene limitaciones de rate limiting
- Los eventos se actualizan automáticamente si ya existen
- El sistema maneja automáticamente diferentes formatos de fecha/hora
- Los estados se mapean automáticamente a valores estándar
