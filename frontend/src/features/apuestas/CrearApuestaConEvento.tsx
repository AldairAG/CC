import React, { useState } from 'react';
import { useApuestas } from '../../../hooks/useApuestasConEventos';

export const CrearApuestaConEvento: React.FC = () => {
  const [formData, setFormData] = useState({
    equipoLocal: '',
    equipoVisitante: '',
    tipoApuesta: 'GANADOR',
    montoApuesta: '',
    cuotaApuesta: '',
    prediccionUsuario: '',
    detalleApuesta: '',
    idEventoExterno: '', // ID de TheSportsDB
    fechaEvento: ''
  });

  const {
    crearApuestaConEvento,
    loading,
    error,
    apuesta,
    calcularGanancia
  } = useApuestas();

  const [gananciaPotencial, setGananciaPotencial] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calcular ganancia potencial automáticamente
    if (name === 'montoApuesta' || name === 'cuotaApuesta') {
      const monto = name === 'montoApuesta' ? parseFloat(value) : parseFloat(formData.montoApuesta);
      const cuota = name === 'cuotaApuesta' ? parseFloat(value) : parseFloat(formData.cuotaApuesta);
      
      if (monto && cuota) {
        calcularGanancia(monto, cuota).then(ganancia => {
          setGananciaPotencial(ganancia);
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipoLocal || !formData.equipoVisitante) {
      alert('Por favor ingresa ambos equipos');
      return;
    }

    const resultado = await crearApuestaConEvento(
      formData.equipoLocal,
      formData.equipoVisitante,
      formData.tipoApuesta,
      parseFloat(formData.montoApuesta),
      parseFloat(formData.cuotaApuesta),
      formData.prediccionUsuario,
      formData.detalleApuesta || undefined,
      formData.idEventoExterno || undefined,
      formData.fechaEvento || undefined
    );

    if (resultado) {
      alert('¡Apuesta creada exitosamente!');
      // Limpiar formulario
      setFormData({
        equipoLocal: '',
        equipoVisitante: '',
        tipoApuesta: 'GANADOR',
        montoApuesta: '',
        cuotaApuesta: '',
        prediccionUsuario: '',
        detalleApuesta: '',
        idEventoExterno: '',
        fechaEvento: ''
      });
      setGananciaPotencial(0);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Crear Apuesta con Evento Automático</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Si el evento no existe, se creará automáticamente usando TheSportsDB o información básica.
      </p>

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

      {apuesta && (
        <div style={{ 
          backgroundColor: '#efe', 
          padding: '15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          color: '#060'
        }}>
          <h4>¡Apuesta creada exitosamente!</h4>
          <p><strong>ID:</strong> {apuesta.idApuesta}</p>
          <p><strong>Partido:</strong> {apuesta.equipoLocal} vs {apuesta.equipoVisitante}</p>
          <p><strong>Monto:</strong> ${apuesta.montoApuesta}</p>
          <p><strong>Ganancia Potencial:</strong> ${apuesta.gananciaPotencial}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Información del evento */}
        <fieldset style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          <legend>Información del Evento</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              name="equipoLocal"
              placeholder="Equipo Local"
              value={formData.equipoLocal}
              onChange={handleInputChange}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="equipoVisitante"
              placeholder="Equipo Visitante"
              value={formData.equipoVisitante}
              onChange={handleInputChange}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <input
              type="text"
              name="idEventoExterno"
              placeholder="ID TheSportsDB (opcional)"
              value={formData.idEventoExterno}
              onChange={handleInputChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="date"
              name="fechaEvento"
              placeholder="Fecha del evento"
              value={formData.fechaEvento}
              onChange={handleInputChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </fieldset>

        {/* Información de la apuesta */}
        <fieldset style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          <legend>Información de la Apuesta</legend>
          
          <select
            name="tipoApuesta"
            value={formData.tipoApuesta}
            onChange={handleInputChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' }}
          >
            <option value="GANADOR">Ganador del Partido</option>
            <option value="EMPATE">Empate</option>
            <option value="OVER_UNDER">Over/Under Goles</option>
            <option value="HANDICAP">Hándicap</option>
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="number"
              name="montoApuesta"
              placeholder="Monto a apostar"
              value={formData.montoApuesta}
              onChange={handleInputChange}
              min="1"
              max="10000"
              step="0.01"
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              name="cuotaApuesta"
              placeholder="Cuota"
              value={formData.cuotaApuesta}
              onChange={handleInputChange}
              min="1.01"
              max="1000"
              step="0.01"
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {gananciaPotencial > 0 && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '10px', 
              borderRadius: '4px', 
              marginTop: '10px',
              textAlign: 'center'
            }}>
              <strong>Ganancia Potencial: ${gananciaPotencial.toFixed(2)}</strong>
            </div>
          )}

          <textarea
            name="prediccionUsuario"
            placeholder="Tu predicción (obligatorio)"
            value={formData.prediccionUsuario}
            onChange={handleInputChange}
            required
            maxLength={500}
            rows={3}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc', 
              width: '100%', 
              marginTop: '10px',
              resize: 'vertical'
            }}
          />

          <textarea
            name="detalleApuesta"
            placeholder="Detalles adicionales (opcional)"
            value={formData.detalleApuesta}
            onChange={handleInputChange}
            maxLength={1000}
            rows={2}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc', 
              width: '100%', 
              marginTop: '10px',
              resize: 'vertical'
            }}
          />
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? 'Creando Apuesta...' : 'Crear Apuesta'}
        </button>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Instrucciones:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>ID TheSportsDB:</strong> Si conoces el ID del evento en TheSportsDB, ingrésalo para obtener información completa.</li>
          <li><strong>Sin ID:</strong> Solo ingresa los nombres de los equipos y el sistema buscará el evento automáticamente.</li>
          <li><strong>Evento nuevo:</strong> Si no existe, se creará uno básico con la información proporcionada.</li>
          <li><strong>Fecha:</strong> Si no especificas fecha, se usará mañana por defecto.</li>
        </ul>
      </div>
    </div>
  );
};
