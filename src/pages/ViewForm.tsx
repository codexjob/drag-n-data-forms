import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFormById, FormData } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FormElement, FormElementType } from '@/lib/formElementTypes';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2 } from 'lucide-react';

const ViewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      if (!id) return;
      
      setLoading(true);
      const formData = await fetchFormById(id);
      
      if (formData) {
        setForm(formData);
        // Initialiser les valeurs du formulaire
        const initialValues: Record<string, any> = {};
        (formData.schema as FormElement[]).forEach(element => {
          const columnName = element.columnName || element.label
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, "");
          
          if (element.type === FormElementType.CHECKBOX && element.options) {
            initialValues[columnName] = [];
          } else {
            initialValues[columnName] = '';
          }
        });
        setFormValues(initialValues);
      }
      
      setLoading(false);
    };

    loadForm();
  }, [id]);

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
      // Soumettre les données du formulaire à la table dynamique
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

  const renderFormElement = (element: FormElement) => {
    const columnName = element.columnName || element.label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
    
    switch (element.type) {
      case FormElementType.TEXT:
      case FormElementType.EMAIL:
      case FormElementType.PHONE:
      case FormElementType.URL:
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Input
              id={columnName}
              type={element.type}
              placeholder={element.placeholder}
              value={formValues[columnName] || ''}
              onChange={(e) => handleChange(columnName, e.target.value)}
              required={element.required}
            />
          </div>
        );
        
      case FormElementType.NUMBER:
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Input
              id={columnName}
              type="number"
              placeholder={element.placeholder}
              value={formValues[columnName] || ''}
              onChange={(e) => handleChange(columnName, e.target.value)}
              required={element.required}
              min={element.validation?.min}
              max={element.validation?.max}
            />
          </div>
        );
        
      case FormElementType.TEXTAREA:
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Textarea
              id={columnName}
              placeholder={element.placeholder}
              value={formValues[columnName] || ''}
              onChange={(e) => handleChange(columnName, e.target.value)}
              required={element.required}
            />
          </div>
        );
        
      case FormElementType.SELECT:
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Select 
              value={formValues[columnName] || ''} 
              onValueChange={(value) => handleChange(columnName, value)}
              required={element.required}
            >
              <SelectTrigger id={columnName}>
                <SelectValue placeholder="Sélectionnez une option" />
              </SelectTrigger>
              <SelectContent>
                {element.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case FormElementType.RADIO:
        return (
          <div key={element.id} className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <RadioGroup 
              value={formValues[columnName] || ''}
              onValueChange={(value) => handleChange(columnName, value)}
              required={element.required}
            >
              {element.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${columnName}_${option.id}`} />
                  <Label htmlFor={`${columnName}_${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case FormElementType.CHECKBOX:
        return (
          <div key={element.id} className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <div className="space-y-2">
              {element.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${columnName}_${option.id}`} 
                    checked={(formValues[columnName] || []).includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(columnName, option.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${columnName}_${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case FormElementType.DATE:
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Input
              id={columnName}
              type="date"
              value={formValues[columnName] || ''}
              onChange={(e) => handleChange(columnName, e.target.value)}
              required={element.required}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-dragndrop-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-2xl font-bold text-dragndrop-text mb-4">Formulaire non trouvé</h1>
          <p className="text-dragndrop-darkgray mb-4">
            Le formulaire que vous recherchez n'existe pas ou n'a pas été publié.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux formulaires
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray">
        <div className="container mx-auto py-6 px-4">
          <div className="bg-white rounded-lg border border-dragndrop-gray p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-dragndrop-text mb-4">Formulaire soumis avec succès</h1>
            <p className="text-dragndrop-darkgray mb-6">
              Merci d'avoir soumis le formulaire "{form.title}". Votre réponse a été enregistrée.
            </p>
            <div className="flex space-x-2">
              <Button onClick={() => {
                setSubmitted(false);
                setFormValues({});
              }}>
                Soumettre un autre formulaire
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux formulaires
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg border border-dragndrop-gray p-6 max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux formulaires
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold text-dragndrop-text">{form.title}</h1>
            <p className="text-dragndrop-darkgray mt-2">{form.description}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {(form.schema as unknown as FormElement[]).map(renderFormElement)}
            
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
