# 🎰 24bet - Plataforma de Casino y Apuestas Deportivas

<div align="center">
  <img src="https://img.shields.io/badge/24bet-Casino%20%26%20Apuestas-red?style=for-the-badge&logo=game&logoColor=white" alt="24bet Logo">
  
  [![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.12-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción General](#-descripción-general)
- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🎨 Diseño y Experiencia de Usuario](#-diseño-y-experiencia-de-usuario)
- [🚀 Funcionalidades](#-funcionalidades)
- [👥 Panel de Administración](#-panel-de-administración)
- [💻 Stack Tecnológico](#-stack-tecnológico)
- [📱 Compatibilidad](#-compatibilidad)
- [🔐 Seguridad](#-seguridad)
- [🎯 Módulos del Sistema](#-módulos-del-sistema)
- [📊 Reportes y Analytics](#-reportes-y-analytics)
- [🚀 Instalación y Despliegue](#-instalación-y-despliegue)
- [📞 Soporte](#-soporte)

---

## 🎯 Descripción General

**24bet** es una plataforma integral de entretenimiento online que combina la emoción del casino con la estrategia de las apuestas deportivas. Desarrollada con tecnologías modernas y diseñada con un enfoque premium, ofrece una experiencia completa para operadores de casino y usuarios finales.

### 🎪 ¿Qué es 24bet?

24bet es más que una simple plataforma de apuestas. Es un **ecosistema completo** que incluye:

- **🎰 Casino Online**: Experiencia de casino digital con juegos clásicos
- **⚽ Apuestas Deportivas**: Sistema completo de apuestas en tiempo real
- **🏆 Sistema de Quinielas**: Predicciones deportivas con premios
- **💰 Gestión Financiera**: Manejo de criptomonedas y pagos
- **👨‍💼 Panel Administrativo**: Control total para operadores
- **📱 Experiencia Móvil**: Optimizado para todos los dispositivos

---

## ✨ Características Principales

### 🎯 Para Usuarios
- **Registro y Autenticación Segura** con JWT
- **Perfil de Usuario Completo** con historial y estadísticas
- **Carrito de Apuestas** para gestionar múltiples apuestas
- **Wallet Multi-Criptomoneda** (Bitcoin, Ethereum, etc.)
- **Notificaciones en Tiempo Real** de eventos y resultados
- **Historial Completo** de apuestas y transacciones
- **Sistema de Niveles** y recompensas por actividad

### 🎰 Casino
- **Interfaz Inmersiva** con diseño de casino real
- **Juegos Clásicos** (próximamente: slots, blackjack, ruleta)
- **Estadísticas de Juego** en tiempo real
- **Sistema de Bonificaciones** y promociones
- **Límites Personalizables** para juego responsable

### ⚽ Apuestas Deportivas
- **Integración con APIs Deportivas** para datos en tiempo real
- **Múltiples Deportes**: Fútbol, Baloncesto, Tenis, y más
- **Cuotas Dinámicas** que se actualizan automáticamente
- **Apuestas En Vivo** durante los eventos
- **Filtros Avanzados** por deporte, liga, fecha
- **Predicciones y Estadísticas** históricas

### 🏆 Sistema de Quinielas
- **Creación de Quinielas Personalizadas**
- **Participación Múltiple** en diferentes quinielas
- **Sistema de Puntuación Automático**
- **Distribución de Premios** automática
- **Rankings y Leaderboards**
- **Quinielas Públicas y Privadas**

---

## 🏗️ Arquitectura del Sistema

### 📐 Arquitectura General

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   FRONTEND      │◄──►│    BACKEND      │◄──►│   BASE DE      │
│                 │    │                 │    │   DATOS         │
│  React + TS     │    │  Spring Boot    │    │  PostgreSQL     │
│  Tailwind CSS   │    │  Java 19        │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   SERVICIOS     │    │   APIs          │    │   REDIS         │
│   EXTERNOS      │    │   EXTERNAS      │    │   CACHE         │
│                 │    │                 │    │                 │
│  Crypto APIs    │    │  Sports APIs    │    │                 │
│  Payment        │    │  TheSportsDB    │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔧 Componentes Principales

#### Frontend (React + TypeScript)
- **Páginas Principales**: Landing, Dashboard, Perfil, Apuestas
- **Componentes Reutilizables**: Botones, Formularios, Modales
- **Estado Global**: Redux Toolkit para gestión de estado
- **Routing**: React Router para navegación SPA
- **Estilos**: Tailwind CSS para diseño responsive

#### Backend (Spring Boot + Java)
- **Controladores REST**: Endpoints para todas las operaciones
- **Servicios de Negocio**: Lógica de apuestas, quinielas, usuarios
- **Entidades JPA**: Modelado de datos con Hibernate
- **Seguridad**: JWT para autenticación y autorización
- **Integración**: APIs externas para datos deportivos

#### Base de Datos (PostgreSQL)
- **Usuarios y Autenticación**
- **Apuestas y Eventos Deportivos**
- **Quinielas y Participaciones**
- **Transacciones y Wallets**
- **Configuración del Sistema**

---

## 🎨 Diseño y Experiencia de Usuario

### 🎯 Filosofía de Diseño

24bet está diseñado con una **filosofía premium** que evoca la experiencia de un casino de Las Vegas, combinada con la modernidad de las plataformas digitales actuales.

### 🎨 Paleta de Colores

```css
/* 🔴 Rojos Principales (Marca 24bet) */
primary-500: #ef4444   /* Rojo vibrante principal */
primary-600: #dc2626   /* Rojo oscuro para contraste */
primary-700: #b91c1c   /* Rojo profundo para hover */

/* 🟠 Naranjas Secundarios */
secondary-500: #ff5722  /* Naranja energético */
secondary-600: #ea580c  /* Naranja oscuro */

/* 🟡 Oro (Premios y VIP) */
gold-500: #f59e0b      /* Oro brillante para premios */
gold-600: #d97706      /* Oro oscuro para elegancia */

/* 🟢 Verde (Éxito y Ganancias) */
success-500: #22c55e   /* Verde victorioso */
success-600: #16a34a   /* Verde confirmación */

/* ⚫ Oscuros (Ambiente Casino) */
dark-900: #0f172a      /* Negro profundo */
dark-800: #1e293b      /* Gris carbón */
dark-700: #334155      /* Gris medio */
```

### 🎪 Elementos Visuales

- **🎰 Iconografía**: Heroicons con temática de casino y deportes
- **✨ Animaciones**: Transiciones suaves con Framer Motion
- **🎨 Gradientes**: Efectos de profundidad con gradientes rojos
- **🌟 Efectos**: Hover states y micro-interacciones
- **📱 Responsive**: Diseño que se adapta a cualquier pantalla

### 🎯 Principios UX

1. **🚀 Velocidad**: Navegación rápida y carga instantánea
2. **🔍 Claridad**: Información clara y accesible
3. **🎮 Diversión**: Elementos lúdicos que mantienen el engagement
4. **🔒 Confianza**: Diseño profesional que inspira seguridad
5. **📱 Accesibilidad**: Funcional en todos los dispositivos

---

## 🚀 Funcionalidades

### 👤 Gestión de Usuarios

#### 🔐 Autenticación y Registro
- **Registro Completo** con validación de datos
- **Login Seguro** con JWT y refresh tokens
- **Recuperación de Contraseña** por email
- **Verificación de Cuenta** obligatoria
- **Autenticación de Dos Factores** (opcional)

#### 👨‍💼 Perfil de Usuario
- **Información Personal** editable
- **Historial de Actividad** completo
- **Configuración de Preferencias**
- **Límites de Apuesta** personalizables
- **Estado VIP** con beneficios especiales

### 💰 Sistema Financiero

#### 🪙 Wallets y Criptomonedas
- **Soporte Multi-Cripto**: Bitcoin, Ethereum, Litecoin, etc.
- **Depósitos Automáticos** con confirmación blockchain
- **Retiros Rápidos** con verificación de seguridad
- **Historial de Transacciones** detallado
- **Conversión Automática** entre criptomonedas

#### 💳 Gestión de Fondos
- **Balance en Tiempo Real**
- **Sistema de Comisiones** configurable
- **Límites de Depósito/Retiro**
- **Alertas de Movimientos** importantes
- **Reportes Financieros** personalizados

### ⚽ Apuestas Deportivas

#### 🏟️ Eventos y Cuotas
- **Datos en Tiempo Real** vía TheSportsDB API
- **Múltiples Deportes**: Fútbol, NBA, NFL, Tennis, etc.
- **Cuotas Competitivas** actualizadas automáticamente
- **Apuestas Pre-partido** y en vivo
- **Estadísticas Históricas** de equipos y jugadores

#### 🎯 Tipos de Apuesta
- **Resultado Final** (1X2)
- **Handicap Asiático**
- **Más/Menos Goles**
- **Ambos Equipos Marcan**
- **Apostador Específico** (próximamente)

#### 🛒 Carrito de Apuestas
- **Múltiples Selecciones** en un solo ticket
- **Apuestas Combinadas** con multiplicador de cuotas
- **Cálculo Automático** de ganancias potenciales
- **Confirmación Inteligente** antes de procesar
- **Guardado Temporal** de selecciones

### 🏆 Sistema de Quinielas

#### 🎲 Creación y Gestión
- **Creador de Quinielas** con interfaz intuitiva
- **Selección de Eventos** de múltiples deportes
- **Configuración de Premios** flexible
- **Fechas de Inicio/Cierre** programables
- **Quinielas Públicas/Privadas** con códigos de acceso

#### 🏅 Participación
- **Búsqueda de Quinielas** disponibles
- **Predicciones Múltiples** por usuario
- **Sistema de Puntuación** automático
- **Rankings en Tiempo Real**
- **Notificaciones de Resultados**

#### 🎁 Premios y Recompensas
- **Distribución Automática** de premios
- **Múltiples Ganadores** por posición
- **Premios en Criptomonedas**
- **Bonus por Participación** frecuente
- **Historial de Ganancias**

---

## 👥 Panel de Administración

### 🎛️ Dashboard Principal
- **Métricas en Tiempo Real**: Usuarios activos, apuestas, ingresos
- **Gráficos Interactivos**: Tendencias y estadísticas visuales
- **Alertas del Sistema**: Notificaciones importantes
- **Acciones Rápidas**: Operaciones comunes al alcance
- **Resumen de Actividad**: Lo más importante del día

### 👤 Gestión de Usuarios
- **Lista Completa** de usuarios registrados
- **Filtros Avanzados**: Por estado, tipo, fecha, actividad
- **Búsqueda Inteligente**: Por nombre, email, ID
- **Acciones Administrativas**: Editar, suspender, eliminar
- **Historial de Usuario**: Apuestas, transacciones, actividad

### 🎰 Gestión de Apuestas
- **Monitor de Apuestas**: Todas las apuestas en tiempo real
- **Gestión de Resultados**: Confirmar y procesar resultados
- **Análisis de Riesgo**: Identificar patrones sospechosos
- **Reportes Detallados**: Ganancias/pérdidas por período
- **Configuración de Límites**: Máximos por usuario/evento

### 🏆 Gestión de Quinielas
- **Lista de Quinielas**: Activas, programadas, finalizadas
- **Gestión de Eventos**: Añadir/quitar eventos de quinielas
- **Distribución de Premios**: Configurar y procesar pagos
- **Estadísticas de Participación**: Análisis de engagement
- **Moderación**: Aprobar/rechazar quinielas públicas

### 💰 Gestión Financiera
- **Balance General**: Fondos totales del sistema
- **Transacciones**: Depósitos, retiros, transferencias
- **Criptomonedas**: Balances por moneda y wallets
- **Comisiones**: Configurar tarifas y comisiones
- **Reportes Financieros**: P&L, cash flow, etc.

### 🏅 Eventos Deportivos
- **Calendario de Eventos**: Próximos partidos y competiciones
- **Gestión de Cuotas**: Ajustar odds manualmente
- **Resultados**: Confirmar y procesar resultados
- **Estadísticas**: Rendimiento por deporte/liga
- **Integración APIs**: Configurar fuentes de datos

### 🔔 Sistema de Notificaciones
- **Notificaciones Masivas**: Enviar a todos los usuarios
- **Segmentación**: Por tipo de usuario, actividad, etc.
- **Programación**: Notificaciones automáticas por eventos
- **Templates**: Plantillas predefinidas para diferentes tipos
- **Estadísticas**: Tasa de apertura, engagement, etc.

### 👨‍💼 Roles y Permisos
- **Gestión de Roles**: Super Admin, Admin, Moderador, Soporte
- **Permisos Granulares**: Control específico por funcionalidad
- **Administradores**: Lista de staff con acceso al panel
- **Auditoría**: Log de acciones administrativas
- **Seguridad**: Control de acceso y sesiones

### ⚙️ Configuración del Sistema
- **Configuración General**: Nombre, logo, información básica
- **Configuración Financiera**: Comisiones, límites, monedas
- **Configuración de Seguridad**: Políticas de contraseñas, 2FA
- **Configuración de Notificaciones**: Templates, proveedores
- **Configuración de Límites**: Apuestas, depósitos, retiros

---

## 💻 Stack Tecnológico

### 🎨 Frontend
```json
{
  "framework": "React 18.3.1",
  "language": "TypeScript 5.8.3",
  "styling": "Tailwind CSS 4.0.12",
  "state_management": "Redux Toolkit",
  "routing": "React Router DOM",
  "forms": "Formik + Yup",
  "icons": "Heroicons",
  "animations": "Framer Motion",
  "http_client": "Axios",
  "build_tool": "Vite"
}
```

### ⚙️ Backend
```json
{
  "framework": "Spring Boot 3.5.0",
  "language": "Java 19",
  "database": "PostgreSQL",
  "orm": "JPA/Hibernate",
  "security": "Spring Security + JWT",
  "documentation": "OpenAPI/Swagger",
  "testing": "JUnit + Mockito",
  "build_tool": "Maven",
  "cache": "Redis (opcional)"
}
```

### 🗄️ Base de Datos
```sql
-- Principales tablas del sistema
TABLES:
├── users (usuarios y autenticación)
├── user_profiles (perfiles detallados)
├── wallets (billeteras de criptomonedas)
├── transactions (historial de transacciones)
├── sports_events (eventos deportivos)
├── bets (apuestas individuales)
├── bet_slips (tickets de apuesta)
├── quinielas (quinielas creadas)
├── quiniela_participations (participaciones)
├── predictions (predicciones de usuarios)
├── notifications (sistema de notificaciones)
└── admin_configs (configuración del sistema)
```

### 🔗 APIs Externas
- **TheSportsDB**: Datos deportivos en tiempo real
- **CoinGecko**: Precios de criptomonedas
- **Blockchain APIs**: Validación de transacciones crypto
- **Email Services**: Envío de notificaciones y confirmaciones

---

## 📱 Compatibilidad

### 🖥️ Navegadores Soportados
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+
- ✅ **Opera** 76+

### 📱 Dispositivos Móviles
- ✅ **iOS** 13+ (Safari, Chrome)
- ✅ **Android** 8+ (Chrome, Firefox)
- ✅ **Tablets** (iPad, Android tablets)
- ✅ **Desktop** (Windows, macOS, Linux)

### 🌐 Responsive Design
- **📱 Mobile First**: Diseñado primero para móviles
- **💻 Desktop Enhanced**: Experiencia rica en pantallas grandes
- **🎮 Touch Optimized**: Controles amigables para dispositivos táctiles
- **⚡ Performance**: Carga rápida en conexiones lentas

---

## 🔐 Seguridad

### 🛡️ Autenticación y Autorización
- **JWT Tokens**: Autenticación sin estado
- **Refresh Tokens**: Renovación automática de sesiones
- **Roles y Permisos**: Control granular de acceso
- **2FA**: Autenticación de dos factores (opcional)
- **Rate Limiting**: Protección contra ataques de fuerza bruta

### 🔒 Protección de Datos
- **Encriptación**: Contraseñas hasheadas con bcrypt
- **HTTPS**: Comunicación segura en producción
- **Validación**: Input validation en frontend y backend
- **Sanitización**: Protección contra XSS y SQL injection
- **CORS**: Configuración correcta de origen cruzado

### 💰 Seguridad Financiera
- **Wallet Validation**: Verificación de direcciones crypto
- **Transaction Monitoring**: Detección de transacciones sospechosas
- **Límites Automáticos**: Prevención de pérdidas excesivas
- **Auditoría**: Log completo de transacciones financieras
- **Backup**: Respaldo regular de datos críticos

---

## 🎯 Módulos del Sistema

### 1. 👤 Módulo de Usuarios
**Funcionalidades:**
- Registro y autenticación
- Gestión de perfiles
- Preferencias y configuración
- Historial de actividad
- Sistema de niveles/VIP

**Tecnologías:**
- React Hook Form para formularios
- JWT para autenticación
- Redux para estado global
- Validación con Yup

### 2. 💰 Módulo Financiero
**Funcionalidades:**
- Gestión de wallets multi-crypto
- Depósitos y retiros automáticos
- Historial de transacciones
- Conversión de criptomonedas
- Reportes financieros

**Tecnologías:**
- APIs de blockchain
- PostgreSQL para transacciones
- Redis para cache de precios
- Cron jobs para actualizaciones

### 3. ⚽ Módulo de Apuestas
**Funcionalidades:**
- Eventos deportivos en tiempo real
- Sistema de cuotas dinámicas
- Carrito de apuestas
- Apuestas en vivo
- Gestión de resultados

**Tecnologías:**
- TheSportsDB API
- WebSockets para tiempo real
- Algoritmos de cuotas
- Sistema de notificaciones

### 4. 🏆 Módulo de Quinielas
**Funcionalidades:**
- Creación de quinielas personalizadas
- Sistema de predicciones
- Cálculo automático de puntos
- Distribución de premios
- Rankings y leaderboards

**Tecnologías:**
- Algoritmos de puntuación
- Cron jobs para resultados
- Sistema de premios automático
- Notificaciones push

### 5. 🎰 Módulo de Casino
**Funcionalidades:**
- Juegos de casino (en desarrollo)
- Gestión de partidas
- Sistema de RNG
- Estadísticas de juego
- Bonificaciones

**Tecnologías:**
- Canvas/WebGL para juegos
- RNG certificado
- Animaciones avanzadas
- Audio effects

### 6. 🔔 Módulo de Notificaciones
**Funcionalidades:**
- Notificaciones en tiempo real
- Email notifications
- Push notifications
- Segmentación de usuarios
- Templates personalizables

**Tecnologías:**
- WebSockets
- Email services (SMTP)
- Push notification APIs
- Template engine

### 7. 👨‍💼 Módulo Administrativo
**Funcionalidades:**
- Panel de control completo
- Gestión de usuarios
- Reportes y analytics
- Configuración del sistema
- Auditoría y logs

**Tecnologías:**
- Dashboard con gráficos
- Exportación de datos
- Sistema de roles
- Logging avanzado

---

## 📊 Reportes y Analytics

### 📈 Dashboard de Métricas
- **Usuarios Activos**: Daily/Weekly/Monthly active users
- **Retención**: Análisis de retención de usuarios
- **Ingresos**: Revenue por día/semana/mes
- **Apuestas**: Volume y tendencias de apuestas
- **Conversión**: Funnel de registro a primera apuesta

### 💰 Reportes Financieros
- **P&L Statement**: Ganancias y pérdidas detalladas
- **Cash Flow**: Flujo de efectivo por período
- **Balance por Cripto**: Distribución de fondos
- **Comisiones**: Ingresos por comisiones y fees
- **ROI por Usuario**: Return on investment por segment

### 🎯 Analytics de Comportamiento
- **Heatmaps**: Zonas más utilizadas de la aplicación
- **User Journey**: Caminos más comunes de navegación
- **Engagement**: Tiempo en sesión y páginas por visita
- **Conversión de Eventos**: Embudo de eventos importantes
- **Abandono**: Puntos donde usuarios abandonan

### 🏆 Reportes de Quinielas
- **Participación**: Número de usuarios por quiniela
- **Engagement**: Frecuencia de participación
- **Premios Distribuidos**: Total de premios entregados
- **Performance**: Quinielas más populares
- **Predicciones**: Análisis de accuracy de usuarios

---

## 🚀 Instalación y Despliegue

### 💻 Desarrollo Local

#### 📋 Prerequisitos
```bash
# Software requerido
- Java 19+
- Node.js 18+
- PostgreSQL 14+
- Git
- Maven 3.8+
- npm/yarn
```

#### 🔧 Configuración del Backend
```bash
# 1. Clonar el repositorio
git clone [repository-url]
cd 24bet/backend

# 2. Configurar base de datos en application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/casino_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password

# 3. Instalar dependencias y ejecutar
./mvnw clean install
./mvnw spring-boot:run
```

#### 🎨 Configuración del Frontend
```bash
# 1. Navegar al directorio frontend
cd ../frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (.env)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws

# 4. Ejecutar en modo desarrollo
npm run dev
```

### 🚀 Despliegue en Producción

#### 🐳 Docker (Recomendado)
```dockerfile
# Backend Dockerfile
FROM openjdk:19-jdk-slim
COPY target/casino-app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]

# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```

#### ☁️ Despliegue en la Nube
```yaml
# docker-compose.yml para producción
version: '3.8'
services:
  database:
    image: postgres:14
    environment:
      POSTGRES_DB: casino_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password
    
  backend:
    build: ./backend
    depends_on:
      - database
    environment:
      SPRING_PROFILES_ACTIVE: production
    
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### 🔧 Variables de Entorno

#### Backend (.env)
```properties
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=casino_db
DB_USER=admin
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRATION=86400000

# APIs Externas
THESPORTSDB_API_KEY=your_api_key
CRYPTO_API_KEY=your_crypto_api_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password
```

#### Frontend (.env)
```properties
# API URLs
VITE_API_BASE_URL=https://api.24bet.com
VITE_WS_URL=wss://api.24bet.com/ws

# Configuración
VITE_APP_NAME=24bet
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# Analytics (opcional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
VITE_HOTJAR_ID=your_hotjar_id
```

---

## 📞 Soporte

### 🎯 Soporte Técnico

#### 📧 Contacto Directo
- **Email**: soporte@24bet.com
- **Teléfono**: +1 (555) 123-4567
- **Horario**: 24/7 para problemas críticos

#### 💬 Canales de Comunicación
- **Slack**: Canal dedicado para soporte
- **Ticket System**: Sistema interno de tickets
- **Video Calls**: Reuniones programadas para issues complejos
- **Screen Sharing**: Soporte remoto cuando sea necesario

### 📚 Documentación

#### 🔗 Enlaces Útiles
- **Documentación API**: `/docs/api`
- **Guías de Usuario**: `/docs/user-guides`
- **Troubleshooting**: `/docs/troubleshooting`
- **FAQ**: `/docs/faq`

#### 📖 Recursos Adicionales
- **Video Tutorials**: Tutoriales paso a paso
- **Best Practices**: Guías de mejores prácticas
- **Code Examples**: Ejemplos de implementación
- **Migration Guides**: Guías de migración y updates

### 🔧 Mantenimiento

#### 🛠️ Servicios Incluidos
- **Updates Regulares**: Actualizaciones de seguridad y features
- **Monitoring 24/7**: Monitoreo continuo del sistema
- **Backup Automático**: Respaldos diarios de datos críticos
- **Performance Optimization**: Optimización continua
- **Security Audits**: Auditorías de seguridad periódicas

#### 📊 SLA (Service Level Agreement)
- **Uptime**: 99.9% guaranteed
- **Response Time**: < 2 horas para issues críticos
- **Resolution Time**: < 24 horas para problemas críticos
- **Maintenance Windows**: Notificación 48h antes
- **Data Backup**: Respaldo cada 6 horas

### 🎓 Training y Onboarding

#### 👥 Para Administradores
- **Sesión de Onboarding**: 2 horas de training inicial
- **Manual de Administración**: Guía completa paso a paso
- **Video Tutorials**: Serie de videos explicativos
- **Q&A Sessions**: Sesiones mensuales de preguntas

#### 👤 Para Usuarios Finales
- **Guías de Usuario**: Documentación friendly para users
- **Video Demos**: Demostraciones de funcionalidades
- **FAQ Interactiva**: Preguntas frecuentes con búsqueda
- **Live Chat**: Soporte en vivo para usuarios

---

## 🎉 Conclusión

**24bet** representa la evolución de las plataformas de entretenimiento online, combinando la emoción del casino tradicional con la innovación de las tecnologías modernas. Con un diseño centrado en el usuario, tecnologías de vanguardia y un enfoque en la experiencia premium, 24bet está preparado para capturar y retener a usuarios en el competitivo mercado del gambling online.

### 🎯 Ventajas Competitivas

- **🎨 Diseño Premium**: Interfaz que compite con las mejores plataformas del mercado
- **⚡ Performance**: Optimizado para velocidad y responsividad
- **🔐 Seguridad**: Estándares de seguridad bancaria
- **📱 Mobile-First**: Experiencia nativa en dispositivos móviles
- **🌍 Escalabilidad**: Arquitectura preparada para crecimiento
- **🎰 Versatilidad**: Casino + Deportes + Quinielas en una sola plataforma

### 🚀 Próximos Pasos

1. **Lanzamiento Beta**: Testing con usuarios selectos
2. **Optimización**: Mejoras basadas en feedback
3. **Marketing Launch**: Campaña de lanzamiento oficial
4. **Feature Expansion**: Nuevas funcionalidades según demanda
5. **International**: Expansión a mercados internacionales

---

<div align="center">
  <h3>🎰 ¡Bienvenido al futuro del entretenimiento online con 24bet! 🎰</h3>
  <p><strong>Donde cada apuesta es una oportunidad de ganar en grande</strong></p>
  
  [![Website](https://img.shields.io/badge/Website-24bet.com-red?style=for-the-badge&logo=globe&logoColor=white)](https://24bet.com)
  [![Support](https://img.shields.io/badge/Support-24%2F7-green?style=for-the-badge&logo=support&logoColor=white)](mailto:soporte@24bet.com)
  [![License](https://img.shields.io/badge/License-Proprietary-blue?style=for-the-badge&logo=license&logoColor=white)](LICENSE)
</div>

---

*© 2024 24bet. Todos los derechos reservados. Juega con responsabilidad.*
