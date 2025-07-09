/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  userSelector,
  setUser,
  clearUser,
  getRoleFromToken
} from '../store/slices/userSlice';
import type { NuevoUsuarioRequestType, UserType } from '../types/UserTypes';
import type { LoginRequest } from '../types/LoginTypes';
import {UserService} from '../service/casino/userService';
import { ADMIN_ROUTES, USER_ROUTES } from '../constants/ROUTERS';

/**
 * Hook personalizado `useUser` para gestionar el estado del usuario y la navegación en la aplicación.
 *
 * @returns {object} Un objeto con las siguientes propiedades y funciones:
 * 
 * - `user` {UserType}: El usuario actual obtenido del estado global.
 * - `token` {string}: El token de autenticación del usuario obtenido del estado global.
 * - `roles` {string[]}: Los roles del usuario extraídos del token JWT.
 * - `isAuthenticated` {boolean}: Indica si el usuario está autenticado.
 * - `loading` {boolean}: Indica si hay una operación en curso.
 * - `error` {string}: Mensaje de error si ocurrió alguno durante la autenticación.
 * - `login` {(username: string, contrasena: string) => Promise<boolean>}: Función para iniciar sesión.
 * - `logout` {() => void}: Función para cerrar sesión.
 * - `navigateTo` {(to: string) => void}: Función para navegar a una ruta específica.
 */
export const useUser = () => {
  const dispatch = useDispatch();
  const navigate = useHistory();

  // Selectores de estado desde el userSlice
  const user = useSelector(userSelector.user);
  const token = useSelector(userSelector.token);
  const roles = useSelector(userSelector.roles);
  const isAuthenticated = useSelector(userSelector.isAuthenticated);
  /**
   * Establece el usuario y token en el estado global
   */
  const setUserData = (userData: UserType, userToken: string | null) => {
    dispatch(setUser({ user: userData, token: userToken }));
  };

  /**
   * Limpia el usuario del estado global (cierre de sesión)
   */
  const logout = () => {
    dispatch(clearUser());
    navigateTo(USER_ROUTES.LANDING_PAGE);
  };

  /**
   * Navega a una ruta específica
   */
  const navigateTo = (to: string) => {
    navigate.push(to);
  };

  /**
   * Inicia sesión con username y contraseña
   * @returns {boolean} true si el login fue exitoso, false si falló
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const credentials: LoginRequest = { email, password };
      const response = await UserService.login(credentials);
      if (response.token) {

        // Primero guarda el usuario y token en el estado global
        setUserData(response.usuario, response.token);

        const rol=getRoleFromToken(response.token)

        if (rol.includes("ROLE_CLIENTE")) {
          navigateTo(USER_ROUTES.HOME);
        } else if (rol.includes("ROLE_ADMIN")) {
          //navigateTo(USER_ROUTES.HOME);
          navigateTo(ADMIN_ROUTES.ADMIN_LAYOUT);
        }

        return true;
      } else {
        alert('Credenciales inválidas');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error en el inicio de sesión';
      alert(errorMessage);
      return false;
    }
  };

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los roles especificados
   */
  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  /**
   * Obtiene todos los usuarios
   */
  const getAllUsers = async (): Promise<UserType[]> => {
    try {
      const users = await UserService.getAllUsuarios();
      return users;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener usuarios';
      alert(errorMessage);
      return [];
    }
  };

  /**
   * Crea un nuevo usuario
   */
  const createUser = async (userData: NuevoUsuarioRequestType): Promise<UserType | null> => {
    try {
      const newUser = await UserService.crearUsuario(userData);
      login(newUser.email,userData.password)
      
      return newUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear usuario';
      alert(errorMessage);
      return null;
    }
  };

  /**
   * Actualiza un usuario existente
   */
  const updateUser = async (id: number, userData: UserType): Promise<UserType | null> => {
    try {
      const updatedUser = await UserService.actualizarUsuario(id, userData);

      // Si se actualiza el usuario actual, actualizar también en el estado
      if (user && user.idUsuario === id) {
        // Usar setUserData en lugar de dispatch directo
        setUserData(updatedUser, token);
      }

      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar usuario';
      alert(errorMessage);
      return null;
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    try { 
      await UserService.desactivarUsuario(id);
      // Si se elimina el usuario actual, limpiar el estado
      if (user && user.idUsuario === id) {
        logout();
      }
      return true;
    }
    catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
      alert(errorMessage);
      return false;
    }
  }

  /**
   * Actualiza los datos del usuario actual desde el servidor
   */
  const refreshUser = async (): Promise<boolean> => {
    try {
      if (!user?.idUsuario) {
        return false;
      }
      
      const updatedUser = await UserService.getUsuarioById(user.idUsuario);
      setUserData(updatedUser, token);
      return true;
    } catch (error: any) {
      console.error('Error refreshing user data:', error);
      return false;
    }
  };

  return {
    // Estado
    user,
    token,
    roles,
    isAuthenticated,

    // Funciones de autenticación
    login,
    logout,
    setUserData,       // Exponer setUserData para usar desde componentes

    // Navegación
    navigateTo,

    // Verificación de roles
    hasRole,
    hasAnyRole,

    // Operaciones CRUD
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,

    // Refrescar usuario
    refreshUser
  };
};

export default useUser;