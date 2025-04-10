
import React from 'react';
import { Trash2 } from 'lucide-react';
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
import { Button } from "@/components/ui/button";

interface DeleteFormDialogProps {
  formId?: string;
  formTitle: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteFormDialog: React.FC<DeleteFormDialogProps> = ({
  formId,
  formTitle,
  onDelete,
  isDeleting
}) => {
  const [showDialog, setShowDialog] = React.useState(false);

  const handleDelete = async () => {
    await onDelete();
    setShowDialog(false);
  };

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setShowDialog(true)}
        disabled={!formId}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Supprimer
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Trash2 className="mr-2 h-5 w-5 text-destructive" />
              Supprimer le formulaire
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le formulaire "{formTitle}" ?
              <br />
              <strong className="text-destructive">Cette action est irréversible.</strong> Toutes les données associées à ce formulaire seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteFormDialog;
