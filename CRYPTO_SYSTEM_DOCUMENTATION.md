# Sistema de Criptomonedas - Documentación de Implementación

## Resumen de Funcionalidades Implementadas

Se ha implementado un sistema completo de gestión de criptomonedas que incluye:

### 1. Gestión de Wallets (CRUD)
- **Crear Wallet**: Permite crear nuevas wallets internas para usuarios
- **Leer Wallets**: Obtener información de wallets del usuario
- **Actualizar Wallet**: Modificar información de wallets existentes
- **Eliminar Wallet**: Remover wallets del sistema

### 2. Criptomonedas Soportadas
- **Bitcoin (BTC)**
- **Ethereum (ETH)**
- **Solana (SOL)**
- **TRC-20 (TRC20)**

### 3. Tipos de Depósitos

#### Depósito Automático
- El usuario selecciona una wallet existente
- Se verifica la transacción usando APIs externas
- Si es exitosa, se aumenta automáticamente el saldo

#### Depósito Manual por Solicitud
- El usuario genera una solicitud de depósito
- Un administrador la aprueba o rechaza
- Si se aprueba, se acredita el saldo

### 4. Tipos de Retiros

#### Retiro Automático
- El usuario solicita un retiro
- Se ejecuta automáticamente mediante APIs externas
- Utiliza wallets designadas para retiros

#### Retiro Manual por Solicitud
- El usuario solicita un retiro
- Un administrador valida y aprueba la operación
- Se ejecuta manualmente tras la aprobación

## Endpoints Implementados

### Endpoints para Clientes

#### Gestión de Wallets
- `POST /cc/crypto/wallets` - Crear nueva wallet
- `GET /cc/crypto/wallets` - Obtener wallets del usuario
- `GET /cc/crypto/wallets/{id}` - Obtener wallet específica
- `PUT /cc/crypto/wallets/{id}` - Actualizar wallet
- `DELETE /cc/crypto/wallets/{id}` - Eliminar wallet

#### Depósitos
- `POST /cc/crypto/deposit` - Depósito básico
- `POST /cc/crypto/deposit/automatic` - Depósito automático con verificación
- `POST /cc/crypto/deposit/manual` - Solicitud de depósito manual

#### Retiros
- `POST /cc/crypto/withdraw/automatic` - Retiro automático
- `POST /cc/crypto/withdraw/manual` - Solicitud de retiro manual

#### Información General
- `GET /cc/crypto/balances` - Obtener balances de criptomonedas
- `GET /cc/crypto/transactions` - Obtener historial de transacciones
- `POST /cc/crypto/convert-to-fiat` - Convertir crypto a fiat

### Endpoints para Administradores

#### Gestión de Solicitudes Manuales
- `GET /cc/crypto/admin/pending-transactions` - Obtener transacciones pendientes
- `POST /cc/crypto/admin/approve-transaction` - Aprobar/rechazar transacción
- `GET /cc/crypto/admin/wallets` - Obtener todas las wallets

#### Webhooks/Internos
- `POST /cc/crypto/process-confirmation` - Procesar confirmación de transacción

## Nuevos DTOs Creados

### CryptoWalletCreateRequestDTO
```java
{
  "cryptoType": "BTC|ETH|SOL|TRC20",
  "address": "string",
  "notes": "string"
}
```

### CryptoWalletDTO
```java
{
  "id": "long",
  "userId": "long",
  "cryptoType": "string",
  "address": "string",
  "balance": "decimal",
  "pendingDeposits": "decimal",
  "pendingWithdrawals": "decimal",
  "totalDeposited": "decimal",
  "totalWithdrawn": "decimal",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### CryptoManualDepositRequestDTO
```java
{
  "cryptoType": "BTC|ETH|SOL|TRC20",
  "amount": "decimal",
  "fromAddress": "string",
  "txHash": "string",
  "notes": "string"
}
```

### CryptoManualWithdrawalRequestDTO
```java
{
  "cryptoType": "BTC|ETH|SOL|TRC20",
  "amount": "decimal",
  "toAddress": "string",
  "notes": "string"
}
```

### CryptoAdminApprovalRequestDTO
```java
{
  "transactionId": "long",
  "approved": "boolean",
  "adminNotes": "string"
}
```

## Estados de Transacciones

### Estados Existentes
- `PENDING` - Pendiente
- `CONFIRMED` - Confirmada
- `COMPLETED` - Completada
- `FAILED` - Fallida
- `CANCELLED` - Cancelada

### Nuevos Estados
- `PENDING_ADMIN_APPROVAL` - Pendiente de aprobación administrativa
- `APPROVED` - Aprobada
- `REJECTED` - Rechazada

## Tipos de Transacciones

### Tipos Existentes
- `DEPOSIT` - Depósito
- `WITHDRAWAL` - Retiro
- `CONVERSION_TO_FIAT` - Conversión a fiat
- `CONVERSION_FROM_FIAT` - Conversión desde fiat

### Nuevos Tipos
- `MANUAL_DEPOSIT_REQUEST` - Solicitud de depósito manual
- `MANUAL_WITHDRAWAL_REQUEST` - Solicitud de retiro manual

## Funcionalidades Técnicas

### Validaciones Implementadas
- Validación de direcciones de wallet por tipo de criptomoneda
- Verificación de balance suficiente para retiros
- Validación de permisos de usuario para operaciones
- Verificación de existencia de wallets y transacciones

### Integración con APIs Externas
- Obtención de precios en tiempo real desde CoinGecko
- Verificación de transacciones en blockchain (simulada)
- Ejecución automática de retiros (simulada)

### Manejo de Errores
- Logs detallados para todas las operaciones
- Manejo de excepciones en todos los endpoints
- Mensajes de error descriptivos para el usuario

### Seguridad
- Autenticación requerida para todos los endpoints
- Verificación de permisos por rol (CLIENTE/ADMIN)
- Verificación de propiedad de wallets por usuario

## Flujo de Operaciones

### Flujo de Depósito Automático
1. Usuario crea solicitud de depósito con hash de transacción
2. Sistema verifica transacción en blockchain
3. Si es válida, se procesa automáticamente
4. Se actualiza el balance del usuario

### Flujo de Depósito Manual
1. Usuario crea solicitud de depósito manual
2. Solicitud queda en estado `PENDING_ADMIN_APPROVAL`
3. Administrador revisa y aprueba/rechaza
4. Si se aprueba, se acredita el saldo

### Flujo de Retiro Automático
1. Usuario solicita retiro automático
2. Sistema verifica balance suficiente
3. Se ejecuta automáticamente en blockchain
4. Se actualiza el balance tras confirmación

### Flujo de Retiro Manual
1. Usuario solicita retiro manual
2. Fondos se reservan en `pendingWithdrawals`
3. Administrador revisa y aprueba/rechaza
4. Si se aprueba, se ejecuta manualmente
5. Si se rechaza, fondos se restauran al balance

## Consideraciones de Producción

### Para Implementación Real
- Reemplazar simulaciones con integraciones reales de blockchain
- Implementar manejo de webhooks para confirmaciones
- Añadir encriptación para claves privadas
- Implementar rate limiting en endpoints
- Añadir monitoreo y alertas
- Implementar backup y recovery de wallets

### Mejoras Recomendadas
- Paginación en listados de transacciones
- Filtros avanzados para búsquedas
- Notificaciones push para usuarios
- Dashboard de administración
- Reportes y analytics
- API de webhooks para integraciones externas
