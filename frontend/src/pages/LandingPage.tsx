import WaveText from "../components/ui/WaveText"
import img1 from '../assets/casino_games.png'
import img2 from '../assets/chicas_ganando.png'
import img3 from '../assets/register.png'
import img4 from '../assets/maletin.png'
import img5 from '../assets/manosCartas.png'
import img6 from '../assets/ruleta.png'
import img7 from '../assets/personasGanando.png'
import { useState } from "react"
import LoginForm from "../components/forms/LoginForm"
import RegisterForm from "../components/forms/RegisterForm"
import { motion } from "framer-motion";
import { useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline"

const LandingPage = () => {

    const [state, setState] = useState({
        login: false,
        register: false
    })

    const closeModal = useCallback(() => {
        setState((prev) => {
            const modal = prev.register ? "register" : "login";
            return {
                ...prev,
                [modal]: !prev[modal],
            };
        });
    }, []);

    const openModal = useCallback((modal: 'login' | 'register') => {
        setState({
            login: modal === 'login',
            register: modal === 'register'
        });
    }, []);

    const switchToRegister = useCallback(() => {
        setState({ login: false, register: true });
    }, []);

    const switchToLogin = useCallback(() => {
        setState({ login: true, register: false });
    }, []);


    return (
        <section className={'relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ' + (state.login || state.register) && (' overflow-y-hidden')}>

            {(state.login || state.register) && (
                <div className="bg-slate-900/80 backdrop-blur-sm absolute w-full h-full z-50 flex justify-center items-center">
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 text-slate-400 hover:text-amber-400 transition-colors duration-300 z-60"
                        aria-label="Cerrar modal"
                    >
                        <XMarkIcon className="h-8 w-8" />
                    </button>
                    {state.login && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative bg-gradient-to-br from-slate-800/90 via-slate-800/95 to-slate-800/90 backdrop-blur-sm shadow-2xl p-8 rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-50 rounded-2xl"></div>
                            <div className="relative z-10">
                                <LoginForm switchToRegister={switchToRegister} />
                            </div>
                        </motion.div>
                    )}
                    {state.register && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative bg-gradient-to-br from-slate-800/90 via-slate-800/95 to-slate-800/90 backdrop-blur-sm shadow-2xl p-8 rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-50 rounded-2xl"></div>
                            <div className="relative z-10">
                                <RegisterForm switchToLogin={switchToLogin} />
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Header */}
            <header className="relative h-20 flex items-center justify-between px-6 md:px-12 z-40">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border-b border-slate-700/50"></div>
                <div className="relative z-10 flex items-center justify-between w-full">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => {
                            // Close any open modals when clicking logo
                            setState({ login: false, register: false });
                        }}
                    >
                        24<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">bet</span>
                    </motion.h1>
                    <div className="flex gap-4">
                        <motion.button 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-500/30"
                            onClick={() => openModal('login')}
                        >
                            Iniciar Sesión
                        </motion.button>
                        <motion.button 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-amber-500/30"
                            onClick={() => openModal('register')}
                        >
                            Registrarse
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative bg-cover bg-center flex flex-col justify-center items-center pt-20 pb-16 min-h-screen overflow-hidden"
                style={{ backgroundImage: `url(${img1})` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative text-center z-10 max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                                El Casino Crypto
                            </span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-purple-500">
                                del Futuro
                            </span>
                        </h1>
                        <div className="relative">
                            <WaveText 
                                text={'¡Apuesta con Bitcoin y Cryptos!'} 
                                classname="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500" 
                            />
                        </div>
                    </motion.div>
                    
                    <motion.h3 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl mb-8 text-slate-300 font-medium max-w-4xl mx-auto"
                    >
                        Disfruta de la experiencia de casino más innovadora. Depósitos instantáneos, retiros rápidos, 
                        y las mejores odds en el mercado crypto.
                    </motion.h3>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button 
                            onClick={() => openModal('register')}
                            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-amber-500/30"
                        >
                            🎰 Jugar Ahora
                        </button>
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-blue-400 font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-500/30 backdrop-blur-sm">
                            💎 Ver Promociones
                        </button>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
                    >
                        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">24/7</div>
                            <div className="text-sm text-slate-300 font-medium">Soporte</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">100+</div>
                            <div className="text-sm text-slate-300 font-medium">Cryptos</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">1000+</div>
                            <div className="text-sm text-slate-300 font-medium">Juegos</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">99.5%</div>
                            <div className="text-sm text-slate-300 font-medium">RTP</div>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="relative mt-8"
                >
                    <img src={img2} alt="crypto casino" className="max-w-lg mx-auto rounded-2xl shadow-2xl" />
                </motion.div>
            </div>

            {/* Steps Section */}
            <div className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Pasos para </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">empezar</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-slate-300 font-medium mb-12"
                    >
                        Comenzar a ganar nunca había sido tan fácil, solo sigue estos simples pasos
                    </motion.p>
                </div>
            </div>

            {/* Steps Cards */}
            <div className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 transform hover:scale-105 text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-50 rounded-xl"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
                                    <img src={img3} alt="Registro" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                                    Regístrate Hoy
                                </h3>
                                <p className="text-slate-300 font-medium">
                                    Crea una cuenta con tu correo electrónico y contraseña segura. El proceso es rápido y fácil.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 transform hover:scale-105 text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-50 rounded-xl"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                                    <img src={img4} alt="Depósito" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-4">
                                    Deposita Crypto
                                </h3>
                                <p className="text-slate-300 font-medium">
                                    Haz tu primer depósito con Bitcoin, Ethereum o cualquier otra criptomoneda. Transacciones instantáneas.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 transform hover:scale-105 text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-50 rounded-xl"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                                    <img src={img5} alt="Ganancias" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
                                    Empieza a Ganar
                                </h3>
                                <p className="text-slate-300 font-medium">
                                    Disfruta de más de 1000 juegos y comienza a multiplicar tus ganancias en 24bet.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Promotion Section */}
            <div className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-50"></div>
                <div className="absolute -top-10 -left-10 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-2 border border-slate-700/50">
                                <img src={img6} alt="Ruleta casino" className="w-full rounded-lg shadow-lg" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center lg:text-left"
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Promoción de </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Bienvenida</span>
                            </h2>
                            <p className="text-xl text-slate-300 font-medium mb-4">
                                Regístrate ahora y recibe un bono de bienvenida increíble
                            </p>
                            <p className="text-lg text-slate-400 mb-8">
                                Además, si recomiendas a un amigo, ambos reciben bonos adicionales
                            </p>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-center lg:justify-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">🎁</span>
                                    </div>
                                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                        Bono de Bienvenida hasta 1000 USDT
                                    </span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">🚀</span>
                                    </div>
                                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                                        Giros Gratis en Slots Premium
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => openModal('register')}
                                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-amber-500/30"
                            >
                                🎰 Reclamar Bono Ahora
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${img7})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            Estadísticas en Tiempo Real
                        </h2>
                        <p className="text-xl text-slate-300 font-medium">
                            Únete a miles de jugadores que ya están ganando en 24bet
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 transform hover:scale-105 text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-50 rounded-xl"></div>
                            <div className="relative z-10">
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
                                    50,000+
                                </div>
                                <div className="text-slate-300 font-bold">
                                    Jugadores Registrados
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 transform hover:scale-105 text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-50 rounded-xl"></div>
                            <div className="relative z-10">
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
                                    1,245
                                </div>
                                <div className="text-slate-300 font-bold">
                                    Ganadores Hoy
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 transform hover:scale-105 text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-50 rounded-xl"></div>
                            <div className="relative z-10">
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2">
                                    25,000+
                                </div>
                                <div className="text-slate-300 font-bold">
                                    Ganadores Totales
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105 text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-50 rounded-xl"></div>
                            <div className="relative z-10">
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                                    2.5M+
                                </div>
                                <div className="text-slate-300 font-bold">
                                    Partidas Jugadas
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-30"></div>
                <div className="absolute -top-10 -left-10 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                                    24
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                                    bet
                                </span>
                            </h2>
                            <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">
                                El casino crypto más innovador del mundo. Únete a la revolución de las apuestas digitales.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                        >
                            <button 
                                onClick={() => openModal('register')}
                                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-amber-500/30"
                            >
                                🚀 Comenzar Ahora
                            </button>
                            <button 
                                onClick={() => openModal('login')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-blue-400 font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-500/30 backdrop-blur-sm"
                            >
                                🎯 Iniciar Sesión
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                        >
                            <div className="text-center">
                                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
                                    Juegos
                                </div>
                                <div className="text-slate-400">
                                    Slots, Póker, Blackjack
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2">
                                    Soporte
                                </div>
                                <div className="text-slate-400">
                                    24/7 Chat en Vivo
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
                                    Seguridad
                                </div>
                                <div className="text-slate-400">
                                    Encriptación SSL
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                                    Licencia
                                </div>
                                <div className="text-slate-400">
                                    Regulado y Seguro
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="pt-8 border-t border-slate-700/50"
                        >
                            <p className="text-slate-400 text-sm">
                                © 2025 24bet Casino. Todos los derechos reservados. Juega responsablemente.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </footer>

        </section>
    )
}

export default LandingPage