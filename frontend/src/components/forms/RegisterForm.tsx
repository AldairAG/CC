import WaveText from "../ui/WaveText";
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

const formulario: FormField[] = [
    { id: 'username', pl: 'Usuario' },
    { id: 'nombres', pl: 'Ingresa tu nombre(s)' },
    { id: 'apellidos', pl: 'Ingresa tu apellido(s)' },
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


const RegisterForm = () => {

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
                <Form className="bg-gray-50 p-4 flex flex-col gap-4 w-md text-center rounded-sm">
                    <WaveText text={'CasiNova'} classname="text-red-500 text-5xl" />
                    <h1 className="font-semibold text-lg">Crear una cuenta</h1>

                    {formulario.map((item, index) => (
                        <div key={index}>
                            <label htmlFor={item.id} className="block text-gray-500 text-left mb-1">{item.pl}</label>
                            <Field
                                id={item.id}
                                name={item.id}
                                type={item.type || 'text'}
                                placeholder={item.pl}
                                className="input"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                values={values[item.id]}
                            />
                            <ErrorMessage name={item.id} component="div" className="text-red-500 text-xs text-left" />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="fechaNacimiento" className="block text-gray-500 text-left mb-1">Fecha de nacimiento</label>
                        <div className="flex gap-2">
                            <select
                                className="input flex-1"
                                value={values.fechaNacimiento ? parseInt(values.fechaNacimiento.split('-')[2] || '0') : ''}
                                onChange={(e) => {
                                    const day = e.target.value.padStart(2, '0');
                                    const currentDate = values.fechaNacimiento ? values.fechaNacimiento.split('-') : [`${new Date().getFullYear()}`, '01', '01'];
                                    const newDate = `${currentDate[0]}-${currentDate[1]}-${day}`;
                                    handleChange({ target: { name: 'fechaNacimiento', value: newDate } });
                                }}
                            >
                                <option value="">Día</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="input flex-1"
                                value={values.fechaNacimiento ? parseInt(values.fechaNacimiento.split('-')[1] || '0') : ''}
                                onChange={(e) => {
                                    const month = e.target.value.padStart(2, '0');
                                    const currentDate = values.fechaNacimiento ? values.fechaNacimiento.split('-') : [`${new Date().getFullYear()}`, '01', '01'];
                                    const newDate = `${currentDate[0]}-${month}-${currentDate[2]}`;
                                    handleChange({ target: { name: 'fechaNacimiento', value: newDate } });
                                }}
                            >
                                <option value="">Mes</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="input flex-1"
                                value={values.fechaNacimiento ? values.fechaNacimiento.split('-')[0] : ''}
                                onChange={(e) => {
                                    const year = e.target.value;
                                    const currentDate = values.fechaNacimiento ? values.fechaNacimiento.split('-') : [year, '01', '01'];
                                    const newDate = `${year}-${currentDate[1]}-${currentDate[2]}`;
                                    handleChange({ target: { name: 'fechaNacimiento', value: newDate } });
                                }}
                            >
                                <option value="">Año</option>
                                {[...Array(100)].map((_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </div>
                        <ErrorMessage name="fechaNacimiento" component="div" className="text-red-500 text-xs text-left" />
                    </div>

                    <div className="text-start">
                        <label htmlFor="telefono" className="text-gray-500">Teléfono</label>
                        <div className="flex gap-2">
                            <select
                                className="input w-24"
                                name="lada"
                                defaultValue="+52"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lada}
                            >
                                <option value="+52">+52 🇲🇽</option>
                                <option value="+1">+1 🇺🇸</option>
                                <option value="+34">+34 🇪🇸</option>
                                <option value="+57">+57 🇨🇴</option>
                                <option value="+51">+51 🇵🇪</option>
                            </select>
                            <Field
                                id="telefono"
                                name="telefono"
                                type="text"
                                className="input flex-1"
                                placeholder="Número de teléfono"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                values={values.telefono}
                            />
                        </div>
                        <ErrorMessage name="telefono" component="div" className="text-red-500 text-xs text-left" />
                    </div>

                    <button
                        className="boton-1"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                    </button>

                    <h5>¿Aun no tienes una cuenta? <span className="text-blue-400">Registrate aqui</span></h5>
                </Form>
            )}
        </Formik>
    )
}

export default RegisterForm;