import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/uiSlice';

export function useToast() {
  const dispatch = useDispatch();

  const toast = useCallback(
    (message, type = 'info') => {
      dispatch(showToast({ message, type }));
    },
    [dispatch]
  );

  return {
    toast,
    success: (message) => toast(message, 'success'),
    error: (message) => toast(message, 'error'),
    info: (message) => toast(message, 'info'),
  };
}
