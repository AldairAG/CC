# 🏆 Módulo de Quinielas Creadas por Usuarios

## Descripción

Sistema completo que permite a los usuarios **crear sus propias quinielas** y **distribuir premios** automáticamente. Los usuarios pueden configurar tipos de distribución de premios, aceptar pagos en criptomonedas o fiat, y manejar quinielas públicas o privadas.

## ✨ Características Principales

### 🎯 Creación de Quinielas
- **Configuración personalizada**: Nombre, descripción, fechas, precio de entrada
- **Límites de participantes**: Configurar máximo de participantes o sin límite
- **Distribución de premios**: 
  - **Ganador se lleva todo** (100% al primer lugar)
  - **Top 3** (configurable: 50%-30%-20% por defecto)
  - **Personalizada** (configurar porcentajes manualmente)
- **Visibilidad**: Quinielas públicas o privadas con código de invitación
- **Pagos duales**: Soporte para fiat (USD) y criptomonedas (BTC, ETH, SOL)

### 🎮 Participación
- **Unirse fácilmente**: Búsqueda por código de invitación para quinielas privadas
- **Predicciones intuitivas**: Interface fácil para hacer predicciones en eventos
- **Seguimiento en tiempo real**: Ver puntuación actual y posición en ranking
- **Múltiples participaciones**: Unirse a varias quinielas simultáneamente

### 🏆 Sistema de Premios
- **Distribución automática**: Los premios se calculan y distribuyen automáticamente
- **Múltiples ganadores**: Soporte para premiar top 3 o más posiciones
- **Reclamación de premios**: Sistema de reclamación seguro para ganadores
- **Historial de premios**: Seguimiento de todos los premios ganados

### 💰 Integración con Criptomonedas
- **Pagos de entrada en crypto**: Bitcoin, Ethereum, Solana
- **Premios en crypto**: Los premios se pagan en la misma criptomoneda
- **Conversión automática**: Cálculo de valores en USD para visualización
- **Wallets integrados**: Conexión con el sistema de wallets existente

## 🏗️ Arquitectura

### Backend (Java/Spring Boot)

#### Entidades
```
QuinielaCreada
├── ParticipacionQuiniela
├── QuinielaEvento
├── QuinielaPrediccion
├── PremioQuiniela
```

#### APIs REST
```
POST /api/quinielas/crear                    - Crear nueva quiniela
POST /api/quinielas/unirse                   - Unirse a quiniela
POST /api/quinielas/predicciones             - Hacer predicciones
POST /api/quinielas/distribuir-premios/{id}  - Distribuir premios
GET  /api/quinielas/publicas                 - Obtener quinielas públicas
GET  /api/quinielas/mis-quinielas            - Mis quinielas creadas
GET  /api/quinielas/mis-participaciones      - Mis participaciones
```

#### Base de Datos
- **5 nuevas tablas** con relaciones optimizadas
- **Índices** para consultas rápidas
- **Constraints** para integridad de datos
- **Soporte para criptomonedas** en esquema

### Frontend (React/TypeScript)

#### Componentes Principales
- `CrearQuinielaForm`: Formulario completo para crear quinielas
- `QuinielaCard`: Tarjeta de quiniela con toda la información
- `QuinielasPage`: Página principal con pestañas y filtros
- `QuinielasQuickAccess`: Widget de acceso rápido para dashboard

#### Hooks y Servicios
- `useQuinielasCreadas`: Hook principal para gestión de estado
- `quinielaCreadaService`: Servicio para comunicación con API
- Tipos TypeScript completos para type safety

## 🚀 Instalación y Configuración

### Backend

1. **Migración de Base de Datos**
```sql
-- Se ejecuta automáticamente
V3__Create_Quinielas_Tables.sql
```

2. **Configuración**
```properties
# application.properties
# Las configuraciones existentes funcionan
```

3. **Servicios**
- `QuinielaService`: Lógica de negocio principal
- `QuinielaController`: Endpoints REST
- Repositorios con consultas optimizadas

### Frontend

1. **Instalación de Dependencias**
```bash
# Las dependencias existentes son suficientes
npm install
```

2. **Configuración de Rutas**
```typescript
// Nuevas rutas agregadas a ROUTERS.ts
USER_ROUTES.QUINIELAS_CREADAS = '/c/quinielas-creadas'
```

3. **Integración en Layout**
```typescript
// UserLayout.tsx - Nueva pestaña agregada
🏆 Mis Quinielas
```

## 📱 Uso

### Para Usuarios

#### Crear una Quiniela
1. Ir a "Mis Quinielas" → "Crear Quiniela"
2. Configurar detalles básicos (nombre, descripción, fechas)
3. Establecer precio de entrada y límites
4. Seleccionar tipo de distribución de premios
5. Elegir si es pública o privada
6. Agregar eventos deportivos
7. Crear y compartir código de invitación si es privada

#### Unirse a una Quiniela
1. Ver quinielas públicas disponibles
2. O usar código de invitación para quinielas privadas
3. Pagar entrada (fiat o crypto según configuración)
4. Hacer predicciones antes del inicio
5. Seguir progreso durante la quiniela

#### Reclamar Premios
1. Ver premios pendientes en dashboard
2. Ir a "Mis Participaciones"
3. Reclamar premios ganados
4. Recibir pago en método configurado

### Para Administradores

#### Gestión de Quinielas
- Monitor de todas las quinielas activas
- Capacidad de forzar distribución de premios
- Estadísticas y reportes
- Gestión de disputas

