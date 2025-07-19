export type UserType = {
    idUsuario: number | null;
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

export interface DocumentoType {
    idDocumento: number;
    tipoDocumento: "Credencial de Elector" | "Comprobante de Domicilio" | "Pasaporte" | "Cédula de Identidad";
    estado: "Pendiente de Revisión" | "Aprobado" | "Rechazado" | "En Revisión";
    nombreArchivo: string;
    rutaArchivo: string;
    urlArchivo: string;
    fechaSubida: string;
    fechaVerificacion: string;
    comentariosVerificacion: string;
}

export interface TicketType{
    id:number;
    titulo:string;
    fechaCreacion:string;
    descripcion:string;
    estado:"RESUELTO"|"PENDIENTE";
}
