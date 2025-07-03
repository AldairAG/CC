import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

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
      
      // TODO: Implementar llamada real al backend
      const params = tipoResultado ? `?tipoResultado=${tipoResultado}` : '';
      console.log(`Cargando historial para evento ${eventoId}${params}`);
      // const response = await fetch(`/api/cuotas-dinamicas/historial/${eventoId}${params}`);
      // const data = await response.json();
      
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
      
      // TODO: Implementar llamada real al backend
      console.log(`Cargando tendencias para evento ${eventoId}`);
      // const response = await fetch(`/api/cuotas-dinamicas/tendencias/${eventoId}`);
      // const data = await response.json();
      
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
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch(`/api/cuotas-dinamicas/volumen/${eventoId}`);
      // const data = await response.json();
      
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
      
      // TODO: Implementar llamada real al backend
      // const response = await fetch(`/api/cuotas-dinamicas/estadisticas/${eventoId}`);
      // const data = await response.json();
      
      // Simulación de datos
      const estadisticasSimuladas: EstadisticasCuotas = {
        eventoId,
        totalMercados: 15,
        mercadoMasPopular: 'RESULTADO_FINAL',
        volumenTotalEvento: 3400,
        ultimaActualizacion: new Date().toISOString()
      };
      
      setEstadisticasCuotas(estadisticasSimuladas);
      
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
      
      // TODO: Implementar llamada real al backend
      console.log(`Registrando apuesta: evento ${eventoId}, tipo ${tipoResultado}, monto ${monto}, cuota ${cuotaUtilizada}`);
      // const response = await fetch('/api/cuotas-dinamicas/registrar-apuesta', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ eventoId, tipoResultado, monto, cuotaUtilizada })
      // });
      
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
      
      toast.success('Apuesta registrada y cuotas actualizadas');
      
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

  return {
    // Estado
    cuotasEvento,
    historialCuotas,
    tendenciaCuotas,
    volumenApuestas,
    estadisticasCuotas,
    loading,
    error,
    
    // Acciones
    cargarCuotasEvento,
    cargarHistorialCuotas,
    cargarTendenciaCuotas,
    cargarVolumenApuestas,
    cargarEstadisticasCuotas,
    registrarApuesta,
    limpiarCuotas
  };
};
