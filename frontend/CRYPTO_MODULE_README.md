# Módulo de Transacciones de Criptomonedas

Este módulo proporciona una funcionalidad completa para manejar depósitos y retiros de criptomonedas (Bitcoin, Ethereum, Solana) en el casino, integrándose perfectamente con el sistema existente.

## 🚀 Características Principales

### Criptomonedas Soportadas
- **Bitcoin (BTC)** - 3 confirmaciones requeridas
- **Ethereum (ETH)** - 12 confirmaciones requeridas  
- **Solana (SOL)** - 1 confirmación requerida

### Funcionalidades
- ✅ Depósitos automáticos con validación de direcciones
- ✅ Balances en tiempo real con conversión USD
- ✅ Historial completo de transacciones
- ✅ Integración con sistema de usuario existente
- ✅ Validación de redes y comisiones
- ✅ Interfaz responsive y moderna
- 🚧 Retiros (en desarrollo)

## 📁 Estructura de Archivos Creados

```
frontend/src/
├── types/
│   └── CryptoTypes.ts                    # Tipos TypeScript para crypto
├── service/api/
│   └── cryptoService.ts                  # Servicio API para transacciones
├── hooks/
│   └── useCryptoTransactions.ts          # Hook personalizado para crypto
├── components/crypto/
│   ├── CryptoDepositForm.tsx             # Formulario de depósito
│   ├── CryptoBalanceCard.tsx             # Tarjeta de balances
│   ├── CryptoTransactionHistory.tsx      # Historial de transacciones
│   └── IntegratedWallet.tsx              # Wallet integrado fiat + crypto
├── pages/user/
│   └── CryptoWalletPage.tsx              # Página principal de crypto
└── constants/
    └── ROUTERS.ts                        # Actualizado con nueva ruta
```

## 🔧 Instalación y Configuración

### 1. Dependencias
No se requieren dependencias adicionales. El módulo usa las librerías ya existentes en el proyecto.

### 2. Configuración de Backend
Para producción, actualizar las URLs en `cryptoService.ts`:

```typescript
const API_BASE_URL = 'https://tu-backend.com/api/crypto';
```

### 3. Integración de Rutas
Agregar la nueva ruta en tu router principal:

```typescript
import { CryptoWalletPage } from '../pages/user/CryptoWalletPage';

// En tu configuración de rutas
{
  path: '/c/crypto-wallet',
  element: <CryptoWalletPage />
}
```

## 🎯 Uso de los Componentes

### Hook Principal
```typescript
import { useCryptoTransactions } from '../hooks/useCryptoTransactions';

const {
  loading,
  error,
  balances,
  transactions,
  createDeposit,
  generateDepositAddress,
  // ... más funciones
} = useCryptoTransactions();
```

### Componente de Balance
```typescript
import { CryptoBalanceCard } from '../components/crypto/CryptoBalanceCard';

<CryptoBalanceCard
  onDeposit={() => setShowDepositForm(true)}
  onWithdraw={(cryptoType) => handleWithdraw(cryptoType)}
/>
```

### Formulario de Depósito
```typescript
import { CryptoDepositForm } from '../components/crypto/CryptoDepositForm';

<CryptoDepositForm
  onSuccess={() => console.log('Depósito exitoso')}
  onClose={() => setShowForm(false)}
/>
```

### Wallet Integrado
```typescript
import { IntegratedWallet } from '../components/crypto/IntegratedWallet';

<IntegratedWallet
  onDepositCrypto={() => setShowCryptoForm(true)}
  onDepositFiat={() => setShowFiatForm(true)}
/>
```

## 🔐 Seguridad Implementada

### Validaciones
- ✅ Validación de formato de direcciones por red
- ✅ Verificación de balances antes de retiros
- ✅ Validación de montos mínimos y máximos
- ✅ Verificación de redes activas

### Manejo de Errores
- ✅ Gestión centralizada de errores
- ✅ Mensajes de error específicos
- ✅ Retry automático en fallos de red
- ✅ Estados de carga consistentes

## 📊 Integración con Sistema Existente

### Balance Total
El módulo calcula automáticamente el balance total sumando:
- Balance fiat existente (`user.saldo`)
- Balances de todas las criptomonedas convertidos a USD

### Flujo de Depósito
1. Usuario selecciona criptomoneda y monto
2. Sistema genera dirección única para depósito
3. Usuario envía fondos a la dirección generada
4. Sistema detecta transacción automáticamente
5. Balance se actualiza tras las confirmaciones requeridas

## 🚀 Funcionalidades Futuras

