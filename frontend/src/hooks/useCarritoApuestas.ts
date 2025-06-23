import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  agregarApuesta,
  removerApuesta,
  actualizarMontoApuesta,
  actualizarCuotaApuesta,
  limpiarCarrito,
  toggleCarrito,
  abrirCarrito,
  cerrarCarrito,
  setCreando,
  setError,
  removerApuestasEvento,
  carritoApuestasSelector,
  type ApuestaCarrito
} from '../store/slices/carritoApuestasSlice';
import { apuestaService, type CrearApuestaRequest } from '../service/casino/apuestaService';
import { useNotificaciones } from './useNotificaciones';
import type { EventType } from '../types/EventType';
import useUser from './useUser';

// Tipos de apuesta disponibles
export const TIPOS_APUESTA = {
  GANADOR_PARTIDO: 'GANADOR_PARTIDO',
  MARCADOR_EXACTO: 'MARCADOR_EXACTO', 
  TOTAL_GOLES: 'TOTAL_GOLES',
  AMBOS_EQUIPOS_ANOTAN: 'AMBOS_EQUIPOS_ANOTAN',
  PRIMER_GOLEADOR: 'PRIMER_GOLEADOR',
  HANDICAP: 'HANDICAP',
  MITAD_TIEMPO: 'MITAD_TIEMPO',
  DOBLE_OPORTUNIDAD: 'DOBLE_OPORTUNIDAD',
  GOLES_MAS_MENOS: 'GOLES_MAS_MENOS',
  CORNER_KICKS: 'CORNER_KICKS'
} as const;

export type TipoApuesta = keyof typeof TIPOS_APUESTA;

// Opciones de apuesta predefinidas
export const OPCIONES_APUESTA = {
  [TIPOS_APUESTA.GANADOR_PARTIDO]: [
    { descripcion: 'Equipo Local', detalle: 'local', cuotaBase: 2.5 },
    { descripcion: 'Empate', detalle: 'empate', cuotaBase: 3.2 },
    { descripcion: 'Equipo Visitante', detalle: 'visitante', cuotaBase: 2.8 }
  ],
  [TIPOS_APUESTA.TOTAL_GOLES]: [
    { descripcion: 'Más de 2.5 goles', detalle: 'over_2.5', cuotaBase: 1.9 },
    { descripcion: 'Menos de 2.5 goles', detalle: 'under_2.5', cuotaBase: 1.95 },
    { descripcion: 'Más de 1.5 goles', detalle: 'over_1.5', cuotaBase: 1.3 },
    { descripcion: 'Menos de 1.5 goles', detalle: 'under_1.5', cuotaBase: 3.5 }
  ],
  [TIPOS_APUESTA.AMBOS_EQUIPOS_ANOTAN]: [
    { descripcion: 'Sí', detalle: 'si', cuotaBase: 1.8 },
    { descripcion: 'No', detalle: 'no', cuotaBase: 2.0 }
  ]
};

