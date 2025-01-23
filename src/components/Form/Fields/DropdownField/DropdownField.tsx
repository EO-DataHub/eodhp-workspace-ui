import React, { useState } from 'react';
import '../styles.scss';

import { InputFieldProps } from '../types';

const DropdownField = ({ field, value, onFieldChange }: InputFieldProps) => {
  const [error, setError] = useState<string>('');

  const validate = (value: string) => {
    setError('');
    if (!field.options || field.options.length === 0) {
      setError(`${field.externalName} has no options available`);
      return;
    }
    if (!field.options.includes(value)) {
      setError(`${value} is not a valid option for ${field.externalName}`);
      return;
    }
    onFieldChange(field.internalName, value);
  };

  return (
    <div className="field">
      <label>{field.externalName}</label>
      <select
        disabled={field.readOnly}
        value={value || field.value || ''}
        onChange={(e) => validate(e.target.value)}
      >
        <option disabled value="">
          Select an option
        </option>
        {field.options &&
          field.options.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
      </select>
      <div className="field-error">{error}</div>
    </div>
  );
};

export default DropdownField;
