import React from 'react';
import '../styles.scss';

import { InputFieldProps } from '../types';

const BooleanField = ({ field, value, onFieldChange }: InputFieldProps) => {
  return (
    <div className="field field-inline">
      <label>{field.externalName}</label>
      <input
        disabled={field.readOnly}
        max={field.max}
        min={field.min}
        type="checkbox"
        value={value ?? field.value}
        onChange={(e) => onFieldChange(field.internalName, e.target.checked)}
      />
    </div>
  );
};

export default BooleanField;
