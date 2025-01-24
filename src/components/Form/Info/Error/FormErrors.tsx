import React from 'react';
import '../styles.scss';

interface FormErrorsProps {
  errors: string[];
}

const FormErrors = ({ errors }: FormErrorsProps) => {
  return (
    <ul className="info info-error">
      {errors.map((error) => {
        return (
          <li key={error} className="info-error__item">
            {error}
          </li>
        );
      })}
    </ul>
  );
};

export default FormErrors;
