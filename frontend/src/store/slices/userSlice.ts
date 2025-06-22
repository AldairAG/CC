import { createSlice } from "@reduxjs/toolkit";
import { type UserType } from "../../types/UserTypes";
import { createSelector } from 'reselect';

interface AuthState {
  user: UserType | null;
  userList: UserType[] | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  userList: [],
};

interface Role {
  nombreRol: string;
  idRol: number;
}

/**
 * Función para extraer los roles del token JWT
 * @param token - Token JWT a decodificar
 * @returns Array de roles del usuario
 */
export const getRoleFromToken = (token: string): string[] => {
  try {
    // Decodificar el token (simple split por '.' y decodificación base64)
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Payload del token:', payload.roles);

    // Extraer solo la propiedad nombreRol de cada rol
    const rol = payload.roles.map((role: Role) => role.nombreRol);

    return rol || [];
  } catch (error) {
    console.error('Error decoding token:', error);
    return [];
  }
};

/**
 * @file authSlice.ts
 * @description This file defines the `authSlice` for managing authentication-related state in the application.
 * It uses Redux Toolkit's `createSlice` to handle user and token information.
 */

/**
   * @constant authSlice
   * @description A Redux slice for managing authentication state.
   * Contains the following:
   * - `name`: The name of the slice, set to 'auth'.
   * - `initialState`: The initial state of the authentication slice.
   * - `reducers`: An object containing reducer functions to handle state updates.
   *
   * @property {Function} setUser - A reducer function to set the user and token in the state.
   *   @param {Object} state - The current state of the slice.
   *   @param {Object} action - The dispatched action containing the payload.
   *   @param {Object} action.payload - The payload containing user and token information.
   *   @param {Object} action.payload.user - The user object to set in the state.
   *   @param {string} action.payload.token - The authentication token to set in the state.
   *
   * @property {Function} clearUser - A reducer function to clear the user and token from the state.
   *   @param {Object} state - The current state of the slice.
   */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});
export const { setUser, clearUser } = userSlice.actions;

const selectUserRoles = createSelector(
  [(state: { user: AuthState }) => state.user.token],
  (token) => token ? getRoleFromToken(token) : []
);

export const userSelector = {
  user: (state: { user: AuthState }) => state.user.user,
  token: (state: { user: AuthState }) => state.user.token,
  roles: selectUserRoles,
  isAuthenticated: (state: { user: AuthState }) => !!state.user.user,
}

export default userSlice.reducer;