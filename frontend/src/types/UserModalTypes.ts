// Tipos específicos para los modales de usuario
export interface UserDetailData {
    // Información básica
    idUsuario: number;
    email: string;
    username: string;
    estado: string;
    estadoCuenta: boolean;
    saldoUsuario: number;
    
    // Información del perfil
    perfil: {
        nombres: string;
        apellidos: string;
        telefono: string;
        fechaNacimiento: string;
        lada: string;
        fechaRegistro: string;
    };
    
    // Información de seguridad
    roles: string[];
    autenticacion2FA: {
        activa: boolean;
    };
    
    // Estadísticas
    totalApuestas: number;
    gananciasPerdidas: number;
    ultimoAcceso: string;
    ultimaConexion: string;
    
    // Documentos
    documentos: {
        tipo: string;
        estado: string;
        fechaSubida: string;
        verificado: boolean;
    }[];
    
    // Transacciones
    transacciones: {
        tipo: string;
        monto: number;
        fecha: string;
        estado: string;
    }[];
    
    // Tickets de soporte
    tickets: {
        id: number;
        titulo: string;
        estado: string;
        fechaCreacion: string;
    }[];
}

export interface UserEditData {
    idUsuario: number;
    email: string;
    username: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    fechaNacimiento: string;
    lada: string;
    estado: string;
    estadoCuenta: boolean;
    saldoUsuario: number;
    roles: string[];
    autenticacion2FA: boolean;
}

export interface UserFormErrors {
    email?: string;
    username?: string;
    nombres?: string;
    apellidos?: string;
    telefono?: string;
    fechaNacimiento?: string;
    saldoUsuario?: string;
    general?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface UserViewModalProps extends ModalProps {
    user: UserDetailData | null;
}

export interface UserEditModalProps extends ModalProps {
    user: UserEditData | null;
    onSave: (userData: UserEditData) => Promise<void>;
}

export interface UserDeleteModalProps extends ModalProps {
    user: { idUsuario: number; username: string; email: string } | null;
    onConfirm: (userId: number) => Promise<void>;
}

// Validaciones
export const validateUserForm = (userData: UserEditData): UserFormErrors => {
    const errors: UserFormErrors = {};
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email) {
        errors.email = 'El email es requerido';
    } else if (!emailRegex.test(userData.email)) {
        errors.email = 'El formato del email no es válido';
    }
    
    // Validar username
    if (!userData.username) {
        errors.username = 'El nombre de usuario es requerido';
    } else if (userData.username.length < 3) {
        errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    // Validar nombres
    if (!userData.nombres) {
        errors.nombres = 'Los nombres son requeridos';
    }
    
    // Validar apellidos
    if (!userData.apellidos) {
        errors.apellidos = 'Los apellidos son requeridos';
    }
    
    // Validar teléfono
    if (!userData.telefono) {
        errors.telefono = 'El teléfono es requerido';
    }
    
    // Validar fecha de nacimiento
    if (!userData.fechaNacimiento) {
        errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
        const birthDate = new Date(userData.fechaNacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
            errors.fechaNacimiento = 'El usuario debe ser mayor de 18 años';
        }
    }
    
    // Validar saldo
    if (userData.saldoUsuario < 0) {
        errors.saldoUsuario = 'El saldo no puede ser negativo';
    }
    
    return errors;
};

// Utilidades
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
