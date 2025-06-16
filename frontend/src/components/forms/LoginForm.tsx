import { useUser } from "../../hooks/useUser";
import WaveText from "../ui/WaveText";
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

const LoginForm = () => {
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
                <Form className=" p-4 flex flex-col gap-4 w-md text-center rounded-sm">
                    <WaveText text={'CasiNova'} classname="text-red-500 text-5xl" />
                    <h1 className="font-semibold text-lg">Inicia sesion</h1>

                    <div className="flex flex-col gap-2">
                        <Field
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Ingresa tu correo electronico"
                            className="input"
                        />
                        <ErrorMessage name="email" component="label"
                            className="text-red-500 text-sm text-start"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            placeholder="******"
                            className="input"
                        />
                        <ErrorMessage name="password" component="label"
                            className="text-red-500 text-sm text-start"
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="boton-1">
                        Iniciar sesion
                    </button>

                    <h5>
                        ¿Aun no tienes una cuenta?{" "}
                        <span className="text-blue-400">Registrate aqui</span>
                    </h5>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;