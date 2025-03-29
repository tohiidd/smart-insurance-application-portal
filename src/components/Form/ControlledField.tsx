import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../../services/formService';
import { ReactElement } from 'react';

interface ControlledFieldProps {
  field: FormField;
  children: (props: { onChange: (value: unknown) => void; value: unknown; error: { message?: string } | undefined }) => ReactElement;
}

function ControlledField({ field, children }: ControlledFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      key={field.id}
      name={field.id}
      control={control}
      rules={{
        required: field.required ? `${field.label} is required` : false,
        ...(field?.validation?.max && {
          max: {
            value: field?.validation?.max,
            message: `${field.label} must be less than ${field.validation?.max}`,
          },
        }),
        ...(field?.validation?.min && {
          min: {
            value: field?.validation?.min,
            message: `${field.label} must be at least ${field?.validation?.min}`,
          },
        }),
        pattern: field?.validation?.pattern
          ? {
              value: new RegExp(field.validation.pattern),
              message: field.validation.message || 'Invalid input',
            }
          : undefined,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => children({ onChange, value, error })}
    />
  );
}

export default ControlledField;
