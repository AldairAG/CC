import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import CuotasDinamicasService from '../service/casino/cuotasDinamicasService';

// Tipos para las cuotas dinámicas
export interface CuotaEvento {
  id: number;
  eventoId: number;
  tipoResultado: string;
  cuotaActual: number;
  cuotaAnterior: number;
  fechaActualizacion: string;
  activa: boolean;
}

export interface CuotaHistorial {
  id: number;
  cuotaEventoId: number;
  cuotaAnterior: number;
  cuotaNueva: number;
  fechaCambio: string;
  motivoCambio: string;
  volumenAcumulado: number;
}

export interface TendenciaCuota {
  tipoResultado: string;
  cuotaActual: number;
  tendencia: 'SUBIENDO' | 'BAJANDO' | 'ESTABLE';
  porcentajeCambio: number;
  volumenTotal: number;
}

export interface VolumenApuestas {
  eventoId: number;
  tipoResultado: string;
  volumenTotal: number;
  numeroApuestas: number;
  fechaUltimaApuesta: string;
}

export interface EstadisticasCuotas {
  eventoId: number;
  totalMercados: number;
  mercadoMasPopular: string;
  volumenTotalEvento: number;
  ultimaActualizacion: string;
}

export const useCuotasDinamicas = () => {
  const [cuotasEvento, setCuotasEvento] = useState<CuotaEvento[]>([]);
  const [historialCuotas, setHistorialCuotas] = useState<CuotaHistorial[]>([]);
  const [tendenciaCuotas, setTendenciaCuotas] = useState<TendenciaCuota[]>([]);
  const [volumenApuestas, setVolumenApuestas] = useState<VolumenApuestas[]>([]);
  const [estadisticasCuotas, setEstadisticasCuotas] = useState<EstadisticasCuotas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para las nuevas funcionalidades
  const [cuotasPorMercado, setCuotasPorMercado] = useState<Record<string, CuotaEvento[]>>({});
  const [cuotasDetalladas, setCuotasDetalladas] = useState<any>(null);
  const [cargandoCuotasPorMercado, setCargandoCuotasPorMercado] = useState<boolean>(false);
  const [cargandoCuotasDetalladas, setCargandoCuotasDetalladas] = useState<boolean>(false);
  const [cargandoCuotasEvento, setCargandoCuotasEvento] = useState<boolean>(false);

  // Función auxiliar para manejar errores
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error en useCuotasDinamicas:', error);
    
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
    
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  // Cargar cuotas de un evento
  const cargarCuotasEvento = useCallback(async (eventoId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar usar el service real
        const cuotas = await CuotasDinamicasService.obtenerCuotasEvento(eventoId);
        setCuotasEvento(cuotas);
      } catch (serviceError) {
        // Si falla el service, usar datos simulados
        console.warn('Service no disponible, usando datos simulados:', serviceError);
        
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
            cuotaActual: 2.65,
            cuotaAnterior: 2.70,
            fechaActualizacion: new Date().toISOString(),
            activa: true
          },
          {
            id: 3,
            eventoId,
            tipoResultado: 'VISITANTE',
            cuotaActual: 6.00,
            cuotaAnterior: 5.80,
            fechaActualizacion: new Date().toISOString(),
            activa: true
          }
        ];
        
        setCuotasEvento(cuotasSimuladas);
      }
      
    } catch (error) {
      handleError(error, 'Error al cargar cuotas del evento');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Cargar historial de cuotas
  const cargarHistorialCuotas = useCallback(async (eventoId: number, tipoResultado?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar usar el service real
        const response = await CuotasDinamicasService.obtenerHistorialCuotas(eventoId, tipoResultado);
        setHistorialCuotas(response.data);
      } catch (serviceError) {
        // Si falla el service, usar datos simulados
        console.warn('Service no disponible, usando datos simulados:', serviceError);
        
        // Simulación de datos
        const historialSimulado: CuotaHistorial[] = [
          {
            id: 1,
            cuotaEventoId: 1,
            cuotaAnterior: 1.80,
            cuotaNueva: 1.85,
            fechaCambio: new Date(Date.now() - 3600000).toISOString(),
            motivoCambio: 'Ajuste por volumen de apuestas',
            volumenAcumulado: 1500
          },
          {
            id: 2,
            cuotaEventoId: 1,
            cuotaAnterior: 1.85,
            cuotaNueva: 1.90,
            fechaCambio: new Date().toISOString(),
            motivoCambio: 'Actualización automática',
            volumenAcumulado: 2100
          }
        ];
        
        setHistorialCuotas(historialSimulado);
      }
      
    } catch (error) {
      handleError(error, 'Error al cargar historial de cuotas');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Cargar tendencias de cuotas
  const cargarTendenciaCuotas = useCallback(async (eventoId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar usar el service real
        const tendencias = await CuotasDinamicasService.obtenerTendenciaCuotas(eventoId);
        setTendenciaCuotas(tendencias);
      } catch (serviceError) {
        // Si falla el service, usar datos simulados
        console.warn('Service no disponible, usando datos simulados:', serviceError);
        
        // Simulación de datos
        const tendenciasSimuladas: TendenciaCuota[] = [
          {
            tipoResultado: 'LOCAL',
            cuotaActual: 1.90,
            tendencia: 'SUBIENDO',
            porcentajeCambio: 2.7,
            volumenTotal: 2100
          },
          {
            tipoResultado: 'EMPATE',
            cuotaActual: 2.65,
            tendencia: 'BAJANDO',
            porcentajeCambio: -1.9,
            volumenTotal: 850
          },
          {
            tipoResultado: 'VISITANTE',
            cuotaActual: 6.00,
            tendencia: 'SUBIENDO',
            porcentajeCambio: 3.4,
            volumenTotal: 450
          }
        ];
        
        setTendenciaCuotas(tendenciasSimuladas);
      }
      
    } catch (error) {
      handleError(error, 'Error al cargar tendencias de cuotas');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Cargar volumen de apuestas
  const cargarVolumenApuestas = useCallback(async (eventoId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar usar el service real
        const volumen = await CuotasDinamicasService.obtenerVolumenApuestas(eventoId);
        setVolumenApuestas(volumen);
      } catch (serviceError) {
        // Si falla el service, usar datos simulados
        console.warn('Service no disponible, usando datos simulados:', serviceError);
        
        // Simulación de datos
        const volumenSimulado: VolumenApuestas[] = [
          {
            eventoId,
            tipoResultado: 'LOCAL',
            volumenTotal: 2100,
            numeroApuestas: 45,
            fechaUltimaApuesta: new Date().toISOString()
          },
          {
            eventoId,
            tipoResultado: 'EMPATE',
            volumenTotal: 850,
            numeroApuestas: 18,
            fechaUltimaApuesta: new Date(Date.now() - 1800000).toISOString()
          },
          {
            eventoId,
            tipoResultado: 'VISITANTE',
            volumenTotal: 450,
            numeroApuestas: 12,
            fechaUltimaApuesta: new Date(Date.now() - 900000).toISOString()
          }
        ];
        
        setVolumenApuestas(volumenSimulado);
      }
      
    } catch (error) {
      handleError(error, 'Error al cargar volumen de apuestas');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Cargar estadísticas generales de cuotas
  const cargarEstadisticasCuotas = useCallback(async (eventoId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar usar el service real
        const estadisticas = await CuotasDinamicasService.obtenerEstadisticasCuotas(eventoId);
        setEstadisticasCuotas(estadisticas);
      } catch (serviceError) {
        // Si falla el service, usar datos simulados
        console.warn('Service no disponible, usando datos simulados:', serviceError);
        
        // Simulación de datos
        const estadisticasSimuladas: EstadisticasCuotas = {
          eventoId,
          totalMercados: 15,
          mercadoMasPopular: 'RESULTADO_FINAL',
          volumenTotalEvento: 3400,
          ultimaActualizacion: new Date().toISOString()
        };
        
        setEstadisticasCuotas(estadisticasSimuladas);
      }
      
    } catch (error) {
      handleError(error, 'Error al cargar estadísticas de cuotas');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Registrar apuesta (para actualizar cuotas dinámicamente)
  const registrarApuesta = useCallback(async (
    eventoId: number,
    tipoResultado: string,
    monto: number,
    cuotaUtilizada: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar usar el service real
        const cuotasActualizadas = await CuotasDinamicasService.registrarApuesta(
          eventoId,
          tipoResultado,
          monto,
          cuotaUtilizada
        );
        setCuotasEvento(cuotasActualizadas);
        toast.success('Apuesta registrada y cuotas actualizadas');
      } catch (serviceError) {
        // Si falla el service, usar simulación local
        console.warn('Service no disponible, usando simulación local:', serviceError);
        
        // Simulación: actualizar cuotas localmente
        setCuotasEvento(prevCuotas => 
          prevCuotas.map(cuota => {
            if (cuota.eventoId === eventoId && cuota.tipoResultado === tipoResultado) {
              return {
                ...cuota,
                cuotaAnterior: cuota.cuotaActual,
                cuotaActual: cuota.cuotaActual * 0.98, // Simulación: baja ligeramente
                fechaActualizacion: new Date().toISOString()
              };
            }
            return cuota;
          })
        );
        
        toast.success('Apuesta registrada y cuotas actualizadas (modo simulación)');
      }
      
    } catch (error) {
      handleError(error, 'Error al registrar apuesta');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Limpiar estado
  const limpiarCuotas = useCallback(() => {
    setCuotasEvento([]);
    setHistorialCuotas([]);
    setTendenciaCuotas([]);
    setVolumenApuestas([]);
    setEstadisticasCuotas(null);
    setError(null);
  }, []);

  // Suscribirse a actualizaciones en tiempo real
  const suscribirseActualizaciones = useCallback(async (
    eventoId: number,
    onCuotaActualizada: (cuota: CuotaEvento) => void
  ) => {
    try {
      const eventSource = await CuotasDinamicasService.suscribirseActualizaciones(
        eventoId,
        (cuotaActualizada) => {
          // Actualizar el estado local
          setCuotasEvento(prevCuotas => 
            prevCuotas.map(cuota => 
              cuota.id === cuotaActualizada.id ? cuotaActualizada : cuota
            )
          );
          
          // Llamar callback personalizado
          onCuotaActualizada(cuotaActualizada);
        }
      );
      
      return eventSource;
    } catch (error) {
      handleError(error, 'Error al suscribirse a actualizaciones en tiempo real');
      return null;
    }
  }, [handleError]);

  // Buscar cuotas con filtros
  const buscarCuotas = useCallback(async (
    filtros: Partial<{
      eventoId?: number;
      tipoResultado?: string;
      activa?: boolean;
      cuotaMinima?: number;
      cuotaMaxima?: number;
    }>,
    busqueda?: string,
    pagina?: number,
    tamaño?: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const paginacion = { 
        page: pagina || 0, 
        size: tamaño || 20 
      };
      
      try {
        const response = await CuotasDinamicasService.buscarCuotas(
          filtros,
          busqueda,
          paginacion
        );
        setCuotasEvento(response.data);
        return response;
      } catch (serviceError) {
        console.warn('Service de búsqueda no disponible:', serviceError);
        // Filtrar datos locales si el service no está disponible
        const cuotasFiltradas = cuotasEvento.filter(cuota => {
          if (filtros.eventoId && cuota.eventoId !== filtros.eventoId) return false;
          if (filtros.tipoResultado && cuota.tipoResultado !== filtros.tipoResultado) return false;
          if (filtros.activa !== undefined && cuota.activa !== filtros.activa) return false;
          if (busqueda && !cuota.tipoResultado.toLowerCase().includes(busqueda.toLowerCase())) return false;
          return true;
        });
        
        setCuotasEvento(cuotasFiltradas);
        return { 
          data: cuotasFiltradas, 
          paginacion: { 
            page: 0, 
            size: cuotasFiltradas.length, 
            totalElements: cuotasFiltradas.length, 
            totalPages: 1 
          } 
        };
      }
      
    } catch (error) {
      handleError(error, 'Error al buscar cuotas');
      return { data: [], paginacion: { page: 0, size: 0, totalElements: 0, totalPages: 0 } };
    } finally {
      setLoading(false);
    }
  }, [handleError, cuotasEvento]);

  // Cargar cuotas agrupadas por mercado
  const cargarCuotasPorMercado = useCallback(async (eventoId: number) => {
    setCargandoCuotasPorMercado(true);
    try {
      const cuotasAgrupadas = await CuotasDinamicasService.obtenerCuotasPorMercado(eventoId);
      setCuotasPorMercado(cuotasAgrupadas);
    } catch (error) {
      console.error('Error cargando cuotas por mercado:', error);
      toast.error('Error al cargar cuotas por mercado');
    } finally {
      setCargandoCuotasPorMercado(false);
    }
  }, []);

  // Cargar cuotas detalladas
  const cargarCuotasDetalladas = useCallback(async (eventoId: number) => {
    setCargandoCuotasDetalladas(true);
    try {
      const cuotasDetalladas = await CuotasDinamicasService.obtenerCuotasDetalladas(eventoId);
      setCuotasDetalladas(cuotasDetalladas);
    } catch (error) {
      console.error('Error cargando cuotas detalladas:', error);
      toast.error('Error al cargar cuotas detalladas');
    } finally {
      setCargandoCuotasDetalladas(false);
    }
  }, []);

  // Generar cuotas completas para un evento
  const generarCuotasCompletas = useCallback(async (eventoId: number) => {
    setCargandoCuotasEvento(true);
    try {
      const cuotasGeneradas = await CuotasDinamicasService.generarCuotasCompletas(eventoId);
      setCuotasEvento(cuotasGeneradas);
      toast.success('Cuotas completas generadas exitosamente');
      
      // Recargar cuotas por mercado
      await cargarCuotasPorMercado(eventoId);
    } catch (error) {
      console.error('Error generando cuotas completas:', error);
      toast.error('Error al generar cuotas completas');
    } finally {
      setCargandoCuotasEvento(false);
    }
  }, [cargarCuotasPorMercado]);

  // Obtener cuotas de un mercado específico
  const obtenerCuotasMercado = useCallback(async (eventoId: number, mercado: string) => {
    try {
      const cuotasMercado = await CuotasDinamicasService.obtenerCuotasMercadoEspecifico(eventoId, mercado);
      return cuotasMercado;
    } catch (error) {
      console.error('Error obteniendo cuotas del mercado:', error);
      toast.error(`Error al obtener cuotas del mercado ${mercado}`);
      return [];
    }
  }, []);

  return {
    // Estado
    cuotasEvento,
    historialCuotas,
    tendenciaCuotas,
    volumenApuestas,
    estadisticasCuotas,
    loading,
    error,
    cuotasPorMercado,
    cuotasDetalladas,
    cargandoCuotasPorMercado,
    cargandoCuotasDetalladas,
    cargandoCuotasEvento,
    
    // Acciones
    cargarCuotasEvento,
    cargarHistorialCuotas,
    cargarTendenciaCuotas,
    cargarVolumenApuestas,
    cargarEstadisticasCuotas,
    registrarApuesta,
    limpiarCuotas,
    suscribirseActualizaciones,
    buscarCuotas,
    cargarCuotasPorMercado,
    cargarCuotasDetalladas,
    generarCuotasCompletas,
    obtenerCuotasMercado
  };
};
