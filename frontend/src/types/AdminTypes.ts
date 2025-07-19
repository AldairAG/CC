import type { CryptoTransaction } from "./CryptoTypes";
import type { DocumentoType, TicketType } from "./UserTypes";

export interface AdminStats {
    totalUsuarios: number;
    usuariosActivos: number;
    usuariosNuevosHoy: number;
    usuariosNuevosMes: number;

    // Estadísticas de apuestas
    totalApuestas: number;
    apuestasActivas: number;
    apuestasPendientes: number;
    montoTotalApuestas: number;
    gananciasHoy: number;
    gananciasMes: number;

    // Estadísticas de quinielas
    totalQuinielas: number;
    quinielasActivas: number;
    quinielasFinalizadas: number;
    poolTotalQuinielas: number;

    // Estadísticas de eventos
    totalEventos: number;
    eventosEnVivo: number;
    eventosHoy: number;
    eventosPendientes: number;

    // Estadísticas de crypto
    totalTransaccionesCrypto: number;
    transaccionesPendientes: number;
    volumenCryptoHoy: number;
    volumenCryptoMes: number;

    // Estadísticas de notificaciones
    totalNotificaciones: number;
    notificacionesNoLeidas: number;
    notificacionesEnviadas: number;

    // Estadísticas financieras
    ingresosTotales: number;
    ingresosHoy: number;
    ingresosMes: number;
    saldoTotal: number;

    // Metadatos
    fechaActualizacion: string;
    version: string;
}

export interface AdminUser {
    idUsuario: number;
    email: string;
    username: string;
    saldoUsuario: number;
    estado: string;
    rol: string[];
    activo: boolean;
    fechaRegistro: string;
    ultimaConexion?: string;
    gananciasPerdidas: number,
    ultimoAcceso: number,
    fechaNacimiento:string,

    nombreCompleto: string;
    apellidos: string;
    telefono: string;
    lada:string;
    //Estadísticas del usuario
    totalApuestas: number;
    montoTotalApostado: number;
    gananciasObtenidas: number;
    quinielasParticipadas: number;
    transaccionesCrypto: number;
    //Información de seguridad
    verificado: boolean;
    twoFactorEnabled: boolean;
    ultimoLogin: string;
    ultimaIp: string;
    intentosLogin: number;
    //Auditoría
    fechaCreacion: string;
    fechaActualizacion: string;
    creadoPor: string;
    actualizadoPor: string;
    //Información de contacto
    pais: string;
    ciudad: string;
    codigoPostal: string;
    //Configuraciones
    notificacionesEmail: boolean;
    notificacionesSms: boolean;
    idioma: string;
    monedaPreferida: string;
    documentos:DocumentoType[];
    tickets:TicketType[];
    
}

export interface AdminBet {

    idApuesta: number;
    tipoApuesta: string; // SIMPLE, MULTIPLE, SISTEMA

    // Información del usuario
    usuarioId: number;
    usuarioUsername: string;
    usuarioEmail: string;

    // Información del evento
    eventoId: number;
    eventoNombre: string;
    equipoLocal: string;
    equipoVisitante: string;
    deporte: string;
    liga: string;

    // Información de la apuesta
    prediccion: string;
    descripcion: string;
    cuotaApostada: number;
    montoApostado: number;
    gananciasPotenciales: number;
    gananciasObtenidas: number;

    // Estado y resultado
    estado: 'PENDIENTE' | 'GANADA' | 'PERDIDA' | 'CANCELADA'; // PENDIENTE, GANADA, PERDIDA, CANCELADA, ANULADA
    resultado: string; // GANADOR, PERDEDOR, EMPATE
    finalizada: boolean;

    // Información de riesgo
    nivelRiesgo: string; // BAJO, MEDIO, ALTO
    probabilidad: number;
    sospechosa: boolean;
    motivoSospecha: string;

    // Auditoría
    fechaCreacion: string;
    fechaFinalizacion: string;
    fechaActualizacion: string;
    procesadoPor: string;

    // Información del evento en tiempo real
    estadoEvento: string; // PROGRAMADO, EN_VIVO, FINALIZADO, CANCELADO
    fechaEvento: string;
    marcadorLocal: number;
    marcadorVisitante: number;


}

export interface AdminQuiniela {
    idQuiniela: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';
    participantes: number;
    premioTotal: number;
    creador: string;
}

