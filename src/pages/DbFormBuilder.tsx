
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import FormBuilderHeader from '@/components/form-builder/FormBuilderHeader';
import FormTitleSection from '@/components/form-builder/FormTitleSection';
import FormBuilderLayout from '@/components/form-builder/FormBuilderLayout';
import DbSchemaDialog from '@/components/form-builder/DbSchemaDialog';
import { useFormBuilderState } from '@/components/form-builder/useFormBuilderState';
import { fetchConnectionById } from '@/services/dbConnectionService';
import { generateCreateTableSQL, executeSQL } from '@/services/sqlGeneratorService';
import { DatabaseConnection } from '@/lib/dbConnectionTypes';

const DbFormBuilder: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const connectionIdParam = searchParams.get('connectionId');
  const isEditing = id && id !== 'new';
  
  const [tableName, setTableName] = useState<string>('');
  const [connectionId, setConnectionId] = useState<string>(connectionIdParam || '');
  const [connection, setConnection] = useState<DatabaseConnection | null>(null);
  const [loadingConnection, setLoadingConnection] = useState<boolean>(false);
  
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
    handleSaveForm
  } = useFormBuilderState(id);

  useEffect(() => {
    if (connectionId) {
      loadConnection();
    }
  }, [connectionId]);

  const loadConnection = async () => {
    setLoadingConnection(true);
    const conn = await fetchConnectionById(connectionId);
    setConnection(conn);
    setLoadingConnection(false);
  };

  const handleDbFormSave = async () => {
    if (!formTitle) {
      toast.error("Le titre du formulaire est requis");
      return;
    }

    if (formElements.length === 0) {
      toast.error("Le formulaire doit contenir au moins un élément");
      return;
    }

    if (!tableName) {
      toast.error("Le nom de la table est requis");
      return;
    }

    if (!connection) {
      toast.error("Connexion à la base de données requise");
      return;
    }

    try {
      // Générer le SQL
      const sql = generateCreateTableSQL(tableName, formElements, connection.type);
      
      // Exécuter le SQL sur la base de données externe
      const result = await executeSQL(connection, connection.type, sql);
      
      if (!result.success) {
        toast.error(`Erreur lors de la création de la table: ${result.error}`);
        return;
      }
      
      // Sauvegarder le formulaire dans Supabase
      await handleSaveForm();
      
      toast.success("Formulaire et table créés avec succès");
      navigate('/forms');
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du formulaire:", error);
      toast.error("Erreur lors de la sauvegarde du formulaire");
    }
  };

  if (loading || loadingConnection) {
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
          onSave={() => setShowDbDialog(true)}
          title={formTitle}
          description={formDescription}
          isDbForm={true}
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
          handleFormSave={handleDbFormSave}
          saving={saving}
          dbMode={true}
          tableName={tableName}
          setTableName={setTableName}
          connectionId={connectionId}
          setConnectionId={setConnectionId}
        />
      </div>
    </DndProvider>
  );
};

export default DbFormBuilder;
