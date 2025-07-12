import React, { useState } from 'react';
import { useCryptoTransactions } from '../../../hooks/useCryptoTransactions';
import { CryptoService } from '../../../service/crypto/cryptoService';
import type { CryptoToFiatConversionRequest } from '../../../types/CryptoTypes';

const RetirarPage = () => {
    const { balances, convertToUSD, refreshData } = useCryptoTransactions();
    const [formData, setFormData] = useState<CryptoToFiatConversionRequest>({
        cryptoType: 'BTC',
        amount: 0,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const getAvailableBalance = (cryptoType: string) => {
        const balance = balances.find(b => b.cryptoType === cryptoType);
        return balance ? balance.balance : 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.amount <= 0) {
            setMessage({ type: 'error', text: 'El monto debe ser mayor a 0' });
            return;
        }

        const availableBalance = getAvailableBalance(formData.cryptoType);
        if (formData.amount > availableBalance) {
            setMessage({ type: 'error', text: `Balance insuficiente. Disponible: ${availableBalance.toFixed(8)} ${formData.cryptoType}` });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await CryptoService.convertToFiat(formData);
            setMessage({ 
                type: 'success', 
                text: `Conversión exitosa. Se agregaron $${response.fiatAmountAdded.toFixed(2)} a tu cuenta.` 
            });
            
            // Reset form
            setFormData({
                cryptoType: 'BTC',
                amount: 0,
                notes: ''
            });
            
            // Refresh balances
            await refreshData();
        } catch (error) {
            console.error('Error converting crypto:', error);
            setMessage({ type: 'error', text: 'Error al procesar la conversión. Intenta nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }));
    };

    const getEstimatedUSD = () => {
        return convertToUSD(formData.amount, formData.cryptoType);
    };

    const setMaxAmount = () => {
        const maxBalance = getAvailableBalance(formData.cryptoType);
        setFormData(prev => ({ ...prev, amount: maxBalance }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Retirar Criptomonedas</h1>
                
                {/* Current Balances */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Balances Disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {balances.map((balance) => (
                            <div key={balance.cryptoType} className="bg-white rounded-lg p-3 border">
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800">{balance.cryptoType}</div>
                                    <div className="text-sm text-gray-600">{balance.balance.toFixed(8)}</div>
                                    <div className="text-xs text-gray-500">
                                        ${convertToUSD(balance.balance, balance.cryptoType).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Información Importante</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• La conversión se realizará al tipo de cambio actual</li>
                        <li>• Los fondos se agregarán a tu balance en USD</li>
                        <li>• Esta operación no se puede deshacer</li>
                        <li>• Las transacciones pueden tardar unos minutos en procesarse</li>
                    </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Criptomoneda
                        </label>
                        <select
                            name="cryptoType"
                            value={formData.cryptoType}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            {balances.map(balance => (
                                <option key={balance.cryptoType} value={balance.cryptoType}>
                                    {balance.cryptoType} (Disponible: {balance.balance.toFixed(8)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad a Retirar
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                step="0.00000001"
                                min="0"
                                max={getAvailableBalance(formData.cryptoType)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="0.00000000"
                            />
                            <button
                                type="button"
                                onClick={setMaxAmount}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                MAX
                            </button>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Disponible: {getAvailableBalance(formData.cryptoType).toFixed(8)} {formData.cryptoType}</span>
                            {formData.amount > 0 && (
                                <span>≈ ${getEstimatedUSD().toFixed(2)} USD</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas (Opcional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Información adicional sobre tu retiro"
                        />
                    </div>

                    {/* Conversion Summary */}
                    {formData.amount > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">Resumen de Conversión</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Cantidad a retirar:</span>
                                    <span>{formData.amount.toFixed(8)} {formData.cryptoType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Valor estimado:</span>
                                    <span>${getEstimatedUSD().toFixed(2)} USD</span>
                                </div>
                                <div className="flex justify-between font-semibold text-blue-800">
                                    <span>Recibirás:</span>
                                    <span>~${getEstimatedUSD().toFixed(2)} USD</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className={`p-4 rounded-lg ${
                            message.type === 'success' 
                                ? 'bg-green-50 border border-green-200 text-green-800' 
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || formData.amount <= 0}
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Retiro'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RetirarPage;