export const useCarritoApuestas = () => {
  const dispatch = useDispatch();
  const { notificarExito, notificarError, notificarInfo } = useNotificaciones();
  const {user}=useUser();
  
  
  // Selectores
  const apuestas = useSelector(carritoApuestasSelector.apuestas);
  const isOpen = useSelector(carritoApuestasSelector.isOpen);
  const totalApuestas = useSelector(carritoApuestasSelector.totalApuestas);
  const totalMonto = useSelector(carritoApuestasSelector.totalMonto);
  const totalGananciaPotencial = useSelector(carritoApuestasSelector.totalGananciaPotencial);
  const isCreating = useSelector(carritoApuestasSelector.isCreating);
  const error = useSelector(carritoApuestasSelector.error);
  const hayApuestas = useSelector(carritoApuestasSelector.hayApuestas);
  // Función para agregar apuesta desde un evento
  const agregarApuestaDesdeEvento = useCallback((
    evento: EventType,
    tipoApuesta: TipoApuesta,
    opcionApuesta: {
      descripcion: string;
      detalle: string;
      cuotaBase: number;
    },
    montoInicial: number = 10
  ) => {
    const nuevaApuesta = {
      idEvento: Number(evento.idEvent),
      equipoLocal: evento.strHomeTeam || 'Equipo Local',
      equipoVisitante: evento.strAwayTeam || 'Equipo Visitante',
      fechaPartido: evento.dateEvent || '',
      tipoApuesta,
      tipoApuestaDescripcion: TIPOS_APUESTA[tipoApuesta],
      cuota: opcionApuesta.cuotaBase,
      montoApuesta: montoInicial,
      gananciaPotencial: montoInicial * opcionApuesta.cuotaBase,
      prediccionUsuario: opcionApuesta.descripcion,
      detalleApuesta: opcionApuesta.detalle,
    };

    dispatch(agregarApuesta(nuevaApuesta));
    dispatch(abrirCarrito());
    
    // Notificar éxito
    notificarExito(
      'Apuesta agregada',
      `${evento.strHomeTeam} vs ${evento.strAwayTeam} - ${opcionApuesta.descripcion}`
    );
  }, [dispatch, notificarExito]);

  // Función para remover apuesta
  const removerApuestaDelCarrito = useCallback((id: string) => {
    dispatch(removerApuesta(id));
  }, [dispatch]);

  // Función para actualizar monto
  const actualizarMonto = useCallback((id: string, nuevoMonto: number) => {
    if (nuevoMonto > 0) {
      dispatch(actualizarMontoApuesta({ id, nuevoMonto }));
    }
  }, [dispatch]);

  // Función para actualizar cuota
  const actualizarCuota = useCallback((id: string, nuevaCuota: number) => {
    if (nuevaCuota > 0) {
      dispatch(actualizarCuotaApuesta({ id, nuevaCuota }));
    }
  }, [dispatch]);

  // Función para limpiar todo el carrito
  const limpiarTodoElCarrito = useCallback(() => {
    dispatch(limpiarCarrito());
  }, [dispatch]);

  // Función para toggle del carrito
  const toggleEstadoCarrito = useCallback(() => {
    dispatch(toggleCarrito());
  }, [dispatch]);

  // Función para abrir carrito
  const abrirCarritoApuestas = useCallback(() => {
    dispatch(abrirCarrito());
  }, [dispatch]);

  // Función para cerrar carrito
  const cerrarCarritoApuestas = useCallback(() => {
    dispatch(cerrarCarrito());
  }, [dispatch]);
  // Función para procesar todas las apuestas
  const procesarApuestas = useCallback(async (): Promise<boolean> => {
    if (apuestas.length === 0) {
      dispatch(setError('No hay apuestas en el carrito'));
      notificarError('Error', 'No hay apuestas en el carrito');
      return false;
    }

    try {
      dispatch(setCreando(true));
      dispatch(setError(null));
      
      notificarInfo('Procesando apuestas', 'Creando tus apuestas...');

      const apuestasCreadas = [];
      
      for (const apuesta of apuestas) {
        const requestApuesta: CrearApuestaRequest = {
          idUsuario: user?.idUsuario || 0,
          idEvento: apuesta.idEvento,
          tipoApuesta: apuesta.tipoApuesta,
          montoApuesta: apuesta.montoApuesta,
          cuotaApuesta: apuesta.cuota,
          prediccionUsuario: apuesta.prediccionUsuario,
          detalleApuesta: apuesta.detalleApuesta,
        };

        const apuestaCreada = await apuestaService.crearApuesta(requestApuesta);
        apuestasCreadas.push(apuestaCreada);
      }

      // Limpiar carrito después de crear todas las apuestas
      dispatch(limpiarCarrito());
      dispatch(cerrarCarrito());
      
      notificarExito(
        '¡Apuestas creadas!',
        `Se crearon ${apuestasCreadas.length} apuestas exitosamente`
      );
      
      return true;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al procesar las apuestas';
      dispatch(setError(errorMessage));
      notificarError('Error al procesar apuestas', errorMessage);
      return false;
    } finally {
      dispatch(setCreando(false));
    }
  }, [apuestas, dispatch, notificarExito, notificarError, notificarInfo]);

  // Función para validar si se puede agregar una apuesta
  const puedeAgregarApuesta = useCallback((idEvento: number, tipoApuesta: TipoApuesta): boolean => {
    return !apuestas.some(
      apuesta => apuesta.idEvento === idEvento && apuesta.tipoApuesta === tipoApuesta
    );
  }, [apuestas]);

  // Función para obtener apuestas de un evento específico
  const obtenerApuestasDeEvento = useCallback((idEvento: number): ApuestaCarrito[] => {
    return apuestas.filter(apuesta => apuesta.idEvento === idEvento);
  }, [apuestas]);

  // Función para remover todas las apuestas de un evento
  const removerApuestasDeEvento = useCallback((idEvento: number) => {
    dispatch(removerApuestasEvento(idEvento));
  }, [dispatch]);

  // Función para calcular ganancia potencial
  const calcularGananciaPotencial = useCallback((monto: number, cuota: number): number => {
    return Number((monto * cuota).toFixed(2));
  }, []);

  // Función para formatear dinero
  const formatearDinero = useCallback((cantidad: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad);
  }, []);

  // Función para obtener el nombre del tipo de apuesta
  const obtenerNombreTipoApuesta = useCallback((tipo: TipoApuesta): string => {
    const nombres = {
      GANADOR_PARTIDO: 'Ganador del Partido',
      MARCADOR_EXACTO: 'Marcador Exacto',
      TOTAL_GOLES: 'Total de Goles',
      AMBOS_EQUIPOS_ANOTAN: 'Ambos Equipos Anotan',
      PRIMER_GOLEADOR: 'Primer Goleador',
      HANDICAP: 'Hándicap',
      MITAD_TIEMPO: 'Resultado Primer Tiempo',
      DOBLE_OPORTUNIDAD: 'Doble Oportunidad',
      GOLES_MAS_MENOS: 'Más/Menos Goles',
      CORNER_KICKS: 'Córners'
    };
    return nombres[tipo] || tipo;
  }, []);

  // Función para limpiar errores
  const limpiarError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    // Estado
    apuestas,
    isOpen,
    totalApuestas,
    totalMonto,
    totalGananciaPotencial,
    isCreating,
    error,
    hayApuestas,

    // Acciones principales
    agregarApuestaDesdeEvento,
    removerApuestaDelCarrito,
    actualizarMonto,
    actualizarCuota,
    limpiarTodoElCarrito,
    procesarApuestas,

    // Control del carrito
    toggleEstadoCarrito,
    abrirCarritoApuestas,
    cerrarCarritoApuestas,

    // Utilidades
    puedeAgregarApuesta,
    obtenerApuestasDeEvento,
    removerApuestasDeEvento,
    calcularGananciaPotencial,
    formatearDinero,
    obtenerNombreTipoApuesta,
    limpiarError,

    // Constantes
    TIPOS_APUESTA,
    OPCIONES_APUESTA,
  };
};