## 🔧 API Reference

### Crear Quiniela
```typescript
POST /api/quinielas/crear
Content-Type: application/json
Authorization: Bearer {token}

{
  "nombre": "Mundial 2026 - Grupo A",
  "descripcion": "Quiniela del grupo A del mundial",
  "fechaInicio": "2026-06-01T14:00:00",
  "fechaFin": "2026-06-15T22:00:00",
  "precioEntrada": 25.00,
  "maxParticipantes": 100,
  "tipoDistribucion": "TOP_3",
  "porcentajePremiosPrimero": 50,
  "porcentajePremiosSegundo": 30,
  "porcentajePremiosTercero": 20,
  "esPublica": true,
  "esCrypto": false,
  "eventos": [
    {
      "eventoId": 1,
      "nombreEvento": "México vs Argentina",
      "fechaEvento": "2026-06-02T16:00:00",
      "equipoLocal": "México",
      "equipoVisitante": "Argentina"
    }
  ]
}
```

### Unirse a Quiniela
```typescript
POST /api/quinielas/unirse
Content-Type: application/json
Authorization: Bearer {token}

{
  "quinielaId": 1,
  "codigoInvitacion": "ABC123", // Solo si es privada
  "metodoPago": "FIAT", // FIAT o CRYPTO
  "cryptoTipo": "BTC" // Solo si es CRYPTO
}
```

### Hacer Predicciones
```typescript
POST /api/quinielas/predicciones
Content-Type: application/json
Authorization: Bearer {token}

{
  "participacionId": 1,
  "predicciones": [
    {
      "eventoId": 1,
      "prediccionLocal": 2,
      "prediccionVisitante": 1
    }
  ]
}
```

## 📊 Características Técnicas

### Rendimiento
- **Consultas optimizadas** con índices apropiados
- **Paginación** para listas grandes
- **Caché** en frontend para datos frecuentes
- **Lazy loading** para componentes pesados

### Seguridad
- **Autenticación JWT** para todas las operaciones
- **Validación** de permisos por usuario
- **Sanitización** de inputs
- **Protección CSRF** en formularios

### Escalabilidad
- **Arquitectura modular** fácil de extender
- **Separación de responsabilidades** clara
- **APIs RESTful** estándar
- **Base de datos normalizada** con relaciones apropiadas

## 🎯 Funcionalidades Avanzadas

### Sistema de Puntuación
- **Puntos por acierto** (ganador/empate/perdedor): 3 puntos por defecto
- **Puntos por resultado exacto**: 5 puntos por defecto
- **Configuración personalizable** por evento
- **Cálculo automático** al finalizar eventos

### Tipos de Distribución
1. **Winner Takes All**: 100% al primer lugar
2. **Top 3**: División entre primeros 3 lugares
3. **Percentage**: Configuración manual de porcentajes

### Estados de Quiniela
- **ACTIVA**: Aceptando participantes
- **EN_CURSO**: Iniciada, no acepta nuevos participantes
- **FINALIZADA**: Terminada con premios distribuidos
- **CANCELADA**: Cancelada con reembolsos

## 🔮 Roadmap Futuro

### Próximas Características
- [ ] **Quinielas colaborativas**: Múltiples creadores
- [ ] **Torneos de quinielas**: Quinielas conectadas
- [ ] **Predicciones con handicap**: Más opciones de apuesta
- [ ] **Social features**: Comentarios y chat
- [ ] **Mobile app**: Aplicación nativa
- [ ] **Push notifications**: Notificaciones en tiempo real
- [ ] **Analytics**: Dashboard de estadísticas avanzadas

### Integraciones Planeadas
- [ ] **Más criptomonedas**: USDT, BNB, MATIC
- [ ] **DeFi protocols**: Yield farming con premios
- [ ] **NFT rewards**: Premios únicos para ganadores
- [ ] **Social login**: Google, Facebook, Twitter
- [ ] **Payment gateways**: PayPal, Stripe

## 🐛 Solución de Problemas

### Problemas Comunes

#### Backend
```bash
# Error de migración
# Verificar que la migración V3 se ejecutó correctamente
SELECT * FROM flyway_schema_history WHERE version = '3';
```

#### Frontend
```bash
# Error de compilación TypeScript
# Verificar imports y tipos
npm run type-check
```

### Logs y Debugging
```bash
# Backend logs
tail -f logs/application.log | grep "Quiniela"

# Frontend debugging
# Usar React DevTools y browser console
```

## 🤝 Contribución

### Desarrollo
1. Fork del repositorio
2. Crear branch para feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **Backend**: Seguir convenciones de Spring Boot
- **Frontend**: ESLint + Prettier configurados
- **Base de datos**: Nomenclatura snake_case
- **APIs**: RESTful con nombres descriptivos

## 📄 Licencia

Este módulo es parte del proyecto CasiNova y sigue la misma licencia del proyecto principal.

---

## 🎉 ¡Listo para Usar!

El módulo de quinielas está **completamente funcional** y listo para producción. Los usuarios pueden empezar a crear sus propias quinielas inmediatamente después del despliegue.

### Estado Actual ✅
- ✅ Backend completamente implementado
- ✅ Frontend con UI/UX completa
- ✅ Base de datos configurada
- ✅ Integración con sistema de criptomonedas
- ✅ Sistema de premios automático
- ✅ Quinielas públicas y privadas
- ✅ Quick access en dashboard
- ✅ Navegación integrada

**¡Disfruta creando y participando en quinielas!** 🏆
