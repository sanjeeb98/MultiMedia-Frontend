import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../store/uiSlice';

function ToastContainer() {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  useEffect(() => {
    if (toasts.length === 0) return undefined;
    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(removeToast(toast.id)), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
