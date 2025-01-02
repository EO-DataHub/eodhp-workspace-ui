import React, { useState } from 'react';
import '../styles.scss';

import { InputFieldProps } from '../types';

const NumberField = ({ field, value, onFieldChange }: InputFieldProps) => {
  const [error, setError] = useState<string>('');

  const validate = (value: number) => {
    setError('');
    if (value < field.min || isNaN(value)) {
      setError(`${field.externalName} must be at least ${field.min}`);
      onFieldChange(field.internalName, field.min);
      return;
    }
    if (value > field.max) {
      setError(`${field.externalName} cannot exceed ${field.max}`);
      onFieldChange(field.internalName, field.max);
      return;
    }
    onFieldChange(field.internalName, value);
  };
  return (
    <div className="field">
      <label>{field.externalName}</label>
      <input
        disabled={field.readOnly}
        max={field.max}
        min={field.min}
        type="number"
        value={value ?? field.value}
        onChange={(e) => validate(parseFloat(e.target.value))}
      />
      <div>{error}</div>
    </div>
  );
};

export default NumberField;
