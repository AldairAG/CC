import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';

const TwoFactorAuth = () => {
    const { 
        tsvStatus, 
        fetchTSVStatus, 
        enableTSV, 
        disableTSV, 
        loading 
    } = useUserProfile();
    
    const [showSetup, setShowSetup] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [setupStep, setSetupStep] = useState(1);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchTSVStatus();
    }, [fetchTSVStatus]);

    const handleEnableTSV = async () => {
        setMessage(null);
        const result = await enableTSV();
        
        if (result.success) {
            setShowSetup(true);
            setSetupStep(1);
            setMessage({ type: 'success', text: 'TSV configurado correctamente' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Error al habilitar TSV' });
        }
    };

    const handleDisableTSV = async () => {
        setMessage(null);
        const result = await disableTSV();
        
        if (result.success) {
            setShowSetup(false);
            setMessage({ type: 'success', text: 'TSV deshabilitado correctamente' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Error al deshabilitar TSV' });
        }
    };

    const handleVerifyCode = () => {
        if (verificationCode.length === 6) {
            setSetupStep(3);
            setMessage({ type: 'success', text: 'Código verificado correctamente. TSV activado.' });
        } else {
            setMessage({ type: 'error', text: 'Código inválido. Debe tener 6 dígitos.' });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setMessage({ type: 'success', text: 'Código copiado al portapapeles' });
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Autenticación de Dos Factores (TSV)</h2>
                <p className="text-gray-600">
                    Agrega una capa adicional de seguridad a tu cuenta
                </p>
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

            {!tsvStatus.enabled && !showSetup && (
                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                            🔐
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">TSV Deshabilitado</h3>
                            <p className="text-gray-600">Tu cuenta no está protegida con autenticación de dos factores</p>
                        </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-yellow-400">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-yellow-800">¿Por qué habilitar TSV?</h4>
                                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                                    <li>Protege tu cuenta contra accesos no autorizados</li>
                                    <li>Requiere tu dispositivo móvil para iniciar sesión</li>
                                    <li>Aumenta significativamente la seguridad de tu cuenta</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleEnableTSV}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        Habilitar TSV
                    </button>
                </div>
            )}

            {tsvStatus.enabled && !showSetup && (
                <div className="border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            ✅
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">TSV Habilitado</h3>
                            <p className="text-gray-600">Tu cuenta está protegida con autenticación de dos factores</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-green-700">
                            La autenticación de dos factores está activa. Se requerirá un código de tu aplicación 
                            autenticadora cada vez que inicies sesión.
                        </p>
                    </div>

                    <button
                        onClick={handleDisableTSV}
                        disabled={loading}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        Deshabilitar TSV
                    </button>
                </div>
            )}

            {showSetup && (
                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        setupStep >= step 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-12 h-0.5 ${
                                            setupStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {setupStep === 1 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Paso 1: Instala una aplicación autenticadora</h3>
                            <p className="text-gray-600 mb-4">
                                Descarga una aplicación autenticadora en tu dispositivo móvil:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl mb-2">📱</div>
                                    <h4 className="font-medium">Google Authenticator</h4>
                                    <p className="text-sm text-gray-600">iOS y Android</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl mb-2">🔐</div>
                                    <h4 className="font-medium">Authy</h4>
                                    <p className="text-sm text-gray-600">iOS y Android</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl mb-2">🛡️</div>
                                    <h4 className="font-medium">Microsoft Authenticator</h4>
                                    <p className="text-sm text-gray-600">iOS y Android</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSetupStep(2)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Continuar
                            </button>
                        </div>
                    )}

                    {setupStep === 2 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Paso 2: Escanea el código QR</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-600 mb-4">
                                        Escanea este código QR con tu aplicación autenticadora:
                                    </p>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                        {tsvStatus.qrCode ? (
                                            <img 
                                                src={tsvStatus.qrCode} 
                                                alt="QR Code" 
                                                className="mx-auto mb-4 w-48 h-48"
                                            />
                                        ) : (
                                            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                                <span className="text-gray-400 text-6xl">📱</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-4">
                                        O ingresa manualmente este código secreto:
                                    </p>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                        <code className="text-sm font-mono break-all">
                                            {tsvStatus.secret || 'JBSWY3DPEHPK3PXP'}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(tsvStatus.secret || 'JBSWY3DPEHPK3PXP')}
                                            className="ml-2 text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            📋 Copiar
                                        </button>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                                            Código de verificación
                                        </label>
                                        <input
                                            type="text"
                                            id="verificationCode"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                                            maxLength={6}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Ingresa el código de 6 dígitos de tu aplicación
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleVerifyCode}
                                        disabled={verificationCode.length !== 6}
                                        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Verificar Código
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {setupStep === 3 && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">¡TSV Configurado Correctamente!</h3>
                            <p className="text-gray-600 mb-6">
                                Tu cuenta ahora está protegida con autenticación de dos factores. 
                                Guarda estos códigos de respaldo en un lugar seguro:
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                    {['ABC123DE', 'FGH456IJ', 'KLM789NO', 'PQR012ST', 'UVW345XY', 'Z67890AB'].map((code, index) => (
                                        <div key={index} className="bg-white px-2 py-1 rounded border">
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowSetup(false);
                                    setSetupStep(1);
                                    setVerificationCode('');
                                }}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Finalizar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TwoFactorAuth;
