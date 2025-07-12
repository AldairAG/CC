import React, { useState } from 'react';
import { 
  QuinielasList, 
  AdvancedQuinielaSearch, 
  CreateQuinielaForm,
  QuinielasDashboard 
} from '../../features/quinielas';

const QuinielasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'search' | 'create'>('dashboard');

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: '📊' },
    { id: 'list' as const, label: 'Explorar', icon: '🔍' },
    { id: 'search' as const, label: 'Búsqueda Avanzada', icon: '🎯' },
    { id: 'create' as const, label: 'Crear Quiniela', icon: '➕' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quinielas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Participa en quinielas deportivas y demuestra tus conocimientos
          </p>
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <QuinielasDashboard />
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-6">
              <QuinielasList />
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <AdvancedQuinielaSearch />
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Crear Nueva Quiniela
                </h2>
                <CreateQuinielaForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuinielasPage;
