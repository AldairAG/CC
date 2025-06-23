# Dashboard de Casino Deportivo

## Descripción
Dashboard completo para un casino deportivo que muestra eventos deportivos relevantes para apostar, inspirado en las principales plataformas como Bet365 y Caliente.

## Características Principales

### 🎰 Banner Principal
- Diseño atractivo con gradientes y elementos gráficos
- Botones de acción prominentes
- Efectos visuales modernos

### 📊 Estadísticas en Tiempo Real
- Partidos en vivo
- Partidos de hoy
- Próximos partidos
- Ligas populares disponibles

### 🏆 Secciones de Eventos
- **Ligas Populares**: Premier League, La Liga, Champions League, etc.
- **En Vivo**: Partidos que están ocurriendo ahora
- **Hoy**: Todos los partidos del día actual
- **Próximos**: Eventos programados para los próximos días

### 🎯 Tarjetas de Partidos
- Información completa del evento
- Logos de equipos y ligas
- Cuotas de apuesta simuladas
- Estado del partido (en vivo, programado, finalizado)
- Botón de apuesta directo

### 🔄 Estados de Carga
- Indicadores de carga mientras se obtienen los datos
- Manejo de errores con mensajes informativos
- Skeleton screens para mejor UX

## Tecnologías Utilizadas

### Frontend
- **React** con TypeScript
- **Redux Toolkit** para manejo de estado global
- **Tailwind CSS** para estilos modernos
- **Axios** para llamadas HTTP

### API Externa
- **TheSportsDB API** para datos deportivos en tiempo real
- Endpoints utilizados:
  - `/eventsnextleague.php` - Eventos de ligas específicas
  - `/eventsday.php` - Partidos del día
  - `/lookupevent.php` - Detalles de evento específico

## Estructura del Proyecto

```
src/
├── components/
│   ├── banner/
│   │   └── CasinoBanner.tsx          # Banner principal del casino
│   ├── cards/
│   │   └── MatchCard.tsx             # Tarjeta individual de partido
│   ├── navigation/
│   │   └── DashboardTabs.tsx         # Navegación por pestañas
│   ├── sections/
│   │   └── EventsSection.tsx         # Sección de eventos con grid
│   ├── stats/
│   │   └── DashboardStats.tsx        # Estadísticas del dashboard
│   └── ui/
│       └── LoadingSpinner.tsx        # Componente de carga
├── hooks/
│   └── useDeportes.ts                # Hook personalizado para deportes
├── pages/user/
│   └── Dashboard.tsx                 # Página principal del dashboard
├── service/api/
│   ├── apiClient.ts                  # Cliente HTTP configurado
│   └── partidoService.ts             # Servicios para obtener partidos
├── store/slices/
│   └── deportesSlice.ts              # Slice de Redux para deportes
└── types/
    └── EventType.ts                  # Tipos TypeScript para eventos
```

## Funcionalidades Implementadas

### ✅ Gestión de Estado
- Estado global con Redux Toolkit
- Separación de estado para diferentes tipos de eventos
- Manejo de loading y errores

### ✅ Servicios API
- Obtención de ligas populares
- Partidos en vivo
- Partidos del día actual
- Búsqueda por ID de evento

### ✅ Componentes Reutilizables
- Sistema de tabs dinámico
- Tarjetas de partido personalizables
- Estadísticas configurables
- Banner promocional

### ✅ UX/UI Moderna
- Diseño responsive
- Animaciones y transiciones suaves
- Skeleton loading screens
- Gradientes y efectos visuales

## Cómo Usar

### 1. Instalación
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Navegar al Dashboard
El dashboard está disponible en la ruta de usuario definida en el router.

## Personalización

### Modificar Ligas Populares
En `partidoService.ts`, línea 63:
```typescript
const popularLeagueIds = ['4328', '4335', '4480', '4346', '4331'];
```

### Cambiar Cuotas de Apuesta
En `MatchCard.tsx`, líneas 89-101, puedes personalizar las cuotas mostradas.

### Agregar Nuevas Secciones
1. Crear nuevo tab en `Dashboard.tsx`
2. Implementar función de obtención de datos en `partidoService.ts`
3. Agregar acción y reducer en `deportesSlice.ts`
4. Conectar en `useDeportes.ts`

## Próximas Mejoras

- [ ] Implementar sistema de apuestas real
- [ ] Agregar filtros por deporte y liga
- [ ] Notificaciones push para partidos en vivo
- [ ] Integración con sistema de pagos
- [ ] Chat en vivo durante eventos
- [ ] Estadísticas detalladas de equipos
- [ ] Historial de apuestas del usuario
- [ ] Sistema de favoritos

## Contribución

Para contribuir al proyecto:
1. Fork del repositorio
2. Crear rama feature
3. Implementar cambios
4. Crear pull request

## Licencia

Este proyecto es parte de un sistema de casino deportivo interno.
