
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilderHeader from './form-builder/FormBuilderHeader';
import FormTitleSection from './form-builder/FormTitleSection';
import FormBuilderLayout from './form-builder/FormBuilderLayout';
import DbSchemaDialog from './form-builder/DbSchemaDialog';
import { useFormBuilderState } from './form-builder/useFormBuilderState';

const FormBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  
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
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
