import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import filesReducer from './filesSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    ui: uiReducer,
  },
});

export default store;
