import React, { ReactElement } from 'react';
import './styles.scss';

interface ModalProps {
  onSubmit: () => void;
  onCancel: () => void;
  content: ReactElement | string;
  submitDisabled: boolean;
}

const Modal = ({ onSubmit, submitDisabled, onCancel, content }: ModalProps) => {
  return (
    <div className="modal">
      <div className="modal-content-container">
        <div className="modal-content">{content}</div>
        <div className="modal-content-buttons">
          <button onClick={() => onCancel()}>Cancel</button>
          <button disabled={submitDisabled} onClick={() => onSubmit()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
