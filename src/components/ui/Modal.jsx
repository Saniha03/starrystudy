import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import Icon from '../AppIcon';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default',
  showCloseButton = true,
  closeOnBackdrop = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="modal-backdrop flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        className={`
          morphic-card w-full ${sizeClasses?.[size]} 
          max-h-[90vh] overflow-y-auto
          slide-in
        `}
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-6">
            {title && (
              <h2 
                id="modal-title"
                className="text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-auto"
                aria-label="Close modal"
              >
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;