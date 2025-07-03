import { useState } from 'react';
import {
    CogIcon,
    BellIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";

interface ConfigSection {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    settings: ConfigSetting[];
}

interface ConfigSetting {
    id: string;
    label: string;
    description: string;
    type: 'toggle' | 'input' | 'select' | 'number';
    value: string | number | boolean;
    options?: { value: string; label: string }[];
}

const AdminConfig = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState<ConfigSection[]>([
        {
            id: 'general',
            title: 'Configuración General',
            description: 'Configuraciones básicas del casino',
            icon: CogIcon,
            settings: [
                {
                    id: 'site_name',
                    label: 'Nombre del Casino',
                    description: 'Nombre que aparece en todo el sitio',
                    type: 'input',
                    value: 'Casino Online'
                },
                {
                    id: 'maintenance_mode',
                    label: 'Modo Mantenimiento',
                    description: 'Activar modo mantenimiento del sitio',
                    type: 'toggle',
                    value: false
                },
                {
                    id: 'registration_enabled',
                    label: 'Registro Habilitado',
                    description: 'Permitir nuevos registros de usuarios',
                    type: 'toggle',
                    value: true
                },
                {
                    id: 'default_language',
                    label: 'Idioma por Defecto',
                    description: 'Idioma predeterminado del sitio',
                    type: 'select',
                    value: 'es',
                    options: [
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' },
                        { value: 'pt', label: 'Português' }
                    ]
                }
            ]
        },
        {
            id: 'financial',
            title: 'Configuración Financiera',
            description: 'Configuraciones de pagos y límites',
            icon: CurrencyDollarIcon,
            settings: [
                {
                    id: 'min_deposit',
                    label: 'Depósito Mínimo',
                    description: 'Cantidad mínima para depósitos (USD)',
                    type: 'number',
                    value: 10
                },
                {
                    id: 'max_deposit',
                    label: 'Depósito Máximo',
                    description: 'Cantidad máxima para depósitos (USD)',
                    type: 'number',
                    value: 10000
                },
                {
                    id: 'min_withdrawal',
                    label: 'Retiro Mínimo',
                    description: 'Cantidad mínima para retiros (USD)',
                    type: 'number',
                    value: 20
                },
                {
                    id: 'crypto_conversion_fee',
                    label: 'Comisión Conversión Crypto',
                    description: 'Porcentaje de comisión para conversiones (%)',
                    type: 'number',
                    value: 2
                },
                {
                    id: 'auto_approve_withdrawals',
                    label: 'Auto-aprobar Retiros',
                    description: 'Aprobar automáticamente retiros menores a $500',
                    type: 'toggle',
                    value: false
                }
            ]
        },
        {
            id: 'security',
            title: 'Configuración de Seguridad',
            description: 'Configuraciones de seguridad y autenticación',
            icon: ShieldCheckIcon,
            settings: [
                {
                    id: 'two_factor_required',
                    label: '2FA Obligatorio',
                    description: 'Requiere autenticación de dos factores para todos los usuarios',
                    type: 'toggle',
                    value: false
                },
                {
                    id: 'password_min_length',
                    label: 'Longitud Mínima de Contraseña',
                    description: 'Número mínimo de caracteres para contraseñas',
                    type: 'number',
                    value: 8
                },
                {
                    id: 'session_timeout',
                    label: 'Tiempo de Sesión (minutos)',
                    description: 'Tiempo antes de cerrar sesión automáticamente',
                    type: 'number',
                    value: 60
                },
                {
                    id: 'max_login_attempts',
                    label: 'Intentos Máximos de Login',
                    description: 'Número máximo de intentos antes de bloquear cuenta',
                    type: 'number',
                    value: 5
                }
            ]
        },
        {
            id: 'notifications',
            title: 'Configuración de Notificaciones',
            description: 'Configuraciones de notificaciones del sistema',
            icon: BellIcon,
            settings: [
                {
                    id: 'email_notifications',
                    label: 'Notificaciones por Email',
                    description: 'Enviar notificaciones importantes por email',
                    type: 'toggle',
                    value: true
                },
                {
                    id: 'sms_notifications',
                    label: 'Notificaciones por SMS',
                    description: 'Enviar notificaciones por SMS',
                    type: 'toggle',
                    value: false
                },
                {
                    id: 'admin_alerts',
                    label: 'Alertas de Administrador',
                    description: 'Recibir alertas de actividad sospechosa',
                    type: 'toggle',
                    value: true
                }
            ]
        },
        {
            id: 'limits',
            title: 'Límites y Restricciones',
            description: 'Configurar límites de apuestas y juego responsable',
            icon: ChartBarIcon,
            settings: [
                {
                    id: 'max_bet_amount',
                    label: 'Apuesta Máxima',
                    description: 'Cantidad máxima por apuesta individual (USD)',
                    type: 'number',
                    value: 1000
                },
                {
                    id: 'daily_loss_limit',
                    label: 'Límite Diario de Pérdidas',
                    description: 'Límite máximo de pérdidas por día por usuario (USD)',
                    type: 'number',
                    value: 500
                },
                {
                    id: 'responsible_gaming',
                    label: 'Juego Responsable',
                    description: 'Activar características de juego responsable',
                    type: 'toggle',
                    value: true
                }
            ]
        }
    ]);

    const updateSetting = (sectionId: string, settingId: string, newValue: string | number | boolean) => {
        setSettings(prevSettings => 
            prevSettings.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        settings: section.settings.map(setting => 
                            setting.id === settingId ? { ...setting, value: newValue } : setting
                        )
                    };
                }
                return section;
            })
        );
    };

    const activeConfig = settings.find(section => section.id === activeSection);

    const renderSettingInput = (section: ConfigSection, setting: ConfigSetting) => {
        switch (setting.type) {
            case 'toggle':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={setting.value as boolean}
                            onChange={(e) => updateSetting(section.id, setting.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>
                );
            case 'input':
                return (
                    <input
                        type="text"
                        value={setting.value as string}
                        onChange={(e) => updateSetting(section.id, setting.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={setting.value as number}
                        onChange={(e) => updateSetting(section.id, setting.id, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                );
            case 'select':
                return (
                    <select
                        value={setting.value as string}
                        onChange={(e) => updateSetting(section.id, setting.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {setting.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>
                    <nav className="space-y-2">
                        {settings.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    {section.title}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {activeConfig && (
                    <div className="max-w-4xl">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <activeConfig.icon className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{activeConfig.title}</h1>
                                    <p className="text-gray-600 mt-1">{activeConfig.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="space-y-6">
                            {activeConfig.settings.map((setting) => (
                                <div key={setting.id} className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 mr-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {setting.label}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {setting.description}
                                            </p>
                                        </div>
                                        <div className="w-64">
                                            {renderSettingInput(activeConfig, setting)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 flex justify-end">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Guardar Configuración
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminConfig;
