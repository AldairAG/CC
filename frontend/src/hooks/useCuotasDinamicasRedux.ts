import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CuotasDinamicasService } from '../service/casino/cuotasDinamicasService';
import type { AppDispatch } from '../store/store';
import type {
  CuotaEvento,
  ConfiguracionCuotas,
  AlertaCuota,
  FiltroCuotas,
  CuotasDinamicasState
} from '../types/CuotasDinamicasTypes';
import {
  setCuotasEventoLoading,
  setCuotasEvento,
  setCuotasEventoError,
  actualizarCuotaEvento,
  setHistorialCuotasLoading,
  setHistorialCuotas,
  setHistorialCuotasError,
  setTendenciaCuotasLoading,
  setTendenciaCuotas,
  setTendenciaCuotasError,
  setVolumenApuestasLoading,
  setVolumenApuestas,
  setVolumenApuestasError,
  setEstadisticasCuotasLoading,
  setEstadisticasCuotas,
  setEstadisticasCuotasError,
  setResumenCuotasLoading,
  setResumenCuotas,
  setResumenCuotasError,
  setAlertasCuotasLoading,
  setAlertasCuotas,
  setAlertasCuotasError,
  agregarAlertaCuota,
  removerAlertaCuota,
  setFiltros,
  limpiarFiltros,
  setBusqueda,
  setPaginacion,
  siguientePagina,
  paginaAnterior,
  setConfiguracion,
  setConexionTiempoReal,
  limpiarError,
  limpiarTodosErrores,
  limpiarEstado,
  selectCuotasEvento,
  selectHistorialCuotas,
  selectTendenciaCuotas,
  selectVolumenApuestas,
  selectEstadisticasCuotas,
  selectResumenCuotas,
  selectAlertasCuotas,
  selectFiltros,
  selectBusqueda,
  selectPaginacion,
  selectConfiguracion,
  selectLoading,
  selectError,
  selectConexionTiempoReal,
  selectCuotasEventoFiltradas,
  selectTendenciaCuotasFiltradas,
  selectAlertasCuotasActivas,
  selectEstadisticasGenerales,
  selectIsLoading,
  selectHasError
} from '../store/slices/cuotasDinamicasSlice';

