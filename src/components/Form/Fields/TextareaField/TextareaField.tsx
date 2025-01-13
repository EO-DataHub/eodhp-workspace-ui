import React from 'react';
import '../styles.scss';

import { InputFieldProps } from '../types';

const TextareaField = ({ field, value, onFieldChange }: InputFieldProps) => {
  return (
    <div className="field">
      <label>{field.externalName}</label>
      <textarea
        className="field-textarea"
        disabled={field.readOnly}
        rows={5}
        value={value ?? field.value}
        onChange={(e) => onFieldChange(field.internalName, e.target.value)}
      />
    </div>
  );
};

export default TextareaField;