### En Desarrollo
- [ ] Formulario de retiros completo
- [ ] Conversión entre criptomonedas
- [ ] Notificaciones push para confirmaciones
- [ ] Historial de precios con gráficos
- [ ] Límites personalizados por usuario

### Mejoras Planificadas
- [ ] Soporte para más criptomonedas (USDT, USDC, etc.)
- [ ] Integración con exchange para trading
- [ ] Sistema de referidos con crypto
- [ ] Staking de criptomonedas

## 🔗 Configuración del Backend

### 1. Base de Datos
Ejecutar el script SQL para crear las tablas necesarias:

```sql
-- Ubicación: backend/src/main/resources/db/migration/V2__Create_Crypto_Tables.sql
-- El script incluye:
-- - crypto_transactions: Historial de transacciones
-- - crypto_wallets: Balances por usuario y criptomoneda
-- - crypto_deposit_addresses: Direcciones de depósito generadas
-- - crypto_networks: Configuración de redes soportadas
-- - crypto_prices: Cache de precios (actualización automática)
```

### 2. Entidades Java Creadas
```
backend/src/main/java/com/example/cc/entities/
├── CryptoTransaction.java          # Transacciones
├── CryptoWallet.java              # Balances de usuarios  
└── CryptoDepositAddress.java      # Direcciones de depósito
```

### 3. DTOs y Repositorios
```
backend/src/main/java/com/example/cc/
├── dto/crypto/
│   ├── CryptoTransactionDTO.java
│   ├── CryptoBalanceDTO.java
│   ├── CryptoDepositRequestDTO.java
│   └── CryptoDepositAddressDTO.java
└── repository/
    ├── CryptoTransactionRepository.java
    ├── CryptoWalletRepository.java
    └── CryptoDepositAddressRepository.java
```

### 4. Servicio y Controlador
```
backend/src/main/java/com/example/cc/
├── service/CryptoService.java      # Lógica de negocio
└── controller/CryptoController.java # Endpoints REST
```

### 5. Endpoints Implementados
```
GET    /api/crypto/networks          ✅ Implementado
GET    /api/crypto/rates             ✅ Implementado
GET    /api/crypto/balances          ✅ Implementado
POST   /api/crypto/deposit-address   ✅ Implementado
POST   /api/crypto/deposit           ✅ Implementado
GET    /api/crypto/transactions      ✅ Implementado
GET    /api/crypto/transactions/:id  ✅ Implementado
GET    /api/crypto/fees/:network     ✅ Implementado
POST   /api/crypto/validate-address  ✅ Implementado
```

### 6. Configuración de Seguridad
El controlador incluye:
- Autenticación JWT requerida
- CORS configurado para frontend
- Validación de usuarios por token
- Manejo de errores centralizado

### 7. Integración con Usuario Existente
Para conectar con el sistema de usuarios actual:

```java
// En CryptoController.java, actualizar el método:
private Long getUserIdFromAuthentication(Authentication authentication) {
    // Implementar extracción del userId desde el JWT
    // Ejemplo:
    JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
    return Long.valueOf(jwtToken.getTokenAttributes().get("userId").toString());
}
```

## 🔗 APIs del Backend Requeridas

Para producción, el backend debe implementar estos endpoints:

```
GET    /api/crypto/networks          # Redes soportadas
GET    /api/crypto/rates             # Tipos de cambio
GET    /api/crypto/balances          # Balances del usuario
POST   /api/crypto/deposit-address   # Generar dirección depósito
POST   /api/crypto/deposit           # Crear depósito
POST   /api/crypto/withdrawal        # Crear retiro
GET    /api/crypto/transactions      # Historial transacciones
GET    /api/crypto/transactions/:id  # Detalle transacción
GET    /api/crypto/fees/:network     # Comisiones de red
POST   /api/crypto/validate-address  # Validar dirección
```

## 📱 Responsive Design

Todos los componentes están optimizados para:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

## 🎨 Temas y Estilos

El módulo utiliza:
- **Tailwind CSS** para estilos consistentes
- **Gradientes** para elementos destacados
- **Iconos Unicode** para criptomonedas
- **Estados de hover** y transiciones suaves

## 🧪 Testing

Para testing, el módulo incluye:
- Mock services con datos realistas
- Estados de carga y error simulados
- Validaciones de formularios
- Manejo de casos edge

## 📞 Soporte

Para dudas o problemas:
1. Revisar este README
2. Verificar tipos TypeScript
3. Comprobar errores en consola
4. Validar configuración de backend

---

**¡El módulo está listo para usar!** 🎉

Simplemente importa los componentes necesarios y comienza a recibir depósitos de criptomonedas en tu casino.
