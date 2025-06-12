import React, { ReactElement, useEffect, useRef, useState } from 'react';

import './styles.scss';
import '../../styles/main.scss';
import { Button } from '../Button/Button';

interface ModalProps {
  onSubmit: () => void;
  onCancel: () => void;
  content: ReactElement | string;
  submitDisabled?: boolean;
  cancelText?: string;
  submitText?: string;
  hideCancel?: boolean;
  hideSubmit?: boolean;
  isLoading?: boolean;
  loadingDuration?: number;
}

const Modal = ({
  onSubmit,
  submitDisabled,
  onCancel,
  content,
  cancelText,
  submitText,
  hideCancel,
  hideSubmit,
  isLoading = false,
  loadingDuration,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [internalLoading, setInternalLoading] = useState(isLoading);

  useEffect(() => {
    setInternalLoading(isLoading);

    if (loadingDuration && isLoading) {
      const timer = setTimeout(() => {
        setInternalLoading(false);
      }, loadingDuration);
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingDuration]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="modal">
      <div ref={modalRef} className="modal-content-container">
        {internalLoading ? (
          <div className="modal-loading">
            <div className="modal-loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <div className="modal-content">{content}</div>
            <div className="modal-content-buttons">
              {!hideCancel && (
                <Button disabled={internalLoading} onClick={() => onCancel()}>
                  {cancelText || 'Cancel'}
                </Button>
              )}
              {!hideSubmit && (
                <Button disabled={submitDisabled || internalLoading} onClick={() => onSubmit()}>
                  {submitText || 'Submit'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
