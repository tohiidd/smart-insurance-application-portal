import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
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
} from '@mui/material';
import { FormData, DynamicOptions, FormField } from '../../services/formService';
import api from '../../utils/api';
import { DatePicker } from '@mui/x-date-pickers';

interface DynamicFormProps {
  formData: FormData;
}

function DynamicForm({ formData }: DynamicFormProps) {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});
  const dynamicOptionsRef = useRef<DynamicOptions[]>([]);
  const { watch, control } = useFormContext();

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
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                label={field.label}
                type={field.type}
                value={value}
                onChange={onChange}
                required={field.required}
                fullWidth
                margin="normal"
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
            defaultValue=""
            render={({ field: { onChange } }) => <DatePicker label={field.label} onChange={onChange} />}
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
                console.log(field);
                console.log(dynamicOptions?.[field?.dynamicOptions?.dependsOn]);
              }

              return (
                <FormControl fullWidth margin="normal">
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={value}
                    onChange={async (event) => {
                      const dynamicOption = dynamicOptionsRef.current.find((option) => option.dependsOn === field.id);
                      if (dynamicOption) {
                        try {
                          const response = await api.get(dynamicOption?.endpoint, { params: { country: event?.target?.value } });
                          setDynamicOptions((prev) => ({ ...prev, [field.id]: response.data.states }));
                        } catch (error) {
                          console.error(`Error fetching ${field?.id} options:`, error);
                        }
                      }

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
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <FormControl component="fieldset" sx={{ display: 'block' }} margin="normal">
                <label>{field.label}</label>
                <RadioGroup value={value} onChange={onChange}>
                  {field?.options?.map((option) => (
                    <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
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
    <Box>
      <h2>{formData.title}</h2>
      {formData?.fields?.map(renderField)}
    </Box>
  );
}

export default DynamicForm;
