# Gestión de Usuarios - Sistema de Administración

## Descripción
Este módulo implementa un sistema completo de gestión de usuarios para el panel de administración del casino. Incluye funcionalidades para crear, visualizar, editar y eliminar usuarios.

## Estructura de Archivos

### Componentes Principales
- **AdminUsers.tsx**: Componente principal que muestra la lista de usuarios con filtros y acciones
- **UserViewModal.tsx**: Modal para visualizar información completa de un usuario
- **UserEditModal.tsx**: Modal para editar información de un usuario
- **UserDeleteModal.tsx**: Modal de confirmación para eliminar usuarios
- **UserCreateModal.tsx**: Modal para crear nuevos usuarios

### Tipos y Interfaces
- **UserModalTypes.ts**: Definición de tipos específicos para los modales de usuario
- **AdminTypes.ts**: Tipos existentes para la gestión administrativa

## Funcionalidades Implementadas

### 1. Visualización de Usuarios
- **Componente**: `UserViewModal`
- **Funcionalidad**: Muestra información completa del usuario en modo solo lectura
- **Secciones**:
  - Información Personal
  - Información Financiera
  - Seguridad y Acceso
  - Documentos de Identidad
  - Tickets de Soporte

### 2. Edición de Usuarios
- **Componente**: `UserEditModal`
- **Funcionalidad**: Permite editar información del usuario
- **Pestañas**:
  - Datos Básicos (email, username, nombres, apellidos, teléfono, fecha de nacimiento)
  - Configuración (estado, saldo, roles, 2FA)
  - Actividad (información de solo lectura)
- **Validaciones**: Validación de campos obligatorios y formatos

### 3. Creación de Usuarios
- **Componente**: `UserCreateModal`
- **Funcionalidad**: Permite crear nuevos usuarios
- **Pestañas**:
  - Información Básica
  - Seguridad y Roles
- **Validaciones**: Validación completa incluyendo contraseña y edad mínima

### 4. Eliminación de Usuarios
- **Componente**: `UserDeleteModal`
- **Funcionalidad**: Confirmación para eliminar usuarios
- **Características**:
  - Confirmación por escritura
  - Advertencias sobre consecuencias
  - Información sobre datos que se conservan

## Características Técnicas

### Validaciones
- **Email**: Formato válido y unicidad
- **Username**: Mínimo 3 caracteres y unicidad
- **Contraseña**: Mínimo 8 caracteres (solo para creación)
- **Edad**: Mínimo 18 años
- **Saldo**: No puede ser negativo
- **Roles**: Mínimo un rol asignado

### Estados de Usuario
- **ACTIVO**: Usuario puede realizar acciones normalmente
- **INACTIVO**: Cuenta deshabilitada temporalmente
- **SUSPENDIDO**: Acceso bloqueado

### Roles Disponibles
- **USER**: Usuario básico
- **ADMIN**: Administrador del sistema
- **MODERATOR**: Moderador
- **BETTOR**: Usuario con permisos de apuesta
- **VIP**: Usuario VIP con privilegios especiales

## Integración con el Sistema Existente

### Hooks Utilizados
- **useAdmin**: Hook principal para operaciones administrativas
- **Funciones disponibles**:
  - `handleCreateUser`: Crear nuevo usuario
  - `handleUpdateUser`: Actualizar usuario existente
  - `handleDeleteUser`: Eliminar usuario

### Tipos de Datos
- **AdminUser**: Tipo base del usuario en el sistema administrativo
- **UserDetailData**: Datos completos para visualización
- **UserEditData**: Datos para edición
- **CreateUserRequest**: Datos para creación

## Utilidades

### Funciones de Formato
- **formatCurrency**: Formatea números como moneda
- **formatDate**: Formatea fechas en español
- **formatDateTime**: Formatea fecha y hora

### Validaciones
- **validateUserForm**: Valida formulario de usuario
- **Validaciones específicas**: Email, username, teléfono, edad, etc.

## Uso del Componente

```tsx
import AdminUsers from './pages/admin/AdminUsers';

// El componente se integra automáticamente con el sistema de administración
<AdminUsers />
```

## Flujo de Trabajo

1. **Visualización**: Lista de usuarios con filtros de búsqueda y estado
2. **Crear**: Botón "Nuevo Usuario" abre modal de creación
3. **Ver**: Botón de ojo abre modal de visualización
4. **Editar**: Botón de lápiz abre modal de edición
5. **Eliminar**: Botón de basura abre modal de confirmación

## Consideraciones de Seguridad

- Validación de entrada en frontend y backend
- Confirmación requerida para eliminación
- Información sensible no mostrada en logs
- Validación de roles y permisos

## Mejoras Futuras

1. **Paginación**: Implementar paginación para grandes volúmenes de usuarios
2. **Exportación**: Funcionalidad para exportar datos de usuarios
3. **Filtros avanzados**: Más opciones de filtrado
4. **Auditoría**: Registro de cambios realizados
5. **Bulk operations**: Operaciones masivas en múltiples usuarios

## Notas Técnicas

- Los datos del perfil (nombres, apellidos, teléfono, etc.) actualmente se simulan ya que no están disponibles en el tipo AdminUser
- Se recomienda expandir el tipo AdminUser para incluir información del perfil
- Las transacciones, documentos y tickets se muestran como placeholders hasta que estén disponibles en el backend
