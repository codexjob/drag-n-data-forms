
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
    handleFormSave,
    generatePostgresSchema
  } = useFormBuilderState(id);

  const completeFormSave = async () => {
    const savedId = await handleFormSave();
    if (savedId) {
      navigate('/forms');
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
          generatePostgresSchema={generatePostgresSchema}
          handleFormSave={completeFormSave}
          saving={saving}
        />
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
