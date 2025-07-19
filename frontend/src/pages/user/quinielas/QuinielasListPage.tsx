import React from 'react';
import { useHistory } from 'react-router-dom';
import { QuinielasList } from '../../../features/quinielas';
import { USER_ROUTES } from '../../../constants/ROUTERS';

const QuinielasListPage: React.FC = () => {
  const history = useHistory();

  const handleNavigateToQuinielas = () => {
    history.push(USER_ROUTES.QUINIELAS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Lista de Quinielas
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explora todas las quinielas disponibles
              </p>
            </div>
            <button
              onClick={handleNavigateToQuinielas}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Dashboard Completo
            </button>
          </div>
        </div>

        {/* Quinielas List Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <QuinielasList />
        </div>
      </div>
    </div>
  );
};

export default QuinielasListPage;
