import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useUser from "../../hooks/useUser";

interface FormValues {
    username: string;
    password: string;
    email: string;
    telefono: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    lada: string;
}

interface FormField {
    id: keyof FormValues;
    pl: string;
    type?: string;
}

interface RegisterFormProps {
    switchToLogin?: () => void;
}

const formulario: FormField[] = [
    { id: 'username', pl: 'Usuario' },
    { id: 'nombres', pl: 'Nombres' },
    { id: 'apellidos', pl: 'Apellidos' },
    { id: 'password', pl: 'Contraseña', type: 'password' },
    { id: 'email', pl: 'Correo electrónico', type: 'email' }
];

const validationSchema = Yup.object({
    username: Yup.string()
        .required("Campo requerido")
        .min(2, "El usuario debe tener al menos 3 caracteres"),
    nombres: Yup.string()
        .required("Campo requerido")
        .matches(/^[a-zA-Z\s]+$/, "Solo se permiten letras"),
    apellidos: Yup.string()
        .required("Campo requerido")
        .matches(/^[a-zA-Z\s]+$/, "Solo se permiten letras"),
    password: Yup.string()
        /* .min(8, "La contraseña debe tener al menos 8 caracteres")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    "Debe contener al menos una mayúscula, una minúscula y un número"
                ) */
        .required("Campo requerido"),
    email: Yup.string()
        .email("Email inválido")
        .required("Campo requerido"),
    telefono: Yup.string()
        .matches(/^[0-9\s+]+$/, "Solo se permiten números")
        .min(10, "El teléfono debe tener al menos 10 dígitos"),
    fechaNacimiento: Yup.date()
        .max(new Date(), "La fecha no puede ser futura")
        .required("Campo requerido")
})

const initialValues = {
    username: '',
    password: '',
    email: '',
    telefono: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    lada: '+52'
};


const RegisterForm = ({ switchToLogin }: RegisterFormProps) => {

    const { createUser } = useUser();

    const handleSubmit = async (values: FormValues) => {
        try {
            console.log("Formulario enviado:", values);
            await createUser(values)
        } catch (error) {
            console.log("Error al enviar el formulario:", error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ isSubmitting, handleChange, handleBlur, values }) => (
                <Form className="relative max-w-md w-full space-y-6">
                    {/* Logo y título */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mb-2">
                            24<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">bet</span>
                        </h1>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
                            Crear Cuenta
                        </h2>
                        <p className="text-slate-400 font-medium">
                            Únete a miles de ganadores en 24bet
                        </p>
                    </div>

                    {/* Campos básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formulario.map((item, index) => (
                            <div key={index} className="relative group">
                                <label htmlFor={item.id} className="block text-slate-300 text-sm font-semibold mb-2">
                                    {item.pl}
                                </label>
                                <Field
                                    id={item.id}
                                    name={item.id}
                                    type={item.type || 'text'}
                                    placeholder={`Ingresa tu ${item.pl.toLowerCase()}`}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name={item.id} component="div" className="mt-1 text-red-400 text-xs font-medium" />
                            </div>
                        ))}
                    </div>

                    {/* Campo Fecha de Nacimiento */}
                    <div className="relative group">
                        <label htmlFor="fechaNacimiento" className="block text-slate-300 text-sm font-semibold mb-2">
                            Fecha de Nacimiento
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <select
                                className="px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
                                value={values.fechaNacimiento ? parseInt(values.fechaNacimiento.split('-')[2] || '0') : ''}
                                onChange={(e) => {
                                    const day = e.target.value.padStart(2, '0');
                                    const currentDate = values.fechaNacimiento ? values.fechaNacimiento.split('-') : [`${new Date().getFullYear()}`, '01', '01'];
                                    const newDate = `${currentDate[0]}-${currentDate[1]}-${day}`;
                                    handleChange({ target: { name: 'fechaNacimiento', value: newDate } });
                                }}
                            >
                                <option value="" className="bg-slate-800 text-slate-300">Día</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1} className="bg-slate-800 text-slate-300">{i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
                                value={values.fechaNacimiento ? parseInt(values.fechaNacimiento.split('-')[1] || '0') : ''}
                                onChange={(e) => {
                                    const month = e.target.value.padStart(2, '0');
                                    const currentDate = values.fechaNacimiento ? values.fechaNacimiento.split('-') : [`${new Date().getFullYear()}`, '01', '01'];
                                    const newDate = `${currentDate[0]}-${month}-${currentDate[2]}`;
                                    handleChange({ target: { name: 'fechaNacimiento', value: newDate } });
                                }}
                            >
                                <option value="" className="bg-slate-800 text-slate-300">Mes</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1} className="bg-slate-800 text-slate-300">{i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
                                value={values.fechaNacimiento ? values.fechaNacimiento.split('-')[0] : ''}
                                onChange={(e) => {
                                    const year = e.target.value;
                                    const currentDate = values.fechaNacimiento ? values.fechaNacimiento.split('-') : [year, '01', '01'];
                                    const newDate = `${year}-${currentDate[1]}-${currentDate[2]}`;
                                    handleChange({ target: { name: 'fechaNacimiento', value: newDate } });
                                }}
                            >
                                <option value="" className="bg-slate-800 text-slate-300">Año</option>
                                {[...Array(100)].map((_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year} className="bg-slate-800 text-slate-300">{year}</option>;
                                })}
                            </select>
                        </div>
                        <ErrorMessage name="fechaNacimiento" component="div" className="mt-1 text-red-400 text-xs font-medium" />
                    </div>

                    {/* Campo Teléfono */}
                    <div className="relative group">
                        <label htmlFor="telefono" className="block text-slate-300 text-sm font-semibold mb-2">
                            Teléfono
                        </label>
                        <div className="flex gap-2">
                            <select
                                className="px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm w-24"
                                name="lada"
                                value={values.lada}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="+52" className="bg-slate-800 text-slate-300">+52 🇲🇽</option>
                                <option value="+1" className="bg-slate-800 text-slate-300">+1 🇺🇸</option>
                                <option value="+34" className="bg-slate-800 text-slate-300">+34 🇪🇸</option>
                                <option value="+57" className="bg-slate-800 text-slate-300">+57 🇨🇴</option>
                                <option value="+51" className="bg-slate-800 text-slate-300">+51 🇵🇪</option>
                            </select>
                            <Field
                                id="telefono"
                                name="telefono"
                                type="text"
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
                                placeholder="Número de teléfono"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        <ErrorMessage name="telefono" component="div" className="mt-1 text-red-400 text-xs font-medium" />
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
                                Creando cuenta...
                            </span>
                        ) : (
                            "🚀 Crear Cuenta"
                        )}
                    </button>

                    {/* Link para iniciar sesión */}
                    <div className="text-center pt-4 border-t border-slate-600/30">
                        <p className="text-slate-400 text-sm font-medium">
                            ¿Ya tienes una cuenta?{" "}
                            <button
                                type="button"
                                onClick={switchToLogin}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 font-bold hover:from-blue-300 hover:to-cyan-400 transition-all duration-300"
                            >
                                Inicia sesión aquí
                            </button>
                        </p>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default RegisterForm;