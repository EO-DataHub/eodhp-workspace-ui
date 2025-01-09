export interface InputFieldProps {
  field: Field;
  onFieldChange: (internalName: string, value: string | number) => void;
  value?: string | number;
}

export type Field = {
  internalName: string;
  externalName: string;
  value: string | number | null | undefined;
  type: 'string' | 'number';
  min?: number;
  max?: number;
  readOnly?: boolean;
};
