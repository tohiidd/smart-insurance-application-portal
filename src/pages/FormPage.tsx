import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useToast } from '../context/ToastContext';
import { formService, FormData } from '../services/formService';
import { FormProvider, useForm } from 'react-hook-form';
import DynamicForm from '../components/Form/DynamicForm';

export default function FormPage() {
  const [formData, setFormData] = useState<FormData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const methods = useForm({ mode: 'onChange' });

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      await formService.submitForm(data);
      showToast('Form submitted successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to submit form', 'error');
    }
  };

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await formService.getForm();
        setFormData(data);
      } catch (error) {
        console.error(error);
        showToast('Failed to load form data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [showToast]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {formData && formData.map((field, i) => <DynamicForm key={i} formData={field} />)}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
