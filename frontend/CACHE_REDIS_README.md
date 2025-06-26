# Sistema de Cache Redis para Frontend

## Descripción General

Este sistema implementa un cache similar a Redis para el frontend usando `localStorage` y `sessionStorage`, proporcionando funcionalidades avanzadas como TTL (Time To Live), compresión, estadísticas y gestión automática.

## Arquitectura del Sistema

### 1. **CacheService** (`/service/cache/cacheService.ts`)
- **Propósito**: Servicio base que simula Redis usando Web Storage APIs
- **Características**:
  - TTL automático con expiración
  - Soporte para localStorage y sessionStorage
  - Compresión opcional de datos grandes
  - Método `memoize` para cachear funciones
  - Limpieza automática de entradas expiradas
  - Estadísticas detalladas

### 2. **ApiCacheService** (`/service/cache/apiCacheService.ts`)
- **Propósito**: Wrapper para Axios que añade cache automático a las peticiones API
- **Características**:
  - Interceptores automáticos para requests/responses
  - Configuración específica por endpoint
  - Patrones de URL para determinar qué cachear
  - TTL diferenciado según el tipo de datos

### 3. **CacheManager** (`/service/cache/cacheManager.ts`)
- **Propósito**: Gestor centralizado para administrar el cache
- **Características**:
  - Estadísticas completas del cache
  - Limpieza inteligente por categorías
  - Recomendaciones automáticas de mantenimiento
  - Limpieza automática cuando se acerca al límite

## Configuración Actual

### TTL por Endpoint:
```typescript
'/all_leagues.php': 3600s (1 hora)         // Ligas no cambian frecuentemente
'/all_sports.php': 86400s (24 horas)       // Deportes muy estables  
'/livescore.php': 30s                       // Datos en vivo muy volátiles
'/eventsday.php': 600s (10 minutos)        // Eventos del día
'/eventsnextleague.php': 1800s (30 min)    // Eventos de liga
'/lookupevent.php': 900s (15 minutos)      // Evento específico
'/searchteams.php': 1800s (30 minutos)     // Búsqueda de equipos
'/lookup_all_teams.php': 3600s (1 hora)    // Equipos de liga
'/search_all_leagues.php': 3600s (1 hora)  // Búsqueda de ligas
'/eventsnext.php': 900s (15 minutos)       // Próximos eventos
'/eventsseason.php': 1800s (30 minutos)    // Eventos de temporada
```

## Componentes de UI

### 1. **CacheIndicator** (`/components/cache/CacheIndicator.tsx`)
- Widget flotante que muestra el estado del cache
- Indicadores visuales de salud (verde/amarillo/rojo)
- Acceso rápido al panel de administración
- Solo visible en modo desarrollo

### 2. **CacheAdmin** (`/components/admin/CacheAdmin.tsx`)
- Panel completo de administración del cache
- Estadísticas detalladas por storage
- Botones para limpieza por categorías
- Lista de entradas con estado de expiración
- Recomendaciones inteligentes de limpieza

### 3. **useCache Hook** (`/hooks/useCache.ts`)
- Hook React para gestionar el cache desde componentes
- Estado reactivo de estadísticas
- Métodos para invalidación y limpieza
- Auto-refresh cada 30 segundos

## Uso del Sistema

### Uso Automático (Transparente)
```typescript
// Las peticiones API se cachean automáticamente
import apiClient from './service/api/apiClient';

// Esta petición se cacheará automáticamente según la configuración
const response = await apiClient.get('/all_sports.php');
```

### Uso Manual con Métodos Específicos
```typescript
import { partidoService } from './service/api/partidoService';

// Usar métodos con cache manual
const sports = await partidoService.getAllSportsWithCache(); // Usa cache
const sportsForced = await partidoService.getAllSportsWithCache(true); // Ignora cache

// Gestión del cache
partidoService.invalidateCache('/all_sports.php'); // Invalidar endpoint específico
partidoService.clearAllCache(); // Limpiar todo el cache
const stats = partidoService.getCacheStats(); // Obtener estadísticas
```

