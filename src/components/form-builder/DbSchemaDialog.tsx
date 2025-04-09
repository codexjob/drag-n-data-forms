
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

interface DbSchemaDialogProps {
  showDbDialog: boolean;
  setShowDbDialog: (show: boolean) => void;
  formTitle: string;
  handleFormSave: () => Promise<void>;
  saving: boolean;
}

const DbSchemaDialog: React.FC<DbSchemaDialogProps> = ({
  showDbDialog,
  setShowDbDialog,
  formTitle,
  handleFormSave,
  saving
}) => {
  return (
    <AlertDialog open={showDbDialog} onOpenChange={setShowDbDialog}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-dragndrop-primary" />
            Enregistrer le formulaire
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ce formulaire sera enregistré et les données soumises seront stockées dans la table "data". 
            Voulez-vous enregistrer ce formulaire?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-dragndrop-text text-white rounded-md p-4 my-4 overflow-auto max-h-80">
          <pre className="text-sm font-mono">
{`-- Les données seront stockées dans la table "data" existante
-- Structure de la table:

TABLE data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  form_id UUID REFERENCES forms(id),
  form_data JSONB -- Les données du formulaire "${formTitle}" seront stockées ici
);

-- Le formulaire lui-même sera enregistré dans la table "forms"`}
          </pre>
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
