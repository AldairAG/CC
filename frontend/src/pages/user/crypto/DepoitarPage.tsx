import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCryptoTransactions } from '../../../hooks/useCryptoTransactions';
import { CryptoService } from '../../../service/crypto/cryptoService';
import DepositAddress from '../../../components/crypto/DepositAddress';
import type { CryptoDepositRequest, CryptoType } from '../../../types/CryptoTypes';

const DepositarPage = () => {
    const { convertToUSD, refreshData } = useCryptoTransactions();
    const [depositMethod, setDepositMethod] = useState<'address' | 'wallet'>('address');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const cryptoOptions: CryptoType[] = ['BTC', 'ETH', 'SOL'];

    // Validation schema
    const validationSchema = Yup.object().shape({
        cryptoType: Yup.string().required('Selecciona una criptomoneda'),
        amount: Yup.number()
            .min(0.00000001, 'El monto debe ser mayor a 0')
            .required('Ingresa un monto válido'),
        transactionHash: Yup.string().when('depositMethod', {
            is: 'address',
            then: (schema) => schema,
            otherwise: (schema) => schema.notRequired()
        }),
        walletAddress: Yup.string().when('depositMethod', {
            is: 'wallet',
            then: (schema) => schema.required('Ingresa la dirección de tu wallet'),
            otherwise: (schema) => schema.notRequired()
        })
    });

    const initialValues = {
        cryptoType: 'BTC' as CryptoType,
        amount: 0,
        transactionHash: '',
        walletAddress: ''
    };

    const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
        setLoading(true);
        setMessage(null);

        try {
            const depositData: CryptoDepositRequest = {
                cryptoType: values.cryptoType,
                amount: values.amount,
                transactionHash: depositMethod === 'address' ? values.transactionHash : undefined,
                notes: depositMethod === 'wallet' 
                    ? `Depósito desde wallet: ${values.walletAddress}`
                    : undefined
            };

            await CryptoService.createCryptoDeposit(depositData);
            setMessage({ 
                type: 'success', 
                text: depositMethod === 'wallet' 
                    ? 'Depósito desde wallet creado exitosamente. Será procesado automáticamente.' 
                    : 'Depósito creado exitosamente. Será procesado en breve.' 
            });
            
            // Reset form
            resetForm();
            
            // Refresh balances
            await refreshData();
        } catch (error) {
            console.error('Error creating deposit:', error);
            setMessage({ type: 'error', text: 'Error al crear el depósito. Intenta nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">Depositar Criptomonedas</h1>
                
                {/* Deposit Method Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-amber-300 mb-4">Método de Depósito</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setDepositMethod('address')}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
                                depositMethod === 'address'
                                    ? 'border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-lg'
                                    : 'border-slate-600/50 hover:border-slate-500/70 text-gray-300 hover:bg-slate-700/20'
                            }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">📍</div>
                                <div className="font-semibold">Dirección de Depósito</div>
                                <div className="text-sm mt-1 opacity-90">
                                    Envía desde tu wallet externo a nuestra dirección
                                </div>
                            </div>
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setDepositMethod('wallet')}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
                                depositMethod === 'wallet'
                                    ? 'border-green-500/60 bg-green-500/20 text-green-300 shadow-lg'
                                    : 'border-slate-600/50 hover:border-slate-500/70 text-gray-300 hover:bg-slate-700/20'
                            }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">👛</div>
                                <div className="font-semibold">Desde Mi Wallet</div>
                                <div className="text-sm mt-1 opacity-90">
                                    Deposita desde tu wallet conectado automáticamente
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Conditional Content Based on Method */}
                {depositMethod === 'address' ? (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue }) => (
                            <>
                                {/* Deposit Address */}
                                <div className="mb-6">
                                    <DepositAddress cryptoType={values.cryptoType} />
                                </div>

                                {/* Instructions */}
                                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                                    <h3 className="font-semibold text-amber-300 mb-2">Instrucciones de Depósito</h3>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Envía tus criptomonedas a la dirección correspondiente</li>
                                        <li>• Completa el formulario con la información de tu transacción</li>
                                        <li>• Tu depósito será procesado automáticamente</li>
                                        <li>• El tiempo de confirmación depende de la red blockchain</li>
                                    </ul>
                                </div>

                                {/* Form */}
                                <Form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Criptomoneda
                                        </label>
                                        <Field
                                            as="select"
                                            name="cryptoType"
                                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm"
                                        >
                                            {cryptoOptions.map(crypto => (
                                                <option key={crypto} value={crypto} className="bg-slate-800 text-white">
                                                    {crypto}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="cryptoType" component="div" className="text-red-400 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Cantidad
                                        </label>
                                        <Field
                                            type="number"
                                            name="amount"
                                            step="0.00000001"
                                            min="0"
                                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm"
                                            placeholder="0.00000000"
                                        />
                                        <ErrorMessage name="amount" component="div" className="text-red-400 text-sm mt-1" />
                                        {values.amount > 0 && (
                                            <p className="text-sm text-amber-300 mt-1">
                                                ≈ ${convertToUSD(values.amount, values.cryptoType).toFixed(2)} USD
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Hash de Transacción (Opcional)
                                        </label>
                                        <Field
                                            type="text"
                                            name="transactionHash"
                                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm font-mono text-sm"
                                            placeholder="Ingresa el hash de tu transacción"
                                        />
                                        <ErrorMessage name="transactionHash" component="div" className="text-red-400 text-sm mt-1" />
                                    </div>

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
                                        disabled={loading}
                                        className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                                    >
                                        {loading ? 'Procesando...' : 'Confirmar Depósito'}
                                    </button>
                                </Form>
                            </>
                        )}
                    </Formik>
                ) : (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values }) => (
                            <>
                                {/* Wallet Deposit Instructions */}
                                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                                    <h3 className="font-semibold text-green-300 mb-2">Depósito desde Wallet</h3>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Ingresa la dirección de tu wallet personal</li>
                                        <li>• Selecciona la criptomoneda y el monto a depositar</li>
                                        <li>• El sistema procesará automáticamente el depósito</li>
                                        <li>• No necesitas enviar manualmente, el backend se encarga</li>
                                    </ul>
                                </div>

                                {/* Form */}
                                <Form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Dirección de tu Wallet
                                        </label>
                                        <Field
                                            type="text"
                                            name="walletAddress"
                                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm font-mono text-sm"
                                            placeholder="Ingresa la dirección de tu wallet"
                                        />
                                        <ErrorMessage name="walletAddress" component="div" className="text-red-400 text-sm mt-1" />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Esta dirección será utilizada para realizar el depósito automáticamente
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Criptomoneda
                                        </label>
                                        <Field
                                            as="select"
                                            name="cryptoType"
                                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm"
                                        >
                                            {cryptoOptions.map(crypto => (
                                                <option key={crypto} value={crypto} className="bg-slate-800 text-white">
                                                    {crypto}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="cryptoType" component="div" className="text-red-400 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Cantidad
                                        </label>
                                        <Field
                                            type="number"
                                            name="amount"
                                            step="0.00000001"
                                            min="0"
                                            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm"
                                            placeholder="0.00000000"
                                        />
                                        <ErrorMessage name="amount" component="div" className="text-red-400 text-sm mt-1" />
                                        {values.amount > 0 && (
                                            <p className="text-sm text-green-300 mt-1">
                                                ≈ ${convertToUSD(values.amount, values.cryptoType).toFixed(2)} USD
                                            </p>
                                        )}
                                    </div>

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
                                        disabled={loading}
                                        className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                                    >
                                        {loading ? 'Procesando...' : 'Depositar desde Wallet'}
                                    </button>
                                </Form>
                            </>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default DepositarPage;