export const useCuotasDinamicasRedux = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectores básicos
  const cuotasEvento = useSelector(selectCuotasEvento);
  const historialCuotas = useSelector(selectHistorialCuotas);
  const tendenciaCuotas = useSelector(selectTendenciaCuotas);
  const volumenApuestas = useSelector(selectVolumenApuestas);
  const estadisticasCuotas = useSelector(selectEstadisticasCuotas);
  const resumenCuotas = useSelector(selectResumenCuotas);
  const alertasCuotas = useSelector(selectAlertasCuotas);
  const filtros = useSelector(selectFiltros);
  const busqueda = useSelector(selectBusqueda);
  const paginacion = useSelector(selectPaginacion);
  const configuracion = useSelector(selectConfiguracion);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const conexionTiempoReal = useSelector(selectConexionTiempoReal);

  // Selectores memoizados
  const cuotasEventoFiltradas = useSelector(selectCuotasEventoFiltradas);
  const tendenciaCuotasFiltradas = useSelector(selectTendenciaCuotasFiltradas);
  const alertasCuotasActivas = useSelector(selectAlertasCuotasActivas);
  const estadisticasGenerales = useSelector(selectEstadisticasGenerales);
  const isLoading = useSelector(selectIsLoading);
  const hasError = useSelector(selectHasError);

  // Función auxiliar para manejar errores
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error en useCuotasDinamicasRedux:', error);
    
    let errorMessage = customMessage || 'Error desconocido';
    
    if (error && typeof error === 'object') {
      if ('response' in error && error.response && typeof error.response === 'object') {
        if ('data' in error.response && error.response.data && typeof error.response.data === 'object') {
          if ('message' in error.response.data && typeof error.response.data.message === 'string') {
            errorMessage = customMessage || error.response.data.message;
          }
        }
      } else if ('message' in error && typeof error.message === 'string') {
        errorMessage = customMessage || error.message;
      }
    }
    
    toast.error(errorMessage);
    return errorMessage;
  }, []);

  // Cargar cuotas de un evento
  const cargarCuotasEvento = useCallback(async (eventoId: number) => {
    try {
      dispatch(setCuotasEventoLoading(true));
      
      // Llamada real al backend
      const cuotas = await CuotasDinamicasService.obtenerCuotasEvento(eventoId);
      
      dispatch(setCuotasEvento(cuotas));
      return cuotas;
    } catch (error) {
      console.error('Error al cargar cuotas del evento:', error);
      
      // Si no hay cuotas, intentar generarlas
      try {
        const cuotasGeneradas = await CuotasDinamicasService.generarCuotasParaEvento(eventoId);
        
        // Después de generar las cuotas, intentar cargarlas nuevamente
        if (cuotasGeneradas.status === 'SUCCESS') {
          toast.success(`Cuotas generadas: ${cuotasGeneradas.message}`);
          
          // Intentar cargar las cuotas generadas
          const cuotasRecienGeneradas = await CuotasDinamicasService.obtenerCuotasEvento(eventoId);
          dispatch(setCuotasEvento(cuotasRecienGeneradas));
          return cuotasRecienGeneradas;
        } else {
          throw new Error(cuotasGeneradas.message || 'No se pudieron generar cuotas para este evento');
        }
      } catch (generationError) {
        const errorMessage = handleError(generationError, 'Error al cargar o generar cuotas del evento');
        dispatch(setCuotasEventoError(errorMessage));
        throw generationError;
      }
    } finally {
      dispatch(setCuotasEventoLoading(false));
    }
  }, [dispatch, handleError]);

  // Cargar historial de cuotas
  const cargarHistorialCuotas = useCallback(async (eventoId: number, tipoResultado?: string) => {
    try {
      dispatch(setHistorialCuotasLoading(true));
      
      // Llamada real al backend
      const resultado = await CuotasDinamicasService.obtenerHistorialCuotas(eventoId, tipoResultado);
      
      dispatch(setHistorialCuotas(resultado.data));
      return resultado.data;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar historial de cuotas');
      dispatch(setHistorialCuotasError(errorMessage));
      throw error;
    } finally {
      dispatch(setHistorialCuotasLoading(false));
    }
  }, [dispatch, handleError]);

  // Cargar tendencias de cuotas
  const cargarTendenciaCuotas = useCallback(async (eventoId?: number, filtros?: FiltroCuotas) => {
    try {
      dispatch(setTendenciaCuotasLoading(true));
      
      // Llamada real al backend
      const tendencias = await CuotasDinamicasService.obtenerTendenciaCuotas(eventoId, filtros);
      
      dispatch(setTendenciaCuotas(tendencias));
      return tendencias;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar tendencias de cuotas');
      dispatch(setTendenciaCuotasError(errorMessage));
      throw error;
    } finally {
      dispatch(setTendenciaCuotasLoading(false));
    }
  }, [dispatch, handleError]);

  // Cargar volumen de apuestas
  const cargarVolumenApuestas = useCallback(async (eventoId: number) => {
    try {
      dispatch(setVolumenApuestasLoading(true));
      
      // Llamada real al backend
      const volumen = await CuotasDinamicasService.obtenerVolumenApuestas(eventoId);
      
      dispatch(setVolumenApuestas(volumen));
      return volumen;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar volumen de apuestas');
      dispatch(setVolumenApuestasError(errorMessage));
      throw error;
    } finally {
      dispatch(setVolumenApuestasLoading(false));
    }
  }, [dispatch, handleError]);

  // Cargar estadísticas de cuotas
  const cargarEstadisticasCuotas = useCallback(async (eventoId: number) => {
    try {
      dispatch(setEstadisticasCuotasLoading(true));
      
      // Llamada real al backend usando el servicio
      const estadisticas = await CuotasDinamicasService.obtenerEstadisticasCuotas(eventoId);
      
      dispatch(setEstadisticasCuotas(estadisticas));
      return estadisticas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar estadísticas de cuotas');
      dispatch(setEstadisticasCuotasError(errorMessage));
      throw error;
    } finally {
      dispatch(setEstadisticasCuotasLoading(false));
    }
  }, [dispatch, handleError]);

  // Cargar resumen de cuotas
  const cargarResumenCuotas = useCallback(async () => {
    try {
      dispatch(setResumenCuotasLoading(true));
      
      // Llamada real al backend usando el servicio
      const resumen = await CuotasDinamicasService.obtenerResumenCuotas();
      
      dispatch(setResumenCuotas(resumen));
      return resumen;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar resumen de cuotas');
      dispatch(setResumenCuotasError(errorMessage));
      throw error;
    } finally {
      dispatch(setResumenCuotasLoading(false));
    }
  }, [dispatch, handleError]);

  // Cargar alertas de cuotas
  const cargarAlertasCuotas = useCallback(async () => {
    try {
      dispatch(setAlertasCuotasLoading(true));
      
      // Llamada real al backend usando el servicio
      const alertas = await CuotasDinamicasService.obtenerAlertasCuotas();
      
      dispatch(setAlertasCuotas(alertas));
      return alertas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar alertas de cuotas');
      dispatch(setAlertasCuotasError(errorMessage));
      throw error;
    } finally {
      dispatch(setAlertasCuotasLoading(false));
    }
  }, [dispatch, handleError]);

  // Crear alerta de cuota
  const crearAlertaCuota = useCallback(async (alerta: Omit<AlertaCuota, 'id' | 'fechaCreacion'>) => {
    try {
      // Llamada real al backend usando el servicio
      const nuevaAlerta = await CuotasDinamicasService.crearAlertaCuota(alerta);
      
      dispatch(agregarAlertaCuota(nuevaAlerta));
      toast.success('Alerta creada exitosamente');
      return nuevaAlerta;
    } catch (error) {
      handleError(error, 'Error al crear alerta de cuota');
      throw error;
    }
  }, [dispatch, handleError]);

  // Eliminar alerta de cuota
  const eliminarAlertaCuota = useCallback(async (alertaId: number) => {
    try {
      // Llamada real al backend usando el servicio
      await CuotasDinamicasService.eliminarAlertaCuota(alertaId);
      
      dispatch(removerAlertaCuota(alertaId));
      toast.success('Alerta eliminada exitosamente');
    } catch (error) {
      handleError(error, 'Error al eliminar alerta de cuota');
      throw error;
    }
  }, [dispatch, handleError]);

  // Actualizar configuración
  const actualizarConfiguracion = useCallback(async (nuevaConfiguracion: Partial<ConfiguracionCuotas>) => {
    try {
      // Llamada real al backend usando el servicio
      const configuracionActualizada = await CuotasDinamicasService.actualizarConfiguracion(nuevaConfiguracion);
      
      dispatch(setConfiguracion(configuracionActualizada));
      toast.success('Configuración actualizada exitosamente');
    } catch (error) {
      handleError(error, 'Error al actualizar configuración');
      throw error;
    }
  }, [dispatch, handleError]);

  // Actualizar cuota en tiempo real
  const actualizarCuotaTiempoReal = useCallback((cuotaActualizada: CuotaEvento) => {
    dispatch(actualizarCuotaEvento(cuotaActualizada));
  }, [dispatch]);

  // Establecer conexión en tiempo real
  const establecerConexionTiempoReal = useCallback((conectado: boolean) => {
    dispatch(setConexionTiempoReal({ conectado }));
  }, [dispatch]);

  // Aplicar filtros
  const aplicarFiltros = useCallback((nuevosFiltros: Partial<FiltroCuotas>) => {
    dispatch(setFiltros(nuevosFiltros));
  }, [dispatch]);

  // Limpiar filtros
  const limpiarFiltrosCuotas = useCallback(() => {
    dispatch(limpiarFiltros());
  }, [dispatch]);

  // Establecer búsqueda
  const establecerBusqueda = useCallback((termino: string) => {
    dispatch(setBusqueda(termino));
  }, [dispatch]);

  // Cambiar página
  const cambiarPagina = useCallback((pagina: number) => {
    dispatch(setPaginacion({ page: pagina }));
  }, [dispatch]);

  // Ir a página siguiente
  const irPaginaSiguiente = useCallback(() => {
    dispatch(siguientePagina());
  }, [dispatch]);

  // Ir a página anterior
  const irPaginaAnterior = useCallback(() => {
    dispatch(paginaAnterior());
  }, [dispatch]);

  // Limpiar error específico
  const limpiarErrorEspecifico = useCallback((tipoError: keyof typeof error) => {
    dispatch(limpiarError(tipoError as keyof CuotasDinamicasState['error']));
  }, [dispatch]);

  // Limpiar todos los errores
  const limpiarErrores = useCallback(() => {
    dispatch(limpiarTodosErrores());
  }, [dispatch]);

  // Limpiar todo el estado
  const limpiarTodoElEstado = useCallback(() => {
    dispatch(limpiarEstado());
  }, [dispatch]);

  // Suscripción en tiempo real para actualizaciones de cuotas
  const suscripcionRef = useRef<EventSource | null>(null);

  const suscribirseActualizaciones = useCallback(async (eventoId: number) => {
    try {
      // Cerrar suscripción anterior si existe
      if (suscripcionRef.current) {
        suscripcionRef.current.close();
        suscripcionRef.current = null;
      }

      // Establecer nueva suscripción
      const eventSource = await CuotasDinamicasService.suscribirseActualizaciones(
        eventoId,
        (cuotaActualizada) => {
          dispatch(actualizarCuotaEvento(cuotaActualizada));
          dispatch(setConexionTiempoReal({ conectado: true }));
        }
      );

      suscripcionRef.current = eventSource;
      dispatch(setConexionTiempoReal({ conectado: true }));
    } catch (error) {
      console.error('Error al establecer suscripción en tiempo real:', error);
      dispatch(setConexionTiempoReal({ conectado: false }));
    }
  }, [dispatch]);

  // Cancelar suscripción
  const cancelarSuscripcion = useCallback(() => {
    if (suscripcionRef.current) {
      suscripcionRef.current.close();
      suscripcionRef.current = null;
      dispatch(setConexionTiempoReal({ conectado: false }));
    }
  }, [dispatch]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (suscripcionRef.current) {
        suscripcionRef.current.close();
      }
    };
  }, []);

  // Buscar cuotas con filtros
  const buscarCuotas = useCallback(async (filtros: FiltroCuotas, busqueda?: string) => {
    try {
      dispatch(setCuotasEventoLoading(true));
      
      const resultado = await CuotasDinamicasService.buscarCuotas(filtros, busqueda, paginacion);
      
      dispatch(setCuotasEvento(resultado.data));
      dispatch(setPaginacion(resultado.paginacion));
      return resultado.data;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al buscar cuotas');
      dispatch(setCuotasEventoError(errorMessage));
      throw error;
    } finally {
      dispatch(setCuotasEventoLoading(false));
    }
  }, [dispatch, handleError, paginacion]);

  // Obtener cuotas por mercado
  const obtenerCuotasPorMercado = useCallback(async (eventoId: number) => {
    try {
      dispatch(setCuotasEventoLoading(true));
      
      const cuotasPorMercado = await CuotasDinamicasService.obtenerCuotasPorMercado(eventoId);
      
      return cuotasPorMercado;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al obtener cuotas por mercado');
      dispatch(setCuotasEventoError(errorMessage));
      throw error;
    } finally {
      dispatch(setCuotasEventoLoading(false));
    }
  }, [dispatch, handleError]);

  // Obtener cuotas detalladas
  const obtenerCuotasDetalladas = useCallback(async (eventoId: number) => {
    try {
      dispatch(setCuotasEventoLoading(true));
      
      const cuotasDetalladas = await CuotasDinamicasService.obtenerCuotasDetalladas(eventoId);
      
      return cuotasDetalladas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al obtener cuotas detalladas');
      dispatch(setCuotasEventoError(errorMessage));
      throw error;
    } finally {
      dispatch(setCuotasEventoLoading(false));
    }
  }, [dispatch, handleError]);

  // Registrar apuesta y actualizar cuotas
  const registrarApuesta = useCallback(async (
    eventoId: number,
    tipoResultado: string,
    monto: number,
    cuotaUtilizada: number
  ) => {
    try {
      const cuotasActualizadas = await CuotasDinamicasService.registrarApuesta(
        eventoId,
        tipoResultado,
        monto,
        cuotaUtilizada
      );
      
      dispatch(setCuotasEvento(cuotasActualizadas));
      toast.success('Apuesta registrada y cuotas actualizadas');
      return cuotasActualizadas;
    } catch (error) {
      handleError(error, 'Error al registrar apuesta');
      throw error;
    }
  }, [dispatch, handleError]);

  // Generar cuotas completas
  const generarCuotasCompletas = useCallback(async (eventoId: number) => {
    try {
      dispatch(setCuotasEventoLoading(true));
      
      const cuotasGeneradas = await CuotasDinamicasService.generarCuotasCompletas(eventoId);
      
      dispatch(setCuotasEvento(cuotasGeneradas));
      toast.success('Cuotas completas generadas exitosamente');
      return cuotasGeneradas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al generar cuotas completas');
      dispatch(setCuotasEventoError(errorMessage));
      throw error;
    } finally {
      dispatch(setCuotasEventoLoading(false));
    }
  }, [dispatch, handleError]);

  // Obtener configuración
  const obtenerConfiguracion = useCallback(async () => {
    try {
      const configuracion = await CuotasDinamicasService.obtenerConfiguracion();
      
      dispatch(setConfiguracion(configuracion));
      return configuracion;
    } catch (error) {
      handleError(error, 'Error al obtener configuración');
      throw error;
    }
  }, [dispatch, handleError]);

  return {
    // Datos
    cuotasEvento,
    historialCuotas,
    tendenciaCuotas,
    volumenApuestas,
    estadisticasCuotas,
    resumenCuotas,
    alertasCuotas,
    filtros,
    busqueda,
    paginacion,
    configuracion,
    conexionTiempoReal,
    
    // Datos procesados
    cuotasEventoFiltradas,
    tendenciaCuotasFiltradas,
    alertasCuotasActivas,
    estadisticasGenerales,
    
    // Estados
    loading,
    error,
    isLoading,
    hasError,
    
    // Funciones
    cargarCuotasEvento,
    cargarHistorialCuotas,
    cargarTendenciaCuotas,
    cargarVolumenApuestas,
    cargarEstadisticasCuotas,
    cargarResumenCuotas,
    cargarAlertasCuotas,
    crearAlertaCuota,
    eliminarAlertaCuota,
    actualizarConfiguracion,
    actualizarCuotaTiempoReal,
    establecerConexionTiempoReal,
    aplicarFiltros,
    limpiarFiltrosCuotas,
    establecerBusqueda,
    cambiarPagina,
    irPaginaSiguiente,
    irPaginaAnterior,
    limpiarErrorEspecifico,
    limpiarErrores,
    limpiarTodoElEstado,

    // Funciones de suscripción en tiempo real
    suscribirseActualizaciones,
    cancelarSuscripcion,

    // Funciones adicionales del servicio
    buscarCuotas,
    obtenerCuotasPorMercado,
    obtenerCuotasDetalladas,
    registrarApuesta,
    generarCuotasCompletas,
    obtenerConfiguracion
  };
};