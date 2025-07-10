# Documentación del Flujo de Cuotas Dinámicas

## Resumen General
Este sistema permite generar y gestionar cuotas dinámicas para múltiples mercados de apuestas deportivas, no solo el resultado final (1X2). 

## Arquitectura del Sistema

### Backend (Spring Boot)

#### 1. TipoResultado (Enum)
- **Ubicación**: `com.example.cc.entities.TipoResultado`
- **Función**: Define todos los tipos de resultados posibles para las apuestas
- **Nuevos tipos agregados**:
  - Resultado Final: `LOCAL`, `VISITANTE`, `EMPATE`
  - Clasificación: `LOCAL_CLASIFICA`, `VISITANTE_CLASIFICA`
  - Doble Oportunidad: `LOCAL_EMPATE`, `LOCAL_VISITANTE`, `VISITANTE_EMPATE`
  - Ambos Equipos Anotan: `AMBOS_ANOTAN`, `NO_AMBOS_ANOTAN`
  - Total Goles: `OVER_0_5`, `UNDER_0_5`, `OVER_1_5`, `UNDER_1_5`, etc.
  - Hándicap: `LOCAL_MINUS_1`, `VISITANTE_PLUS_1`, etc.
  - Marcador Correcto: `MARCADOR_1_0`, `MARCADOR_2_1`, etc.
  - Primer Goleador: `PRIMER_GOLEADOR_1`, `PRIMER_GOLEADOR_2`, etc.
  - Tarjetas, Corners, Segunda Mitad, etc.

#### 2. CuotaGeneratorService
- **Ubicación**: `com.example.cc.service.apuestas.CuotaGeneratorService`
- **Función**: Genera cuotas realistas para cada tipo de resultado
- **Características**:
  - Rangos de cuotas específicos por mercado
  - Cuotas más bajas para favoritos
  - Cuotas más altas para resultados improbables

#### 3. CuotaEventoService (Actualizado)
- **Ubicación**: `com.example.cc.service.apuestas.CuotaEventoService`
- **Nuevos métodos**:
  - `generarCuotasParaEvento()`: Genera cuotas para TODOS los mercados
  - `getCuotasByEventoIdAndMercado()`: Filtra cuotas por mercado
  - `getCuotasAgrupadasPorMercado()`: Agrupa cuotas por mercado
  - `generarCuotasBasicasParaEvento()`: Solo genera cuotas 1X2 (legacy)

#### 4. CuotasDinamicasController (Actualizado)
- **Ubicación**: `com.example.cc.controller.CuotasDinamicasController`
- **Nuevos endpoints**:
  - `GET /evento/{eventoId}/cuotas-por-mercado`: Obtiene cuotas agrupadas por mercado
  - `GET /evento/{eventoId}/mercado/{mercado}`: Obtiene cuotas de un mercado específico
  - `POST /evento/{eventoId}/generar-cuotas-completas`: Genera cuotas para todos los mercados
  - `POST /evento/{eventoId}/generar-cuotas-basicas`: Genera solo cuotas 1X2
  - `GET /evento/{eventoId}/cuotas-detalladas`: Obtiene cuotas con información del evento

#### 5. CuotasMercadoDTO
- **Ubicación**: `com.example.cc.dto.CuotasMercadoDTO`
- **Función**: DTO para respuestas estructuradas con información del evento

### Frontend (React + TypeScript)

#### 1. CuotasDinamicasService (Actualizado)
- **Ubicación**: `frontend/src/service/casino/cuotasDinamicasService.ts`
- **Nuevos métodos**:
  - `obtenerCuotasPorMercado()`: Obtiene cuotas agrupadas por mercado
  - `obtenerCuotasMercadoEspecifico()`: Obtiene cuotas de un mercado específico
  - `generarCuotasCompletas()`: Genera cuotas para todos los mercados
  - `generarCuotasBasicas()`: Genera solo cuotas 1X2
  - `obtenerCuotasDetalladas()`: Obtiene cuotas con información del evento

