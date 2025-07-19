# Documentación del Sistema de Administración

## Descripción General

Se ha implementado un sistema completo de administración para el proyecto Casino que incluye:

- **AdminService**: Servicio para consumir APIs del backend
- **AdminSlice**: Slice de Redux para gestión de estado
- **useAdmin Hook**: Hook personalizado que facilita el uso del estado y acciones
- **AdminLayout**: Layout actualizado con funcionalidad completa
- **AdminDashboard**: Dashboard de ejemplo implementado con el hook useAdmin

## Archivos Creados

### 1. Tipos - `AdminTypes.ts`
Define todas las interfaces y tipos necesarios para el sistema de administración:

- `AdminStats`: Estadísticas del dashboard
- `AdminUser`, `AdminBet`, `AdminQuiniela`, `AdminEvent`: Entidades principales
- `AdminNotification`, `AdminRole`, `AdminConfig`, `AdminCrypto`: Entidades adicionales
- Request types para operaciones CRUD
- `AdminState`: Estado del slice

### 2. Servicio - `adminService.ts`
Servicio completo que consume las APIs del backend con métodos para:

#### Estadísticas
- `getStats()`: Obtiene estadísticas generales del dashboard

#### Gestión de Usuarios
- `getAllUsers()`: Obtiene todos los usuarios
- `getUserById(id)`: Obtiene usuario por ID
- `createUser(userData)`: Crea nuevo usuario
- `updateUser(userData)`: Actualiza usuario existente
- `toggleUserStatus(id)`: Activa/desactiva usuario
- `deleteUser(id)`: Elimina usuario

#### Gestión de Apuestas
- `getAllBets()`: Obtiene todas las apuestas
- `getBetsByStatus(estado)`: Filtra apuestas por estado
- `updateBetStatus(id, estado)`: Actualiza estado de apuesta
- `cancelBet(id)`: Cancela una apuesta

#### Gestión de Quinielas
- `getAllQuinielas()`: Obtiene todas las quinielas
- `finalizeQuiniela(id)`: Finaliza una quiniela
- `cancelQuiniela(id)`: Cancela una quiniela

#### Gestión de Eventos
- `getAllEvents()`: Obtiene todos los eventos
- `updateEventStatus(id, estado)`: Actualiza estado de evento
- `cancelEvent(id)`: Cancela un evento

#### Gestión de Notificaciones
- `getAllNotifications()`: Obtiene todas las notificaciones
- `createNotification(data)`: Crea nueva notificación
- `markNotificationAsRead(id)`: Marca notificación como leída
- `deleteNotification(id)`: Elimina notificación

#### Gestión de Roles
- `getAllRoles()`: Obtiene todos los roles
- `createRole(data)`: Crea nuevo rol
- `updateRole(data)`: Actualiza rol existente
- `toggleRoleStatus(id)`: Activa/desactiva rol
- `deleteRole(id)`: Elimina rol

#### Gestión de Configuración
- `getAllConfigs()`: Obtiene configuraciones del sistema
- `updateConfig(data)`: Actualiza configuración

#### Gestión de Crypto
- `getAllCryptoTransactions()`: Obtiene transacciones crypto
- `getCryptoTransactionsByStatus(estado)`: Filtra por estado
- `approveCryptoTransaction(id)`: Aprueba transacción
- `rejectCryptoTransaction(id, motivo)`: Rechaza transacción

#### Reportes
- `generateUserReport(fechaInicio, fechaFin)`: Genera reporte de usuarios
- `generateBetsReport(fechaInicio, fechaFin)`: Genera reporte de apuestas
- `generateFinancialReport(fechaInicio, fechaFin)`: Genera reporte financiero

### 3. Slice Redux - `adminSlice.ts`
Slice de Redux con:

#### Estado Inicial
- Todos los arrays de datos inicializados vacíos
- Estados de loading, error y elementos seleccionados

#### Async Thunks
Thunks asíncronos para todas las operaciones del servicio

#### Reducers
- `clearError`: Limpia mensajes de error
- `setSelected*`: Setters para elementos seleccionados
- `resetAdminState`: Resetea todo el estado

#### Selectors
Selectores para acceder a todos los datos del estado

### 4. Hook Personalizado - `useAdmin.ts`
Hook que encapsula toda la lógica de administración:

#### Selectores
Acceso directo a todos los datos del estado

