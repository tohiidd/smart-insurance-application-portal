import api from '../utils/api';
import { API_ENDPOINTS } from '../config/api';

export interface DynamicOptions {
  dependsOn: string;
  endpoint: string;
  method: 'GET' | 'POST';
}

export interface Visibility {
  condition: string;
  dependsOn: string;
  value: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  fields?: FormField[];
  options?: string[];
  dynamicOptions?: DynamicOptions;
  visibility?: Visibility;
  validation?: {
    pattern?: string;
    message?: string;
    max?: number;
    min?: number;
  };
}

export interface FormData {
  formId: string;
  title: string;
  fields: FormField[];
}

export const formService = {
  getForm: async (): Promise<FormData[]> => {
    const response = await api.get(API_ENDPOINTS.form);
    return response.data;
  },

  submitForm: async (formData: Record<string, unknown>): Promise<void> => {
    await api.post(API_ENDPOINTS.submitForm, formData);
  },
};

export interface SubmissionData {
  columns: ['Full Name', 'Age', 'Gender', 'Insurance Type', 'City'];
  data: Record<string, string | number>[];
}

export const submissionService = {
  getSubmissions: async (): Promise<SubmissionData> => {
    const response = await api.get(API_ENDPOINTS.submissions);
    return response.data;
  },
};
