import { useState } from 'react';
import {
    CogIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    BellIcon,
    CurrencyDollarIcon,
    UserIcon,
    DocumentTextIcon,
    ServerIcon
} from '@heroicons/react/24/outline';

interface ConfigSection {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    settings: ConfigSetting[];
}

interface ConfigSetting {
    key: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
    value: string | number | boolean;
    options?: string[];
    description?: string;
}

const AdminConfig = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState<Record<string, ConfigSetting[]>>({
        general: [
            {
                key: 'siteName',
                label: 'Nombre del Sitio',
                type: 'text',
                value: 'Casino & Quinielas',
                description: 'Nombre que aparece en la aplicación'
            },
            {
                key: 'siteDescription',
                label: 'Descripción',
                type: 'textarea',
                value: 'Plataforma de casino online y quinielas deportivas',
                description: 'Descripción del sitio para SEO'
            },
            {
                key: 'maintenanceMode',
                label: 'Modo Mantenimiento',
                type: 'boolean',
                value: false,
                description: 'Activar para bloquear acceso a usuarios'
            },
            {
                key: 'registrationEnabled',
                label: 'Registro Habilitado',
                type: 'boolean',
                value: true,
                description: 'Permitir nuevos registros de usuarios'
            }
        ],
        security: [
            {
                key: 'maxLoginAttempts',
                label: 'Intentos Máximos de Login',
                type: 'number',
                value: 5,
                description: 'Intentos fallidos antes de bloquear cuenta'
            },
            {
                key: 'sessionTimeout',
                label: 'Timeout de Sesión (minutos)',
                type: 'number',
                value: 60,
                description: 'Tiempo antes de cerrar sesión automáticamente'
            },
            {
                key: 'requireEmailVerification',
                label: 'Verificación de Email Requerida',
                type: 'boolean',
                value: true,
                description: 'Usuarios deben verificar email para activar cuenta'
            },
            {
                key: 'twoFactorAuth',
                label: 'Autenticación de Dos Factores',
                type: 'boolean',
                value: false,
                description: 'Habilitar 2FA para cuentas'
            }
        ],
        payments: [
            {
                key: 'minDeposit',
                label: 'Depósito Mínimo',
                type: 'number',
                value: 10,
                description: 'Cantidad mínima para depósitos'
            },
            {
                key: 'maxDeposit',
                label: 'Depósito Máximo',
                type: 'number',
                value: 10000,
                description: 'Cantidad máxima para depósitos'
            },
            {
                key: 'minWithdrawal',
                label: 'Retiro Mínimo',
                type: 'number',
                value: 20,
                description: 'Cantidad mínima para retiros'
            },
            {
                key: 'withdrawalFee',
                label: 'Comisión de Retiro (%)',
                type: 'number',
                value: 2.5,
                description: 'Porcentaje de comisión en retiros'
            },
            {
                key: 'currency',
                label: 'Moneda Principal',
                type: 'select',
                value: 'USD',
                options: ['USD', 'EUR', 'MXN', 'COP'],
                description: 'Moneda principal del sistema'
            }
        ],
        notifications: [
            {
                key: 'emailNotifications',
                label: 'Notificaciones por Email',
                type: 'boolean',
                value: true,
                description: 'Enviar notificaciones por correo electrónico'
            },
            {
                key: 'pushNotifications',
                label: 'Notificaciones Push',
                type: 'boolean',
                value: true,
                description: 'Enviar notificaciones push'
            },
            {
                key: 'smsNotifications',
                label: 'Notificaciones SMS',
                type: 'boolean',
                value: false,
                description: 'Enviar notificaciones por SMS'
            },
            {
                key: 'notificationRetention',
                label: 'Retención de Notificaciones (días)',
                type: 'number',
                value: 30,
                description: 'Días antes de eliminar notificaciones antiguas'
            }
        ],
        games: [
            {
                key: 'quinielasEnabled',
                label: 'Quinielas Habilitadas',
                type: 'boolean',
                value: true,
                description: 'Permitir creación y participación en quinielas'
            },
            {
                key: 'maxQuinielasPerUser',
                label: 'Máximo Quinielas por Usuario',
                type: 'number',
                value: 10,
                description: 'Número máximo de quinielas que puede crear un usuario'
            },
            {
                key: 'minBetAmount',
                label: 'Apuesta Mínima',
                type: 'number',
                value: 5,
                description: 'Cantidad mínima para apostar'
            },
            {
                key: 'maxBetAmount',
                label: 'Apuesta Máxima',
                type: 'number',
                value: 1000,
                description: 'Cantidad máxima para apostar'
            },
            {
                key: 'houseEdge',
                label: 'Ventaja de la Casa (%)',
                type: 'number',
                value: 5,
                description: 'Porcentaje de ventaja de la casa'
            }
        ],
        system: [
            {
                key: 'debugMode',
                label: 'Modo Debug',
                type: 'boolean',
                value: false,
                description: 'Habilitar logs detallados'
            },
            {
                key: 'apiRateLimit',
                label: 'Límite de API (req/min)',
                type: 'number',
                value: 100,
                description: 'Requests por minuto por usuario'
            },
            {
                key: 'backupFrequency',
                label: 'Frecuencia de Backup',
                type: 'select',
                value: 'daily',
                options: ['hourly', 'daily', 'weekly'],
                description: 'Frecuencia de respaldos automáticos'
            },
            {
                key: 'logRetention',
                label: 'Retención de Logs (días)',
                type: 'number',
                value: 90,
                description: 'Días antes de eliminar logs antiguos'
            }
        ]
    });

    const sections: ConfigSection[] = [
        {
            id: 'general',
            title: 'General',
            description: 'Configuración general del sistema',
            icon: GlobeAltIcon,
            settings: settings.general
        },
        {
            id: 'security',
            title: 'Seguridad',
            description: 'Configuración de seguridad y autenticación',
            icon: ShieldCheckIcon,
            settings: settings.security
        },
        {
            id: 'payments',
            title: 'Pagos',
            description: 'Configuración de depósitos y retiros',
            icon: CurrencyDollarIcon,
            settings: settings.payments
        },
        {
            id: 'notifications',
            title: 'Notificaciones',
            description: 'Configuración del sistema de notificaciones',
            icon: BellIcon,
            settings: settings.notifications
        },
        {
            id: 'games',
            title: 'Juegos',
            description: 'Configuración de quinielas y apuestas',
            icon: UserIcon,
            settings: settings.games
        },
        {
            id: 'system',
            title: 'Sistema',
            description: 'Configuración técnica del sistema',
            icon: ServerIcon,
            settings: settings.system
        }
    ];

    const handleSettingChange = (sectionId: string, settingKey: string, value: string | number | boolean) => {
        setSettings(prev => ({
            ...prev,
            [sectionId]: prev[sectionId].map(setting =>
                setting.key === settingKey ? { ...setting, value } : setting
            )
        }));
    };

    const handleSave = async () => {
        try {
            // Aquí iría la lógica para guardar en el backend
            console.log('Guardando configuración:', settings);
            alert('Configuración guardada exitosamente');
        } catch (error) {
            console.error('Error guardando configuración:', error);
            alert('Error al guardar la configuración');
        }
    };

    const activeSection_data = sections.find(s => s.id === activeSection);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            <CogIcon className="inline h-8 w-8 mr-2" />
                            Configuración del Sistema
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Administra la configuración global del casino
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Secciones</h3>
                        <nav className="space-y-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 ${
                                        activeSection === section.id
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <section.icon className="h-5 w-5" />
                                    <div>
                                        <div className="font-medium">{section.title}</div>
                                        <div className="text-xs text-gray-500">{section.description}</div>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white shadow rounded-lg p-6">
                        {activeSection_data && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <activeSection_data.icon className="h-6 w-6 mr-2" />
                                        {activeSection_data.title}
                                    </h2>
                                    <p className="text-gray-600 mt-1">{activeSection_data.description}</p>
                                </div>

                                <div className="space-y-6">
                                    {activeSection_data.settings.map((setting) => (
                                        <div key={setting.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {setting.label}
                                                </label>
                                                {setting.description && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {setting.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                {setting.type === 'text' && (
                                                    <input
                                                        type="text"
                                                        value={setting.value as string}
                                                        onChange={(e) => handleSettingChange(activeSection, setting.key, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                )}
                                                
                                                {setting.type === 'number' && (
                                                    <input
                                                        type="number"
                                                        value={setting.value as number}
                                                        onChange={(e) => handleSettingChange(activeSection, setting.key, Number(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                )}
                                                
                                                {setting.type === 'boolean' && (
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={setting.value as boolean}
                                                            onChange={(e) => handleSettingChange(activeSection, setting.key, e.target.checked)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            {setting.value ? 'Habilitado' : 'Deshabilitado'}
                                                        </span>
                                                    </label>
                                                )}
                                                
                                                {setting.type === 'select' && (
                                                    <select
                                                        value={setting.value as string}
                                                        onChange={(e) => handleSettingChange(activeSection, setting.key, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {setting.options?.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                
                                                {setting.type === 'textarea' && (
                                                    <textarea
                                                        value={setting.value as string}
                                                        onChange={(e) => handleSettingChange(activeSection, setting.key, e.target.value)}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-900">Información Importante</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Los cambios se aplicarán inmediatamente al guardar</li>
                                <li>Algunas configuraciones pueden requerir reinicio del servidor</li>
                                <li>Se recomienda hacer backup antes de cambios críticos</li>
                                <li>Los logs de configuración se mantienen por 30 días</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminConfig;
