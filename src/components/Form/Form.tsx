import React, { ReactElement, useEffect, useState } from 'react';
import './styles.scss';

interface FormProps {
  fieldData: Field[];
  header: string | ReactElement;
  onChange: (formData: { [key: string]: string }) => void;
}

const Form = ({ fieldData, header, onChange }: FormProps) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newData = {};
    fieldData.forEach((data) => {
      newData[data.internalName] = data.value;
    });
    setFormData(newData);
  }, [fieldData]);

  const onFieldChange = (internalName, value) => {
    const newFormData = { ...formData };
    newFormData[internalName] = value;
    setFormData(newFormData);
    onChange(newFormData);
  };

  const constructFields = () => {
    const fields = Object.entries(formData).map(([key, value]) => {
      const field = fieldData.filter((f) => f.internalName === key)[0];
      return (
        <div key={key}>
          <label>{field.externalName}</label>
          <input
            value={value}
            onChange={(e) => onFieldChange(field.internalName, e.target.value)}
          />
        </div>
      );
    });
    return fields;
  };

  return (
    <div>
      <h2>{header}</h2>
      {constructFields()}
    </div>
  );
};

export default Form;
