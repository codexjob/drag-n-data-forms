
import React from 'react';
import { Database } from 'lucide-react';
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
import { FormElement } from '@/lib/formElementTypes';

interface DbSchemaDialogProps {
  showDbDialog: boolean;
  setShowDbDialog: (show: boolean) => void;
  generatePostgresSchema: () => string;
  handleFormSave: () => Promise<void>;
  saving: boolean;
}

const DbSchemaDialog: React.FC<DbSchemaDialogProps> = ({
  showDbDialog,
  setShowDbDialog,
  generatePostgresSchema,
  handleFormSave,
  saving
}) => {
  return (
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
  );
};

export default DbSchemaDialog;
