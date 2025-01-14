import React, { ReactElement } from 'react';

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
  return (
    <div className="modal">
      <div className="modal-content-container">
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
