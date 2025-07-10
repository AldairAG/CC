# Scheduler de Verificación de Cuotas - Sistema Automatizado

## Descripción General

Se ha implementado un sistema de scheduler robusto que automatiza la verificación y creación de cuotas para eventos deportivos. El sistema garantiza que todos los eventos en estado "programado" y "en_vivo" tengan cuotas completas disponibles para los usuarios.

## Tareas Programadas Implementadas

### 🎯 **Verificación de Cuotas Eventos Activos (Cada 2 minutos)**
```java
@Scheduled(cron = "0 */2 * * * *", zone = "America/Mexico_City")
public void verificarCuotasEventosProgramados()
```

**Funcionalidad:**
- Se ejecuta cada 2 minutos
- Verifica eventos en estado "programado" y "en_vivo"
- Crea automáticamente cuotas faltantes
- Logging detallado de resultados

**Importancia:** Esta es la tarea más crítica porque asegura que los eventos disponibles para apuestas siempre tengan cuotas completas.

### 📅 **Verificación de Cuotas Eventos Próximos (Cada 30 minutos)**
```java
@Scheduled(cron = "0 */30 * * * *", zone = "America/Mexico_City")
public void verificarCuotasEventosProximos()
```

**Funcionalidad:**
- Se ejecuta cada 30 minutos
- Verifica eventos de los próximos 3 días
- Prepara cuotas con anticipación
- Mejora la experiencia del usuario

**Importancia:** Garantiza que eventos futuros ya tengan cuotas preparadas antes de que cambien a estado "programado".

### 🔴 **Actualización de Livescores (Cada 2 minutos)**
```java
@Scheduled(cron = "0 */2 * * * *", zone = "America/Mexico_City")
public void actualizarLivescoresEventosHoy()
```

**Funcionalidad:**
- Actualiza marcadores en tiempo real
- Procesa eventos del día actual
- Sincroniza con TheSportsDB API

### 🌙 **Sincronización Completa (Diaria a medianoche)**
```java
@Scheduled(cron = "0 0 0 * * *", zone = "America/Mexico_City")
public void sincronizarEventosDeportivos()
```

**Funcionalidad:**
- Importa nuevos eventos desde TheSportsDB
- Actualiza información de eventos existentes
- Proceso completo de sincronización

### 🔒 **Cierre de Eventos Vencidos (Cada hora)**
```java
@Scheduled(cron = "0 0 * * * *", zone = "America/Mexico_City")
public void cerrarEventosVencidos()
```

**Funcionalidad:**
- Cierra eventos cuya fecha ya pasó
- Mantiene la integridad del sistema
- Evita apuestas en eventos finalizados

### 🧹 **Limpieza de Eventos Antiguos (Semanal - Domingos a las 2:00 AM)**
```java
@Scheduled(cron = "0 0 2 * * SUN", zone = "America/Mexico_City")
public void limpiarEventosAntiguos()
```

**Funcionalidad:**
- Elimina eventos muy antiguos
- Optimiza el rendimiento de la base de datos
- Liberación de espacio

## Métodos Manuales Disponibles

Para ejecutar tareas manualmente desde código o endpoints:

```java
// Verificación manual de cuotas
eventoScheduler.forzarVerificacionCuotas();

// Verificación de cuotas eventos próximos
eventoScheduler.forzarVerificacionCuotasProximos();

// Sincronización manual
eventoScheduler.forzarSincronizacion();

// Actualización manual de livescores
eventoScheduler.forzarActualizacionLivescores();

// Cierre manual de eventos vencidos
eventoScheduler.forzarCierreEventosVencidos();
```

## Endpoints REST para Ejecución Manual

### Verificación de Cuotas
```http
POST /cc/eventos-deportivos/ejecutar-verificacion-cuotas
```
Ejecuta manualmente la verificación de cuotas para eventos activos.

```http
POST /cc/eventos-deportivos/ejecutar-verificacion-cuotas-proximos
```
Ejecuta manualmente la verificación de cuotas para eventos próximos.

