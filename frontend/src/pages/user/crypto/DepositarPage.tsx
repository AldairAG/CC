import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers, type FieldProps } from 'formik';
import * as Yup from 'yup';
import { useCrypto } from '../../../hooks/useCrypto';
import DepositAddress from '../../../components/crypto/DepositAddress';
import type { CryptoType, UserWallet } from '../../../types/CryptoTypes';

const cryptoOptions = [
    { symbol: 'BTC', name: 'bitcoin' },
    { symbol: 'ETH', name: 'ethereum' },
    { symbol: 'SOL', name: 'solana' }
];

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
    }),
    cryptoWallet: Yup.object().nullable().when('depositMethod', {
        is: 'wallet',
        then: (schema) => schema.required('Selecciona una wallet'),
        otherwise: (schema) => schema.notRequired()
    })
});

const initialValues = {
    cryptoType: 'bitcoin',
    amount: 0,
    transactionHash: '',
    walletAddress: '',
    cryptoWallet: null as UserWallet | null
};

const DepositarPage = () => {
    const {
        createDeposit,
        createManualDepositRequest,
        isCreatingDeposit,
        wallets,
        exchangeRates
    } = useCrypto();

    const [depositMethod, setDepositMethod] = useState<'address' | 'wallet'>('address');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const convertToUSD = (amount: number, cryptoType: string, cryptoWallet?: UserWallet | null) => {
        if (!exchangeRates) return 0;

        // Si tenemos una wallet seleccionada, usar su tipo de crypto
        const effectiveCryptoType = cryptoWallet ? cryptoWallet.cryptoType : cryptoType;

        if (cryptoWallet) {
            const valuesRates = {
                BTC: exchangeRates.bitcoin?.usd || 0,
                ETH: exchangeRates.ethereum?.usd || 0,
                SOL: exchangeRates.solana?.usd || 0,
            };
            const walletRate = valuesRates[cryptoWallet.cryptoType as keyof typeof valuesRates];
            if (walletRate) {
                return walletRate * amount;
            }
        }

        const rate = exchangeRates[effectiveCryptoType as keyof typeof exchangeRates];
        return rate ? amount * rate.usd : 0;
    };

    const handleSubmit = async (values: typeof initialValues, actions: FormikHelpers<typeof initialValues>) => {
        setMessage(null);

        try {
            if (depositMethod === 'address') {
                // Depósito desde dirección externa
                const depositData = {
                    cryptoType: values.cryptoType.toUpperCase() as CryptoType,
                    amount: values.amount,
                    userWalletAddress: 'pending', // Se genera automáticamente
                    txHash: values.transactionHash || undefined,
                    notes: 'Depósito desde dirección externa'
                };

                const result = await createDeposit(depositData);
                if (result) {
                    setMessage({
                        type: 'success',
                        text: 'Depósito creado exitosamente. Será procesado automáticamente.'
                    });
                    actions.resetForm();
                }
            } else {
                // Depósito desde wallet seleccionada
                if (!values.cryptoWallet) {
                    setMessage({
                        type: 'error',
                        text: 'Debes seleccionar una wallet para depositar.'
                    });
                    return;
                }

                const depositData = {
                    cryptoType: values.cryptoWallet.cryptoType,
                    amount: values.amount,
                    fromAddress: values.cryptoWallet.address,
                    txHash: values.transactionHash || undefined,
                    notes: `Depósito desde wallet: ${values.cryptoWallet.address}`
                };

                const result = await createManualDepositRequest(depositData);
                if (result) {
                    setMessage({
                        type: 'success',
                        text: 'Solicitud de depósito enviada exitosamente. Será revisada por un administrador.'
                    });
                    actions.resetForm();
                }
            }
        } catch (error) {
            console.error('Error creating deposit:', error);
            setMessage({ type: 'error', text: 'Error al crear el depósito. Intenta nuevamente.' });
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
                            className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${depositMethod === 'address'
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
                            className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${depositMethod === 'wallet'
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
                        {({ values }) => (
                            <>
                                {/* Deposit Address */}
                                <div className="mb-6">
                                    <DepositAddress cryptoType={values.cryptoType.toUpperCase() as CryptoType} />
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
                                                <option key={crypto.name} value={crypto.name} className="bg-slate-800 text-white">
                                                    {crypto.symbol}
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
                                        <div className={`p-4 rounded-xl backdrop-blur-lg border ${message.type === 'success'
                                            ? 'bg-green-500/20 border-green-500/30 text-green-300'
                                            : 'bg-red-500/20 border-red-500/30 text-red-300'
                                            }`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isCreatingDeposit}
                                        className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                                    >
                                        {isCreatingDeposit ? 'Procesando...' : 'Confirmar Depósito'}
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
                        {({ values }: { values: typeof initialValues }) => (
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
                                    {wallets.filter(wallet => wallet.isActive).length === 0 ? (
                                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
                                            <div className="text-yellow-300 font-medium mb-2">⚠️ No tienes wallets activas</div>
                                            <p className="text-sm text-gray-300">
                                                Necesitas crear al menos una wallet para poder depositar.
                                                Ve a la sección de "Mis Wallets" para crear una nueva wallet.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-4">
                                                    Selecciona tu Wallet
                                                </label>
                                                <Field name="cryptoWallet">
                                                    {({ field, form }: FieldProps) => (
                                                        <div className="space-y-3">
                                                            {wallets.filter(wallet => wallet.isActive).map((wallet) => {
                                                                const isSelected = field.value?.id === wallet.id;
                                                                const getCryptoIcon = (cryptoType: string) => {
                                                                    switch (cryptoType) {
                                                                        case 'BTC': return '₿';
                                                                        case 'ETH': return 'Ξ';
                                                                        case 'SOL': return '◎';
                                                                        default: return '🪙';
                                                                    }
                                                                };

                                                                return (
                                                                    <div
                                                                        key={wallet.id}
                                                                        onClick={() => {
                                                                            form.setFieldValue('cryptoWallet', wallet);
                                                                            form.setFieldValue('cryptoType', wallet.cryptoType.toLowerCase());
                                                                        }}
                                                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] ${isSelected
                                                                            ? 'border-green-500/60 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/25'
                                                                            : 'border-slate-600/50 hover:border-slate-500/70 text-gray-300 hover:bg-slate-700/20'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-4">
                                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isSelected
                                                                                    ? 'bg-green-500/30 border-green-500/50'
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
                                                                                <div className="text-sm opacity-75">
                                                                                    {wallet.cryptoType}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {isSelected && (
                                                                            <div className="absolute top-2 right-2">
                                                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </Field>
                                                <ErrorMessage name="cryptoWallet" component="div" className="text-red-400 text-sm mt-2" />

                                                {values.cryptoWallet && (
                                                    <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                            <span className="text-green-300 font-semibold">Wallet Seleccionada</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <span className="text-gray-400">Dirección completa:</span>
                                                                <p className="text-white font-mono text-xs break-all mt-1 p-2 bg-slate-800/50 rounded-lg">
                                                                    {values.cryptoWallet.address}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-400">Cryptomoneda:
                                                                    <span className="text-green-300 font-semibold mt-1">
                                                                        {' ' + values.cryptoWallet.cryptoType}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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
                                                    max={values.cryptoWallet?.balance || undefined}
                                                    className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm"
                                                    placeholder="0.00000000"
                                                />
                                                <ErrorMessage name="amount" component="div" className="text-red-400 text-sm mt-1" />
                                                {values.amount > 0 && values.cryptoWallet && (
                                                    <p className="text-sm text-green-300 mt-1">
                                                        ≈ ${convertToUSD(values.amount, values.cryptoType, values.cryptoWallet).toFixed(2)} USD
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {message && (
                                        <div className={`p-4 rounded-xl backdrop-blur-lg border ${message.type === 'success'
                                            ? 'bg-green-500/20 border-green-500/30 text-green-300'
                                            : 'bg-red-500/20 border-red-500/30 text-red-300'
                                            }`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isCreatingDeposit || wallets.filter(wallet => wallet.isActive).length === 0}
                                        className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                                    >
                                        {isCreatingDeposit ? 'Procesando...' : 'Depositar desde Wallet'}
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
