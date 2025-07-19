import React, { useState } from 'react';
import type { CryptoType } from '../../types/CryptoTypes';
import QRCodeDisplay from './QRCodeDisplay';

interface DepositAddressProps {
    cryptoType: CryptoType;
}

const DepositAddress: React.FC<DepositAddressProps> = ({ cryptoType }) => {
    const [copied, setCopied] = useState(false);

    // Mock addresses - in production, these would come from your backend
    const addresses = {
        BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ETH: '0x742d35Cc6634C0532925a3b8D4e5f4534e0b2bAA',
        SOL: '9WKrQ9eDmgT5KQGwCdqJZEWpTFvG4hJhNhvwZhgZtg7A',
        TRC20:''
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(addresses[cryptoType]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Dirección de Depósito ({cryptoType})
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
                <div className="font-mono text-sm text-gray-900 bg-white p-3 rounded border break-all">
                    {addresses[cryptoType]}
                </div>
            </div>
            
            <QRCodeDisplay cryptoType={cryptoType} address={addresses[cryptoType]} />
        </div>
    );
};

export default DepositAddress;
