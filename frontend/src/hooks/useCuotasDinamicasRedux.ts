import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../store/store';
import type {
  CuotaEvento,
  CuotaHistorial,
  TendenciaCuota,
  VolumenApuestas,
  EstadisticasCuotas,
  ConfiguracionCuotas,
  AlertaCuota,
  ResumenCuotas,
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
      
      // TODO: Implementar llamada real al backend cuando esté listo
      // const response = await fetch(`/api/cuotas-dinamicas/evento/${eventoId}`);
      // const data = await response.json();
      
      // Simulación de datos por ahora
      const cuotasSimuladas: CuotaEvento[] = [
        {
          id: 1,
          eventoId,
          tipoResultado: 'LOCAL',
          cuotaActual: 1.90,
          cuotaAnterior: 1.85,
          fechaActualizacion: new Date().toISOString(),
          activa: true
        },
        {
          id: 2,
          eventoId,
          tipoResultado: 'EMPATE',
          cuotaActual: 3.20,
          cuotaAnterior: 3.25,
          fechaActualizacion: new Date().toISOString(),
          activa: true
        },
        {
          id: 3,
          eventoId,
          tipoResultado: 'VISITANTE',
          cuotaActual: 4.15,
          cuotaAnterior: 4.20,
          fechaActualizacion: new Date().toISOString(),
          activa: true
        }
      ];
      
      dispatch(setCuotasEvento(cuotasSimuladas));
      return cuotasSimuladas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar cuotas del evento');
      dispatch(setCuotasEventoError(errorMessage));
      throw error;
    }
  }, [dispatch, handleError]);

  // Cargar historial de cuotas
  const cargarHistorialCuotas = useCallback(async (cuotaEventoId: number) => {
    try {
      dispatch(setHistorialCuotasLoading(true));
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch(`/api/cuotas-dinamicas/historial/${cuotaEventoId}`);
      // const data = await response.json();
      
      // Simulación de datos
      const historialSimulado: CuotaHistorial[] = [
        {
          id: 1,
          cuotaEventoId,
          cuotaAnterior: 1.80,
          cuotaNueva: 1.85,
          fechaCambio: new Date(Date.now() - 300000).toISOString(),
          motivoCambio: 'Aumento de volumen de apuestas',
          volumenAcumulado: 15000
        },
        {
          id: 2,
          cuotaEventoId,
          cuotaAnterior: 1.85,
          cuotaNueva: 1.90,
          fechaCambio: new Date().toISOString(),
          motivoCambio: 'Ajuste por balance de riesgo',
          volumenAcumulado: 18500
        }
      ];
      
      dispatch(setHistorialCuotas(historialSimulado));
      return historialSimulado;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar historial de cuotas');
      dispatch(setHistorialCuotasError(errorMessage));
      throw error;
    }
  }, [dispatch, handleError]);

  // Cargar tendencias de cuotas
  const cargarTendenciaCuotas = useCallback(async () => {
    try {
      dispatch(setTendenciaCuotasLoading(true));
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch('/api/cuotas-dinamicas/tendencias');
      // const data = await response.json();
      
      // Simulación de datos
      const tendenciasSimuladas: TendenciaCuota[] = [
        {
          tipoResultado: 'LOCAL',
          cuotaActual: 1.90,
          tendencia: 'SUBIENDO',
          porcentajeCambio: 2.7,
          volumenTotal: 18500
        },
        {
          tipoResultado: 'EMPATE',
          cuotaActual: 3.20,
          tendencia: 'BAJANDO',
          porcentajeCambio: -1.5,
          volumenTotal: 8200
        },
        {
          tipoResultado: 'VISITANTE',
          cuotaActual: 4.15,
          tendencia: 'ESTABLE',
          porcentajeCambio: -1.2,
          volumenTotal: 5800
        }
      ];
      
      dispatch(setTendenciaCuotas(tendenciasSimuladas));
      return tendenciasSimuladas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar tendencias de cuotas');
      dispatch(setTendenciaCuotasError(errorMessage));
      throw error;
    }
  }, [dispatch, handleError]);

  // Cargar volumen de apuestas
  const cargarVolumenApuestas = useCallback(async (eventoId: number) => {
    try {
      dispatch(setVolumenApuestasLoading(true));
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch(`/api/cuotas-dinamicas/volumen/${eventoId}`);
      // const data = await response.json();
      
      // Simulación de datos
      const volumenSimulado: VolumenApuestas[] = [
        {
          eventoId,
          tipoResultado: 'LOCAL',
          volumenTotal: 18500,
          numeroApuestas: 142,
          fechaUltimaApuesta: new Date().toISOString()
        },
        {
          eventoId,
          tipoResultado: 'EMPATE',
          volumenTotal: 8200,
          numeroApuestas: 87,
          fechaUltimaApuesta: new Date(Date.now() - 120000).toISOString()
        },
        {
          eventoId,
          tipoResultado: 'VISITANTE',
          volumenTotal: 5800,
          numeroApuestas: 56,
          fechaUltimaApuesta: new Date(Date.now() - 180000).toISOString()
        }
      ];
      
      dispatch(setVolumenApuestas(volumenSimulado));
      return volumenSimulado;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar volumen de apuestas');
      dispatch(setVolumenApuestasError(errorMessage));
      throw error;
    }
  }, [dispatch, handleError]);

  // Cargar estadísticas de cuotas
  const cargarEstadisticasCuotas = useCallback(async (eventoId: number) => {
    try {
      dispatch(setEstadisticasCuotasLoading(true));
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch(`/api/cuotas-dinamicas/estadisticas/${eventoId}`);
      // const data = await response.json();
      
      // Simulación de datos
      const estadisticasSimuladas: EstadisticasCuotas = {
        eventoId,
        totalMercados: 15,
        mercadoMasPopular: 'RESULTADO_GENERAL',
        volumenTotalEvento: 32500,
        ultimaActualizacion: new Date().toISOString()
      };
      
      dispatch(setEstadisticasCuotas(estadisticasSimuladas));
      return estadisticasSimuladas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar estadísticas de cuotas');
      dispatch(setEstadisticasCuotasError(errorMessage));
      throw error;
    }
  }, [dispatch, handleError]);

  // Cargar resumen de cuotas
  const cargarResumenCuotas = useCallback(async () => {
    try {
      dispatch(setResumenCuotasLoading(true));
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch('/api/cuotas-dinamicas/resumen');
      // const data = await response.json();
      
      // Simulación de datos
      const resumenSimulado: ResumenCuotas = {
        totalEventos: 25,
        totalCuotas: 375,
        cuotasActualizadas: 89,
        tendenciasPositivas: 142,
        tendenciasNegativas: 98,
        ultimaActualizacion: new Date().toISOString()
      };
      
      dispatch(setResumenCuotas(resumenSimulado));
      return resumenSimulado;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar resumen de cuotas');
      dispatch(setResumenCuotasError(errorMessage));
      throw error;
    }
  }, [dispatch, handleError]);

  // Cargar alertas de cuotas
  const cargarAlertasCuotas = useCallback(async () => {
    try {
      dispatch(setAlertasCuotasLoading(true));
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch('/api/cuotas-dinamicas/alertas');
      // const data = await response.json();
      
      // Simulación de datos
      const alertasSimuladas: AlertaCuota[] = [
        {
          id: 1,
          eventoId: 1,
          tipoResultado: 'LOCAL',
          cuotaObjetivo: 2.0,
          direccion: 'MAYOR',
          activa: true,
          fechaCreacion: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          eventoId: 2,
          tipoResultado: 'VISITANTE',
          cuotaObjetivo: 3.5,
          direccion: 'MENOR',
          activa: true,
          fechaCreacion: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      dispatch(setAlertasCuotas(alertasSimuladas));
      return alertasSimuladas;
    } catch (error) {
      const errorMessage = handleError(error, 'Error al cargar alertas de cuotas');
      dispatch(setAlertasCuotasError(errorMessage));
      throw error;
    }
  }, [dispatch, handleError]);

  // Crear alerta de cuota
  const crearAlertaCuota = useCallback(async (alerta: Omit<AlertaCuota, 'id' | 'fechaCreacion'>) => {
    try {
      // TODO: Implementar llamada real al backend
      // const response = await fetch('/api/cuotas-dinamicas/alertas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(alerta)
      // });
      // const data = await response.json();
      
      // Simulación de datos
      const nuevaAlerta: AlertaCuota = {
        ...alerta,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
      };
      
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
      // TODO: Implementar llamada real al backend
      // await fetch(`/api/cuotas-dinamicas/alertas/${alertaId}`, {
      //   method: 'DELETE'
      // });
      
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
      // TODO: Implementar llamada real al backend
      // const response = await fetch('/api/cuotas-dinamicas/configuracion', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(nuevaConfiguracion)
      // });
      // const data = await response.json();
      
      dispatch(setConfiguracion(nuevaConfiguracion));
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
    limpiarTodoElEstado
  };
};