import React from 'react';
import { CreateQuinielaForm } from '../../features/quinielas';
import { useHistory } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/ROUTERS';

const CrearQuinielaPage: React.FC = () => {
  const history = useHistory();

  const handleCancel = () => {
    // Volver a la página de quinielas
    history.push(USER_ROUTES.QUINIELAS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Volver a Quinielas
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crear Nueva Quiniela
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crea tu propia quiniela deportiva y invita a otros a participar
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <CreateQuinielaForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearQuinielaPage;
