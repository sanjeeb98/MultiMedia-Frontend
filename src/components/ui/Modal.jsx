import { useEffect } from 'react';
import { IconClose } from './Icons';

function Modal({ isOpen, onClose, title, children, size = 'md', footer = null }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title || 'Modal'}>
      <div className={`modal modal--${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          {title && <h3 className="modal__title">{title}</h3>}
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close modal">
            <IconClose size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
