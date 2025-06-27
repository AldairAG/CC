# Método getUserProfile - Documentación

## Descripción
Se ha implementado un método completo para obtener un perfil de usuario mediante su ID. Esta funcionalidad está disponible tanto en el backend como en el frontend.

## Backend

### Endpoint
```
GET /cc/perfil/{idUsuario}
```

### Parámetros
- `idUsuario` (Long): El ID del usuario cuyo perfil se desea obtener

### Respuesta
```json
{
  "idUsuario": 1,
  "email": "usuario@ejemplo.com",
  "saldoUsuario": 1000.00,
  "estadoCuenta": true,
  "idPerfil": 1,
  "fotoPerfil": "path/to/photo.jpg",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fechaRegistro": "2024-01-01T00:00:00",
  "fechaNacimiento": "1990-01-01",
  "telefono": "1234567890",
  "lada": "+52",
  "username": "juanperez",
  "tiene2FAHabilitado": false,
  "documentosSubidos": 2,
  "ultimaActividad": "2024-12-26T10:00:00"
}
```

### Implementación Backend
- **Servicio**: `IPerfilUsuarioService.obtenerPerfilUsuario(Long idUsuario)`
- **Implementación**: `PerfilUsuarioServiceImpl.obtenerPerfilUsuario()`
- **DTO de respuesta**: `PerfilUsuarioResponse`

## Frontend

### Uso en el servicio
```typescript
import { profileService } from '../service/casino/profileService';

const profile = await profileService.getUserProfile(userId);
```

### Uso en el hook
```typescript
import { useUserProfile } from '../hooks/useUserProfile';

const Component = () => {
  const { getUserProfile } = useUserProfile();
  
  const handleGetProfile = async (userId: number) => {
    const profile = await getUserProfile(userId);
    if (profile) {
      console.log('Perfil obtenido:', profile);
    }
  };
};
```

### Uso en el contexto
```typescript
import { useProfileContext } from '../contexts/ProfileContext';

const Component = () => {
  const { getUserProfile } = useProfileContext();
  
  const loadProfile = async (userId: number) => {
    const profile = await getUserProfile(userId);
    return profile;
  };
};
```

## Características
- ✅ Validación de usuario existente
- ✅ Información completa del perfil y usuario
- ✅ Estado de autenticación 2FA
- ✅ Conteo de documentos subidos
- ✅ Fecha de última actividad basada en transacciones
- ✅ Manejo de errores
- ✅ Loading states en el frontend
- ✅ Tipado completo en TypeScript

## Casos de uso
- Obtener información completa de un usuario específico
- Verificar el estado de un perfil antes de realizar operaciones
- Mostrar datos de perfil en interfaces administrativas
- Validar información de usuario en procesos de verificación
