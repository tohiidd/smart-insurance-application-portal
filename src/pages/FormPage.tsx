import { useEffect, useState } from 'react';
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import { formService, FormData } from '../services/formService';
import DynamicForm from '../components/Form/DynamicForm';
import FormTabPanel from '../components/Form/FormTabPanel';
import { useToast } from '../context/ToastContext';

export default function FormPage() {
  const [formData, setFormData] = useState<FormData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { showToast } = useToast();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
  console.log('formData', formData);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="form tabs">
          {formData?.map((form) => (
            <Tab label={form?.title} id={form?.formId} />
          ))}
        </Tabs>
      </Box>
      {formData?.map((form, i) => (
        <FormTabPanel key={form?.formId} value={tabValue} index={i}>
          <DynamicForm formData={form} />
        </FormTabPanel>
      ))}
    </Box>
  );
}
