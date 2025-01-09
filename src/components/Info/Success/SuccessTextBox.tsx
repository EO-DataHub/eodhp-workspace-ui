import React, { ReactElement } from 'react';
import './styles.scss';

interface SuccessTextBox {
  content: string | ReactElement;
}

const SuccessTextBox = ({ content }: SuccessTextBox) => {
  return <div className="success-text-box">{content}</div>;
};

export default SuccessTextBox;
