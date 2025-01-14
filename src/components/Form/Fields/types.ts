import { ReactElement } from 'react';

export interface InputFieldProps {
  field: Field;
  onFieldChange: (internalName: string, value: string | number | boolean) => void;
  value?: string | number;
}

export type Field = {
  internalName: string;
  externalName: string | ReactElement;
  value: string | number | null | undefined;
  type: 'string' | 'number' | 'textarea' | 'boolean';
  min?: number;
  max?: number;
  readOnly?: boolean;
};
