
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFormById, FormData } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Share2, ArrowLeft, List } from 'lucide-react';
import FormElementRenderer from '@/components/form/FormElementRenderer';
import FormHeader from '@/components/form/FormHeader';
import FormSubmissionSuccess from '@/components/form/FormSubmissionSuccess';
import FormNotFound from '@/components/form/FormNotFound';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { toast } from 'sonner';

const ViewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadForm = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const formData = await fetchFormById(id);
        
        if (formData) {
          setForm(formData);
          initializeFormValues(formData.schema);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du formulaire:", error);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id]);

  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shareOptionsRef]);

  const {
    formValues,
    submitting,
    submitted,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    resetForm,
    initializeFormValues
  } = useFormSubmission({ form: form as FormData });

  const copyFormLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Lien du formulaire copié dans le presse-papier");
      setShowShareOptions(false);
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray">
        <FormNotFound />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray">
        <div className="container mx-auto py-6 px-4">
          <FormSubmissionSuccess 
            formTitle={form.title}
            onResubmit={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg border border-dragndrop-gray p-6 max-w-3xl mx-auto">
          {/* Header with navigation */}
          <div className="mb-4">
            <Button variant="outline" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux formulaires
              </Link>
            </Button>
          </div>

          {/* En-tête avec options de partage */}
          <div className="flex justify-between items-start mb-6">
            <FormHeader 
              title={form.title} 
              description={form.description} 
            />
            <div className="flex items-center space-x-2 relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              
              {form.published && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link to={`/responses/${form.id}`}>
                    <List className="h-4 w-4 mr-2" />
                    Réponses
                  </Link>
                </Button>
              )}
              
              {showShareOptions && (
                <div 
                  ref={shareOptionsRef}
                  className="absolute right-0 top-10 mt-2 bg-white shadow-lg rounded-md border border-dragndrop-gray p-2 z-10 w-40"
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start mb-1"
                    onClick={copyFormLink}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier le lien
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {form.schema.map(element => (
              <FormElementRenderer
                key={element.id}
                element={element}
                value={formValues[element.columnName || element.label
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "_")
                  .replace(/_+/g, "_")
                  .replace(/^_|_$/g, "")]}
                onChange={handleChange}
                onCheckboxChange={handleCheckboxChange}
              />
            ))}
            
            <Button 
              type="submit" 
              className="bg-dragndrop-primary hover:bg-dragndrop-secondary mt-4"
              disabled={submitting}
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Soumettre
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
