import { useState, useEffect } from 'react';
import { useApuestasDeportivas } from '../../hooks/useApuestasDeportivas';
import { useEvento } from '../../hooks/useEvento';
import type { CrearApuestaRequestType } from '../../types/ApuestaType';
import { TipoApuesta } from '../../types/ApuestaType';

interface CrearApuestaFormProps {
  isOpen: boolean;
  onClose: () => void;
  eventoId?: number;
  onApuestaCreada?: () => void;
}

const CrearApuestaForm = ({ isOpen, onClose, eventoId, onApuestaCreada }: CrearApuestaFormProps) => {
  const {
    createApuesta,
    isCreandoApuesta,
    errorCrearApuesta,
    validateMontoApuesta,
    calculatePotentialWinnings,
    loadLimitesApuesta,
    limites
  } = useApuestasDeportivas();

  const { eventos, cargarEventos } = useEvento();

  const [formData, setFormData] = useState<CrearApuestaRequestType>({
    eventoId: eventoId || 0,
    cuotaId: 0,
    montoApostado: 0,
    tipoApuesta: TipoApuesta.RESULTADO_GENERAL,
    prediccion: '',
    descripcion: ''
  });

  const [gananciasPotenciales, setGananciasPotenciales] = useState(0);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(1.5);

  useEffect(() => {
    if (isOpen) {
      cargarEventos();
      loadLimitesApuesta();
    }
  }, [isOpen, cargarEventos, loadLimitesApuesta]);

  useEffect(() => {
    if (eventoId) {
      setFormData(prev => ({ ...prev, eventoId }));
    }
  }, [eventoId]);

  useEffect(() => {
    if (formData.montoApostado && cuotaSeleccionada) {
      const ganancias = calculatePotentialWinnings(formData.montoApostado, cuotaSeleccionada);
      setGananciasPotenciales(ganancias);
    }
  }, [formData.montoApostado, cuotaSeleccionada, calculatePotentialWinnings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'montoApostado' || name === 'eventoId' || name === 'cuotaId' 
        ? Number(value) 
        : value
    }));
  };

  const handleTipoApuestaChange = (tipo: TipoApuesta) => {
    setFormData(prev => ({ ...prev, tipoApuesta: tipo }));
    
    // Actualizar predicción y cuota según el tipo
    switch (tipo) {
      case TipoApuesta.RESULTADO_GENERAL:
        setCuotaSeleccionada(2.1);
        setFormData(prev => ({ ...prev, prediccion: 'Local' }));
        break;
      case TipoApuesta.TOTAL_GOLES:
        setCuotaSeleccionada(1.8);
        setFormData(prev => ({ ...prev, prediccion: 'Más de 2.5' }));
        break;
      case TipoApuesta.AMBOS_EQUIPOS_ANOTAN:
        setCuotaSeleccionada(1.9);
        setFormData(prev => ({ ...prev, prediccion: 'Sí' }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMontoApuesta(formData.montoApostado)) {
      alert('El monto de apuesta no es válido');
      return;
    }

    const apuestaData: CrearApuestaRequestType = {
      ...formData,
      cuotaId: 1 // Por ahora usamos un ID fijo, en producción vendría del backend
    };

    const resultado = await createApuesta(apuestaData);
    
    if (resultado) {
      onApuestaCreada?.();
      onClose();
      // Resetear formulario
      setFormData({
        eventoId: eventoId || 0,
        cuotaId: 0,
        montoApostado: 0,
        tipoApuesta: TipoApuesta.RESULTADO_GENERAL,
        prediccion: '',
        descripcion: ''
      });
    }
  };

  const eventoSeleccionado = eventos.find(e => e.id === formData.eventoId);

  const opciones = {
    [TipoApuesta.RESULTADO_GENERAL]: [
      { label: 'Local', cuota: 2.1 },
      { label: 'Empate', cuota: 3.2 },
      { label: 'Visitante', cuota: 2.8 }
    ],
    [TipoApuesta.TOTAL_GOLES]: [
      { label: 'Más de 2.5', cuota: 1.8 },
      { label: 'Menos de 2.5', cuota: 2.0 }
    ],
    [TipoApuesta.AMBOS_EQUIPOS_ANOTAN]: [
      { label: 'Sí', cuota: 1.9 },
      { label: 'No', cuota: 1.8 }
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎯 Crear Nueva Apuesta
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Error */}
          {errorCrearApuesta && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorCrearApuesta}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Evento */}
            {!eventoId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Evento Deportivo
                </label>
                <select
                  name="eventoId"
                  value={formData.eventoId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={0}>Selecciona un evento</option>
                  {eventos.map(evento => (
                    <option key={evento.id} value={evento.id}>
                      {evento.equipoLocal} vs {evento.equipoVisitante} - {evento.deporte}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Información del Evento Seleccionado */}
            {eventoSeleccionado && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {eventoSeleccionado.equipoLocal} vs {eventoSeleccionado.equipoVisitante}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {eventoSeleccionado.deporte} • {eventoSeleccionado.liga}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(eventoSeleccionado.fechaEvento).toLocaleString()}
                </p>
              </div>
            )}

            {/* Tipo de Apuesta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Apuesta
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { tipo: TipoApuesta.RESULTADO_GENERAL, label: 'Resultado General', icon: '⚽' },
                  { tipo: TipoApuesta.TOTAL_GOLES, label: 'Total Goles', icon: '🥅' },
                  { tipo: TipoApuesta.AMBOS_EQUIPOS_ANOTAN, label: 'Ambos Equipos Anotan', icon: '⚽⚽' }
                ].map(({ tipo, label, icon }) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => handleTipoApuestaChange(tipo)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      formData.tipoApuesta === tipo
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg mb-1">{icon}</div>
                    <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Opciones de Predicción */}
            {formData.tipoApuesta && opciones[formData.tipoApuesta] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Predicción
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {opciones[formData.tipoApuesta].map((opcion) => (
                    <button
                      key={opcion.label}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, prediccion: opcion.label }));
                        setCuotaSeleccionada(opcion.cuota);
                      }}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        formData.prediccion === opcion.label
                          ? 'border-green-500 bg-green-50 dark:bg-green-900'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{opcion.label}</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Cuota: {opcion.cuota}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Monto a Apostar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto a Apostar
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="montoApostado"
                  value={formData.montoApostado}
                  onChange={handleInputChange}
                  min={limites?.minimo || 10}
                  max={limites?.maximo || 10000}
                  step="0.01"
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              {limites && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Límites: ${limites.minimo} - ${limites.maximo}
                </p>
              )}
            </div>

            {/* Descripción Opcional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Agrega una nota personal sobre esta apuesta..."
              />
            </div>

            {/* Resumen */}
            {formData.montoApostado > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resumen de la Apuesta</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Monto apostado:</span>
                    <span className="font-medium">${formData.montoApostado.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cuota:</span>
                    <span className="font-medium">{cuotaSeleccionada}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-green-600 dark:text-green-400">
                    <span>Ganancia potencial:</span>
                    <span>${gananciasPotenciales.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreandoApuesta || !formData.eventoId || !formData.prediccion || formData.montoApostado <= 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {isCreandoApuesta && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isCreandoApuesta ? 'Creando...' : 'Crear Apuesta'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearApuestaForm;
