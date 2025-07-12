export const USER_ROUTES = {
    LANDING_PAGE: '/',
    USER_LAYOUT: '/c/',
    HOME: '/c/home',
    //Quinielas
    QUINIELAS_LIST: '/c/quiniela-list',
    QUINIELAS_CREADAS: '/c/quinielas-creadas',
    CREAR_QUINIELA: '/c/crear-quiniela',
    ARMAR_QUINIELA: '/c/armar-quiniela',
    QUINIELA: '/c/quiniela/:id',
    QUINIELAS: '/c/quinielas',
    MIS_PARTICIPACIONES: '/c/mis-participaciones',
    GESTIONAR_QUINIELA: '/c/gestionar-quiniela/:id',
    //Crypto
    CRYPTO_DASHBOARD: '/c/crypto',
    DEPOSITAR: '/c/crypto/depositar',
    RETIRAR: '/c/crypto/retirar',
    WALLET_MANAGEMENT: '/c/crypto/wallet-management',
    TRANSACTION_HISTORY: '/c/crypto/transaction-history',
    //Profile
    USER_PROFILE: '/c/user-profile',
    //Apuestas
    APUESTAS_DEPORTIVAS: '/c/apuestas-deportivas',
    APUESTAS_DETAIL: '/c/apuestas-deportivas/:fecha/:nombreEvento',
    APUESTAS_POR_DEPORTE: '/c/apuestas-deportivas/:deporte',
    MIS_APUESTAS: '/c/mis-apuestas',
} as const;

export const ADMIN_ROUTES = {
    ADMIN_LAYOUT: '/admin',
    ADMIN_HOME: '/admin/home',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_USER: '/admin/user',
    ADMIN_QUINIELAS: '/admin/quinielas',
    ADMIN_QUINIELA: '/admin/quiniela',
    ADMIN_CREATE_QUINIELA: '/admin/crear-quiniela',
    ADMIN_APUESTAS: '/admin/apuestas',
    ADMIN_CRYPTO: '/admin/crypto',
    ADMIN_EVENTOS: '/admin/eventos',
    ADMIN_NOTIFICACIONES: '/admin/notificaciones',
    ADMIN_ROLES: '/admin/roles',
    ADMIN_CONFIG: '/admin/configuracion',
}