import React from 'react';
import { Database } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
  return <AlertDialog open={showDbDialog} onOpenChange={setShowDbDialog}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-dragndrop-primary" />
            Enregistrer le formulaire
          </AlertDialogTitle>
          <AlertDialogDescription>Ce formulaire sera enregistré et les données soumises seront stockées dans la table "data". Voulez-vous enregistrer ce formulaire?</AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction className="bg-dragndrop-primary hover:bg-dragndrop-secondary" onClick={handleFormSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
};
export default DbSchemaDialog;