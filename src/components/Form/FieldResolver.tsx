import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../../services/formService';
import {
  Box,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Radio,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import api from '../../utils/api';
import { useState } from 'react';
interface FieldResolverProps {
  field: FormField;
}

function FieldResolver({ field }: FieldResolverProps) {
  const { watch, control } = useFormContext();
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});
  const [isLoadingFetchingDynamicOptions, setIsLoadingFetchingDynamicOptions] = useState(false);

  if (field.visibility && watch(field?.visibility?.dependsOn) !== field.visibility.value) return null;

  const fetchDynamicOptions = async (field: FormField) => {
    if (field?.dynamicOptions) {
      try {
        setIsLoadingFetchingDynamicOptions(true);
        const response = await api.get(field?.dynamicOptions?.endpoint, { params: { country: watch(field?.dynamicOptions?.dependsOn) } });
        setDynamicOptions((prev) => ({ ...prev, [field?.id]: response?.data?.states }));
      } catch (error) {
        console.error(`Error fetching ${field?.id} options:`, error);
      }
      setIsLoadingFetchingDynamicOptions(false);
    }
  };

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
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth margin="normal" required={field.required}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={value}
                onOpen={async () => {
                  if (field?.dynamicOptions) {
                    await fetchDynamicOptions(field);
                  }
                }}
                onChange={onChange}
                required={field.required}
              >
                {isLoadingFetchingDynamicOptions && <MenuItem key="loading">Loading...</MenuItem>}

                {!isLoadingFetchingDynamicOptions &&
                  (dynamicOptions[field?.id] || field?.options)?.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
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
          rules={{
            required: field.required ? `${field.label} is required` : false,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormGroup>
              <label>{field.label}</label>
              {field?.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  required={field.required}
                  control={
                    <Checkbox
                      checked={value.includes(option)}
                      onChange={(e) => {
                        const newValue = e.target.checked ? [...value, option] : value.filter((item: string) => item !== option);
                        onChange(newValue);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
              {error && (
                <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>
                  {error.message}
                </Box>
              )}
            </FormGroup>
          )}
        />
      );

    case 'group':
      return (
        <div key={field.id}>
          <h3>{field.label}</h3>
          {field?.fields?.map((field) => (
            <FieldResolver key={field.id} field={field} />
          ))}
        </div>
      );

    default:
      return null;
  }
}

export default FieldResolver;
