
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
      } else if (element.type === 'date') {
        initialValues[columnName] = '';
      } else if (element.type === 'number') {
        initialValues[columnName] = '';
      } else {
        initialValues[columnName] = '';
      }
    });
    console.log("Initialized form values:", initialValues);
    setFormValues(initialValues);
  };

  // Re-initialize form values when form changes
  useEffect(() => {
    if (form && form.schema) {
      console.log("Initializing form values with schema:", form.schema);
      initializeFormValues(form.schema);
    }
  }, [form]);

  const handleChange = (name: string, value: any) => {
    console.log(`Field changed: ${name} = `, value);
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
    
    if (!form || !form.id) {
      toast.error("Impossible de soumettre le formulaire : identifiant non spécifié");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Debug log
      console.log("Soumission des données :", formValues);
      
      // Prepare the submission data
      const submissionData = {
        form_id: form.id,
        form_data: formValues  // Store all form values as JSON
      };
      
      // Submit form data to the single "data" table
      const { error } = await supabase
        .from('data')
        .insert(submissionData);
      
      if (error) {
        console.error("Erreur lors de la soumission du formulaire:", error);
        toast.error(`Erreur lors de la soumission du formulaire: ${error.message}`);
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
