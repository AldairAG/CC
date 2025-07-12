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
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Depositar Criptomonedas</h1>
                
                {/* Deposit Method Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Método de Depósito</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setDepositMethod('address')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                depositMethod === 'address'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                            }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">📍</div>
                                <div className="font-semibold">Dirección de Depósito</div>
                                <div className="text-sm mt-1">
                                    Envía desde tu wallet externo a nuestra dirección
                                </div>
                            </div>
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setDepositMethod('wallet')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                depositMethod === 'wallet'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                            }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">👛</div>
                                <div className="font-semibold">Desde Mi Wallet</div>
                                <div className="text-sm mt-1">
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
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-2">Instrucciones de Depósito</h3>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Envía tus criptomonedas a la dirección correspondiente</li>
                                        <li>• Completa el formulario con la información de tu transacción</li>
                                        <li>• Tu depósito será procesado automáticamente</li>
                                        <li>• El tiempo de confirmación depende de la red blockchain</li>
                                    </ul>
                                </div>

                                {/* Form */}
                                <Form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Criptomoneda
                                        </label>
                                        <Field
                                            as="select"
                                            name="cryptoType"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {cryptoOptions.map(crypto => (
                                                <option key={crypto} value={crypto}>
                                                    {crypto}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="cryptoType" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cantidad
                                        </label>
                                        <Field
                                            type="number"
                                            name="amount"
                                            step="0.00000001"
                                            min="0"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0.00000000"
                                        />
                                        <ErrorMessage name="amount" component="div" className="text-red-600 text-sm mt-1" />
                                        {values.amount > 0 && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                ≈ ${convertToUSD(values.amount, values.cryptoType).toFixed(2)} USD
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hash de Transacción (Opcional)
                                        </label>
                                        <Field
                                            type="text"
                                            name="transactionHash"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ingresa el hash de tu transacción"
                                        />
                                        <ErrorMessage name="transactionHash" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

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
                                        disabled={loading}
                                        className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
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
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-green-800 mb-2">Depósito desde Wallet</h3>
                                    <ul className="text-sm text-green-700 space-y-1">
                                        <li>• Ingresa la dirección de tu wallet personal</li>
                                        <li>• Selecciona la criptomoneda y el monto a depositar</li>
                                        <li>• El sistema procesará automáticamente el depósito</li>
                                        <li>• No necesitas enviar manualmente, el backend se encarga</li>
                                    </ul>
                                </div>

                                {/* Form */}
                                <Form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección de tu Wallet
                                        </label>
                                        <Field
                                            type="text"
                                            name="walletAddress"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Ingresa la dirección de tu wallet"
                                        />
                                        <ErrorMessage name="walletAddress" component="div" className="text-red-600 text-sm mt-1" />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Esta dirección será utilizada para realizar el depósito automáticamente
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Criptomoneda
                                        </label>
                                        <Field
                                            as="select"
                                            name="cryptoType"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            {cryptoOptions.map(crypto => (
                                                <option key={crypto} value={crypto}>
                                                    {crypto}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="cryptoType" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cantidad
                                        </label>
                                        <Field
                                            type="number"
                                            name="amount"
                                            step="0.00000001"
                                            min="0"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="0.00000000"
                                        />
                                        <ErrorMessage name="amount" component="div" className="text-red-600 text-sm mt-1" />
                                        {values.amount > 0 && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                ≈ ${convertToUSD(values.amount, values.cryptoType).toFixed(2)} USD
                                            </p>
                                        )}
                                    </div>

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
                                        disabled={loading}
                                        className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
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
