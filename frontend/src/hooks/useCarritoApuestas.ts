import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { EventoDeportivoType } from '../types/EventoDeportivoTypes';
import { TipoApuesta } from '../types/ApuestaType';
import { useApuestasDeportivas } from './useApuestasDeportivas';
import type { AppDispatch } from '../store/store';
import {
  agregarSlip,
  actualizarMontoSlip,
  removerSlip,
  limpiarCarrito,
  cambiarTipoApuesta,
  toggleVisibilidad,
  mostrarCarrito,
  ocultarCarrito,
  setProcesandoApuestas,
  setErrorProcesarApuestas,
  limpiarErrores,
  duplicarSlip,
  reordenarSlips,
  actualizarConfiguraciones,
  selectSlips,
  selectTipoApuesta,
  selectIsVisible,
  selectLoading,
  selectError,
  selectEstadisticasCarrito,
  selectValidacionesCarrito,
  type BettingSlip
} from '../store/slices/carritoApuestasSlice';

// Constantes para tipos de apuesta (mantenemos compatibilidad)
export const TIPOS_APUESTA = {
  RESULTADO_GENERAL: 'RESULTADO_GENERAL',
  RESULTADO_EXACTO: 'RESULTADO_EXACTO',
  TOTAL_GOLES: 'TOTAL_GOLES',
  GOLES_LOCAL: 'GOLES_LOCAL',
  GOLES_VISITANTE: 'GOLES_VISITANTE',
  AMBOS_EQUIPOS_ANOTAN: 'AMBOS_EQUIPOS_ANOTAN',
  PRIMER_GOLEADOR: 'PRIMER_GOLEADOR',
  HANDICAP: 'HANDICAP',
  DOBLE_OPORTUNIDAD: 'DOBLE_OPORTUNIDAD',
  MITAD_TIEMPO: 'MITAD_TIEMPO',
  GOLES_PRIMERA_MITAD: 'GOLES_PRIMERA_MITAD',
  CORNER_KICKS: 'CORNER_KICKS',
  TARJETAS: 'TARJETAS',
  AMBAS_MITADES_GOLEAN: 'AMBAS_MITADES_GOLEAN'
} as const;

export const OPCIONES_APUESTA = {
  RESULTADO_GENERAL: ['Local', 'Empate', 'Visitante'],
  TOTAL_GOLES: ['Más de 2.5', 'Menos de 2.5', 'Más de 3.5', 'Menos de 3.5'],
  AMBOS_EQUIPOS_ANOTAN: ['Sí', 'No'],
  DOBLE_OPORTUNIDAD: ['Local o Empate', 'Visitante o Empate', 'Local o Visitante']
};

