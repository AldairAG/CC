import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useCrypto } from '../../../hooks/useCrypto';
import * as Yup from 'yup';
import type { UserWallet, CreateWalletRequest, CryptoType } from '../../../types/CryptoTypes';

const WalletManagementPage = () => {
  const {
    wallets,
    createWallet,
    getUserWallets,
    updateWallet,
    deleteWallet,
    isCreatingWallet,
    isUpdatingWallet,
    isFetchingWallets,
  } = useCrypto();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<UserWallet | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cryptoOptions: CryptoType[] = ['BTC', 'ETH', 'SOL'];

  // Validation schema
  const walletValidationSchema = Yup.object().shape({
    address: Yup.string()
      .min(10, 'La dirección parece inválida')
      .required('La dirección es requerida'),
    cryptoType: Yup.string().required('Selecciona un tipo de criptomoneda'),
    notes: Yup.string().optional()
  });

  // Load wallets
  const loadWallets = async () => {
    try {
      await getUserWallets();
    } catch (error) {
      console.error('Error loading wallets:', error);
      setMessage({ type: 'error', text: 'Error al cargar las wallets' });
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  // Create wallet
  const handleCreateWallet = async (values: CreateWalletRequest, { resetForm }: any) => {
    try {
      const result = await createWallet(values);
      if (result) {
        setMessage({ type: 'success', text: 'Wallet agregada exitosamente' });
        setShowAddForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      setMessage({ type: 'error', text: 'Error al crear la wallet' });
    }
  };

  // Update wallet
  const handleUpdateWallet = async (values: CreateWalletRequest) => {
    if (!editingWallet) return;

    try {
      const result = await updateWallet(editingWallet.id, values);
      if (result) {
        setMessage({ type: 'success', text: 'Wallet actualizada exitosamente' });
        setEditingWallet(null);
      }
    } catch (error) {
      console.error('Error updating wallet:', error);
      setMessage({ type: 'error', text: 'Error al actualizar la wallet' });
    }
  };

  // Delete wallet
  const handleDeleteWallet = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta wallet?')) return;

    try {
      const result = await deleteWallet(id);
      if (result) {
        setMessage({ type: 'success', text: 'Wallet eliminada exitosamente' });
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la wallet' });
    }
  };

  // Toggle wallet status
  const handleToggleWalletStatus = async (wallet: UserWallet) => {
    try {
      // Crear un objeto con la propiedad isActive
      const updatedData = {
        address: wallet.address,
        cryptoType: wallet.cryptoType,
        isActive: !wallet.isActive
      };
      
      const result = await updateWallet(wallet.id, updatedData);
      if (result) {
        setMessage({
          type: 'success',
          text: `Wallet ${!wallet.isActive ? 'activada' : 'desactivada'} exitosamente`
        });
      }
    } catch (error) {
      console.error('Error toggling wallet status:', error);
      setMessage({ type: 'error', text: 'Error al cambiar el estado de la wallet' });
    }
  };

  const getCryptoIcon = (cryptoType: CryptoType) => {
    switch (cryptoType) {
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      case 'SOL': return '◎';
      default: return '🪙';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Gestión de Wallets</h1>
          <p className="text-gray-300 mt-1">Administra tus wallets de criptomonedas</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:scale-105"
        >
          + Agregar Wallet
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 backdrop-blur-lg border ${message.type === 'success'
            ? 'bg-green-500/20 border-green-500/30 text-green-300'
            : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-200 text-xl">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingWallet) && (
        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700/50">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
            {editingWallet ? 'Editar Wallet' : 'Agregar Nueva Wallet'}
          </h2>

          <Formik
            initialValues={{
              address: editingWallet?.address || '',
              cryptoType: editingWallet?.cryptoType || 'BTC' as CryptoType,
              notes: ''
            }}
            validationSchema={walletValidationSchema}
            onSubmit={editingWallet ? handleUpdateWallet : handleCreateWallet}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dirección de la Wallet
                </label>
                <Field
                  type="text"
                  name="address"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm font-mono text-sm"
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                />
                <ErrorMessage name="address" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Criptomoneda
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
                  Notas (Opcional)
                </label>
                <Field
                  as="textarea"
                  name="notes"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm resize-none"
                  rows={3}
                  placeholder="Información adicional sobre esta wallet"
                />
                <ErrorMessage name="notes" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isCreatingWallet || isUpdatingWallet}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300 font-medium shadow-lg"
                >
                  {(isCreatingWallet || isUpdatingWallet) ? 'Guardando...' : editingWallet ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingWallet(null);
                  }}
                  className="flex-1 py-3 px-4 bg-slate-600/50 text-white rounded-xl hover:bg-slate-500/50 transition-all duration-300 font-medium backdrop-blur-sm border border-slate-600/50"
                >
                  Cancelar
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      )}

      {/* Wallets List */}
      <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/40 to-slate-700/40">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Mis Wallets ({(wallets||[]).length})
          </h2>
        </div>

        {isFetchingWallets && (wallets||[]).length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            Cargando wallets...
          </div>
        ) : (wallets||[]).length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="text-4xl mb-2">👛</div>
            <div className="text-lg font-medium mb-1 text-amber-300">No tienes wallets registradas</div>
            <div className="text-sm mb-4">Agrega tu primera wallet para comenzar</div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg"
            >
              Agregar Primera Wallet
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {wallets.map((wallet: UserWallet) => (
              <div key={wallet.id} className="p-6 hover:bg-slate-700/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 backdrop-blur-sm">
                      <span className="text-amber-300 text-xl">{getCryptoIcon(wallet.cryptoType)}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-white">{wallet.cryptoType} Wallet</h3>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium border ${wallet.isActive
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }`}>
                          {wallet.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        <div className="font-mono break-all text-amber-300 text-xs bg-slate-800/30 px-2 py-1 rounded inline-block">{wallet.address}</div>
                        <div className="mt-2 text-gray-400">
                          <span className="font-medium">{wallet.cryptoType}</span> • Creada el {formatDate(wallet.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleWalletStatus(wallet)}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${wallet.isActive
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30'
                          : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                        }`}
                    >
                      {wallet.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => setEditingWallet(wallet)}
                      className="px-3 py-2 text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-200 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="px-3 py-2 text-sm bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManagementPage;