#### Métodos de Carga
- `loadStats()`: Carga estadísticas
- `loadUsers()`: Carga usuarios
- `loadBets()`: Carga apuestas
- `loadQuinielas()`: Carga quinielas
- `loadEvents()`: Carga eventos
- `loadNotifications()`: Carga notificaciones
- `loadRoles()`: Carga roles
- `loadConfigs()`: Carga configuraciones
- `loadCryptoTransactions()`: Carga transacciones crypto
- `loadAllData()`: Carga todos los datos iniciales

#### Métodos de Gestión
Métodos para crear, actualizar, eliminar y gestionar cada entidad

#### Utilidades
- `clearErrorMessage()`: Limpia errores
- `resetState()`: Resetea estado
- Valores computados (contadores, flags de estado)

### 5. Layout Actualizado - `AdminLayout.tsx`
AdminLayout mejorado con:

#### Funcionalidades Nuevas
- Integración completa con `useAdmin` hook
- Carga automática de datos al montar
- Manejo de estados de loading y error
- Contador de notificaciones no leídas
- Botón de logout funcional
- Mostrar estadísticas básicas en el dashboard
- Manejo automático de errores con timeout

#### Características UI
- Indicador de notificaciones con badge
- Información del usuario logueado
- Cards de estadísticas en el dashboard
- Mensajes de estado (loading, error)
- Botón de actualización de datos

### 6. Dashboard de Ejemplo - `AdminDashboard.tsx`
Dashboard completamente funcional que demuestra:

#### Funcionalidades
- Uso completo del hook `useAdmin`
- Carga de estadísticas al montar
- Manejo de estados (loading, error, sin datos)
- Cards dinámicas con datos reales
- Botón de actualización manual

#### UI Components
- Cards de estadísticas principales
- Indicadores de estado del sistema
- Placeholder para futuros gráficos
- Resumen de datos en tiempo real

## Integración con el Store

El `adminSlice` se ha agregado al store principal con:

- Configuración de persistencia
- Optimizaciones de rendimiento para grandes datasets
- Paths ignorados para evitar warnings de immutabilidad

## Uso del Sistema

### En Componentes
```tsx
import { useAdmin } from '../hooks/useAdmin';

const MiComponente = () => {
    const {
        users,
        loading,
        error,
        loadUsers,
        handleCreateUser,
        // ... otros métodos
    } = useAdmin();

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Resto del componente...
};
```

### Métodos Disponibles
```tsx
// Cargar datos
loadUsers();
loadBets();
loadAllData(); // Carga todo

// Gestionar usuarios
handleCreateUser(userData);
handleUpdateUser(userData);
handleToggleUserStatus(userId);
handleDeleteUser(userId);

// Gestionar otras entidades
handleUpdateBetStatus(betId, status);
handleFinalizeQuiniela(quinielaId);
handleCreateNotification(notificationData);
// ... más métodos disponibles
```

### Acceso a Datos
```tsx
// Datos principales
const { users, bets, quinielas, events } = useAdmin();

// Estados
const { loading, error } = useAdmin();

// Valores computados
const { 
    pendingBetsCount, 
    activeUsersCount, 
    unreadNotificationsCount 
} = useAdmin();
```

## Próximos Pasos

1. **Backend**: Implementar los endpoints correspondientes en el backend
2. **Autenticación**: Asegurar que todas las rutas requieran permisos de admin
3. **Validaciones**: Agregar validaciones de formularios
4. **Gráficos**: Integrar Chart.js o similar para visualizaciones
5. **Notificaciones**: Implementar notificaciones en tiempo real
6. **Filtros**: Agregar filtros y búsqueda en las listas
7. **Paginación**: Implementar paginación para grandes datasets
8. **Exportación**: Habilitar exportación de reportes en PDF/Excel

## Estructura de Archivos

```
frontend/src/
├── types/
│   └── AdminTypes.ts
├── service/casino/
│   ├── adminService.ts
│   └── index.ts (actualizado)
├── store/slices/
│   └── adminSlice.ts
├── store/
│   └── store.ts (actualizado)
├── hooks/
│   └── useAdmin.ts
├── layout/
│   └── AdminLayout.tsx (actualizado)
└── pages/admin/
    └── AdminDashboard.tsx (actualizado)
```

El sistema está completamente implementado y listo para usar. Solo falta conectar con el backend correspondiente.
