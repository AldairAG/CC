import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { QuinielaDetail } from '../../../features/quinielas';
import { USER_ROUTES } from '../../../constants/ROUTERS';

const QuinielaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const quinielaId = id ? parseInt(id, 10) : 0;

  const handleBack = () => {
    history.push(USER_ROUTES.QUINIELAS);
  };

  if (!quinielaId || quinielaId <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiniela no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            El ID de la quiniela no es válido.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Quinielas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Volver a Quinielas
            </button>
          </div>
        </div>

        {/* Quiniela Detail Component */}
        <QuinielaDetail />
      </div>
    </div>
  );
};

export default QuinielaDetailPage;
