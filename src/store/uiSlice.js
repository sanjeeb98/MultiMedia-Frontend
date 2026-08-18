import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    toasts: [],
  },
  reducers: {
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action) => {
      state.mobileSidebarOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toasts.push({
        id: Date.now() + Math.random(),
        message: action.payload.message,
        type: action.payload.type || 'info',
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  showToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
