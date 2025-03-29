import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { FormData, formService } from '../../services/formService';
import { useToast } from '../../context/ToastContext';
import FieldResolver from './FieldResolver';
import { useState } from 'react';
interface DynamicFormProps {
  formData: FormData;
}

function DynamicForm({ formData }: DynamicFormProps) {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const methods = useForm({ mode: 'onSubmit' });
  const { handleSubmit } = methods;
  const { showToast } = useToast();

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitLoading(true);
    try {
      await formService.submitForm(data);
      showToast('Form submitted successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to submit form', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {formData?.fields?.map((field) => (
          <FieldResolver key={field.id} field={field} />
        ))}
        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isSubmitLoading}>
          {isSubmitLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </FormProvider>
  );
}

export default DynamicForm;
