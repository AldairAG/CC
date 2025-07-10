# Verificación y Creación Automática de Cuotas

## Descripción General

Se ha implementado un sistema completo de verificación y creación automática de cuotas para eventos deportivos. El sistema verifica si un evento tiene todas las cuotas requeridas (todos los tipos de `TipoResultado`) y crea automáticamente las que faltan.

## Funcionalidades Implementadas

### 1. Verificación Automática en Tiempo Real

Cuando se crea o actualiza un evento a través del `TheSportsDbService`, el sistema automáticamente:
- Verifica si el evento está en estado "programado" o "en_vivo"
- Comprueba si tiene todas las cuotas completas
- Crea automáticamente las cuotas faltantes

### 2. Métodos de Verificación

#### En `TheSportsDbService`:

**`verificarCuotasCompletas(Long eventoId)`**
- Verifica si un evento tiene todas las cuotas requeridas
- Retorna `true` si están completas, `false` si faltan algunas

**`determinarCuotasFaltantes(Long eventoId)`**
- Retorna lista de tipos de cuotas que faltan para un evento
- Útil para diagnóstico detallado

**`crearCuotasFaltantes(Long eventoId)`**
- Crea las cuotas faltantes para un evento específico
- Retorna `true` si se crearon cuotas, `false` si no fue necesario

### 3. Métodos de Verificación Masiva

**`verificarYCrearCuotasMultiples(List<Long> eventosIds)`**
- Verifica y crea cuotas para múltiples eventos
- Retorna estadísticas detalladas de la operación

**`verificarCuotasEventosActivos()`**
- Verifica cuotas para todos los eventos "programados" y "en_vivo"
- Proceso automatizado para mantener cuotas actualizadas

**`verificarCuotasEventosPorEstados(List<String> estados)`**
- Verifica cuotas para eventos con estados específicos
- Permite filtrar por estados como ["programado", "en_vivo", "finalizado"]

**`verificarCuotasEventosProximos(int diasAdelante)`**
- Verifica cuotas para eventos de los próximos N días
- Útil para preparación anticipada

### 4. Métodos de Análisis

**`obtenerEstadisticasCuotasEvento(Long eventoId)`**
- Retorna estadísticas completas sobre las cuotas de un evento
- Incluye porcentaje de completitud y distribución por mercado

**`verificarCuotasDetalladasEvento(Long eventoId)`**
- Análisis detallado del estado de cuotas por mercado
- Información completa del evento y sus cuotas

**`forzarCreacionCuotas(Long eventoId)`**
- Fuerza la creación de cuotas incluso si ya existen
- Útil para regenerar cuotas con nuevos valores

## Endpoints REST Disponibles

### Verificación Individual

```http
GET /cc/eventos-deportivos/{eventoId}/verificar-cuotas
```
Verifica si un evento tiene cuotas completas.

```http
GET /cc/eventos-deportivos/{eventoId}/cuotas-faltantes
```
Obtiene la lista de cuotas faltantes para un evento.

```http
POST /cc/eventos-deportivos/{eventoId}/crear-cuotas-faltantes
```
Crea las cuotas faltantes para un evento específico.

### Análisis Detallado

```http
GET /cc/eventos-deportivos/{eventoId}/estadisticas-cuotas
```
Estadísticas completas de cuotas del evento.

```http
GET /cc/eventos-deportivos/{eventoId}/cuotas-detalladas
```
Información detallada por mercado de las cuotas.

```http
POST /cc/eventos-deportivos/{eventoId}/forzar-creacion-cuotas
```
Fuerza la creación de cuotas (incluso si ya existen).

### Verificación Masiva

```http
POST /cc/eventos-deportivos/verificar-cuotas-eventos-activos
```
Verifica cuotas para todos los eventos programados y en vivo.

```http
POST /cc/eventos-deportivos/verificar-cuotas-por-estados
```
Verifica cuotas para eventos con estados específicos.
```json
{
  "estados": ["programado", "en_vivo"]
}
```

```http
POST /cc/eventos-deportivos/verificar-cuotas-proximos?diasAdelante=7
```
Verifica cuotas para eventos de los próximos N días.

## Tipos de Cuotas Verificados

