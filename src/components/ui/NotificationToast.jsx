import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import Icon from '../AppIcon';

const NotificationToast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  showCloseButton = true 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for exit animation
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'CheckCircle',
          bgColor: 'bg-success',
          textColor: 'text-success-foreground',
          borderColor: 'border-success/20'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-warning',
          textColor: 'text-warning-foreground',
          borderColor: 'border-warning/20'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          bgColor: 'bg-error',
          textColor: 'text-error-foreground',
          borderColor: 'border-error/20'
        };
      case 'friend':
        return {
          icon: 'Users',
          bgColor: 'bg-accent',
          textColor: 'text-accent-foreground',
          borderColor: 'border-accent/20'
        };
      default:
        return {
          icon: 'Info',
          bgColor: 'bg-primary',
          textColor: 'text-primary-foreground',
          borderColor: 'border-primary/20'
        };
    }
  };

  const config = getToastConfig();

  if (!isVisible) return null;

  return createPortal(
    <div className={`notification-toast ${isVisible ? 'slide-in' : ''}`}>
      <div 
        className={`
          ${config?.bgColor} ${config?.textColor} 
          rounded-lg p-4 shadow-medium border ${config?.borderColor}
          flex items-center gap-3 min-w-80 max-w-md
        `}
        role="alert"
        aria-live="polite"
      >
        <Icon 
          name={config?.icon} 
          size={20} 
          className="flex-shrink-0"
        />
        
        <p className="flex-1 text-sm font-medium">
          {message}
        </p>

        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className={`
              ${config?.textColor} hover:bg-white/10 h-6 w-6 p-0 flex-shrink-0
            `}
            aria-label="Close notification"
          >
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>
    </div>,
    document.body
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      ...options
    };

    setToasts(prev => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts?.map(toast => (
        <NotificationToast
          key={toast?.id}
          message={toast?.message}
          type={toast?.type}
          duration={toast?.duration}
          showCloseButton={toast?.showCloseButton}
          onClose={() => removeToast(toast?.id)}
        />
      ))}
    </>
  );

  return {
    addToast,
    removeToast,
    ToastContainer
  };
};

export default NotificationToast;