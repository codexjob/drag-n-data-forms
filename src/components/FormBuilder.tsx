
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilderHeader from './form-builder/FormBuilderHeader';
import FormTitleSection from './form-builder/FormTitleSection';
import FormBuilderLayout from './form-builder/FormBuilderLayout';
import DbSchemaDialog from './form-builder/DbSchemaDialog';
import DeleteFormDialog from './form-builder/DeleteFormDialog';
import { useFormBuilderState } from './form-builder/useFormBuilderState';
import { deleteForm } from '@/services/formService';
import { toast } from 'sonner';

const FormBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  console.log("FormBuilder rendering with ID:", id);
  
  const {
    formElements,
    selectedElementId,
    formTitle,
    formDescription,
    showDbDialog,
    saving,
    loading,
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
  } = useFormBuilderState(id);

  const completeFormSave = async () => {
    console.log("Attempting to save form...");
    const savedId = await handleFormSave();
    if (savedId) {
      console.log("Form saved successfully, navigating to forms list");
      navigate('/forms');
    } else {
      console.error("Failed to save form");
    }
  };

  const handleFormDelete = async () => {
    if (!id || id === 'new') {
      toast.error("Impossible de supprimer un formulaire non sauvegardé");
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteForm(id);
      if (success) {
        toast.success("Formulaire supprimé avec succès");
        navigate('/forms');
      } else {
        toast.error("Échec de la suppression du formulaire");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du formulaire");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dragndrop-primary"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4">
        <FormBuilderHeader 
          isEditing={isEditing} 
          onSave={handleSaveForm}
          title={formTitle}
          description={formDescription}
        />

        <FormTitleSection
          formTitle={formTitle}
          formDescription={formDescription}
          setFormTitle={setFormTitle}
          setFormDescription={setFormDescription}
        />

        <FormBuilderLayout
          formElements={formElements}
          selectedElementId={selectedElementId}
          selectedElement={selectedElement}
          formTitle={formTitle}
          formDescription={formDescription}
          onSelectElement={setSelectedElementId}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onMoveElement={handleMoveElement}
        />

        <DbSchemaDialog
          showDbDialog={showDbDialog}
          setShowDbDialog={setShowDbDialog}
          formTitle={formTitle}
          handleFormSave={completeFormSave}
          saving={saving}
        />

        {isEditing && (
          <div className="flex justify-end mt-4">
            <DeleteFormDialog
              formId={id}
              formTitle={formTitle}
              onDelete={handleFormDelete}
              isDeleting={isDeleting}
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
