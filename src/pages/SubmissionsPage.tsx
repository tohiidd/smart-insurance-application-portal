import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { SubmissionData, submissionService } from '../services/formService';
import SubmissionsTable from '../components/Submissions/SubmissionsTable';
import { useToast } from '../context/ToastContext';
import LoadingPlaceholder from '../components/Ui/LoadingPlaceholder';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionData>();
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await submissionService.getSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error(error);
        showToast('Failed to load submissions', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [showToast]);

  if (loading) {
    return <LoadingPlaceholder />;
  }

  return <Box sx={{ py: 4 }}>{submissions && <SubmissionsTable data={submissions} />}</Box>;
}
