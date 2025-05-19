import React, { ReactElement, useEffect, useRef } from 'react';

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
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
        <div className="modal-content">{content}</div>
        <div className="modal-content-buttons">
          {!hideCancel && <Button onClick={() => onCancel()}>{cancelText || 'Cancel'}</Button>}
          {!hideSubmit && (
            <Button disabled={submitDisabled} onClick={() => onSubmit()}>
              {submitText || 'Submit'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
