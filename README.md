# 🎰 24bet - Plataforma de Casino y Apuestas Deportivas

<div align="center">
  <img src="frontend/src/assets/banner-default.webp" alt="24bet Banner" width="800">
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-green.svg)](https://spring.io/projects/spring-boot)
  [![Java](https://img.shields.io/badge/Java-19-orange.svg)](https://openjdk.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://www.postgresql.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.12-38B2AC.svg)](https://tailwindcss.com/)
</div>

## 📋 Tabla de Contenidos
- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [🏗️ Arquitectura](#️-arquitectura)
- [🎨 Paleta de Colores 24bet](#-paleta-de-colores-24bet)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [📱 Frontend](#-frontend)
- [🔧 Backend](#-backend)
- [🎲 Funcionalidades Principales](#-funcionalidades-principales)
- [📊 Base de Datos](#-base-de-datos)
- [🔗 API Endpoints](#-api-endpoints)
- [🎯 Módulo de Quinielas](#-módulo-de-quinielas)
- [🔐 Autenticación](#-autenticación)
- [🎨 Componentes UI](#-componentes-ui)
- [📈 Estado de la Aplicación](#-estado-de-la-aplicación)
- [🧪 Testing](#-testing)
- [🚀 Despliegue](#-despliegue)

## 🎯 Descripción del Proyecto

**24bet** es una plataforma completa de casino y apuestas deportivas que combina la emoción de los juegos de casino con la estrategia de las apuestas deportivas. La aplicación ofrece una experiencia premium con un diseño moderno en rojos llamativos, funcionalidades completas de apuestas, un sistema de quinielas y una interfaz intuitiva para usuarios y administradores.

### ✨ Características Destacadas
- 🎰 **Casino Online**: Juegos de casino clásicos con interfaz moderna
- ⚽ **Apuestas Deportivas**: Sistema completo de apuestas en eventos deportivos
- 🏆 **Quinielas**: Creación y participación en quinielas con predicciones
- 🎨 **Diseño Premium**: Paleta de colores roja llamativa con efectos visuales
- 📱 **Responsive**: Optimizado para dispositivos móviles y desktop
- 🔐 **Seguridad**: Autenticación JWT y roles de usuario
- 💰 **Sistema de Premios**: Distribución automática de premios y recompensas

## 🏗️ Arquitectura

La aplicación sigue una arquitectura moderna de **Frontend-Backend separados**:

```
24bet/
├── frontend/          # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios API
│   │   ├── store/         # Redux store y slices
│   │   ├── types/         # Definiciones TypeScript
│   │   └── constants/     # Constantes y configuración
│   └── public/
└── backend/           # Spring Boot + PostgreSQL
    ├── src/main/java/com/example/cc/
    │   ├── controller/    # Controladores REST
    │   ├── service/       # Lógica de negocio
    │   ├── entities/      # Entidades JPA
    │   ├── dto/           # Data Transfer Objects
    │   ├── repository/    # Repositorios JPA
    │   └── config/        # Configuración
    └── src/main/resources/
```

## 🎨 Paleta de Colores 24bet

La paleta de colores está diseñada para crear una **experiencia de casino premium** con rojos llamativos:

### 🔴 Colores Principales
```css
/* Rojo Principal (24bet Brand) */
primary-500: #ef4444   /* Color principal */
primary-600: #dc2626   /* Color principal oscuro */
primary-700: #b91c1c   /* Hover states */

/* Naranja Secundario */
secondary-500: #ff5722  /* Botones secundarios */
secondary-600: #ea580c  /* Hover secundario */

/* Oro (Premios y Destacados) */
gold-500: #f59e0b      /* Premios y elementos dorados */
gold-600: #d97706      /* Hover dorado */

/* Verde (Éxito y Ganancias) */
success-500: #22c55e   /* Ganancias y éxito */
success-600: #16a34a   /* Confirmaciones */

/* Oscuros (Fondo Casino) */
dark-900: #0f172a      /* Fondo principal */
dark-800: #1e293b      /* Fondo secundario */
dark-700: #334155      /* Elementos elevados */
```

### 🎯 Aplicación de Colores
- **Botones Principales**: `bg-primary-500 hover:bg-primary-600`
- **Efectos Neón**: `shadow-neon-red` para elementos destacados
- **Gradientes**: `bg-red-gradient`, `bg-gold-gradient`, `bg-casino-gradient`
- **Cards de Casino**: `card-casino` con bordes rojos y efectos de brillo
- **Notificaciones**: Colores diferenciados por tipo (éxito, error, información)

### 🎨 Configuración en Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        secondary: {
          500: '#ff5722',
          600: '#ea580c'
        },
        gold: {
          500: '#f59e0b',
          600: '#d97706'
        },
        success: {
          500: '#22c55e',
          600: '#16a34a'
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      },
      backgroundImage: {
        'casino-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'red-gradient': 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)'
      },
      boxShadow: {
        'casino': '0 0 20px rgba(239, 68, 68, 0.5)',
        'gold': '0 0 20px rgba(245, 158, 11, 0.5)',
        'neon-red': '0 0 5px #ef4444, 0 0 10px #ef4444, 0 0 20px #ef4444',
        'neon-gold': '0 0 5px #f59e0b, 0 0 10px #f59e0b, 0 0 20px #f59e0b'
      }
    }
  }
}
```

### 🎨 Clases CSS Globales

```css
/* index.css - Estilos globales 24bet */
:root {
  --color-primary: #ef4444;
  --color-primary-dark: #dc2626;
  --color-secondary: #ff5722;
  --color-gold: #f59e0b;
  --color-dark: #0f172a;
  --color-dark-light: #1e293b;
}

/* Botones con branding 24bet */
.btn-primary {
  background-color: #ef4444;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #dc2626;
  box-shadow: 0 0 5px #ef4444, 0 0 10px #ef4444, 0 0 20px #ef4444;
  transform: scale(1.05);
}

.btn-gold {
  background-color: #f59e0b;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
  border: none;
  cursor: pointer;
}

.btn-gold:hover {
  background-color: #d97706;
  box-shadow: 0 0 5px #f59e0b, 0 0 10px #f59e0b, 0 0 20px #f59e0b;
  transform: scale(1.05);
}

/* Cards de casino */
.card-casino {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #ef4444;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.card-casino:hover {
  border-color: #f87171;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
}
```

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos
- **Node.js** >= 18.0.0
- **Java** >= 19
- **Maven** >= 3.8.0
- **PostgreSQL** >= 14

### 🔧 Configuración del Backend

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd 24bet/backend
```

2. **Configurar la base de datos**:
```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cc_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Configuración CORS
cors.allowed.origins=http://localhost:5173

# JWT Configuration
jwt.secret=tu_jwt_secret_key
jwt.expiration=86400000
```

3. **Instalar dependencias y ejecutar**:
```bash
mvn clean install
mvn spring-boot:run
```

### 🎨 Configuración del Frontend

1. **Navegar al directorio frontend**:
```bash
cd ../frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
# .env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=24bet
```

4. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080

## 📱 Frontend

### 🛠️ Tecnologías Frontend
- **React 18.3.1**: Biblioteca principal
- **TypeScript 5.8.3**: Tipado estático
- **Tailwind CSS 4.0.12**: Framework de estilos
- **Redux Toolkit**: Manejo de estado global
- **React Router**: Navegación
- **Axios**: Cliente HTTP
- **Framer Motion**: Animaciones
- **React Toastify**: Notificaciones

### 📂 Estructura de Componentes

```
src/components/
├── apuestas/           # Componentes de apuestas
│   ├── CrearApuestaConEvento.tsx
│   └── ModalApuesta.tsx
├── banner/             # Banners promocionales
│   └── CasinoBanner.tsx
├── cards/              # Tarjetas reutilizables
│   ├── Card.tsx
│   └── MatchCard.tsx
├── carrito/            # Carrito de apuestas
│   ├── BotonCarrito.tsx
│   └── CarritoApuestas.tsx
├── eventos/            # Eventos deportivos
│   └── EventoSearch.tsx
├── forms/              # Formularios
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── quinielas/          # Sistema de quinielas
│   ├── CrearQuinielaForm.tsx
│   ├── QuinielaCard.tsx
│   └── EventSelector.tsx
├── navigation/         # Navegación
│   ├── DashboardTabs.tsx
│   └── Tabs.tsx
└── ui/                 # Componentes UI base
    ├── Button.tsx
    ├── Modal.tsx
    └── Notification.tsx
```

### 🎯 Páginas Principales

```
src/pages/
├── LandingPage.tsx     # Página de inicio
├── user/               # Páginas de usuario
│   ├── DashboardUser.tsx
│   ├── ApuestasPage.tsx
│   ├── QuinielasPage.tsx
│   ├── CasinoPage.tsx
│   └── ProfilePage.tsx
└── admin/              # Panel administrativo
    ├── DashboardAdmin.tsx
    ├── EventosManagement.tsx
    └── UsersManagement.tsx
```

### 🔄 Hooks Personalizados

```typescript
// Hooks principales
useApuestas()           // Manejo de apuestas
useCarritoApuestas()    // Carrito de compras
useEventos()            // Eventos deportivos
useQuiniela()           // Sistema de quinielas
useNotificaciones()     // Sistema de notificaciones
useUser()               // Autenticación de usuarios
useDeportes()           // Gestión de deportes
useTheSportsDb()        // Integración API externa
```

## 🔧 Backend

### ⚙️ Tecnologías Backend
- **Spring Boot 3.5.0**: Framework principal
- **Spring Data JPA**: ORM y persistencia
- **Spring Security**: Autenticación y autorización
- **PostgreSQL**: Base de datos principal
- **JWT**: Tokens de autenticación
- **Maven**: Gestión de dependencias
- **Flyway**: Migraciones de base de datos

### 🏗️ Arquitectura Backend

```
src/main/java/com/example/cc/
├── CcApplication.java          # Clase principal
├── config/                     # Configuraciones
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── JwtConfig.java
├── controller/                 # Controladores REST
│   ├── AuthController.java
│   ├── ApuestaController.java
│   ├── EventoController.java
│   ├── QuinielaController.java
│   └── UserController.java
├── service/                    # Servicios de negocio
│   ├── AuthService.java
│   ├── ApuestaService.java
│   ├── EventoService.java
│   ├── QuinielaService.java
│   └── UserService.java
├── entities/                   # Entidades JPA
│   ├── User.java
│   ├── Apuesta.java
│   ├── Evento.java
│   ├── Quiniela.java
│   └── QuinielaPrediccion.java
├── dto/                        # Data Transfer Objects
│   ├── request/
│   ├── response/
│   └── quiniela/
└── repository/                 # Repositorios JPA
    ├── UserRepository.java
    ├── ApuestaRepository.java
    ├── EventoRepository.java
    └── QuinielaRepository.java
```

## 🎲 Funcionalidades Principales

### 🎰 **Casino**
- **Juegos Clásicos**: Ruleta, blackjack, slots
- **Interfaz Premium**: Efectos visuales y sonoros
- **Sistema de Créditos**: Manejo de saldo virtual
- **Historial de Juegos**: Seguimiento de sesiones

### ⚽ **Apuestas Deportivas**
- **Eventos en Vivo**: Integración con API de deportes
- **Múltiples Mercados**: 1X2, Over/Under, Handicap
- **Carrito de Apuestas**: Sistema de acumulación
- **Cuotas Dinámicas**: Actualización en tiempo real

### 🏆 **Sistema de Quinielas**
- **Creación de Quinielas**: Los usuarios pueden crear sus propias quinielas
- **Participación**: Unirse a quinielas existentes
- **Predicciones**: Sistema de predicciones por evento
- **Distribución de Premios**: Cálculo automático de ganancias
- **Rankings**: Tabla de posiciones por quiniela

### 💰 **Sistema Económico**
- **Billetera Virtual**: Manejo de saldo de usuarios
- **Transacciones**: Historial completo de movimientos
- **Bonificaciones**: Sistema de recompensas
- **Premios**: Distribución automática de ganancias

## 📊 Base de Datos

### 🗄️ Esquema Principal

```sql
-- Tabla de Usuarios
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    balance DECIMAL(10,2) DEFAULT 0.00,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos Deportivos
CREATE TABLE eventos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    equipo_local VARCHAR(100),
    equipo_visitante VARCHAR(100),
    fecha_evento TIMESTAMP,
    deporte VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'PROGRAMADO',
    cuota_local DECIMAL(5,2),
    cuota_empate DECIMAL(5,2),
    cuota_visitante DECIMAL(5,2),
    resultado_local INTEGER,
    resultado_visitante INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Quinielas
CREATE TABLE quinielas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    creador_id BIGINT REFERENCES users(id),
    costo_entrada DECIMAL(10,2) NOT NULL,
    premio_total DECIMAL(10,2) DEFAULT 0.00,
    fecha_cierre TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'ABIERTA',
    max_participantes INTEGER,
    tipo_quiniela VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos de Quiniela
CREATE TABLE quiniela_eventos (
    id BIGSERIAL PRIMARY KEY,
    quiniela_id BIGINT REFERENCES quinielas(id),
    evento_id BIGINT REFERENCES eventos(id),
    orden_evento INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Participaciones en Quinielas
CREATE TABLE quiniela_participaciones (
    id BIGSERIAL PRIMARY KEY,
    quiniela_id BIGINT REFERENCES quinielas(id),
    usuario_id BIGINT REFERENCES users(id),
    fecha_participacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntos_totales INTEGER DEFAULT 0,
    posicion INTEGER,
    premio_ganado DECIMAL(10,2) DEFAULT 0.00,
    UNIQUE(quiniela_id, usuario_id)
);

-- Tabla de Predicciones
CREATE TABLE quiniela_predicciones (
    id BIGSERIAL PRIMARY KEY,
    participacion_id BIGINT REFERENCES quiniela_participaciones(id),
    evento_id BIGINT REFERENCES eventos(id),
    tipo_prediccion VARCHAR(20),
    prediccion_local INTEGER,
    prediccion_visitante INTEGER,
    puntos_ganados INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Apuestas
CREATE TABLE apuestas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES users(id),
    evento_id BIGINT REFERENCES eventos(id),
    tipo_apuesta VARCHAR(20),
    monto DECIMAL(10,2) NOT NULL,
    cuota DECIMAL(5,2) NOT NULL,
    ganancia_potencial DECIMAL(10,2),
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    resultado VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📊 Relaciones Clave
- **Usuario-Quiniela**: Relación muchos a muchos a través de participaciones
- **Quiniela-Evento**: Relación muchos a muchos para eventos incluidos
- **Usuario-Predicción**: Cada usuario puede hacer una predicción por evento
- **Evento-Apuesta**: Los usuarios pueden apostar en múltiples eventos

## 🔗 API Endpoints

### 🔐 **Autenticación**
```http
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario
POST /api/auth/refresh        # Renovar token
GET  /api/auth/profile        # Obtener perfil de usuario
```

### ⚽ **Eventos Deportivos**
```http
GET    /api/eventos           # Listar eventos
GET    /api/eventos/{id}      # Obtener evento específico
POST   /api/eventos           # Crear evento (Admin)
PUT    /api/eventos/{id}      # Actualizar evento (Admin)
DELETE /api/eventos/{id}      # Eliminar evento (Admin)
GET    /api/eventos/deporte/{deporte}  # Eventos por deporte
```

### 🏆 **Quinielas**
```http
GET    /api/quinielas         # Listar todas las quinielas
GET    /api/quinielas/{id}    # Obtener quiniela específica
POST   /api/quinielas         # Crear nueva quiniela
PUT    /api/quinielas/{id}    # Actualizar quiniela
DELETE /api/quinielas/{id}    # Eliminar quiniela

# Participación en Quinielas
POST   /api/quinielas/{id}/unirse      # Unirse a quiniela
GET    /api/quinielas/{id}/participantes # Listar participantes
GET    /api/quinielas/usuario/{userId}  # Quinielas del usuario

# Predicciones
POST   /api/quinielas/{id}/predicciones    # Hacer predicciones
GET    /api/quinielas/{id}/mis-predicciones # Obtener mis predicciones
PUT    /api/quinielas/{id}/predicciones    # Actualizar predicciones

# Administración
POST   /api/quinielas/{id}/cerrar          # Cerrar quiniela
POST   /api/quinielas/{id}/calcular-puntos # Calcular puntos
POST   /api/quinielas/{id}/distribuir-premios # Distribuir premios
```

### 🎲 **Apuestas**
```http
GET    /api/apuestas          # Historial de apuestas del usuario
POST   /api/apuestas          # Crear nueva apuesta
GET    /api/apuestas/{id}     # Obtener apuesta específica
PUT    /api/apuestas/{id}     # Actualizar apuesta
DELETE /api/apuestas/{id}     # Cancelar apuesta (si está pendiente)
```

### 👤 **Usuarios**
```http
GET    /api/usuarios          # Listar usuarios (Admin)
GET    /api/usuarios/{id}     # Obtener usuario específico
PUT    /api/usuarios/{id}     # Actualizar perfil de usuario
GET    /api/usuarios/{id}/balance  # Obtener saldo del usuario
POST   /api/usuarios/{id}/deposito # Realizar depósito
POST   /api/usuarios/{id}/retiro   # Realizar retiro
```

## 🎯 Módulo de Quinielas

### 🏗️ **Arquitectura del Sistema de Quinielas**

El módulo de quinielas es una funcionalidad completa que permite:

#### 📝 **Creación de Quinielas**
```typescript
// Estructura de una quiniela
interface Quiniela {
  id: number;
  nombre: string;
  descripcion: string;
  creadorId: number;
  costoEntrada: number;
  premioTotal: number;
  fechaCierre: Date;
  estado: 'ABIERTA' | 'CERRADA' | 'FINALIZADA';
  maxParticipantes: number;
  tipoQuiniela: 'FUTBOL' | 'BASKETBALL' | 'MIXTA';
  eventos: Evento[];
  participantes: Usuario[];
}
```

#### 🎯 **Sistema de Predicciones**
```typescript
// Tipos de predicción disponibles
interface Prediccion {
  eventoId: number;
  tipoPrediccion: 'RESULTADO_EXACTO' | 'GANADOR' | 'OVER_UNDER';
  prediccionLocal?: number;
  prediccionVisitante?: number;
  puntosGanados: number;
}
```

#### 🏆 **Cálculo de Puntos**
- **Resultado Exacto**: 3 puntos
- **Ganador Correcto**: 1 punto
- **Predicción Incorrecta**: 0 puntos

#### 💰 **Distribución de Premios**
```typescript
// Sistema de distribución automática
const distribucionPremios = {
  primerLugar: 0.60,    // 60% del premio total
  segundoLugar: 0.30,   // 30% del premio total
  tercerLugar: 0.10     // 10% del premio total
};
```

### 🔄 **Flujo de una Quiniela**

1. **Creación**: Usuario crea quiniela con eventos seleccionados
2. **Participación**: Otros usuarios se unen pagando el costo de entrada
3. **Predicciones**: Participantes hacen sus predicciones antes del cierre
4. **Cierre**: Se cierra la quiniela al alcanzar la fecha límite
5. **Cálculo**: Se calculan puntos basados en resultados reales
6. **Premios**: Se distribuyen automáticamente los premios

## 🔐 Autenticación

### 🛡️ **Sistema de Seguridad**

```typescript
// Estructura del token JWT
interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}
```

### 🔑 **Roles y Permisos**

```typescript
// Definición de roles
enum UserRole {
  USER = 'USER',         // Usuario regular
  ADMIN = 'ADMIN'        // Administrador
}

// Permisos por rol
const permissions = {
  USER: [
    'CREATE_QUINIELA',
    'JOIN_QUINIELA',
    'MAKE_PREDICTION',
    'PLACE_BET',
    'VIEW_PROFILE'
  ],
  ADMIN: [
    'MANAGE_EVENTS',
    'MANAGE_USERS',
    'VIEW_ANALYTICS',
    'SYSTEM_CONFIG',
    '...ALL_USER_PERMISSIONS'
  ]
};
```

## 🎨 Componentes UI

### 🎯 **Sistema de Componentes**

```typescript
// Botón principal con branding 24bet
<Button
  variant="primary"      // primary | secondary | gold
  size="large"          // small | medium | large
  glowEffect={true}     // Efecto neón
  className="animate-pulse-fast"
>
  Hacer Apuesta
</Button>

// Card de casino con efectos
<Card
  variant="casino"      // casino | default | minimal
  hover={true}         // Efectos de hover
  neonBorder={true}    // Borde neón
>
  <CardContent />
</Card>

// Notificación con branding
<Notification
  type="success"       // success | error | warning | info
  title="¡Ganaste!"
  message="Tu apuesta fue exitosa"
  autoClose={5000}
/>
```

### 🎨 **Clases Utilitarias Personalizadas**

```css
/* Botones con branding 24bet */
.btn-24bet-primary {
  @apply bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-casino transition-all duration-300 hover:scale-105;
}

.btn-24bet-gold {
  @apply bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-6 rounded-lg shadow-gold transition-all duration-300 hover:scale-105;
}

/* Cards de casino */
.card-casino {
  @apply bg-gradient-to-br from-dark-800 to-dark-900 border border-primary-500 rounded-xl shadow-casino p-6 hover:border-primary-400 transition-all duration-300;
}

/* Efectos neón */
.neon-red {
  @apply shadow-neon-red;
  animation: glow 2s ease-in-out infinite alternate;
}

.neon-gold {
  @apply shadow-neon-gold;
  animation: glow-gold 2s ease-in-out infinite alternate;
}
```

## 📈 Estado de la Aplicación

### 🔄 **Redux Store Structure**

```typescript
// Store principal de la aplicación
interface RootState {
  auth: AuthState;           // Autenticación de usuarios
  apuestas: ApuestasState;   // Estado de apuestas
  eventos: EventosState;     // Eventos deportivos
  quinielas: QuinielasState; // Sistema de quinielas
  carrito: CarritoState;     // Carrito de apuestas
  notifications: NotificationState; // Sistema de notificaciones
  ui: UIState;               // Estado de la interfaz
}

// Slice principal de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});
```

## 🧪 Testing

### 🔍 **Estrategia de Testing**

```bash
# Frontend Testing
npm run test              # Jest unit tests
npm run test:coverage     # Coverage report
npm run e2e              # Cypress integration tests

# Backend Testing
mvn test                 # JUnit unit tests
mvn test -Dtest=IntegrationTest  # Integration tests
mvn jacoco:report        # Coverage report
```

### 📝 **Ejemplos de Tests**

```typescript
// Frontend: Test de componente de quiniela
describe('QuinielaCard', () => {
  it('should display quiniela information correctly', () => {
    const mockQuiniela = {
      id: 1,
      nombre: 'Liga Test',
      premioTotal: 1000,
      participantes: 10
    };
    
    render(<QuinielaCard quiniela={mockQuiniela} />);
    
    expect(screen.getByText('Liga Test')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByText('10 participantes')).toBeInTheDocument();
  });
});
```

```java
// Backend: Test de servicio de quinielas
@SpringBootTest
class QuinielaServiceTest {
    
    @Test
    void shouldCreateQuinielaSuccessfully() {
        // Given
        CrearQuinielaRequest request = new CrearQuinielaRequest();
        request.setNombre("Test Quiniela");
        request.setCostoEntrada(BigDecimal.valueOf(100));
        
        // When
        QuinielaResponse response = quinielaService.crearQuiniela(request, userId);
        
        // Then
        assertNotNull(response);
        assertEquals("Test Quiniela", response.getNombre());
        assertEquals(BigDecimal.valueOf(100), response.getCostoEntrada());
    }
}
```

## 🚀 Despliegue

### 🐳 **Docker Configuration**

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]

# Backend Dockerfile
FROM openjdk:19-jdk-alpine
VOLUME /tmp
COPY target/cc-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

### 📝 **Docker Compose**

```yaml
version: '3.8'
services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: cc_db
      POSTGRES_USER: cc_user
      POSTGRES_PASSWORD: cc_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Backend Spring Boot
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/cc_db
      SPRING_DATASOURCE_USERNAME: cc_user
      SPRING_DATASOURCE_PASSWORD: cc_password
    depends_on:
      - postgres

  # Frontend React
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://backend:8080/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

### ☁️ **Despliegue en la Nube**

```bash
# Construir y desplegar
docker-compose build
docker-compose up -d

# Verificar servicios
docker-compose ps
docker-compose logs -f

# Escalado horizontal
docker-compose up -d --scale backend=3
```

### 🔧 **Variables de Entorno de Producción**

```bash
# Backend
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db:5432/cc_db
JWT_SECRET=your_super_secure_jwt_secret_key
CORS_ALLOWED_ORIGINS=https://24bet.com

# Frontend
VITE_API_URL=https://api.24bet.com
VITE_APP_NAME=24bet
VITE_ENVIRONMENT=production
```

## 📞 Soporte y Contribución

### 🤝 **Cómo Contribuir**
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 🐛 **Reportar Bugs**
- Usa el sistema de Issues de GitHub
- Incluye pasos para reproducir el bug
- Especifica el navegador y versión
- Adjunta screenshots si es necesario

### 📋 **TODO List**
- [ ] Implementar más juegos de casino
- [ ] Añadir apuestas en vivo
- [ ] Sistema de chat en tiempo real
- [ ] Integración con pasarelas de pago
- [ ] Aplicación móvil nativa
- [ ] Sistema de afiliados
- [ ] Analytics avanzados
- [ ] Modo oscuro/claro

### 📄 **Licencia**
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

### 📧 **Contacto**
- **Email**: soporte@24bet.com
- **Website**: https://24bet.com
- **Discord**: https://discord.gg/24bet

---

<div align="center">
  <p><strong>¡Gracias por usar 24bet! 🎰🎯</strong></p>
  <p>La plataforma definitiva para casino y apuestas deportivas</p>
</div>
