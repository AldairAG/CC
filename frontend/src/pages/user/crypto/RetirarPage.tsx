import React, { useState } from 'react';
import { useCrypto } from '../../../hooks/useCrypto';
import type { CryptoManualWithdrawalRequest, UserWallet } from '../../../types/CryptoTypes';

const RetirarPage = () => {
    const { 
        balances, 
        exchangeRates,
        createManualWithdrawalRequest,
        isCreatingWithdrawal,
        wallets
    } = useCrypto();
    const [formData, setFormData] = useState<CryptoManualWithdrawalRequest>({
        cryptoType: 'BTC',
        amount: 0,
        toAddress: '',
        notes: ''
    });
    const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);
    const [withdrawalMethod, setWithdrawalMethod] = useState<'address' | 'wallet'>('address');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const getAvailableBalance = (cryptoType: string) => {
        const balance = balances.find(b => b.cryptoType === cryptoType);
        return balance ? balance.balance : 0;
    };

    const convertToUSD = (amount: number, cryptoType: string) => {
        if (!exchangeRates) return 0;
        const effectiveCryptoType = cryptoType.toLowerCase();
        const rate = exchangeRates[effectiveCryptoType as keyof typeof exchangeRates];
        return rate ? amount * rate.usd : 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.amount <= 0) {
            setMessage({ type: 'error', text: 'El monto debe ser mayor a 0' });
            return;
        }

        // Validar según el método de retiro
        if (withdrawalMethod === 'address') {
            if (!formData.toAddress) {
                setMessage({ type: 'error', text: 'La dirección de destino es requerida' });
                return;
            }
        } else {
            if (!selectedWallet) {
                setMessage({ type: 'error', text: 'Debes seleccionar una wallet de destino' });
                return;
            }
        }

        const availableBalance = getAvailableBalance(formData.cryptoType);
        if (formData.amount > availableBalance) {
            setMessage({ type: 'error', text: `Balance insuficiente. Disponible: ${availableBalance.toFixed(8)} ${formData.cryptoType}` });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const withdrawalData = {
                ...formData,
                toAddress: withdrawalMethod === 'wallet' ? selectedWallet!.address : formData.toAddress,
                notes: withdrawalMethod === 'wallet' 
                    ? `Retiro a wallet propia: ${selectedWallet!.address}` 
                    : formData.notes
            };

            const response = await createManualWithdrawalRequest(withdrawalData);
            if (response) {
                setMessage({ 
                    type: 'success', 
                    text: 'Solicitud de retiro enviada exitosamente. Será procesada por un administrador.' 
                });
                
                // Reset form
                setFormData({
                    cryptoType: 'BTC',
                    amount: 0,
                    toAddress: '',
                    notes: ''
                });
                setSelectedWallet(null);
            }
        } catch (error) {
            console.error('Error creating withdrawal request:', error);
            setMessage({ type: 'error', text: 'Error al procesar la solicitud de retiro. Intenta nuevamente.' });
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
        
        // Si cambia el tipo de crypto, limpiar la wallet seleccionada
        if (name === 'cryptoType') {
            setSelectedWallet(null);
        }
    };

    const setMaxAmount = () => {
        const maxBalance = getAvailableBalance(formData.cryptoType);
        setFormData(prev => ({ ...prev, amount: maxBalance }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">Retirar Criptomonedas</h1>
                
                {/* Withdrawal Method Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-amber-300 mb-4">Método de Retiro</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setWithdrawalMethod('address')}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${withdrawalMethod === 'address'
                                ? 'border-red-500/60 bg-red-500/20 text-red-300 shadow-lg'
                                : 'border-slate-600/50 hover:border-slate-500/70 text-gray-300 hover:bg-slate-700/20'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">📍</div>
                                <div className="font-semibold">Dirección Externa</div>
                                <div className="text-sm mt-1 opacity-90">
                                    Envía a cualquier dirección externa
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setWithdrawalMethod('wallet')}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${withdrawalMethod === 'wallet'
                                ? 'border-blue-500/60 bg-blue-500/20 text-blue-300 shadow-lg'
                                : 'border-slate-600/50 hover:border-slate-500/70 text-gray-300 hover:bg-slate-700/20'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">👛</div>
                                <div className="font-semibold">A Mi Wallet</div>
                                <div className="text-sm mt-1 opacity-90">
                                    Retira a una de tus wallets registradas
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                
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
                        <li>• La solicitud de retiro será revisada por un administrador</li>
                        <li>• Los fondos se enviarán a la dirección especificada</li>
                        <li>• Esta operación no se puede deshacer</li>
                        <li>• Las transacciones pueden tardar tiempo en procesarse</li>
                        <li>• Asegúrate de que la dirección de destino sea correcta</li>
                    </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {withdrawalMethod === 'address' && (
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
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {withdrawalMethod === 'address' ? 'Dirección de Destino' : 'Selecciona tu Wallet de Destino'}
                        </label>
                        {withdrawalMethod === 'address' ? (
                            <input
                                type="text"
                                name="toAddress"
                                value={formData.toAddress}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm font-mono text-sm"
                                placeholder="Ingresa la dirección de destino"
                                required
                            />
                        ) : (
                            <div className="space-y-3">
                                {wallets.filter(wallet => wallet.isActive && wallet.cryptoType === formData.cryptoType).length === 0 ? (
                                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="text-yellow-300 font-medium mb-2">⚠️ No tienes wallets de {formData.cryptoType}</div>
                                        <p className="text-sm text-gray-300">
                                            Necesitas crear una wallet de {formData.cryptoType} para poder retirar a ella.
                                        </p>
                                    </div>
                                ) : (
                                    wallets
                                        .filter(wallet => wallet.isActive && wallet.cryptoType === formData.cryptoType)
                                        .map((wallet) => {
                                            const isSelected = selectedWallet?.id === wallet.id;
                                            const getCryptoIcon = (cryptoType: string) => {
                                                switch (cryptoType) {
                                                    case 'BTC': return '₿';
                                                    case 'ETH': return 'Ξ';
                                                    case 'SOL': return '◎';
                                                    case 'TRC20': return '₮';
                                                    default: return '🪙';
                                                }
                                            };
                                            
                                            return (
                                                <div
                                                    key={wallet.id}
                                                    onClick={() => setSelectedWallet(wallet)}
                                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] ${
                                                        isSelected
                                                            ? 'border-blue-500/60 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/25'
                                                            : 'border-slate-600/50 hover:border-slate-500/70 text-gray-300 hover:bg-slate-700/20'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                                                                isSelected 
                                                                    ? 'bg-blue-500/30 border-blue-500/50' 
                                                                    : 'bg-slate-700/50 border-slate-600/50'
                                                            }`}>
                                                                <span className="text-xl font-bold">
                                                                    {getCryptoIcon(wallet.cryptoType)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-lg">
                                                                    {wallet.cryptoType}
                                                                </div>
                                                                <div className="text-sm opacity-75 font-mono">
                                                                    {wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 8)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold">
                                                                {wallet.balance.toFixed(8)}
                                                            </div>
                                                            <div className="text-sm opacity-75">
                                                                {wallet.cryptoType}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2">
                                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                )}
                                
                                {selectedWallet && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-blue-300 font-semibold">Wallet de Destino Seleccionada</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-400">Dirección completa:</span>
                                            <p className="text-white font-mono text-xs break-all mt-1 p-2 bg-slate-800/50 rounded-lg">
                                                {selectedWallet.address}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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
                                <span className="text-amber-300">≈ ${convertToUSD(formData.amount, formData.cryptoType).toFixed(2)} USD</span>
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

                    {/* Withdrawal Summary */}
                    {formData.amount > 0 && ((withdrawalMethod === 'address' && formData.toAddress) || (withdrawalMethod === 'wallet' && selectedWallet)) && (
                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="font-semibold text-amber-300 mb-2">Resumen de Retiro</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-gray-300">
                                    <span>Cantidad a retirar:</span>
                                    <span className="text-white">{formData.amount.toFixed(8)} {formData.cryptoType}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Valor estimado:</span>
                                    <span className="text-white">${convertToUSD(formData.amount, formData.cryptoType).toFixed(2)} USD</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Método de retiro:</span>
                                    <span className="text-white">{withdrawalMethod === 'address' ? 'Dirección Externa' : 'Mi Wallet'}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Dirección de destino:</span>
                                    <span className="text-white font-mono text-xs">
                                        {withdrawalMethod === 'address' 
                                            ? `${formData.toAddress.substring(0, 20)}...`
                                            : `${selectedWallet?.address.substring(0, 20)}...`
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold text-amber-300 pt-2 border-t border-amber-500/20">
                                    <span>Total a retirar:</span>
                                    <span>{formData.amount.toFixed(8)} {formData.cryptoType}</span>
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
                        disabled={
                            loading || 
                            isCreatingWithdrawal || 
                            formData.amount <= 0 || 
                            (withdrawalMethod === 'address' && !formData.toAddress) ||
                            (withdrawalMethod === 'wallet' && !selectedWallet)
                        }
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg"
                    >
                        {(loading || isCreatingWithdrawal) ? 'Procesando...' : 'Solicitar Retiro'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RetirarPage;
