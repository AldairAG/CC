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
import cuotasDinamicasSlice from './slices/cuotasDinamicasSlice'; // Importa el slice de cuotas dinámicas

// Configuración de Redux-Persist
const persistConfig = {
  key: 'root', // Clave bajo la cual se guardará el estado
  storage, // Usar sessionStorage como almacenamiento compatible
  whitelist: ['deportes', 'user','quiniela','carritoApuestas','profile','evento','theSportsDB','cuotasDinamicas'], // Solo persistir los slices especificados
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
  cuotasDinamicas: cuotasDinamicasSlice,
});

// Aplica persistencia al reducer combinado
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura el store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desactiva la verificación de serialización (necesario para Redux-Persist)
      immutableCheck: {
        // Configurar ImmutableStateInvariantMiddleware
        warnAfter: 100, // Aumentar threshold de 32ms a 100ms
        ignoredActions: [
          // Ignorar acciones que manejan grandes cantidades de datos
          'evento/setEventos',
          'evento/setEventosProximos', 
          'evento/setEventosDisponibles',
          'theSportsDB/setEventos',
          'apuesta/setApuestas',
          'quiniela/setQuinielas'
        ],
        ignoredActionsPaths: [
          // Ignorar paths específicos en las acciones
          'payload.eventos',
          'payload.data.eventos',
          'payload.participaciones'
        ],
        ignoredPaths: [
          // Ignorar paths del estado que pueden ser grandes
          'evento.eventos',
          'evento.eventosProximos',
          'evento.eventosDisponibles',
          'theSportsDB.eventos',
          'apuesta.apuestas',
          'quiniela.quinielas'
        ]
      }
    }),
});

// Exporta el persistor
export const persistor = persistStore(store);

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;