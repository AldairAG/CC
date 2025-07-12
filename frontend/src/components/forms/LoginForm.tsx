import { useUser } from "../../hooks/useUser";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Email invalido")
        .required("Campo requerido"),
    password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("Campo requerido"),
});

interface LoginFormProps {
    switchToRegister?: () => void;
}

const LoginForm = ({ switchToRegister }: LoginFormProps) => {
    const { login } = useUser();

    const handleLogin = async (email: string, password: string) => {
        await login(email, password);
    };

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
                await handleLogin(values.email, values.password);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="relative max-w-md w-full space-y-6">
                    {/* Logo y título */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mb-2">
                            24<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">bet</span>
                        </h1>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-slate-400 font-medium">
                            Accede a tu cuenta y comienza a ganar
                        </p>
                    </div>

                    {/* Campo Email */}
                    <div className="relative group">
                        <label htmlFor="email" className="block text-slate-300 text-sm font-semibold mb-2">
                            Correo Electrónico
                        </label>
                        <Field
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            className="w-full px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
                        />
                        <ErrorMessage 
                            name="email" 
                            component="div"
                            className="mt-1 text-red-400 text-xs font-medium"
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="relative group">
                        <label htmlFor="password" className="block text-slate-300 text-sm font-semibold mb-2">
                            Contraseña
                        </label>
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
                        />
                        <ErrorMessage 
                            name="password" 
                            component="div"
                            className="mt-1 text-red-400 text-xs font-medium"
                        />
                    </div>

                    {/* Botón de envío */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 disabled:scale-100 transition-all duration-300 border border-amber-500/30 disabled:border-slate-600/30"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Iniciando sesión...
                            </span>
                        ) : (
                            "🚀 Iniciar Sesión"
                        )}
                    </button>

                    {/* Link para registrarse */}
                    <div className="text-center pt-4 border-t border-slate-600/30">
                        <p className="text-slate-400 text-sm font-medium">
                            ¿No tienes una cuenta?{" "}
                            <button
                                type="button"
                                onClick={switchToRegister}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 font-bold hover:from-blue-300 hover:to-cyan-400 transition-all duration-300"
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;