#### 2. useCuotasDinamicas Hook (Actualizado)
- **Ubicación**: `frontend/src/hooks/useCuotasDinamicas.ts`
- **Nuevas funcionalidades**:
  - `cargarCuotasPorMercado()`: Carga cuotas agrupadas por mercado
  - `cargarCuotasDetalladas()`: Carga cuotas con información del evento
  - `generarCuotasCompletas()`: Genera cuotas para todos los mercados
  - `obtenerCuotasMercado()`: Obtiene cuotas de un mercado específico

#### 3. Tipos TypeScript
- **Ubicación**: `frontend/src/types/CuotasDinamicasTypes.ts`
- **Nuevo tipo**: `CuotasMercadoDetalladas`

## Flujo de Funcionamiento

### 1. Creación de Cuotas
```
1. Se llama a CuotaEventoService.generarCuotasParaEvento(eventoId)
2. El servicio obtiene todos los TipoResultado disponibles
3. Para cada tipo, usa CuotaGeneratorService para generar una cuota realista
4. Guarda todas las cuotas en la base de datos
5. Retorna la lista completa de cuotas creadas
```

### 2. Consulta de Cuotas
```
Frontend:
1. Llama a CuotasDinamicasService.obtenerCuotasPorMercado(eventoId)
2. El servicio hace una petición al endpoint backend
3. El backend retorna las cuotas agrupadas por mercado
4. El frontend actualiza el estado con las cuotas organizadas
```

### 3. Actualización de Cuotas
```
1. CuotasDinamicasService.actualizarCuotasPorVolumen() se ejecuta
2. Recalcula las cuotas basado en el volumen de apuestas
3. Guarda el historial de cambios
4. Notifica a los clientes conectados vía WebSocket (si está implementado)
```

### 4. Consumo en la UI
```
1. ApuestaDetailsPage usa el hook useCuotasDinamicas
2. Carga las cuotas al montar el componente
3. Muestra los mercados organizados en tabs
4. Permite hacer apuestas en cualquier mercado
5. Refleja cambios en tiempo real
```

## Mercados Soportados

El sistema ahora soporta los siguientes mercados:

1. **Resultado Final**: Local, Visitante, Empate
2. **Clasificación**: Se clasificará (Local/Visitante)
3. **Doble Oportunidad**: Local/Empate, Local/Visitante, Visitante/Empate
4. **Ambos Equipos Anotan**: Sí, No
5. **Total Goles**: Over/Under 0.5, 1.5, 2.5, 3.5
6. **Hándicap**: Local/Visitante con diferentes handicaps
7. **Marcador Correcto**: 1-0, 2-1, 0-0, etc.
8. **Primer Goleador**: Jugadores específicos, No gol
9. **Tarjetas**: Over/Under tarjetas amarillas
10. **Corners**: Over/Under tiros de esquina
11. **Segunda Mitad**: Varios mercados específicos de 2da mitad
12. **Especiales**: Mercados específicos del evento

## Ventajas del Nuevo Sistema

1. **Escalabilidad**: Fácil agregar nuevos mercados
2. **Flexibilidad**: Cuotas específicas por tipo de mercado
3. **Organización**: Cuotas agrupadas por mercado
4. **Performance**: Consultas optimizadas
5. **Mantenibilidad**: Código estructurado y documentado

## Uso Recomendado

1. **Para generar cuotas nuevas**: Usar `generarCuotasCompletas()`
2. **Para obtener cuotas de un evento**: Usar `obtenerCuotasPorMercado()`
3. **Para filtrar por mercado**: Usar `obtenerCuotasMercadoEspecifico()`
4. **Para información completa**: Usar `obtenerCuotasDetalladas()`

## Notas Importantes

- El sistema mantiene compatibilidad con el código legacy
- Las cuotas se generan una sola vez por evento
- Los cambios de cuotas se registran en el historial
- El sistema soporta actualizaciones en tiempo real
- Las cuotas se pueden filtrar y agrupar eficientemente
