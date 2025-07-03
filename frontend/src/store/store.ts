// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Usar sessionStorage como almacenamiento compatible
import { combineReducers } from 'redux';

import userSlice from './slices/userSlice'; // Importa el slice de auth con datos de ususario
import profileSlice from './slices/profileSlice'; // Importa el slice de perfil
import quinielaSlice from './slices/quinielaSlice'; // Importa el slice de quinielas
import eventoSlice from './slices/eventoSlice'; // Importa el slice de eventos deportivos
import apuestaSlice from './slices/apuestaSlice'; // Importa el slice de eventos deportivos
import theSportsDBSlice from './slices/theSportsDBSlice'; // Importa el slice de TheSportsDB
import carritoApuestasSlice from './slices/carritoApuestasSlice'; // Importa el slice del carrito de apuestas

// Configuración de Redux-Persist
const persistConfig = {
  key: 'root', // Clave bajo la cual se guardará el estado
  storage, // Usar sessionStorage como almacenamiento compatible
  whitelist: ['deportes', 'user','quiniela','carritoApuestas','profile','evento','theSportsDB'], // Solo persistir los slices 'deportes' y 'auth' (opcional)
};

// Combina todos los reducers
const rootReducer = combineReducers({
  user: userSlice,
  profile: profileSlice,
  quiniela: quinielaSlice,
  evento: eventoSlice,
  apuesta: apuestaSlice,
  theSportsDB: theSportsDBSlice,
  carritoApuestas: carritoApuestasSlice,
});

// Aplica persistencia al reducer combinado
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura el store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desactiva la verificación de serialización (necesario para Redux-Persist)
    }),
});

// Exporta el persistor
export const persistor = persistStore(store);

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;