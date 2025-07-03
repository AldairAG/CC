import React, { useState, useEffect } from 'react';
import { QuinielaEventsManager, EditQuinielaForm } from '../../features/quinielas';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import { useParams } from 'react-router-dom';

const GestionarQuinielaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const quinielaId = id ? parseInt(id, 10) : 0;
  
  const { user } = useUser();
  const { 
    quinielaActual,
    loadQuinielaDetail,
    loading,
    errors
  } = useQuiniela();
  
  const [activeTab, setActiveTab] = useState<'info' | 'eventos' | 'editar'>('info');

  useEffect(() => {
    if (quinielaId > 0) {
      loadQuinielaDetail(quinielaId);
    }
  }, [quinielaId, loadQuinielaDetail]);

  const canManageQuiniela = quinielaActual?.creadorId === user?.idUsuario;

  if (loading.quinielaActual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando quiniela...</p>
        </div>
      </div>
    );
  }

  if (errors.quinielaActual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error al cargar quiniela
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {errors.quinielaActual}
          </p>
        </div>
      </div>
    );
  }

  if (!quinielaActual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiniela no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            La quiniela solicitada no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

  if (!canManageQuiniela) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            No tienes permisos para gestionar esta quiniela.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'info' as const, label: 'Información', icon: '📋' },
    { id: 'eventos' as const, label: 'Eventos', icon: '⚽' },
    { id: 'editar' as const, label: 'Editar', icon: '✏️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Volver
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {quinielaActual.nombre}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestionar quiniela
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              quinielaActual.estado === 'ACTIVA' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : quinielaActual.estado === 'BORRADOR'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {quinielaActual.estado}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {quinielaActual.participantesActuales}/{quinielaActual.maxParticipantes} participantes
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              ${quinielaActual.poolActual.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Información de la Quiniela
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descripción</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {quinielaActual.descripcion}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Detalles</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                        <span className="text-gray-900 dark:text-white">{quinielaActual.tipoQuiniela}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Costo:</span>
                        <span className="text-gray-900 dark:text-white">${quinielaActual.costoParticipacion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Premio mínimo:</span>
                        <span className="text-gray-900 dark:text-white">${quinielaActual.premioMinimo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fecha cierre:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(quinielaActual.fechaCierre).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eventos' && (
            <div className="space-y-6">
              <QuinielaEventsManager quinielaId={quinielaId} />
            </div>
          )}

          {activeTab === 'editar' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Editar Quiniela
                </h2>
                <EditQuinielaForm quinielaId={quinielaActual.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionarQuinielaPage;