// Hook principal para el carrito de apuestas
export const useCarritoApuestas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { createApuesta } = useApuestasDeportivas();

  // Selectores básicos
  const slips = useSelector(selectSlips);
  const betType = useSelector(selectTipoApuesta);
  const isVisible = useSelector(selectIsVisible);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Selectores memoizados
  const estadisticas = useSelector(selectEstadisticasCarrito);
  const validaciones = useSelector(selectValidacionesCarrito);

  // Agregar apuesta al carrito
  const agregarApuesta = useCallback((
    evento: EventoDeportivoType,
    tipoApuesta: TipoApuesta,
    prediccion: string,
    cuota: number,
    cuotaId: number,
    montoInicial: number = 0
  ) => {
    try {
      dispatch(agregarSlip({
        evento,
        tipoApuesta,
        prediccion,
        cuota,
        cuotaId,
        montoInicial
      }));

      // Solo mostrar toast si no hay error
      const errorState = error.agregarSlip;
      if (!errorState) {
        toast.success(`${evento.equipoLocal} vs ${evento.equipoVisitante} agregado al carrito`);
        return true;
      } else {
        toast.warning(errorState);
        return false;
      }
    } catch (err) {
      console.error('Error al agregar apuesta:', err);
      toast.error('Error al agregar la apuesta al carrito');
      return false;
    }
  }, [dispatch, error.agregarSlip]);

  // Actualizar monto de un slip
  const actualizarMonto = useCallback((id: string, nuevoMonto: number) => {
    dispatch(actualizarMontoSlip({ id, nuevoMonto }));
  }, [dispatch]);

  // Remover slip del carrito
  const removerApuesta = useCallback((id: string) => {
    const slip = slips.find(s => s.id === id);
    if (slip) {
      dispatch(removerSlip(id));
      toast.info(`${slip.evento.equipoLocal} vs ${slip.evento.equipoVisitante} removido del carrito`);
    }
  }, [dispatch, slips]);

  // Limpiar todo el carrito
  const limpiarTodoElCarrito = useCallback(() => {
    dispatch(limpiarCarrito());
    toast.info('Carrito limpiado');
  }, [dispatch]);

  // Verificar si una apuesta ya está en el carrito
  const estaEnCarrito = useCallback((evento: EventoDeportivoType, tipoApuesta: TipoApuesta, prediccion: string): boolean => {
    const generateSlipId = (evento: EventoDeportivoType, tipoApuesta: TipoApuesta, prediccion: string): string => {
      return `${evento.id}-${tipoApuesta}-${prediccion.replace(/\s+/g, '-')}`;
    };
    const id = generateSlipId(evento, tipoApuesta, prediccion);
    return slips.some((slip: BettingSlip) => slip.id === id);
  }, [slips]);

  // Obtener slip específico
  const obtenerSlip = useCallback((id: string): BettingSlip | undefined => {
    return slips.find((slip: BettingSlip) => slip.id === id);
  }, [slips]);

  // Procesar apuestas
  const procesarApuestas = useCallback(async () => {
    if (validaciones.carritoVacio) {
      //bugs: no se puede appostar multiples,las apuestas no tienen datos exactos de modo de juego,etc.
      //no se pueden guardar apuestas en modo simple mas de una vez
      //requiere un mejor dise;o 
      toast.error('No hay apuestas en el carrito');
      return false;
    }

    if (validaciones.tieneSlipsSinMonto) {
      toast.error('Todas las apuestas deben tener un monto mayor a 0');
      return false;
    }

    dispatch(setProcesandoApuestas(true));

    try {
      if (betType === 'simple') {
        // Procesar apuestas simples
        const resultados = await Promise.all(
          slips.map(async (slip) => {
            const datosApuesta = {
              eventoId: slip.evento.id,
              cuotaId: slip.cuotaId,
              montoApostado: slip.montoApostado,
              tipoApuesta: slip.tipoApuesta,
              prediccion: slip.prediccion
            };
            return await createApuesta(datosApuesta);
          })
        );

        const exitosas = resultados.filter(resultado => resultado !== null);
        if (exitosas.length === slips.length) {
          toast.success(`${exitosas.length} apuesta${exitosas.length > 1 ? 's' : ''} realizada${exitosas.length > 1 ? 's' : ''} exitosamente`);
          dispatch(limpiarCarrito());
          return true;
        } else {
          toast.warning(`${exitosas.length} de ${slips.length} apuestas fueron realizadas`);
          // Aquí podrías implementar lógica para remover solo las exitosas
          return false;
        }
      } else {
        // Para apuestas múltiples
        if (slips.length > 0) {
          const totalMonto = estadisticas.totalApostado;
          const primeraSeleccion = slips[0];

          const datosApuestaMultiple = {
            eventoId: primeraSeleccion.evento.id,
            cuotaId: primeraSeleccion.cuotaId,
            montoApostado: totalMonto,
            tipoApuesta: 'MULTIPLE' as TipoApuesta,
            descripcion: `Apuesta múltiple con ${slips.length} selecciones`
          };

          const resultado = await createApuesta(datosApuestaMultiple);

          if (resultado) {
            toast.success('Apuesta múltiple realizada exitosamente');
            dispatch(limpiarCarrito());
            return true;
          } else {
            dispatch(setErrorProcesarApuestas('Error al procesar la apuesta múltiple'));
            return false;
          }
        }
      }
    } catch (error) {
      console.error('Error al procesar apuestas:', error);
      dispatch(setErrorProcesarApuestas('Error al procesar las apuestas'));
      toast.error('Error al procesar las apuestas');
      return false;
    } finally {
      dispatch(setProcesandoApuestas(false));
    }
  }, [dispatch, slips, betType, estadisticas.totalApostado, validaciones, createApuesta]);

  // Cambiar tipo de apuesta
  const cambiarTipo = useCallback((tipo: 'simple' | 'multiple') => {
    dispatch(cambiarTipoApuesta(tipo));
  }, [dispatch]);

  // Controles de visibilidad
  const toggleCarrito = useCallback(() => {
    dispatch(toggleVisibilidad());
  }, [dispatch]);

  const mostrarCarritoApuestas = useCallback(() => {
    dispatch(mostrarCarrito());
  }, [dispatch]);

  const ocultarCarritoApuestas = useCallback(() => {
    dispatch(ocultarCarrito());
  }, [dispatch]);

  // Funciones adicionales
  const duplicarApuesta = useCallback((id: string) => {
    dispatch(duplicarSlip(id));
    toast.info('Apuesta duplicada');
  }, [dispatch]);

  const reordenar = useCallback((nuevoOrden: string[]) => {
    dispatch(reordenarSlips(nuevoOrden));
  }, [dispatch]);

  const actualizarConfiguracion = useCallback((configuracion: {
    montoMinimo?: number;
    montoMaximo?: number;
    cuotaMinima?: number;
    cuotaMaxima?: number;
  }) => {
    dispatch(actualizarConfiguraciones(configuracion));
  }, [dispatch]);

  const limpiarTodosLosErrores = useCallback(() => {
    dispatch(limpiarErrores());
  }, [dispatch]);

  // Selectores utilitarios
  const obtenerSlipsPorEvento = useCallback((eventoId: number) => {
    return slips.filter((slip: BettingSlip) => slip.evento.id === eventoId);
  }, [slips]);

  const obtenerSlipsPorTipo = useCallback((tipoApuesta: TipoApuesta) => {
    return slips.filter((slip: BettingSlip) => slip.tipoApuesta === tipoApuesta);
  }, [slips]);

  // Función para obtener etiqueta del tipo de apuesta
  const getTipoApuestaLabel = useCallback((tipo: TipoApuesta): string => {
    const labels: Record<TipoApuesta, string> = {
      'RESULTADO_GENERAL': 'Resultado',
      'RESULTADO_EXACTO': 'Marcador Exacto',
      'TOTAL_GOLES': 'Total Goles',
      'GOLES_LOCAL': 'Goles Local',
      'GOLES_VISITANTE': 'Goles Visitante',
      'AMBOS_EQUIPOS_ANOTAN': 'Ambos Anotan',
      'PRIMER_GOLEADOR': 'Primer Goleador',
      'HANDICAP': 'Hándicap',
      'DOBLE_OPORTUNIDAD': 'Doble Oportunidad',
      'MITAD_TIEMPO': 'Mitad Tiempo',
      'GOLES_PRIMERA_MITAD': 'Goles 1ª Mitad',
      'CORNER_KICKS': 'Córners',
      'TARJETAS': 'Tarjetas',
      'AMBAS_MITADES_GOLEAN': 'Ambas Mitades Golean'
    };
    return labels[tipo] || tipo;
  }, []);

  return {
    // Estado
    slips,
    betType,
    isVisible,
    isCreandoApuesta: loading.procesandoApuestas,

    // Estadísticas
    estadisticas,
    validaciones,

    // Errores
    error,

    // Acciones principales
    agregarApuesta,
    actualizarMontoSlip: actualizarMonto,
    removerSlip: removerApuesta,
    limpiarCarrito: limpiarTodoElCarrito,
    procesarApuestas,

    // Configuración
    cambiarTipoApuesta: cambiarTipo,
    toggleVisibilidad: toggleCarrito,
    mostrarCarrito: mostrarCarritoApuestas,
    ocultarCarrito: ocultarCarritoApuestas,

    // Utilidades
    estaEnCarrito,
    obtenerSlip,
    getTipoApuestaLabel,
    duplicarSlip: duplicarApuesta,
    reordenarSlips: reordenar,
    actualizarConfiguraciones: actualizarConfiguracion,
    limpiarErrores: limpiarTodosLosErrores,

    // Selectores utilitarios
    obtenerSlipsPorEvento,
    obtenerSlipsPorTipo,

    // Constantes
    TIPOS_APUESTA,
    OPCIONES_APUESTA
  };
};

// Re-exportar el tipo BettingSlip para compatibilidad
export type { BettingSlip };

export default useCarritoApuestas;
