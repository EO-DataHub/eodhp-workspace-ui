export interface InputFieldProps {
  field: Field;
  onFieldChange: (internalName: string, value: string | number | File) => void;
  value?: string | number;
}

export type Field = {
  internalName: string;
  externalName: string;
  value: string | number | null | undefined;
  type: 'string' | 'number' | 'dropdown' | 'file';
  min?: number;
  max?: number;
  readOnly?: boolean;
  options?: Option[];
};

export type Option = {
  internalName: string;
  externalName: string;
};
