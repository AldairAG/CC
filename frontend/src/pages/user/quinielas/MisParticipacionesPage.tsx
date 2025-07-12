import React, { useState, useEffect } from 'react';
import { UserParticipationsList, PrediccionesForm } from '../../features/quinielas';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import { EstadoParticipacion } from '../../types/QuinielaType';
import type { QuinielaParticipacionType } from '../../types/QuinielaType';

const MisParticipacionesPage: React.FC = () => {
  const { user } = useUser();
  const { 
    participacionesUsuario, 
    loadParticipacionesUsuario, 
  } = useQuiniela();
  
  const [selectedParticipacion, setSelectedParticipacion] = useState<QuinielaParticipacionType | null>(null);
  const [showPredicciones, setShowPredicciones] = useState(false);

  useEffect(() => {
    if (user?.idUsuario) {
      loadParticipacionesUsuario(user.idUsuario);
    }
  }, [user?.idUsuario]);

  const handleMakePredicciones = (participacionId: number) => {
    const participacion = participacionesUsuario.find(p => p.id === participacionId);
    if (participacion) {
      setSelectedParticipacion(participacion);
      setShowPredicciones(true);
    }
  };

  const handleClosePredicciones = () => {
    setSelectedParticipacion(null);
    setShowPredicciones(false);
  };

  const handlePrediccionSuccess = () => {
    handleClosePredicciones();
    // Reload participaciones to update state
    if (user?.idUsuario) {
      loadParticipacionesUsuario(user.idUsuario);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Participaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus participaciones activas y haz tus predicciones
          </p>
        </div>

        {/* Estadísticas rápidas */}
        {participacionesUsuario.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Participaciones
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {participacionesUsuario.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Activas
                  </h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {participacionesUsuario.filter(p => p.estado === EstadoParticipacion.ACTIVA).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pendientes
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {participacionesUsuario.filter(p => p.estado === EstadoParticipacion.ACTIVA).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de participaciones */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <UserParticipationsList 
            onMakePredicciones={handleMakePredicciones}
          />
        </div>

        {/* Modal para hacer predicciones */}
        {showPredicciones && selectedParticipacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Hacer Predicciones
                  </h2>
                  <button
                    onClick={handleClosePredicciones}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Quiniela ID: {selectedParticipacion.quinielaId}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Participación activa - Haz tus predicciones
                  </p>
                </div>

                <PrediccionesForm
                  participacionId={selectedParticipacion.id}
                  quinielaId={selectedParticipacion.quinielaId}
                  onSuccess={handlePrediccionSuccess}
                  onCancel={handleClosePredicciones}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisParticipacionesPage;
