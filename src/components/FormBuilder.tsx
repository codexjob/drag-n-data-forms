
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormElementsList from './FormElementsList';
import FormPreview from './FormPreview';
import ConfigPanel from './ConfigPanel';
import { FormElement } from '@/lib/formElementTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, Database, Save } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { saveForm } from '@/services/formService';
import { useNavigate } from 'react-router-dom';

const FormBuilder: React.FC = () => {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("Nouveau Formulaire");
  const [formDescription, setFormDescription] = useState<string>("Description de votre formulaire");
  const [showDbDialog, setShowDbDialog] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const navigate = useNavigate();

  const selectedElement = formElements.find((element) => element.id === selectedElementId) || null;

  const handleAddElement = (element: FormElement) => {
    // Correction ici : on utilise l'état précédent au lieu d'une référence directe à formElements
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
    if (formElements.length === 0) return;
    
    try {
      setSaving(true);
      
      const formId = await saveForm(formTitle, formDescription, formElements);
      
      if (formId) {
        toast.success("Formulaire sauvegardé avec succès");
        navigate('/forms');
      } else {
        toast.error("Erreur lors de la sauvegarde du formulaire");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du formulaire:", error);
      toast.error("Erreur lors de la sauvegarde du formulaire");
    } finally {
      setSaving(false);
      setShowDbDialog(false);
    }
  };

  const generatePostgresSchema = () => {
    if (formElements.length === 0) return "";

    const tableName = formTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    let schema = `CREATE TABLE ${tableName} (\n`;
    schema += `  id SERIAL PRIMARY KEY,\n`;
    
    formElements.forEach((element, index) => {
      const columnName = element.label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
      
      let columnType = "VARCHAR(255)";
      
      switch (element.type) {
        case "textarea":
          columnType = "TEXT";
          break;
        case "number":
          columnType = "NUMERIC";
          break;
        case "date":
          columnType = "DATE";
          break;
        case "checkbox":
          columnType = "BOOLEAN[]";
          break;
        default:
          columnType = "VARCHAR(255)";
      }
      
      schema += `  ${columnName} ${columnType}`;
      if (element.required) {
        schema += " NOT NULL";
      }
      
      if (index < formElements.length - 1) {
        schema += ",\n";
      } else {
        schema += "\n";
      }
    });
    
    schema += `);`;
    
    return schema;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dragndrop-text">Générateur de Formulaire</h1>
            <p className="text-dragndrop-darkgray">
              Créez votre formulaire en glissant-déposant des éléments
            </p>
          </div>
          <Button 
            className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
            onClick={handleSaveForm}
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 lg:col-span-3">
            <FormElementsList />
          </div>

          <div className="md:col-span-8 lg:col-span-6 flex flex-col gap-4">
            <div className="p-4 bg-white rounded-lg border border-dragndrop-gray">
              <div className="mb-4">
                <label className="block text-sm font-medium text-dragndrop-text mb-1">
                  Titre du formulaire
                </label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dragndrop-text mb-1">
                  Description du formulaire
                </label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <FormPreview
              elements={formElements}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onAddElement={handleAddElement}
              onMoveElement={handleMoveElement}
              formTitle={formTitle}
              formDescription={formDescription}
            />
          </div>

          <div className="md:col-span-12 lg:col-span-3">
            <ConfigPanel
              element={selectedElement}
              onUpdate={handleUpdateElement}
              onDelete={handleDeleteElement}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showDbDialog} onOpenChange={setShowDbDialog}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-dragndrop-primary" />
              Structure PostgreSQL générée
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette structure sera utilisée pour créer une table dans votre base de données Supabase. Voulez-vous enregistrer ce formulaire?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-dragndrop-text text-white rounded-md p-4 my-4 overflow-auto max-h-80">
            <pre className="text-sm font-mono">{generatePostgresSchema()}</pre>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
              onClick={handleFormSave}
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndProvider>
  );
};

export default FormBuilder;
