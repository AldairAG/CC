export type UserType= {
    idUsuario: number|null;
    email: string;
    username: string;
    saldoUsuario: number;
    perfilImage: string;
    idPerfil?: number;
    rol: string[];
}

export type NuevoUsuarioRequestType = {
    password: string;
    email: string;
    telefono: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    lada: string;
}