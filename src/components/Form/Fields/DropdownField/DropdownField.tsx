import React, { useState } from 'react';
import '../styles.scss';

import { InputFieldProps, Option } from '../types';

const DropdownField = ({ field, value, onFieldChange }: InputFieldProps) => {
  const [error, setError] = useState<string>('');

  const validate = (value: string) => {
    setError('');
    if (!field.options || field.options.length === 0) {
      setError(`${field.externalName} has no options available`);
      return;
    }
    onFieldChange(field.internalName, value);
  };

  const selectValue = value || field.value || '';
  return (
    <div className="field">
      <label>{field.externalName}</label>
      <select
        disabled={field.readOnly}
        value={selectValue}
        onChange={(e) => validate(e.target.value)}
      >
        <option disabled value="">
          Select an option
        </option>
        {field.options &&
          field.options.map((option: Option) => (
            <option key={option.internalName} value={option.internalName}>
              {option.externalName}
            </option>
          ))}
      </select>
      <div className="field-error">{error}</div>
    </div>
  );
};

export default DropdownField;
