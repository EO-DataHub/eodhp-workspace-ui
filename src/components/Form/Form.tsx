import React, { ReactElement, useEffect, useState } from 'react';

import './styles.scss';
import DropdownField from './Fields/DropdownField/DropdownField';
import NumberField from './Fields/NumberField/NumberField';
import StringField from './Fields/StringField/StringField';
import { Field, InputFieldProps } from './Fields/types';
import FormErrors from './Info/Error/FormErrors';

interface FormProps {
  fieldData: Field[];
  header: string | ReactElement;
  onChange: (formData: { [key: string]: string }) => void;
  formErrors?: string[];
}

const FIELD_MAP: { [key: string]: React.FC<InputFieldProps> } = {
  string: StringField,
  number: NumberField,
  dropdown: DropdownField,
};

const Form = ({ fieldData, header, onChange, formErrors }: FormProps) => {
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

      if (!FIELD_MAP[field.type]) {
        console.error(
          `Please add type ${field.type} to FIELD_MAP and create a valid input editor.`,
        );
        return;
      }

      return getEditorField(field, value);
    });
    return fields;
  };
  const getEditorField = (field: Field, value) => {
    const EditorField = FIELD_MAP[field.type];
    return (
      <EditorField
        field={field}
        value={value}
        onFieldChange={(internalName, value) => onFieldChange(internalName, value)}
      />
    );
  };

  return (
    <div className="form">
      <h2>{header}</h2>
      {constructFields()}
      {formErrors?.length ? <FormErrors errors={formErrors} /> : null}
    </div>
  );
};

export default Form;
