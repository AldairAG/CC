import React, { useState } from 'react';
import { useEventos } from '../../hooks/useEventos';
import type { EventoResponse } from '../../service/api/eventosAPI';

interface EventoSearchProps {
  onEventoEncontrado?: (evento: EventoResponse) => void;
}

export const EventoSearch: React.FC<EventoSearchProps> = ({ onEventoEncontrado }) => {
  const [equipoLocal, setEquipoLocal] = useState('');
  const [equipoVisitante, setEquipoVisitante] = useState('');
  const [fechaSincronizacion, setFechaSincronizacion] = useState('');
  const [eventoBuscado, setEventoBuscado] = useState<EventoResponse | null>(null);

  const {
    eventos,
    loading,
    error,
    buscarOCrearEvento,
    sincronizarEventos,
    obtenerEventosPorFecha,
    setError
  } = useEventos();

  const handleBuscarEvento = async () => {
    if (!equipoLocal.trim() || !equipoVisitante.trim()) {
      setError('Por favor ingresa ambos equipos');
      return;
    }

    const evento = await buscarOCrearEvento(equipoLocal.trim(), equipoVisitante.trim());
    if (evento) {
      setEventoBuscado(evento);
      onEventoEncontrado?.(evento);
    }
  };

  const handleSincronizar = async () => {
    if (!fechaSincronizacion) {
      setError('Por favor selecciona una fecha');
      return;
    }

    const resultado = await sincronizarEventos(fechaSincronizacion);
    if (resultado) {
      alert(`Sincronización completada: ${resultado.eventosNuevos} eventos nuevos`);
    }
  };

  const handleBuscarPorFecha = async () => {
    if (!fechaSincronizacion) {
      setError('Por favor selecciona una fecha');
      return;
    }

    await obtenerEventosPorFecha(fechaSincronizacion);
  };

  return (
    <div className="evento-search-container" style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>Búsqueda de Eventos</h2>

      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          color: '#c00'
        }}>
          {error}
        </div>
      )}

      {/* Búsqueda por equipos */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Buscar Evento por Equipos</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Equipo Local"
            value={equipoLocal}
            onChange={(e) => setEquipoLocal(e.target.value)}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              minWidth: '200px'
            }}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Equipo Visitante"
            value={equipoVisitante}
            onChange={(e) => setEquipoVisitante(e.target.value)}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              minWidth: '200px'
            }}
            disabled={loading}
          />
          <button
            onClick={handleBuscarEvento}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Buscando...' : 'Buscar Evento'}
          </button>
        </div>

        {eventoBuscado && (
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
            <h4>Evento Encontrado:</h4>
            <p><strong>Nombre:</strong> {eventoBuscado.nombreEvento || `${eventoBuscado.equipoLocal} vs ${eventoBuscado.equipoVisitante}`}</p>
            <p><strong>Equipos:</strong> {eventoBuscado.equipoLocal} vs {eventoBuscado.equipoVisitante}</p>
            <p><strong>Fecha:</strong> {eventoBuscado.fechaPartido}</p>
            {eventoBuscado.liga && <p><strong>Liga:</strong> {eventoBuscado.liga}</p>}
            {eventoBuscado.estadio && <p><strong>Estadio:</strong> {eventoBuscado.estadio}</p>}
            <p><strong>Estado:</strong> {eventoBuscado.estado || 'PROGRAMADO'}</p>
          </div>
        )}
      </div>

      {/* Sincronización por fecha */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Sincronizar Eventos por Fecha</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={fechaSincronizacion}
            onChange={(e) => setFechaSincronizacion(e.target.value)}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc'
            }}
            disabled={loading}
          />
          <button
            onClick={handleSincronizar}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Sincronizando...' : 'Sincronizar'}
          </button>
          <button
            onClick={handleBuscarPorFecha}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Buscando...' : 'Ver Eventos'}
          </button>
        </div>
      </div>

      {/* Lista de eventos */}
      {eventos.length > 0 && (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Eventos ({eventos.length})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {eventos.map((evento) => (
              <div 
                key={evento.idEvento} 
                style={{ 
                  padding: '10px', 
                  marginBottom: '10px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px' 
                }}
              >
                <strong>{evento.equipoLocal} vs {evento.equipoVisitante}</strong>
                <br />
                <small>
                  Fecha: {evento.fechaPartido} | 
                  Liga: {evento.liga || 'N/A'} | 
                  Estado: {evento.estado || 'PROGRAMADO'}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
