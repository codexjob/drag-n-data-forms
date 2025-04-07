
import { useState, useEffect } from 'react';
import { FormData } from '@/services/formService';
import { FormElement } from '@/lib/formElementTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseFormSubmissionProps {
  form: FormData;
}

export const useFormSubmission = ({ form }: UseFormSubmissionProps) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize form values based on form schema
  const initializeFormValues = (formSchema: FormElement[]) => {
    const initialValues: Record<string, any> = {};
    formSchema.forEach(element => {
      const columnName = element.columnName || element.label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
      
      if (element.type === 'checkbox' && element.options) {
        initialValues[columnName] = [];
      } else {
        initialValues[columnName] = '';
      }
    });
    setFormValues(initialValues);
  };

  // Re-initialize form values when form changes
  useEffect(() => {
    if (form && form.schema) {
      initializeFormValues(form.schema);
    }
  }, [form]);

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormValues(prev => {
      const currentValues = prev[name] || [];
      if (checked) {
        return {
          ...prev,
          [name]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [name]: currentValues.filter((v: string) => v !== value)
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form || !form.table_name) return;
    
    setSubmitting(true);
    
    try {
      // Submit form data to the dynamic table
      const { error } = await supabase
        .from(form.table_name as any)
        .insert(formValues as any);
      
      if (error) {
        console.error("Erreur lors de la soumission du formulaire:", error);
        toast.error("Erreur lors de la soumission du formulaire");
      } else {
        toast.success("Formulaire soumis avec succès");
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Erreur lors de la soumission du formulaire");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    if (form && form.schema) {
      initializeFormValues(form.schema);
    } else {
      setFormValues({});
    }
  };

  return {
    formValues,
    submitting,
    submitted,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    resetForm,
    initializeFormValues
  };
};
