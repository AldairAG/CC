import { useDispatch, useSelector } from "react-redux";
import { QuinielaService } from "../service/casino/quinielaService";
import type {
  CrearQuinielaRequest,
  QuinielaResponse,
  UnirseQuinielaRequest,
  HacerPrediccionesRequest,
  ParticipacionQuiniela,
  EstadisticasQuinielaResponse,
  FiltrosBusquedaAvanzada
} from "../types/QuinielaServiceTypes";
import { quinielaSelector } from "../store/slices/quinielaSlice";

export const useQuiniela = () => {
  const dispatch = useDispatch();
  const quinielaList = useSelector(quinielaSelector.quinielas);
  const quinielaActual = useSelector(quinielaSelector.quinielaActual);
  const quinielasFiltradas = useSelector(quinielaSelector.quinielasFiltradas);

  // =================== OPERACIONES PRINCIPALES ===================

  /**
   * Crea una nueva quiniela usando el servicio moderno
   */
  const crearQuiniela = async (request: CrearQuinielaRequest): Promise<QuinielaResponse> => {
    const nueva = await QuinielaService.crearQuiniela(request);
    console.log("Quiniela creada:", nueva);
    
    dispatch({ type: "quiniela/addQuiniela", payload: nueva });
    return nueva;
  };

  /**
   * Unirse a una quiniela existente
   */
  const unirseQuiniela = async (request: UnirseQuinielaRequest): Promise<ParticipacionQuiniela> => {
    const participacion = await QuinielaService.unirseQuiniela(request);
    // Actualizar la lista de quinielas para reflejar la participación
    await obtenerQuinielasPublicas();
    return participacion;
  };
  /**
   * Hacer predicciones en una quiniela
   */
  const hacerPredicciones = async (request: HacerPrediccionesRequest): Promise<string> => {
    const resultado = await QuinielaService.hacerPredicciones(request);
    // Actualizar la quiniela actual para reflejar las predicciones
    if (quinielaActual?.idQuiniela === request.quinielaId) {
      await obtenerQuinielaPorId(request.quinielaId);
    }
    return resultado;
  };

  /**
   * Distribuir premios de una quiniela (solo para administradores)
   */
  const distribuirPremios = async (quinielaId: number): Promise<string> => {
    const resultado = await QuinielaService.distribuirPremios(quinielaId);
    // Actualizar la quiniela para reflejar la distribución de premios
    await obtenerQuinielaPorId(quinielaId);
    return resultado;
  };

  /**
   * Finalizar una quiniela (solo para administradores)
   */
  const finalizarQuiniela = async (quinielaId: number): Promise<string> => {
    const resultado = await QuinielaService.finalizarQuiniela(quinielaId);
    // Actualizar la quiniela para reflejar el nuevo estado
    await obtenerQuinielaPorId(quinielaId);
    return resultado;
  };

  /**
   * Eliminar una quiniela del sistema
   */
  const eliminarQuiniela = async (id: number): Promise<void> => {
    await QuinielaService.eliminarQuiniela(id);
    dispatch({ type: "quiniela/removeQuiniela", payload: id });
  };

  // =================== CONSULTAS Y OBTENCIÓN DE DATOS ===================

  /**
   * Obtener una quiniela por su ID
   */
  const obtenerQuinielaPorId = async (id: number): Promise<QuinielaResponse> => {
    const quiniela = await QuinielaService.obtenerQuinielaPorId(id);
    dispatch({ type: "quiniela/setQuinielaActual", payload: quiniela });
    return quiniela;
  };

  /**
   * Obtener todas las quinielas públicas
   */
  const obtenerQuinielasPublicas = async (): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerQuinielasPublicas();
    dispatch({ type: "quiniela/setQuinielas", payload: quinielas });
    return quinielas;
  };

  /**
   * Obtener todas las quinielas con paginación
   */
  const obtenerTodasQuinielas = async (page: number = 0, size: number = 10): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerTodasQuinielas(page, size);
    dispatch({ type: "quiniela/setQuinielas", payload: quinielas });
    return quinielas;
  };

  /**
   * Obtener las quinielas creadas por el usuario actual
   */
  const obtenerMisQuinielas = async (): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerMisQuinielas();
    dispatch({ type: "quiniela/setQuinielas", payload: quinielas });
    return quinielas;
  };

  /**
   * Obtener las quinielas en las que participa el usuario
   */
  const obtenerMisParticipaciones = async (): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerMisParticipaciones();
    dispatch({ type: "quiniela/setQuinielas", payload: quinielas });
    return quinielas;
  };

  // =================== FILTROS Y BÚSQUEDAS ===================

  /**
   * Obtener quinielas filtradas por estado
   */
  const obtenerQuinielasPorEstado = async (estado: string): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerQuinielasPorEstado(estado);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  /**
   * Obtener quinielas filtradas por rango de fechas
   */
  const obtenerQuinielasPorRangoFecha = async (fechaInicio: string, fechaFin: string): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerQuinielasPorRangoFecha(fechaInicio, fechaFin);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  /**
   * Obtener quinielas filtradas por precio máximo
   */
  const obtenerQuinielasPorPrecioMaximo = async (precioMaximo: number): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerQuinielasPorPrecioMaximo(precioMaximo);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  /**
   * Obtener quinielas filtradas por tipo de premio
   */
  const obtenerQuinielasPorTipoPremio = async (tipoPremio: string): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.obtenerQuinielasPorTipoPremio(tipoPremio);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  /**
   * Búsqueda avanzada con múltiples filtros
   */
  const busquedaAvanzadaQuinielas = async (filtros: FiltrosBusquedaAvanzada): Promise<QuinielaResponse[]> => {
    const quinielas = await QuinielaService.busquedaAvanzadaQuinielas(filtros);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  // =================== ADMINISTRACIÓN ===================

  /**
   * Actualizar el premio acumulado de una quiniela
   */
  const actualizarPremioAcumulado = async (id: number, nuevoPremio: number): Promise<string> => {
    const resultado = await QuinielaService.actualizarPremioAcumulado(id, nuevoPremio);
    // Actualizar la quiniela en el estado local
    await obtenerQuinielaPorId(id);
    return resultado;
  };

  /**
   * Actualizar el estado de una quiniela
   */
  const actualizarEstadoQuiniela = async (id: number, nuevoEstado: string): Promise<string> => {
    const resultado = await QuinielaService.actualizarEstadoQuiniela(id, nuevoEstado);
    // Actualizar la quiniela en el estado local
    await obtenerQuinielaPorId(id);
    return resultado;
  };

  // =================== ESTADÍSTICAS ===================

  /**
   * Obtener estadísticas detalladas de una quiniela
   */
  const obtenerEstadisticasQuiniela = async (id: number): Promise<EstadisticasQuinielaResponse> => {
    return await QuinielaService.obtenerEstadisticasQuiniela(id);
  };

  // =================== FILTROS LOCALES (REDUX) ===================
  // Mantener algunos filtros locales para compatibilidad con componentes existentes

  const filterByNombre = (nombre: string) => 
    dispatch({ type: "quiniela/filtrarQuinielasPorNombre", payload: nombre });
  
  const filterByEstado = (estado: string) => 
    dispatch({ type: "quiniela/filtrarQuinielasPorEstado", payload: estado });
  
  const filterByTipoPremio = (tipoPremio: string) => 
    dispatch({ type: "quiniela/filtrarQuinielasPorTipoPremio", payload: tipoPremio });
  
  const filterByMinParticipantes = (min: number) => 
    dispatch({ type: "quiniela/filtrarQuinielasPorParticipantes", payload: min });
  
  const filterByPremioAcumulado = (min: number, max: number) =>
    dispatch({ type: "quiniela/filtrarQuinielasPorPremioAcumulado", payload: { min, max } });
  
  const filterByTipoApuesta = (tipo: string) => 
    dispatch({ type: "quiniela/filtrarQuinielasPorTipoApuesta", payload: tipo });

  // =================== UTILIDADES ===================

  /**
   * Limpiar todas las quinielas del estado local
   */
  const limpiarQuinielas = () => dispatch({ type: "quiniela/clearQuinielas" });

  // =================== MÉTODOS DE COMPATIBILIDAD ===================
  // Para mantener compatibilidad con componentes existentes que usen los nombres antiguos

  const getAllQuinielas = obtenerQuinielasPublicas;
  const getQuinielaById = obtenerQuinielaPorId;
  const fetchByEstado = obtenerQuinielasPorEstado;
  const fetchByFechas = obtenerQuinielasPorRangoFecha;
  const fetchByPrecioMaximo = obtenerQuinielasPorPrecioMaximo;

  return {
    // Estado del hook
    quinielaList,
    quinielaActual,
    quinielasFiltradas,

    // Operaciones principales (métodos modernos)
    crearQuiniela,
    unirseQuiniela,
    hacerPredicciones,
    distribuirPremios,
    finalizarQuiniela,
    eliminarQuiniela,

    // Consultas y obtención de datos
    obtenerQuinielaPorId,
    obtenerQuinielasPublicas,
    obtenerTodasQuinielas,
    obtenerMisQuinielas,
    obtenerMisParticipaciones,

    // Filtros y búsquedas
    obtenerQuinielasPorEstado,
    obtenerQuinielasPorRangoFecha,
    obtenerQuinielasPorPrecioMaximo,
    obtenerQuinielasPorTipoPremio,
    busquedaAvanzadaQuinielas,

    // Administración
    actualizarPremioAcumulado,
    actualizarEstadoQuiniela,

    // Estadísticas
    obtenerEstadisticasQuiniela,

    // Filtros locales (Redux)
    filterByNombre,
    filterByEstado,
    filterByTipoPremio,
    filterByMinParticipantes,
    filterByPremioAcumulado,
    filterByTipoApuesta,

    // Utilidades
    limpiarQuinielas,

    // Métodos de compatibilidad (deprecated pero funcionales)
    getAllQuinielas,
    getQuinielaById,
    fetchByEstado,
    fetchByFechas,
    fetchByPrecioMaximo
  };
};
