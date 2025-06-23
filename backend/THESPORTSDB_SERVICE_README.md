# Servicio TheSportsDB

Este servicio proporciona una integración completa con la API de TheSportsDB para obtener información deportiva en tiempo real.

## Características

- **Eventos deportivos**: Búsqueda y obtención de eventos por ID, equipos, fechas, ligas
- **Equipos**: Información detallada de equipos, búsqueda por nombre, liga o ID
- **Ligas**: Listado de ligas por deporte, país o búsqueda general
- **Caché**: Sistema de caché integrado para mejorar el rendimiento
- **Estadísticas**: Monitoreo de uso y rendimiento del servicio
- **Conectividad**: Verificación del estado de la API

## Configuración

El servicio se configura a través de `application.properties`:

```properties
# Clave de API de TheSportsDB
thesportsdb.api.key=722804

# Configuraciones adicionales (opcionales)
thesportsdb.api.base-url=https://www.thesportsdb.com/api/v1/json
thesportsdb.api.timeout.connect=10000
thesportsdb.api.timeout.read=30000
thesportsdb.api.retry.max-attempts=3
thesportsdb.api.cache.enabled=true
thesportsdb.api.cache.ttl=3600
```

## Uso del Servicio

### Inyección de dependencia

```java
@Autowired
private ITheSportsDbService theSportsDbService;
```

### Ejemplos de uso

#### Buscar un evento por ID
```java
Optional<TheSportsDbEventResponse> evento = theSportsDbService.buscarEventoPorId("602329");
if (evento.isPresent()) {
    System.out.println("Evento: " + evento.get().getStrEvent());
}
```

#### Buscar eventos por equipos
```java
List<TheSportsDbEventResponse> eventos = theSportsDbService.buscarEventosPorEquipos("Arsenal", "Chelsea");
eventos.forEach(evento -> System.out.println(evento.getStrEvent()));
```

#### Buscar eventos por fecha
```java
LocalDate fecha = LocalDate.now();
List<TheSportsDbEventResponse> eventos = theSportsDbService.buscarEventosPorFecha(fecha);
```

#### Buscar equipo por nombre
```java
Optional<TheSportsDbTeamResponse> equipo = theSportsDbService.buscarEquipoPorNombre("Barcelona");
if (equipo.isPresent()) {
    System.out.println("Equipo: " + equipo.get().getStrTeam());
    System.out.println("País: " + equipo.get().getStrCountry());
}
```

#### Obtener ligas por deporte
```java
List<TheSportsDbLeagueResponse> ligas = theSportsDbService.buscarLigasPorDeporte("Soccer");
```

## Endpoints REST

El servicio expone los siguientes endpoints REST:

### Eventos
- `GET /api/thesportsdb/evento/{idEvento}` - Buscar evento por ID
- `GET /api/thesportsdb/eventos/equipos?equipoLocal={local}&equipoVisitante={visitante}` - Eventos entre equipos
- `GET /api/thesportsdb/eventos/fecha/{fecha}` - Eventos por fecha (formato: YYYY-MM-DD)
- `GET /api/thesportsdb/eventos/liga/{idLiga}` - Eventos de una liga
- `GET /api/thesportsdb/eventos/equipo/{nombreEquipo}` - Eventos de un equipo
- `GET /api/thesportsdb/eventos/envivo` - Eventos en vivo
- `GET /api/thesportsdb/eventos/proximos/{idLiga}` - Próximos eventos de una liga

### Equipos
- `GET /api/thesportsdb/equipo/nombre/{nombreEquipo}` - Buscar equipo por nombre
- `GET /api/thesportsdb/equipos/liga/{idLiga}` - Equipos de una liga
- `GET /api/thesportsdb/equipo/id/{idEquipo}` - Buscar equipo por ID

### Ligas
- `GET /api/thesportsdb/ligas` - Todas las ligas
- `GET /api/thesportsdb/ligas/deporte/{deporte}` - Ligas por deporte
- `GET /api/thesportsdb/liga/nombre/{nombreLiga}` - Buscar liga por nombre
- `GET /api/thesportsdb/ligas/pais/{pais}` - Ligas por país

### Utilidad
- `GET /api/thesportsdb/conectividad` - Verificar conectividad
- `GET /api/thesportsdb/estado` - Estado de la API
- `POST /api/thesportsdb/cache/limpiar` - Limpiar caché
- `GET /api/thesportsdb/estadisticas` - Estadísticas de uso

## Modelos de Respuesta

### TheSportsDbEventResponse
Contiene información completa del evento deportivo:
- `idEvent`: ID único del evento
- `strEvent`: Nombre del evento
- `strHomeTeam`/`strAwayTeam`: Equipos local y visitante
- `dateEvent`: Fecha del evento
- `strStatus`: Estado del evento
- `intHomeScore`/`intAwayScore`: Resultado
- Y muchos campos adicionales...

### TheSportsDbTeamResponse
Información detallada del equipo:
- `idTeam`: ID único del equipo
- `strTeam`: Nombre del equipo
- `strCountry`: País
- `strBadge`: Logo del equipo
- `strStadium`: Estadio
- Y más información...

### TheSportsDbLeagueResponse
Datos de la liga:
- `idLeague`: ID único de la liga
- `strLeague`: Nombre de la liga
- `strSport`: Deporte
- `strCountry`: País
- Y información adicional...

## Caché

El servicio implementa caché automático para mejorar el rendimiento:

- Los resultados se almacenan en caché por un tiempo determinado
- Reduce las llamadas a la API externa
- Mejora los tiempos de respuesta

## Monitoreo

El servicio incluye funcionalidades de monitoreo:

- Contador de peticiones totales
- Contador de peticiones exitosas/fallidas
- Tasa de éxito
- Verificación de conectividad

## Manejo de Errores

El servicio maneja graciosamente los errores:

- Timeouts de conexión
- Errores HTTP
- Respuestas vacías o malformadas
- Problemas de conectividad

## Testing

Se incluyen tests unitarios para verificar:

- Conectividad con la API
- Funcionalidad básica de búsqueda
- Manejo de errores
- Estadísticas de uso

Para ejecutar los tests:
```bash
mvn test -Dtest=TheSportsDbServiceImplTest
```

## Notas

- El servicio usa la clave de API gratuita de TheSportsDB (722804)
- Algunas funcionalidades pueden requerir una clave de API premium
- Los datos dependen de la disponibilidad de la API externa
- Se recomienda implementar circuit breakers para mayor robustez en producción
