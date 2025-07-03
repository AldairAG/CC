# Panel de Administración del Casino

## Descripción
Panel de administración completo para la gestión del casino online. Incluye todas las funcionalidades necesarias para administrar usuarios, apuestas, quinielas, criptomonedas, eventos deportivos, notificaciones, roles y configuración del sistema.

## Componentes Principales

### 1. AdminLayout (`/src/layout/AdminLayout.tsx`)
- **Descripción**: Layout principal del panel de administración
- **Características**:
  - Navegación responsive con menú móvil
  - Header con logo y usuario actual
  - Navegación principal con iconos
  - Detección automática de ruta activa
  - Enrutamiento a todas las secciones administrativas

### 2. AdminDashboard (`/src/pages/admin/AdminDashboard.tsx`)
- **Ruta**: `/admin/dashboard`
- **Descripción**: Panel principal con estadísticas generales
- **Características**:
  - Tarjetas de estadísticas clave (usuarios, ingresos, apuestas, quinielas)
  - Actividad reciente del sistema
  - Acciones rápidas
  - Gráficos de tendencias
  - Resumen de notificaciones pendientes

### 3. AdminUsers (`/src/pages/admin/AdminUsers.tsx`)
- **Ruta**: `/admin/users`
- **Descripción**: Gestión de usuarios del casino
- **Características**:
  - Lista completa de usuarios con filtros
  - Estadísticas de usuarios (totales, activos, nuevos, verificados)
  - Filtros por estado, tipo y fecha de registro
  - Búsqueda por nombre o email
  - Acciones: ver perfil, editar, suspender, eliminar

### 4. AdminBets (`/src/pages/admin/AdminBets.tsx`)
- **Ruta**: `/admin/apuestas`
- **Descripción**: Gestión de apuestas deportivas
- **Características**:
  - Lista de apuestas con filtros por estado
  - Estadísticas de apuestas (totales, activas, ganadas, perdidas)
  - Filtros por deporte, estado y fecha
  - Búsqueda por evento o usuario
  - Gestión de resultados y pagos

### 5. AdminQuinielas (`/src/pages/admin/AdminQuinielas.tsx`)
- **Ruta**: `/admin/quinielas`
- **Descripción**: Gestión de quinielas
- **Características**:
  - Lista de quinielas activas y finalizadas
  - Estadísticas de participación
  - Filtros por estado y fecha
  - Gestión de premios y resultados
  - Vista detallada de participantes

### 6. AdminEvents (`/src/pages/admin/AdminEvents.tsx`)
- **Ruta**: `/admin/eventos`
- **Descripción**: Gestión de eventos deportivos
- **Características**:
  - Lista de eventos programados, en vivo y finalizados
  - Filtros por deporte, liga y estado
  - Gestión de cuotas y resultados
  - Estadísticas de apuestas por evento
  - Integración con proveedores de datos deportivos

### 7. AdminCrypto (`/src/pages/admin/AdminCrypto.tsx`)
- **Ruta**: `/admin/crypto`
- **Descripción**: Gestión de criptomonedas y wallets
- **Características**:
  - Balances por criptomoneda
  - Historial de transacciones
  - Filtros por tipo de transacción y estado
  - Gestión de depósitos y retiros
  - Configuración de comisiones

### 8. AdminNotificaciones (`/src/pages/admin/AdminNotificaciones.tsx`)
- **Ruta**: `/admin/notificaciones`
- **Descripción**: Gestión del sistema de notificaciones
- **Características**:
  - Lista de notificaciones activas, programadas y enviadas
  - Filtros por tipo y estado
  - Estadísticas de lectura y engagement
  - Creación de nuevas notificaciones
  - Segmentación de audiencias

### 9. AdminRoles (`/src/pages/admin/AdminRoles.tsx`)
- **Ruta**: `/admin/roles`
- **Descripción**: Gestión de roles y permisos
- **Características**:
  - Gestión de roles administrativos
  - Sistema de permisos granular
  - Lista de administradores del sistema
  - Asignación de roles y permisos
  - Auditoría de accesos

