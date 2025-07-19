import { useState } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import type { CambiarPasswordRequest } from '../../types/PerfilTypes';

const ChangePassword = () => {
    const { changePassword, loading } = useUserProfile();
    const [formData, setFormData] = useState<CambiarPasswordRequest>({
        passwordActual: '',
        nuevaPassword: '',
        confirmarPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePasswords = () => {
        if (formData.nuevaPassword.length < 8) {
            return 'La nueva contraseña debe tener al menos 8 caracteres';
        }
        if (formData.nuevaPassword !== formData.confirmarPassword) {
            return 'Las contraseñas no coinciden';
        }
        if (formData.confirmarPassword === formData.nuevaPassword) {
            return 'La nueva contraseña debe ser diferente a la actual';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const validationError = validatePasswords();
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        const result = await changePassword(formData);
        
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setFormData({
                passwordActual: '',
                nuevaPassword: '',
                confirmarPassword: ''
            });
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getStrengthColor = (strength: number) => {
        switch (strength) {
            case 0:
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-blue-500';
            case 5: return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getStrengthText = (strength: number) => {
        switch (strength) {
            case 0:
            case 1: return 'Muy débil';
            case 2: return 'Débil';
            case 3: return 'Regular';
            case 4: return 'Fuerte';
            case 5: return 'Muy fuerte';
            default: return '';
        }
    };

    const passwordStrength = getPasswordStrength(formData.nuevaPassword);

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cambiar Contraseña</h2>
                <p className="text-gray-600">Actualiza tu contraseña para mantener tu cuenta segura</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                    message.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="passwordActual" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.current ? 'text' : 'password'}
                            id="passwordActual"
                            name="passwordActual"
                            value={formData.passwordActual}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.current ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="nuevaPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            id="nuevaPassword"
                            name="nuevaPassword"
                            value={formData.nuevaPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.new ? '🙈' : '👁️'}
                        </button>
                    </div>
                    
                    {formData.nuevaPassword && (
                        <div className="mt-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {getStrengthText(passwordStrength)}
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                <p>La contraseña debe contener:</p>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li className={formData.nuevaPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                                        Al menos 8 caracteres
                                    </li>
                                    <li className={/[a-z]/.test(formData.nuevaPassword) ? 'text-green-600' : 'text-gray-500'}>
                                        Letras minúsculas
                                    </li>
                                    <li className={/[A-Z]/.test(formData.nuevaPassword) ? 'text-green-600' : 'text-gray-500'}>
                                        Letras mayúsculas
                                    </li>
                                    <li className={/[0-9]/.test(formData.nuevaPassword) ? 'text-green-600' : 'text-gray-500'}>
                                        Números
                                    </li>
                                    <li className={/[^A-Za-z0-9]/.test(formData.nuevaPassword) ? 'text-green-600' : 'text-gray-500'}>
                                        Caracteres especiales
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            id="confirmarPassword"
                            name="confirmarPassword"
                            value={formData.confirmarPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.confirm ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {formData.confirmarPassword && formData.nuevaPassword !== formData.confirmarPassword && (
                        <p className="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>
                    )}
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={loading || passwordStrength < 3}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
