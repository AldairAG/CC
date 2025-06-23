# Sistema de Apuestas Deportivas

## Descripción
Sistema completo de apuestas deportivas integrado en el dashboard, que permite a los usuarios realizar apuestas en eventos deportivos en vivo, gestionar un carrito de apuestas y procesar múltiples apuestas simultáneamente.

## Características Implementadas

### 🎯 Sistema de Apuestas
- **Múltiples tipos de apuesta**: Ganador del partido, Total de goles, Ambos equipos anotan
- **Cuotas dinámicas**: Simulación de cuotas realistas basadas en los eventos
- **Carrito de apuestas**: Gestión de múltiples apuestas antes de procesarlas
- **Modal de apuesta**: Interfaz intuitiva para seleccionar tipos y montos

### 🛒 Carrito de Apuestas
- **Estado global**: Persistencia en Redux con almacenamiento en sesión
- **Gestión de apuestas**: Agregar, remover, actualizar montos y cuotas
- **Cálculos automáticos**: Ganancias potenciales y totales en tiempo real
- **Validaciones**: Previene apuestas duplicadas por evento

### 🔔 Sistema de Notificaciones
- **Notificaciones en tiempo real**: Confirmaciones y errores
- **Múltiples tipos**: Éxito, error, advertencia, información
- **Auto-eliminación**: Desaparecen automáticamente después de un tiempo
- **Posicionamiento flexible**: Configurables en diferentes esquinas

### 🎨 Componentes UI
- **ModalApuesta**: Modal responsive para crear apuestas
- **CarritoApuestas**: Panel lateral para gestionar el carrito
- **BotonCarrito**: Botón flotante con contador de apuestas
- **NotificacionesContainer**: Contenedor de notificaciones

## Estructura del Código

### Tipos de Datos
```typescript
// src/types/ApuestaTypes.ts
interface Apuesta {
  id: string;
  eventoId: string;
  tipoApuesta: TipoApuesta;
  montoApuesta: number;
  cuota: number;
  gananciasPotenciales: number;
  // ... más campos
}
```

### Estado Global (Redux)
```typescript
// src/store/slices/carritoApuestasSlice.ts
interface CarritoApuestasState {
  apuestas: ApuestaCarrito[];
  isOpen: boolean;
  totalApuestas: number;
  totalMonto: number;
  totalGananciaPotencial: number;
  // ... más campos
}
```

### Hook Personalizado
```typescript
// src/hooks/useCarritoApuestas.ts
export const useCarritoApuestas = () => {
  // Gestión completa del carrito de apuestas
  // Funciones para agregar, remover, actualizar
  // Procesamiento de apuestas
  // Utilidades de formateo y validación
}
```

## Cómo Usar

### 1. Realizar una Apuesta
1. En el dashboard, hacer clic en "🎲 Apostar Ahora" en cualquier evento
2. Se abre el modal de apuesta con tres pasos:
   - **Paso 1**: Seleccionar tipo de apuesta (Ganador, Total goles, etc.)
   - **Paso 2**: Elegir opción específica con su cuota
   - **Paso 3**: Definir monto a apostar
3. Hacer clic en "Agregar al Carrito"

### 2. Gestionar el Carrito
- El **botón flotante** aparece cuando hay apuestas en el carrito
- Hacer clic para abrir el **panel del carrito**
- **Editar montos** directamente en cada apuesta
- **Remover apuestas** individuales
- **Ver resumen** con totales y ganancias potenciales

### 3. Procesar Apuestas
1. En el carrito, hacer clic en "Procesar Apuestas"
2. Se envían todas las apuestas al backend
3. **Notificación de éxito** cuando se completan
4. El carrito se limpia automáticamente

## API Integration

### Endpoints Utilizados
```typescript
// Crear apuesta
POST /api/apuestas
{
  idEvento: number;
  tipoApuesta: string;
  montoApuesta: number;
  cuotaApuesta: number;
  prediccionUsuario: string;
}

// Obtener apuestas del usuario
GET /api/apuestas/usuario/{id}

// Estadísticas de apuestas
GET /api/apuestas/usuario/{id}/estadisticas
```

### Manejo de Errores
- **Validación frontend**: Antes de enviar al backend
- **Manejo de errores de red**: Con notificaciones al usuario
- **Estados de carga**: Indicadores visuales durante el procesamiento

## Configuración

### Tipos de Apuesta Disponibles
```typescript
export const TIPOS_APUESTA = {
  GANADOR_PARTIDO: 'GANADOR_PARTIDO',
  TOTAL_GOLES: 'TOTAL_GOLES',
  AMBOS_EQUIPOS_ANOTAN: 'AMBOS_EQUIPOS_ANOTAN',
  // Fácil agregar más tipos
};
```

### Opciones por Tipo
```typescript
export const OPCIONES_APUESTA = {
  [TIPOS_APUESTA.GANADOR_PARTIDO]: [
    { descripcion: 'Equipo Local', cuotaBase: 2.5 },
    { descripcion: 'Empate', cuotaBase: 3.2 },
    { descripcion: 'Equipo Visitante', cuotaBase: 2.8 }
  ],
  // ... más opciones
};
```

## Personalización

### Agregar Nuevos Tipos de Apuesta
1. Agregar el tipo en `TIPOS_APUESTA`
2. Definir opciones en `OPCIONES_APUESTA`
3. Actualizar el modal para incluir el nuevo tipo
4. Implementar lógica en el backend si es necesario

### Modificar Cuotas
Las cuotas se generan dinámicamente en `useCarritoApuestas.ts`:
```typescript
const generarCuotasEvento = (evento: EventType) => {
  // Lógica para calcular cuotas realistas
  // Puede integrarse con APIs de cuotas reales
};
```

### Customizar Notificaciones
```typescript
// En cualquier componente
const { notificarExito, notificarError } = useNotificaciones();

notificarExito('Título', 'Mensaje de éxito');
notificarError('Error', 'Mensaje de error');
```

## Mejoras Futuras

- [ ] **Apuestas en vivo**: Cuotas que cambian durante el partido
- [ ] **Cash out**: Cerrar apuestas antes del final del evento
- [ ] **Apuestas combinadas**: Múltiples eventos en una sola apuesta
- [ ] **Límites de apuesta**: Configuración de límites por usuario
- [ ] **Historial detallado**: Visualización de todas las apuestas pasadas
- [ ] **Estadísticas avanzadas**: Análisis de rendimiento del usuario

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Redux Toolkit** para estado global
- **React Hooks** personalizados
- **Tailwind CSS** para estilos
- **Axios** para llamadas a la API
- **Redux Persist** para persistencia

## Testing

Para probar el sistema:
1. Ir al dashboard
2. Hacer clic en "Apostar Ahora" en cualquier evento
3. Crear varias apuestas con diferentes tipos y montos
4. Verificar que el carrito muestra totales correctos
5. Procesar las apuestas y verificar las notificaciones

## Soporte

El sistema está completamente integrado con el dashboard existente y es compatible con la arquitectura actual del proyecto. No requiere configuración adicional más allá de la que ya existe.