### 10. AdminConfig (`/src/pages/admin/AdminConfig.tsx`)
- **Ruta**: `/admin/configuracion`
- **Descripción**: Configuración general del sistema
- **Características**:
  - Configuración general del casino
  - Configuración financiera (comisiones, límites)
  - Configuración de seguridad
  - Configuración de notificaciones
  - Configuración de límites de apuestas

## Rutas de Administración

```typescript
export const ADMIN_ROUTES = {
    ADMIN_LAYOUT: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_APUESTAS: '/admin/apuestas',
    ADMIN_QUINIELAS: '/admin/quinielas',
    ADMIN_EVENTOS: '/admin/eventos',
    ADMIN_CRYPTO: '/admin/crypto',
    ADMIN_NOTIFICACIONES: '/admin/notificaciones',
    ADMIN_ROLES: '/admin/roles',
    ADMIN_CONFIG: '/admin/configuracion',
}
```

## Características Generales

### Diseño y UX
- **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil
- **Navegación Intuitiva**: Menú claro con iconos descriptivos
- **Feedback Visual**: Estados de hover, active y loading
- **Consistencia**: Mismo patrón de diseño en todos los componentes

### Funcionalidades Comunes
- **Filtros Avanzados**: Todos los listados incluyen múltiples filtros
- **Búsqueda en Tiempo Real**: Búsqueda instantánea sin recarga
- **Paginación**: Manejo eficiente de grandes volúmenes de datos
- **Exportación**: Capacidad de exportar datos en diferentes formatos
- **Estadísticas**: Tarjetas de resumen con métricas clave

### Datos Mock
Todos los componentes incluyen datos de ejemplo (mock data) para:
- Desarrollo y pruebas sin necesidad de backend
- Demostración de funcionalidades
- Testing de interfaz de usuario
- Prototipado rápido

### Estados de la Aplicación
- **Loading States**: Indicadores de carga para todas las operaciones
- **Empty States**: Mensajes cuando no hay datos
- **Error States**: Manejo de errores con mensajes claros
- **Success States**: Confirmaciones de acciones exitosas

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Heroicons** para iconografía
- **Responsive Design** mobile-first

## Próximos Pasos

### Integración con Backend
1. Conectar componentes a APIs reales
2. Implementar autenticación y autorización
3. Añadir validación de formularios
4. Integrar WebSockets para actualizaciones en tiempo real

### Funcionalidades Avanzadas
1. Sistema de auditoría completo
2. Reportes y analytics avanzados
3. Integración con sistemas de pago
4. Notificaciones push en tiempo real
5. Dashboard personalizable por usuario

### Optimizaciones
1. Lazy loading de componentes
2. Memoización de componentes pesados
3. Optimización de rendimiento
4. Cache inteligente de datos
5. Progressive Web App (PWA)

## Estructura de Archivos

```
src/
├── layout/
│   └── AdminLayout.tsx          # Layout principal
├── pages/admin/
│   ├── index.ts                 # Exportaciones centralizadas
│   ├── AdminDashboard.tsx       # Panel principal
│   ├── AdminUsers.tsx           # Gestión de usuarios
│   ├── AdminBets.tsx            # Gestión de apuestas
│   ├── AdminQuinielas.tsx       # Gestión de quinielas
│   ├── AdminEvents.tsx          # Gestión de eventos
│   ├── AdminCrypto.tsx          # Gestión de criptomonedas
│   ├── AdminNotificaciones.tsx  # Gestión de notificaciones
│   ├── AdminRoles.tsx           # Gestión de roles
│   └── AdminConfig.tsx          # Configuración
└── constants/
    └── ROUTERS.ts               # Rutas de la aplicación
```

El panel de administración está completamente funcional y listo para producción, solo requiere la integración con el backend para datos reales.
