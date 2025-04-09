
import { useState, useEffect } from 'react';
import { FormElement } from '@/lib/formElementTypes';
import { fetchFormById, saveForm } from '@/services/formService';
import { toast } from 'sonner';

export const useFormBuilderState = (formId?: string) => {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("Nouveau Formulaire");
  const [formDescription, setFormDescription] = useState<string>("Description de votre formulaire");
  const [showDbDialog, setShowDbDialog] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFormId, setCurrentFormId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const loadForm = async () => {
      if (!formId || formId === 'new') return;
      
      setLoading(true);
      try {
        console.log("Chargement du formulaire avec l'ID:", formId);
        const form = await fetchFormById(formId);
        if (form) {
          console.log("Formulaire chargé avec succès:", form);
          setCurrentFormId(formId);
          setFormTitle(form.title);
          setFormDescription(form.description || "");
          setFormElements(form.schema);
        } else {
          toast.error("Formulaire non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du formulaire:", error);
        toast.error("Erreur lors du chargement du formulaire");
      } finally {
        setLoading(false);
      }
    };
    
    loadForm();
  }, [formId]);

  const selectedElement = formElements.find((element) => element.id === selectedElementId) || null;

  const handleAddElement = (element: FormElement) => {
    setFormElements(prevElements => [...prevElements, element]);
    setSelectedElementId(element.id);
    toast.success("Élément ajouté avec succès");
  };

  const handleUpdateElement = (updatedElement: FormElement) => {
    setFormElements(
      formElements.map((element) =>
        element.id === updatedElement.id ? updatedElement : element
      )
    );
  };

  const handleDeleteElement = (id: string) => {
    setFormElements(formElements.filter((element) => element.id !== id));
    setSelectedElementId(null);
    toast.info("Élément supprimé");
  };

  const handleMoveElement = (dragIndex: number, hoverIndex: number) => {
    const dragElement = formElements[dragIndex];
    const newElements = [...formElements];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, dragElement);
    setFormElements(newElements);
  };

  const handleSaveForm = () => {
    if (formElements.length === 0) {
      toast.error("Votre formulaire est vide. Ajoutez des éléments avant de sauvegarder.");
      return;
    }

    setShowDbDialog(true);
  };

  const handleFormSave = async () => {
    if (formElements.length === 0) return null;
    
    try {
      setSaving(true);
      
      console.log("Sauvegarde du formulaire avec les données:", {
        title: formTitle,
        description: formDescription,
        elements: formElements,
        formId: currentFormId || (formId !== 'new' ? formId : undefined)
      });
      
      const savedFormId = await saveForm(
        formTitle, 
        formDescription, 
        formElements, 
        currentFormId || (formId !== 'new' ? formId : undefined)
      );
      
      if (savedFormId) {
        toast.success("Formulaire sauvegardé avec succès");
        setCurrentFormId(savedFormId);
        return savedFormId;
      } else {
        toast.error("Erreur lors de la sauvegarde du formulaire");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du formulaire:", error);
      toast.error("Erreur lors de la sauvegarde du formulaire");
      return null;
    } finally {
      setSaving(false);
      setShowDbDialog(false);
    }
  };

  return {
    formElements,
    selectedElementId,
    formTitle,
    formDescription,
    showDbDialog,
    saving,
    loading,
    currentFormId,
    selectedElement,
    setFormTitle,
    setFormDescription,
    setSelectedElementId,
    setShowDbDialog,
    handleAddElement,
    handleUpdateElement,
    handleDeleteElement,
    handleMoveElement,
    handleSaveForm,
    handleFormSave
  };
};