El sistema verifica todos los tipos definidos en `TipoResultado`:

### Mercados Principales:
- **resultado-final**: LOCAL, VISITANTE, EMPATE
- **doble-oportunidad**: LOCAL_EMPATE, LOCAL_VISITANTE, VISITANTE_EMPATE
- **both-teams-score**: AMBOS_ANOTAN, NO_AMBOS_ANOTAN
- **total-goles**: OVER/UNDER (0.5, 1.5, 2.5, 3.5)
- **handicap**: Varios tipos de hándicap europeo y asiático
- **marcador-correcto**: Resultados exactos comunes
- **anotadores**: Primer goleador, sin goles
- **tarjetas**: Over/Under tarjetas
- **corners**: Over/Under corners
- **metodo-clasificacion**: Clasificación en tiempo regular o penales
- **mitades**: Resultados y totales por mitades

## Uso Recomendado

### 1. Verificación Automática
El sistema funciona automáticamente. Cuando se importan eventos desde TheSportsDB, las cuotas se crean automáticamente.

### 2. Mantenimiento Manual
Para verificar manualmente:
```bash
# Verificar eventos activos
curl -X POST http://localhost:8080/cc/eventos-deportivos/verificar-cuotas-eventos-activos

# Verificar eventos próximos
curl -X POST http://localhost:8080/cc/eventos-deportivos/verificar-cuotas-proximos?diasAdelante=3
```

### 3. Diagnóstico de Evento Específico
```bash
# Ver cuotas detalladas
curl http://localhost:8080/cc/eventos-deportivos/123/cuotas-detalladas

# Ver estadísticas
curl http://localhost:8080/cc/eventos-deportivos/123/estadisticas-cuotas
```

### 4. Corrección de Problemas
```bash
# Crear cuotas faltantes
curl -X POST http://localhost:8080/cc/eventos-deportivos/123/crear-cuotas-faltantes

# Forzar recreación completa
curl -X POST http://localhost:8080/cc/eventos-deportivos/123/forzar-creacion-cuotas
```

## Estructura de Respuestas

### Respuesta de Verificación:
```json
{
  "status": "success",
  "eventoId": 123,
  "nombreEvento": "Real Madrid vs Barcelona",
  "cuotasCompletas": true,
  "message": "El evento tiene cuotas completas"
}
```

### Respuesta de Estadísticas:
```json
{
  "status": "success",
  "datos": {
    "totalCuotasExistentes": 45,
    "totalTiposRequeridos": 50,
    "totalCuotasFaltantes": 5,
    "cuotasCompletas": false,
    "porcentajeCompletitud": 90.0,
    "cuotasPorMercado": {
      "resultado-final": 3,
      "total-goles": 8,
      "handicap": 12
    }
  }
}
```

### Respuesta de Operación Masiva:
```json
{
  "status": "success",
  "message": "Verificación de cuotas completada",
  "totalEventos": 25,
  "eventosCompletos": 20,
  "eventosConCuotasCreadas": 4,
  "eventosConErrores": 1
}
```

## Logging y Monitoreo

El sistema proporciona logging detallado:
- ✅ Cuotas completas encontradas
- 🔧 Cuotas faltantes creadas
- ⚠️ Advertencias para eventos problemáticos
- ❌ Errores en el proceso

## Beneficios

1. **Automatización**: Las cuotas se crean automáticamente al importar eventos
2. **Completitud**: Garantiza que todos los eventos tengan todas las cuotas requeridas
3. **Flexibilidad**: Permite verificación manual y masiva
4. **Diagnóstico**: Herramientas detalladas para análisis
5. **Mantenimiento**: Endpoints para corrección de problemas
6. **Escalabilidad**: Procesa múltiples eventos eficientemente

## Consideraciones de Rendimiento

- La verificación automática se ejecuta solo para eventos "programados" y "en_vivo"
- Los procesos masivos incluyen pausas para no sobrecargar el sistema
- Se usa `@Transactional` para garantizar consistencia de datos
- Logging optimizado para no impactar el rendimiento

Este sistema asegura que todos los eventos deportivos tengan cuotas completas y disponibles para los usuarios, mejorando la experiencia de apuestas.
