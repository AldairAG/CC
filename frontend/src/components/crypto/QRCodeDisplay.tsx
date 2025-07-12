import React, { useState } from 'react';
import type { CryptoType } from '../../types/CryptoTypes';

interface QRCodeDisplayProps {
    cryptoType: CryptoType;
    address: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ cryptoType, address }) => {
    const [showQR, setShowQR] = useState(false);
    
    // QR code URL generator (using qr-server.com as example)
    const generateQRUrl = (text: string) => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">Código QR</h4>
                <button
                    onClick={() => setShowQR(!showQR)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    {showQR ? 'Ocultar' : 'Mostrar'} QR
                </button>
            </div>
            
            {showQR && (
                <div className="text-center">
                    <img
                        src={generateQRUrl(address)}
                        alt={`QR Code para ${cryptoType}`}
                        className="mx-auto mb-2 rounded-lg shadow-sm"
                        style={{ maxWidth: '200px', height: 'auto' }}
                    />
                    <p className="text-xs text-gray-600">
                        Escanea este código QR para obtener la dirección de depósito
                    </p>
                </div>
            )}
        </div>
    );
};

export default QRCodeDisplay;
