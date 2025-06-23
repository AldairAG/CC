import React, { useState } from 'react';
import { useTheSportsDb } from '../../hooks/useTheSportsDb';
import type { Evento } from '../../types/EventType';
import './TheSportsDbExplorer.css';

const TheSportsDbExplorer: React.FC = () => {
  const {
    loading,
    error,
    buscarEventoPorEquipos,
    buscarEventosPorFecha,
    buscarEventoPorId,
    testConectividad,
    obtenerInformacion,
    clearError
  } = useTheSportsDb();

  // Estados para formularios
  const [equipoLocal, setEquipoLocal] = useState('');
  const [equipoVisitante, setEquipoVisitante] = useState('');
  const [fecha, setFecha] = useState('');
  const [idExterno, setIdExterno] = useState('');

  // Estados para resultados
  const [eventoPorEquipos, setEventoPorEquipos] = useState<Evento | null>(null);
  const [eventosPorFecha, setEventosPorFecha] = useState<Evento[]>([]);
  const [eventoPorId, setEventoPorId] = useState<Evento | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [apiInfo, setApiInfo] = useState<any>(null);

  const handleBuscarPorEquipos = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!equipoLocal.trim() || !equipoVisitante.trim()) {
      alert('Por favor, ingresa ambos equipos');
      return;
    }
    
    const resultado = await buscarEventoPorEquipos(equipoLocal.trim(), equipoVisitante.trim());
    setEventoPorEquipos(resultado);
  };

  const handleBuscarPorFecha = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!fecha) {
      alert('Por favor, selecciona una fecha');
      return;
    }
    
    const resultados = await buscarEventosPorFecha(fecha);
    setEventosPorFecha(resultados);
  };

  const handleBuscarPorId = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!idExterno.trim()) {
      alert('Por favor, ingresa un ID de evento');
      return;
    }
    
    const resultado = await buscarEventoPorId(idExterno.trim());
    setEventoPorId(resultado);
  };

  const handleTestConectividad = async () => {
    clearError();
    const resultado = await testConectividad();
    setTestResult(resultado);
  };

  const handleObtenerInfo = async () => {
    clearError();
    const info = await obtenerInformacion();
    setApiInfo(info);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  return (
    <div className="thesportsdb-explorer">
      <div className="explorer-header">
        <h2>🏆 TheSportsDB Explorer</h2>
        <p>Busca eventos deportivos desde TheSportsDB API</p>
      </div>

      {/* Botones de prueba */}
      <div className="test-section">
        <button 
          onClick={handleTestConectividad}
          disabled={loading}
          className="test-btn"
        >
          🔍 Test Conectividad
        </button>
        
        <button 
          onClick={handleObtenerInfo}
          disabled={loading}
          className="info-btn"
        >
          ℹ️ Info API
        </button>
      </div>

      {/* Búsqueda por equipos */}
      <div className="search-section">
        <h3>🥅 Buscar por Equipos</h3>
        <form onSubmit={handleBuscarPorEquipos} className="search-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Equipo Local (ej: Real Madrid)"
              value={equipoLocal}
              onChange={(e) => setEquipoLocal(e.target.value)}
              className="form-input"
            />
            <span className="vs-separator">VS</span>
            <input
              type="text"
              placeholder="Equipo Visitante (ej: Barcelona)"
              value={equipoVisitante}
              onChange={(e) => setEquipoVisitante(e.target.value)}
              className="form-input"
            />
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? '🔄' : '🔍'} Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Búsqueda por fecha */}
      <div className="search-section">
        <h3>📅 Buscar por Fecha</h3>
        <form onSubmit={handleBuscarPorFecha} className="search-form">
          <div className="form-row">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="form-input"
            />
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? '🔄' : '🔍'} Buscar Eventos
            </button>
          </div>
        </form>
      </div>

      {/* Búsqueda por ID */}
      <div className="search-section">
        <h3>🔢 Buscar por ID Externo</h3>
        <form onSubmit={handleBuscarPorId} className="search-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="ID del evento externo"
              value={idExterno}
              onChange={(e) => setIdExterno(e.target.value)}
              className="form-input"
            />
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? '🔄' : '🔍'} Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="error-message">
          ❌ Error: {error}
          <button onClick={clearError} className="close-btn">×</button>
        </div>
      )}

      {/* Resultados */}
      <div className="results-section">
        {/* Test de conectividad */}
        {testResult && (
          <div className="result-card">
            <h4>🔍 Test de Conectividad</h4>
            <div className="result-content">
              <p><strong>Estado:</strong> <span className={testResult.status === 'OK' ? 'status-ok' : 'status-error'}>{testResult.status}</span></p>
              <p><strong>Mensaje:</strong> {testResult.message}</p>
              {testResult.eventosEncontrados !== undefined && (
                <p><strong>Eventos encontrados:</strong> {testResult.eventosEncontrados}</p>
              )}
              <p><strong>Timestamp:</strong> {new Date(testResult.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Info de la API */}
        {apiInfo && (
          <div className="result-card">
            <h4>ℹ️ Información de la API</h4>
            <div className="result-content">
              <p><strong>Nombre:</strong> {apiInfo.apiName}</p>
              <p><strong>Versión:</strong> {apiInfo.version}</p>
              <p><strong>Descripción:</strong> {apiInfo.description}</p>
              <p><strong>Base URL:</strong> {apiInfo.baseUrl}</p>
              <details>
                <summary><strong>Endpoints disponibles</strong></summary>
                <ul>
                  {apiInfo.endpoints?.map((endpoint: string, index: number) => (
                    <li key={index}><code>{endpoint}</code></li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        )}

        {/* Evento por equipos */}
        {eventoPorEquipos && (
          <div className="result-card">
            <h4>🥅 Evento Encontrado por Equipos</h4>
            <div className="event-card">
              <div className="event-header">
                <h5>{eventoPorEquipos.equipoLocal} vs {eventoPorEquipos.equipoVisitante}</h5>
                <span className="event-status">{eventoPorEquipos.estadoEvento}</span>
              </div>
              <div className="event-details">
                <p><strong>Fecha:</strong> {formatDate(eventoPorEquipos.fechaPartido)}</p>
                <p><strong>Deporte:</strong> {eventoPorEquipos.deporte}</p>
                {eventoPorEquipos.liga && <p><strong>Liga:</strong> {eventoPorEquipos.liga}</p>}
                {eventoPorEquipos.estadio && <p><strong>Estadio:</strong> {eventoPorEquipos.estadio}</p>}
                {eventoPorEquipos.eventoExternoId && <p><strong>ID Externo:</strong> {eventoPorEquipos.eventoExternoId}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Eventos por fecha */}
        {eventosPorFecha.length > 0 && (
          <div className="result-card">
            <h4>📅 Eventos por Fecha ({eventosPorFecha.length})</h4>
            <div className="events-grid">
              {eventosPorFecha.map((evento, index) => (
                <div key={index} className="event-card">
                  <div className="event-header">
                    <h5>{evento.equipoLocal} vs {evento.equipoVisitante}</h5>
                    <span className="event-status">{evento.estadoEvento}</span>
                  </div>
                  <div className="event-details">
                    <p><strong>Deporte:</strong> {evento.deporte}</p>
                    {evento.liga && <p><strong>Liga:</strong> {evento.liga}</p>}
                    {evento.estadio && <p><strong>Estadio:</strong> {evento.estadio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evento por ID */}
        {eventoPorId && (
          <div className="result-card">
            <h4>🔢 Evento por ID Externo</h4>
            <div className="event-card">
              <div className="event-header">
                <h5>{eventoPorId.equipoLocal} vs {eventoPorId.equipoVisitante}</h5>
                <span className="event-status">{eventoPorId.estadoEvento}</span>
              </div>
              <div className="event-details">
                <p><strong>Fecha:</strong> {formatDate(eventoPorId.fechaPartido)}</p>
                <p><strong>Deporte:</strong> {eventoPorId.deporte}</p>
                {eventoPorId.liga && <p><strong>Liga:</strong> {eventoPorId.liga}</p>}
                {eventoPorId.estadio && <p><strong>Estadio:</strong> {eventoPorId.estadio}</p>}
                <p><strong>ID Externo:</strong> {eventoPorId.eventoExternoId}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {!loading && !error && (
        (!eventoPorEquipos && eventosPorFecha.length === 0 && !eventoPorId && !testResult && !apiInfo) && (
          <div className="no-results">
            <p>🔍 Usa los formularios de arriba para buscar eventos deportivos</p>
          </div>
        )
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Buscando eventos...</p>
        </div>
      )}
    </div>
  );
};

export default TheSportsDbExplorer;