### Ejemplo de Respuesta:
```json
{
  "status": "success",
  "message": "Verificación de cuotas ejecutada exitosamente",
  "timestamp": "2025-07-10T14:30:00"
}
```

## Logging y Monitoreo

### Formato de Logs para Verificación de Cuotas:

```
🎯 === INICIANDO VERIFICACIÓN DE CUOTAS (cada 2 min) ===
✅ === VERIFICACIÓN DE CUOTAS COMPLETADA (245ms) ===
📊 Total eventos procesados: 15
💰 Eventos con cuotas completas: 12
🔧 Eventos con cuotas creadas: 3
❌ Eventos con errores: 0
🎉 IMPORTANTE: Se crearon cuotas para 3 eventos (programados/en_vivo)
```

### Niveles de Logging:
- **INFO**: Información general de ejecución
- **WARN**: Advertencias sobre eventos problemáticos
- **ERROR**: Errores que requieren atención
- **DEBUG**: Información detallada para debugging

## Configuración y Personalización

### Zona Horaria
Todas las tareas usan la zona horaria `America/Mexico_City` configurada en cada `@Scheduled`.

### Frecuencias Configurables

Para modificar las frecuencias, cambiar los valores cron:

```java
// Cada 2 minutos: "0 */2 * * * *"
// Cada 5 minutos: "0 */5 * * * *"
// Cada 30 minutos: "0 */30 * * * *"
// Cada hora: "0 0 * * * *"
```

### Personalización de Verificación de Eventos Próximos

Modificar el número de días a verificar:
```java
var resumen = theSportsDbService.verificarCuotasEventosProximos(3); // 3 días
```

## Beneficios del Sistema

### ✅ **Automatización Completa**
- No requiere intervención manual
- Funciona 24/7 sin supervisión
- Garantiza disponibilidad constante de cuotas

### ⚡ **Alta Frecuencia para Eventos Críticos**
- Verificación cada 2 minutos para eventos activos
- Respuesta rápida a nuevos eventos
- Minimiza tiempo sin cuotas

### 📈 **Optimización de Recursos**
- Verificación diferenciada por frecuencia
- Eventos próximos: cada 30 minutos
- Eventos activos: cada 2 minutos
- Balance entre eficiencia y cobertura

### 🛡️ **Robustez y Confiabilidad**
- Manejo de errores integrado
- Logging detallado para monitoreo
- Continuidad ante fallos parciales

### 🎮 **Experiencia de Usuario Mejorada**
- Cuotas siempre disponibles
- Eventos listos para apostar
- Tiempo de respuesta optimizado

## Monitoreo Recomendado

### Métricas Clave a Monitorear:
1. **Frecuencia de creación de cuotas**: Cuántas cuotas se crean por ciclo
2. **Eventos sin cuotas**: Debe ser siempre 0 para eventos activos
3. **Tiempo de ejecución**: Debe mantenerse bajo para no impactar performance
4. **Errores**: Monitorear y alertar sobre errores recurrentes

### Alertas Sugeridas:
- Si más de 5 eventos activos no tienen cuotas
- Si el tiempo de ejecución supera los 30 segundos
- Si hay más de 3 errores consecutivos en verificación

## Troubleshooting

### Problema: "No se crean cuotas"
**Verificar:**
1. Logs del scheduler
2. Estado de conexión con base de datos
3. Configuración de `CuotaEventoService`

### Problema: "Tarea muy lenta"
**Soluciones:**
1. Verificar número de eventos a procesar
2. Optimizar consultas de base de datos
3. Ajustar frecuencia si es necesario

### Problema: "Errores frecuentes"
**Verificar:**
1. Logs de error detallados
2. Estado de servicios dependientes
3. Configuración de `TheSportsDbService`

Este sistema garantiza que todos los eventos deportivos tengan cuotas completas y actualizadas, proporcionando una experiencia de apuestas sin interrupciones para los usuarios.
