import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Box,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { FormData, DynamicOptions, FormField, formService } from '../../services/formService';
import api from '../../utils/api';
import { DatePicker } from '@mui/x-date-pickers';
import { useToast } from '../../context/ToastContext';

interface DynamicFormProps {
  formData: FormData;
}

function DynamicForm({ formData }: DynamicFormProps) {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});
  const dynamicOptionsRef = useRef<DynamicOptions[]>([]);
  const { watch, control, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { showToast } = useToast();

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      await formService.submitForm(data);
      showToast('Form submitted successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to submit form', 'error');
    }
  };

  const fetchDynamicOptions = async (field: FormField, event: SelectChangeEvent<HTMLSelectElement>) => {
    const dynamicOption = dynamicOptionsRef.current.find((option) => option.dependsOn === field.id);
    if (dynamicOption) {
      try {
        const response = await api.get(dynamicOption?.endpoint, { params: { country: event?.target?.value } });
        setDynamicOptions((prev) => ({ ...prev, [field.id]: response.data.states }));
      } catch (error) {
        console.error(`Error fetching ${field?.id} options:`, error);
      }
    }
  };

  const renderField = (field: FormField) => {
    if (field.visibility && watch(field?.visibility?.dependsOn) !== field.visibility.value) return null;

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false,
              max: {
                value: field?.validation?.max,
                message: `${field.label} must be less than ${field.validation?.max}`,
              },
              min: {
                value: field?.validation?.min,
                message: `${field.label} must be at least ${field?.validation?.min}`,
              },
              pattern: field?.validation?.pattern
                ? {
                    value: new RegExp(field.validation.pattern),
                    message: field.validation.message || 'Invalid input',
                  }
                : undefined,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label={field.label}
                type={field.type}
                value={value}
                onChange={onChange}
                required={field.required}
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false,
            }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <DatePicker label={field.label} onChange={onChange} />
                {error && (
                  <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>
                    {error.message}
                  </Box>
                )}
              </FormControl>
            )}
          />
        );
      case 'select':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => {
              if (field?.dynamicOptions) {
                dynamicOptionsRef.current.push(field.dynamicOptions);
              }

              return (
                <FormControl fullWidth margin="normal" required={field.required}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={value}
                    onChange={async (event) => {
                      await fetchDynamicOptions(field, event);
                      onChange(event);
                    }}
                    required={field.required}
                  >
                    {(dynamicOptions?.[field?.dynamicOptions?.dependsOn || ''] || field.options)?.map((option: string) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }}
          />
        );

      case 'radio':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl component="fieldset" sx={{ display: 'block' }} margin="normal" required={field.required}>
                <label>{field.label}</label>
                <RadioGroup value={value} onChange={onChange}>
                  {field?.options?.map((option) => (
                    <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
                {error && (
                  <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>
                    {error.message}
                  </Box>
                )}
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <FormGroup>
                <label>{field.label}</label>
                {field?.options?.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={value.includes(option)}
                        onChange={(e) => {
                          const newValue = e.target.checked ? [...value, option] : value.filter((item) => item !== option);
                          onChange(newValue);
                        }}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            )}
          />
        );

      case 'group':
        return (
          <div key={field.id}>
            <h3>{field.label}</h3>
            {field?.fields?.map(renderField)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formData?.fields?.map(renderField)}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </form>
  );
}

export default DynamicForm;
