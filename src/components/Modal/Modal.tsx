import React, { ReactElement } from 'react';
import './styles.scss';
import '../../styles/main.scss';

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
  return (
    <div className="modal">
      <div className="modal-content-container">
        <div className="modal-content">{content}</div>
        <div className="modal-content-buttons">
          {!hideCancel && (
            <button className="blue-button" onClick={() => onCancel()}>
              {cancelText || 'Cancel'}
            </button>
          )}
          {!hideSubmit && (
            <button className="blue-button" disabled={submitDisabled} onClick={() => onSubmit()}>
              {submitText || 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