export interface AdminEvent {
    idEvento: number;
    codigoEvento: string;
    nombre: string;
    descripcion: string;

    // Información del deporte/liga
    deporte: string; // FUTBOL, BASKETBALL, TENNIS
    liga: string;
    temporada: string;
    categoria: string;

    // Equipos/Participantes
    equipoLocal: string;
    equipoVisitante: string;
    logoEquipoLocal: string;
    logoEquipoVisitante: string;

    // Estado del evento
    estado: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO'; // PROGRAMADO, EN_VIVO, FINALIZADO, SUSPENDIDO, CANCELADO
    resultado: string;
    marcador: string;
    golesLocal: number;
    golesVisitante: number;

    // Fechas y horarios
    fechaEvento: string;
    fechaInicio: string;
    fechaFin: string;
    fechaCreacion: string;
    fechaActualizacion: string;

    // Información de apuestas
    cuotaLocal: number;
    cuotaEmpate: number;
    cuotaVisitante: number;
    totalApuestas: number;
    montoTotalApostado: number;
    exposicionRiesgo: number;

    // Fuente de datos
    fuenteDatos: string; // MANUAL, THE_SPORTS_DB, API_EXTERNA
    idEventoExterno: string;
    urlStreamig: string;
    verificado: boolean;

    // Información del lugar
    estadio: string;
    ciudad: string;
    pais: string;
    capacidad: number;
    asistencia: number;

    // Métricas administrativas
    popularidad: number;
    participacionQuinielas: number;
    ingresoGenerado: number;
    nivelRiesgo: string; // BAJO, MEDIO, ALTO

    // Información adicional
    arbitro: string;
    clima: string;
    notas: string;
    destacado: boolean;
    prioridad: string;

    // Auditoría
    creadoPor: string;
    modificadoPor: string;
    estadoAdmin: string; // PENDIENTE, APROBADO, RECHAZADO
    motivoRechazo: string;

}

export interface AdminNotification {
    idNotificacion: number;
    titulo: string;
    mensaje: string;
    tipo: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    fechaCreacion: string;
    leida: boolean;
    usuarioDestino?: string;
    global: boolean;
}

export interface AdminRole {
    idRol: number;
    nombreRol: string;
    descripcion: string;
    permisos: string[];
    activo: boolean;
    fechaCreacion: string;
}

export interface AdminConfig {
    clave: string;
    valor: string;
    descripcion: string;
    tipo: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
    categoria: string;
}

export interface AdminCrypto {
    idTransaccion: number;
    usuario: string;
    tipo: 'DEPOSITO' | 'RETIRO';
    moneda: string;
    cantidad: number;
    estado: 'PENDIENTE' | 'COMPLETADA' | 'FALLIDA' | 'CANCELADA';
    fechaTransaccion: string;
    hash?: string;
    direccionWallet?: string;
}

// Request types para creación y actualización
export interface CreateUserRequest {
    email: string;
    username: string;
    password: string;
    telefono: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    lada: string;
    rol: string[];
}

export interface UpdateUserRequest {
    idUsuario: number;
    email?: string;
    username?: string;
    saldoUsuario?: number;
    rol?: string[];
    activo?: boolean;
}

export interface CreateNotificationRequest {
    titulo: string;
    mensaje: string;
    tipo: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    usuarioDestino?: number;
    global: boolean;
}

export interface CreateRoleRequest {
    nombreRol: string;
    descripcion: string;
    permisos: string[];
}

export interface UpdateRoleRequest {
    idRol: number;
    nombreRol?: string;
    descripcion?: string;
    permisos?: string[];
    activo?: boolean;
}

export interface UpdateConfigRequest {
    clave: string;
    valor: string;
    descripcion?: string;
}

export interface AdminState {
    stats: AdminStats | null;
    users: AdminUser[];
    bets: AdminBet[];
    quinielas: AdminQuiniela[];
    events: AdminEvent[];
    notifications: AdminNotification[];
    roles: AdminRole[];
    configs: AdminConfig[];
    cryptoTransactions: CryptoTransaction[];
    loading: boolean;
    error: string | null;
    selectedUser: AdminUser | null;
    selectedBet: AdminBet | null;
    selectedQuiniela: AdminQuiniela | null;
    selectedEvent: AdminEvent | null;
}
