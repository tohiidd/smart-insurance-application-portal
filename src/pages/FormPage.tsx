import { SyntheticEvent, useEffect, useState } from 'react';
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import { formService, FormData } from '../services/formService';
import DynamicForm from '../components/Form/DynamicForm';
import FormTabPanel from '../components/Form/FormTabPanel';
import { useToast } from '../context/ToastContext';

function FormPage() {
  const [formData, setFormData] = useState<FormData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { showToast } = useToast();

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
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
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="form tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-scrollButtons': {
              display: { xs: 'flex', sm: 'none' },
              width: '40px',
              '&.Mui-disabled': {
                display: 'none',
              },
            },
            '& .MuiTabs-flexContainer': {
              gap: 1,
              px: 1,
            },
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 2,
            },
          }}
        >
          {formData?.map((form) => (
            <Tab
              key={form?.formId}
              label={form?.title}
              id={form?.formId}
              sx={{
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            />
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

export default FormPage;
