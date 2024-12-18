import React, { ReactElement } from 'react';
import './styles.scss';

interface ModalProps {
  onSubmit: () => void;
  onCancel: () => void;
  content: ReactElement | string;
}

const Modal = ({ onSubmit, onCancel, content }: ModalProps) => {
  return (
    <div className="modal">
      <div className="modal-content-container">
        <div className="modal-content">{content}</div>
        <div className="modal-content-buttons">
          <button onClick={() => onCancel()}>Cancel</button>
          <button onClick={() => onSubmit()}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