### Uso con el Hook de React
```typescript
import { useCache } from '../hooks/useCache';

function MiComponente() {
  const { 
    stats, 
    sizeInMB, 
    isNearLimit,
    invalidateByCategory,
    performSmartCleanup 
  } = useCache();

  const handleClearSports = async () => {
    await invalidateByCategory('sports');
  };

  return (
    <div>
      <p>Cache: {sizeInMB.toFixed(2)}MB</p>
      {isNearLimit && <p>⚠️ Cerca del límite</p>}
      <button onClick={handleClearSports}>Limpiar Cache de Deportes</button>
    </div>
  );
}
```

## Categorías de Cache

### Por Tipo de Datos:
- **sports**: Deportes y ligas (`/all_sports.php`, `/search_all_leagues.php`)
- **matches**: Partidos y eventos (`/eventsday.php`, `/livescore.php`, `/eventsnextleague.php`)
- **leagues**: Ligas específicas (`/all_leagues.php`, `/eventsnextleague.php`)
- **teams**: Equipos (`/searchteams.php`, `/lookup_all_teams.php`)

## Funcionalidades Avanzadas

### 1. **Limpieza Inteligente**
- Detecta automáticamente cuando el cache necesita limpieza
- Prioriza eliminar datos más volátiles (partidos en vivo)
- Mantiene datos importantes (deportes, ligas)

### 2. **Recomendaciones Automáticas**
- Analiza el estado del cache y sugiere acciones
- Considera tamaño total, entradas expiradas, y número de entradas
- Proporciona razones específicas y acciones sugeridas

### 3. **Estadísticas Detalladas**
- Número total de entradas por storage
- Entradas expiradas
- Tamaño ocupado en MB
- Análisis de antigüedad de datos

### 4. **Auto-limpieza**
- Configurada automáticamente en desarrollo
- Limpia entradas expiradas cada 10 minutos
- Verifica límites cada 30 minutos
- Limpieza crítica automática si supera 9MB

## Límites y Consideraciones

### Límites de Storage:
- **localStorage**: ~10MB típicamente
- **sessionStorage**: ~10MB típicamente
- **Sistema configurado**: Alerta a 8MB, crítico a 9MB

### Mejores Prácticas:
1. Usar TTL apropiados según la volatilidad de los datos
2. Monitorear el tamaño del cache periódicamente
3. Limpiar cache expirado regularmente
4. Usar categorías para limpieza selectiva
5. Configurar auto-limpieza en producción

## Integración en el Dashboard

El sistema está completamente integrado en el dashboard:

```typescript
// Dashboard.tsx
import CacheIndicator from '../../components/cache/CacheIndicator';

// Solo visible en desarrollo
{import.meta.env?.DEV && <CacheIndicator />}
```

## Inicialización

El sistema se inicializa automáticamente en `main.tsx`:

```typescript
import { cacheManager } from './service/cache/cacheManager';

if (import.meta.env?.DEV) {
  cacheManager.configureAutoCleanup(true);
  console.log('🚀 Cache Redis service initialized');
}
```

## Monitoreo y Debug

### En Consola del Navegador:
```javascript
// Acceder al servicio de cache
window.cacheService = cacheService;
window.cacheManager = cacheManager;

// Ver estadísticas
cacheManager.getFullStats();

// Limpiar cache
cacheManager.performSmartCleanup();
```

### Logs Automáticos:
- Limpieza automática cada 10 minutos (log en consola)
- Alertas cuando se acerca al límite
- Estadísticas de rendimiento de cache

## Conclusión

Este sistema proporciona una solución completa de cache similar a Redis para aplicaciones frontend, con gestión automática, monitoreo en tiempo real y herramientas de administración integradas. Mejora significativamente el rendimiento de la aplicación al reducir las peticiones redundantes a la API y proporciona una experiencia de usuario más fluida.
