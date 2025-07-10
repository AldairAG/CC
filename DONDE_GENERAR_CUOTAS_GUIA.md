# Guía: Dónde y Cuándo se Generan las Cuotas Dinámicas

## Resumen
El método `generarCuotasCompletas()` se ejecuta en varios puntos del flujo de la aplicación para asegurar que todos los eventos tengan cuotas disponibles.

## Lugares donde se Generan las Cuotas

### 1. 🔄 **Automáticamente al Crear Eventos** (Recomendado)
**Ubicación**: `EventoDeportivoService.sincronizarEventosDeportivos()`
```java
// Cuando se crea un nuevo evento desde sincronización
EventoDeportivo eventoGuardado = eventoRepository.save(nuevoEvento);
// Se generan automáticamente las cuotas
cuotaEventoService.generarCuotasParaEvento(eventoGuardado.getId());
```

**Cuándo se ejecuta**:
- Cada vez que el scheduler sincroniza eventos desde TheSportsDB
- Configurado para ejecutarse cada 30 minutos (configurable)
- Solo para eventos nuevos (no duplica cuotas)

### 2. 🎯 **Manualmente para Evento Específico**
**Endpoint**: `POST /cc/eventos-deportivos/{eventoId}/generar-cuotas`
```javascript
// Desde el frontend
const respuesta = await CuotasDinamicasService.generarCuotasParaEvento(eventoId);
```

**Cuándo usarlo**:
- Cuando un evento no tiene cuotas por algún error
- Para regenerar cuotas de un evento específico
- En testing o desarrollo

### 3. 🚀 **Masivamente para Eventos Faltantes**
**Endpoint**: `POST /cc/eventos-deportivos/generar-cuotas-faltantes`
```javascript
// Desde el frontend
const respuesta = await CuotasDinamicasService.generarCuotasFaltantes();
```

**Cuándo usarlo**:
- Al inicializar la aplicación por primera vez
- Cuando hay eventos sin cuotas después de migraciones
- Para asegurar que todos los eventos tengan cuotas

### 4. 🎮 **Desde el Sistema de Cuotas Dinámicas**
**Endpoint**: `POST /cc/cuotas-dinamicas/evento/{eventoId}/generar-cuotas-completas`
```javascript
// Desde el hook useCuotasDinamicas
const generarCuotasCompletas = useCallback(async (eventoId: number) => {
    const cuotasGeneradas = await CuotasDinamicasService.generarCuotasCompletas(eventoId);
    // Actualiza automáticamente el estado del frontend
});
```

**Cuándo usarlo**:
- Desde la interfaz de usuario cuando el usuario lo solicita
- En páginas de administración
- Para eventos en tiempo real

## Flujo Recomendado

### Para Producción:
1. **Automático**: Los eventos se sincronizan y generan cuotas automáticamente
2. **Verificación**: Usar endpoint de cuotas faltantes ocasionalmente
3. **Manual**: Solo cuando sea necesario para eventos específicos

### Para Desarrollo:
1. **Inicialización**: Ejecutar `generarCuotasFaltantes()` al iniciar
2. **Testing**: Usar `generarCuotasParaEvento()` para eventos específicos
3. **Limpieza**: Regenerar cuotas cuando sea necesario

## Configuración del Scheduler

**Ubicación**: `EventoDeportivoScheduler.java`
```java
@Scheduled(fixedRate = 1800000) // 30 minutos
public void sincronizacionAutomatica() {
    eventoDeportivoService.sincronizarEventosDeportivos();
    // Esto internamente llama a generarCuotasParaEvento() para eventos nuevos
}
```

## Interfaz de Usuario

### En ApuestaDetailsPage:
```typescript
// Se cargan automáticamente las cuotas cuando el usuario ve el evento
useEffect(() => {
    if (eventoActual?.id) {
        cargarCuotasEvento(eventoActual.id);
        cargarCuotasPorMercado(eventoActual.id); // Usa las cuotas ya generadas
    }
}, [eventoActual?.id]);
```

### Página de Administración (Recomendado):
```typescript
// Botón para generar cuotas faltantes
const handleGenerarCuotasFaltantes = async () => {
    const respuesta = await CuotasDinamicasService.generarCuotasFaltantes();
    toast.success(`Cuotas generadas para ${respuesta.eventosConCuotasGeneradas} eventos`);
};
```

## Mejores Prácticas

### ✅ **Hacer**:
1. Mantener el scheduler automático activado
2. Verificar ocasionalmente eventos sin cuotas
3. Usar logging para monitorear la generación
4. Implementar retry logic para fallos

### ❌ **No Hacer**:
1. Generar cuotas manualmente para todos los eventos regularmente
2. Llamar generación desde múltiples lugares simultáneamente
3. Ignorar errores de generación de cuotas
4. Generar cuotas para eventos muy antiguos

## Monitoreo y Logs

```java
// Los logs muestran:
log.info("Generadas {} cuotas para evento: {} - Mercados: {}", 
        cuotasNuevas.size(), evento.getNombreEvento(), mercadosCount);
```

## Endpoints para Administración

### Verificar Estados:
- `GET /cc/eventos-deportivos/estadisticas` - Ver estadísticas generales
- `GET /cc/cuotas-dinamicas/evento/{eventoId}/cuotas` - Ver cuotas de un evento
- `GET /cc/cuotas-dinamicas/evento/{eventoId}/cuotas-por-mercado` - Ver cuotas por mercado

### Acciones:
- `POST /cc/eventos-deportivos/sincronizar` - Forzar sincronización
- `POST /cc/eventos-deportivos/generar-cuotas-faltantes` - Generar cuotas faltantes
- `POST /cc/eventos-deportivos/{eventoId}/generar-cuotas` - Generar para evento específico

## Conclusión

La generación automática en `EventoDeportivoService.sincronizarEventosDeportivos()` es el método principal y recomendado. Los otros métodos son complementarios para casos específicos y administración.
