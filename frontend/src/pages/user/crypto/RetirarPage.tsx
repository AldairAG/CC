import React, { useState } from 'react';
import { useCrypto } from '../../../hooks/useCrypto';
import { CryptoService } from '../../../service/crypto/cryptoService';
import type { CryptoToFiatConversionRequest } from '../../../types/CryptoTypes';

const RetirarPage = () => {
    const { balances, convertToUSD } = useCrypto();
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
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">Retirar Criptomonedas</h1>
                
                {/* Current Balances */}
                <div className="bg-slate-700/30 rounded-xl p-4 mb-6 backdrop-blur-sm border border-slate-600/30">
                    <h3 className="font-semibold text-amber-300 mb-3">Balances Disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {balances.map((balance) => (
                            <div key={balance.cryptoType} className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 rounded-xl p-3 border border-slate-600/40 backdrop-blur-sm">
                                <div className="text-center">
                                    <div className="font-semibold text-white">{balance.cryptoType}</div>
                                    <div className="text-sm text-amber-300">{balance.balance.toFixed(8)}</div>
                                    <div className="text-xs text-gray-400">
                                        ${convertToUSD(balance.balance, balance.cryptoType).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-yellow-300 mb-2">⚠️ Información Importante</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>• La conversión se realizará al tipo de cambio actual</li>
                        <li>• Los fondos se agregarán a tu balance en USD</li>
                        <li>• Esta operación no se puede deshacer</li>
                        <li>• Las transacciones pueden tardar unos minutos en procesarse</li>
                    </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Criptomoneda
                        </label>
                        <select
                            name="cryptoType"
                            value={formData.cryptoType}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm"
                        >
                            {balances.map(balance => (
                                <option key={balance.cryptoType} value={balance.cryptoType} className="bg-slate-800 text-white">
                                    {balance.cryptoType} (Disponible: {balance.balance.toFixed(8)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm"
                                placeholder="0.00000000"
                            />
                            <button
                                type="button"
                                onClick={setMaxAmount}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-300 text-sm font-medium px-2 py-1 bg-amber-500/20 rounded-lg transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>Disponible: {getAvailableBalance(formData.cryptoType).toFixed(8)} {formData.cryptoType}</span>
                            {formData.amount > 0 && (
                                <span className="text-amber-300">≈ ${getEstimatedUSD().toFixed(2)} USD</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Notas (Opcional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm resize-none"
                            placeholder="Información adicional sobre tu retiro"
                        />
                    </div>

                    {/* Conversion Summary */}
                    {formData.amount > 0 && (
                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="font-semibold text-amber-300 mb-2">Resumen de Conversión</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-gray-300">
                                    <span>Cantidad a retirar:</span>
                                    <span className="text-white">{formData.amount.toFixed(8)} {formData.cryptoType}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Valor estimado:</span>
                                    <span className="text-white">${getEstimatedUSD().toFixed(2)} USD</span>
                                </div>
                                <div className="flex justify-between font-semibold text-amber-300 pt-2 border-t border-amber-500/20">
                                    <span>Recibirás:</span>
                                    <span>~${getEstimatedUSD().toFixed(2)} USD</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className={`p-4 rounded-xl backdrop-blur-lg border ${
                            message.type === 'success' 
                                ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                                : 'bg-red-500/20 border-red-500/30 text-red-300'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || formData.amount <= 0}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Retiro'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RetirarPage;
