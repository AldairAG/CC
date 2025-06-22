/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoginRequest, LoginResponse } from "../../types/LoginTypes";
import type { NuevoUsuarioRequestType, UserType } from "../../types/UserTypes";
import { apiClient } from "./ApiCliente";

const BASE_URL = '/usuarios';

export const UserService = {
    /**
     * Crea un nuevo usuario en el sistema
     * @param usuario Datos del usuario a crear
     * @returns El usuario creado
     */
    crearUsuario: async (usuario: NuevoUsuarioRequestType): Promise<UserType> => {
        const response = await apiClient.post<UserType>(BASE_URL, usuario);
        return response.data;
    },

    /**
     * Actualiza un usuario existente
     * @param id ID del usuario a actualizar
     * @param usuario Datos actualizados del usuario
     * @returns El usuario actualizado
     */
    actualizarUsuario: async (id: number, usuario: UserType): Promise<UserType> => {
        const response = await apiClient.put<UserType>(`${BASE_URL}/${id}`, usuario);
        return response.data;
    },

    /**
     * Desactiva un usuario (eliminación lógica)
     * @param id ID del usuario a desactivar
     */
    desactivarUsuario: async (id: number): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/${id}`);
    },

    /**
     * Obtiene un usuario por su ID
     * @param id ID del usuario a buscar
     * @returns El usuario encontrado
     */
    getUsuarioById: async (id: number): Promise<UserType> => {
        const response = await apiClient.get<UserType>(`${BASE_URL}/${id}`);
        return response.data;
    },

    /**
     * Obtiene un usuario por su nombre de usuario
     * @param username Nombre de usuario a buscar
     * @returns El usuario encontrado
     */
    getUsuarioByUsername: async (username: string): Promise<UserType> => {
        const response = await apiClient.get<UserType>(`${BASE_URL}/username/${username}`);
        return response.data;
    },

    /**
     * Obtiene todos los usuarios del sistema
     * @returns Lista de todos los usuarios
     */
    getAllUsuarios: async (): Promise<UserType[]> => {
        const response = await apiClient.get<UserType[]>(BASE_URL);
        return response.data;
    },

    /**
     * Valida las credenciales de un usuario e inicia sesión
     * @param credentials Credenciales de inicio de sesión (username y contraseña)
     * @returns Los datos del usuario si las credenciales son válidas
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>(`${BASE_URL}/login`, credentials);

            // En el caso actual, el backend no devuelve un token, solo el usuario
            // Si se implementa JWT en el futuro, el token vendría en la respuesta
            return {
                usuario: response.data.usuario,
                token: response.data.token, // O response.headers['authorization'] si implementas JWT
                error: response.data.error || ""
            };
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                throw new Error("Credenciales inválidas");
            }
            throw error;
        }
    },

    /**
     * Obtiene usuarios por rol
     * @param rol Rol de los usuarios a buscar (ADMIN, VENDEDOR, etc.)
     * @returns Lista de usuarios con el rol especificado
     */
    getUsuariosByRol: async (rol: string): Promise<UserType[]> => {
        const response = await apiClient.get<UserType[]>(`${BASE_URL}/rol/${rol}`);
        return response.data;
    },

    /**
     * Configura el token de autenticación para las solicitudes futuras
     * @param token Token JWT a configurar en el header de autorización
     */
    setAuthToken: (token: string | null): void => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete apiClient.defaults.headers.common['Authorization'];
        }
    },

    /**
     * Actualiza el saldo de un usuario
     * @param id ID del usuario
     * @param nuevoSaldo Nuevo saldo a establecer
     */
    actualizarSaldo: async (id: number, nuevoSaldo: number): Promise<void> => {
        await apiClient.put(`${BASE_URL}/${id}/saldo`, null, {
            params: { nuevoSaldo }
        });
    },

    /**
     * Actualiza el estado de la cuenta de un usuario
     * @param id ID del usuario
     * @param estado Nuevo estado de la cuenta
     */
    actualizarEstadoCuenta: async (id: number, estado: boolean): Promise<void> => {
        await apiClient.put(`${BASE_URL}/${id}/estado-cuenta`, null, {
            params: { estado }
        });
    },

    /**
     * Obtiene un usuario por su email
     * @param email Email del usuario a buscar
     * @returns El usuario encontrado
     */
    getUsuarioByEmail: async (email: string): Promise<UserType> => {
        const response = await apiClient.get<UserType>(`${BASE_URL}/email/${email}`);
        return response.data;
    },
};
