import React, { useState } from 'react';
import '../styles.scss';

import { InputFieldProps } from '../types';

const StringField = ({ field, value, onFieldChange }: InputFieldProps) => {
  const [error, setError] = useState<string>('');

  const validate = (value: string) => {
    setError('');
    if (value.length < field.min) {
      setError(`${field.externalName} must be at least ${field.min} character(s) long`);
      return;
    }
    if (value.length > field.max) {
      setError(`${field.externalName} cannot exceed ${field.max} characters in length`);
      return;
    }
    onFieldChange(field.internalName, value);
  };

  return (
    <div className="field">
      <label>{field.externalName}</label>
      <input
        disabled={field.readOnly}
        value={value || field.value}
        onChange={(e) => validate(e.target.value)}
      />
      <div className="field-error">{error}</div>
    </div>
  );
};

export default StringField;
