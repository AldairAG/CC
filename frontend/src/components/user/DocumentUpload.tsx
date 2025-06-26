import { useState, useEffect, useRef } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import type { DocumentUploadRequest } from '../../types/UserProfileTypes';

const DocumentUpload = () => {
    const { documents, fetchDocuments, uploadDocument, loading } = useUserProfile();
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        setMessage(null);

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setMessage({ 
                type: 'error', 
                text: 'Solo se permiten archivos JPG, PNG o PDF' 
            });
            return;
        }

        // Validar tamaño (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ 
                type: 'error', 
                text: 'El archivo no debe superar los 5MB' 
            });
            return;
        }

        // Determinar tipo de documento basado en el nombre del archivo
        const fileName = file.name.toLowerCase();
        let documentType: 'INE' | 'COMPROBANTE_DOMICILIO';
        
        if (fileName.includes('ine') || fileName.includes('identificacion')) {
            documentType = 'INE';
        } else if (fileName.includes('comprobante') || fileName.includes('domicilio')) {
            documentType = 'COMPROBANTE_DOMICILIO';
        } else {
            // Preguntar al usuario el tipo de documento
            const userChoice = window.confirm(
                '¿Es este documento una INE/Identificación? Haz clic en "Aceptar" para INE o "Cancelar" para Comprobante de Domicilio'
            );
            documentType = userChoice ? 'INE' : 'COMPROBANTE_DOMICILIO';
        }

        const documentUpload: DocumentUploadRequest = {
            type: documentType,
            file: file
        };

        // Simular progreso de subida
        const fileId = Date.now().toString();
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                const currentProgress = prev[fileId] || 0;
                if (currentProgress >= 100) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return { ...prev, [fileId]: currentProgress + 10 };
            });
        }, 200);

        const result = await uploadDocument(documentUpload);
        
        clearInterval(progressInterval);
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });

        if (result.success) {
            setMessage({ 
                type: 'success', 
                text: `Documento ${documentType} subido correctamente` 
            });
        } else {
            setMessage({ 
                type: 'error', 
                text: result.message || 'Error al subir el documento' 
            });
        }

        // Limpiar input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APROBADO':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">✅ Aprobado</span>;
            case 'RECHAZADO':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">❌ Rechazado</span>;
            case 'PENDIENTE':
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">⏳ Pendiente</span>;
        }
    };

    const getDocumentIcon = (tipo: string) => {
        switch (tipo) {
            case 'INE':
                return '🆔';
            case 'COMPROBANTE_DOMICILIO':
                return '🏠';
            default:
                return '📄';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentos de Identidad</h2>
                <p className="text-gray-600">
                    Sube tu INE y comprobante de domicilio para verificar tu cuenta
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

            {/* Upload Area */}
            <div className="mb-8">
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            Arrastra tus documentos aquí
                        </p>
                        <p className="text-gray-600">
                            o haz clic para seleccionar archivos
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Seleccionar Archivos
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG o PDF • Máximo 5MB
                    </p>
                </div>

                {/* Upload Progress */}
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Subiendo documento...</span>
                            <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Required Documents Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🆔</span>
                        <h3 className="text-lg font-semibold">INE (Identificación)</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Credencial de elector vigente</li>
                        <li>• Imagen clara y legible</li>
                        <li>• Ambos lados (frente y reverso)</li>
                        <li>• Formato: JPG, PNG o PDF</li>
                    </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🏠</span>
                        <h3 className="text-lg font-semibold">Comprobante de Domicilio</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Recibo de luz, agua, gas o teléfono</li>
                        <li>• No mayor a 3 meses</li>
                        <li>• Mismo nombre que en la INE</li>
                        <li>• Formato: JPG, PNG o PDF</li>
                    </ul>
                </div>
            </div>

            {/* Documents List */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos Subidos</h3>
                
                {documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📄</span>
                        <p>No has subido ningún documento aún</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {documents.map((doc) => (
                            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-2xl">
                                            {getDocumentIcon(doc.tipo)}
                                        </span>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                {doc.tipo === 'INE' ? 'Identificación (INE)' : 'Comprobante de Domicilio'}
                                            </h4>
                                            <p className="text-sm text-gray-600">{doc.nombreArchivo}</p>
                                            <p className="text-xs text-gray-500">
                                                Subido el {formatDate(doc.fechaSubida)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {getStatusBadge(doc.estado)}
                                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                            Ver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Verification Status */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <span className="text-blue-400">ℹ️</span>
                    </div>
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Proceso de Verificación</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            Los documentos son revisados por nuestro equipo de seguridad. 
                            El proceso puede tomar de 24 a 72 horas hábiles. 
                            Te notificaremos por email cuando la verificación esté completa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;
