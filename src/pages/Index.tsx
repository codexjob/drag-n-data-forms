import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchForms, FormData, publishForm, unpublishForm, deleteForm } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { List, Plus } from 'lucide-react';
import { toast } from 'sonner';
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
import { Trash2 } from 'lucide-react';
import ViewToggle, { ViewMode } from '@/components/form-builder/ViewToggle';
import FormGridView from '@/components/form-builder/FormGridView';
import FormListView from '@/components/form-builder/FormListView';

const Index = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    try {
      const formsList = await fetchForms();
      setForms(formsList);
    } catch (error) {
      console.error("Erreur lors du chargement des formulaires:", error);
      toast.error("Erreur lors du chargement des formulaires");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (formId: string) => {
    try {
      const result = await publishForm(formId);
      if (result) {
        toast.success("Formulaire publié avec succès");
        loadForms();
      }
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      toast.error("Erreur lors de la publication du formulaire");
    }
  };

  const handleUnpublish = async (formId: string) => {
    try {
      const result = await unpublishForm(formId);
      if (result) {
        toast.success("Formulaire dépublié avec succès");
        loadForms();
      }
    } catch (error) {
      console.error("Erreur lors de la dépublication:", error);
      toast.error("Erreur lors de la dépublication du formulaire");
    }
  };

  const copyFormLink = (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Lien du formulaire copié dans le presse-papier");
    });
  };

  const handleNewForm = () => {
    navigate('/form/new');
  };

  const confirmDeleteForm = (form: FormData) => {
    setFormToDelete(form);
    setShowDeleteDialog(true);
  };

  const handleDeleteForm = async () => {
    if (!formToDelete || !formToDelete.id) {
      return;
    }

    setDeletingFormId(formToDelete.id);
    try {
      const success = await deleteForm(formToDelete.id);
      if (success) {
        toast.success("Formulaire supprimé avec succès");
        loadForms();
      } else {
        toast.error("Échec de la suppression du formulaire");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du formulaire");
    } finally {
      setDeletingFormId(null);
      setShowDeleteDialog(false);
      setFormToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dragndrop-text">Mes Formulaires</h1>
            <p className="text-dragndrop-darkgray">
              Gérez vos formulaires et accédez aux réponses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            <Button 
              className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
              onClick={handleNewForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Formulaire
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dragndrop-primary"></div>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mb-4">
              <List className="h-12 w-12 mx-auto text-dragndrop-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Aucun formulaire trouvé</h2>
            <p className="text-dragndrop-darkgray mb-6">
              Vous n'avez pas encore créé de formulaire.
            </p>
            <Button 
              className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
              onClick={handleNewForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer mon premier formulaire
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <FormGridView 
            forms={forms}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            copyFormLink={copyFormLink}
            onDeleteForm={confirmDeleteForm}
            deletingFormId={deletingFormId}
          />
        ) : (
          <FormListView 
            forms={forms}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            copyFormLink={copyFormLink}
            onDeleteForm={confirmDeleteForm}
            deletingFormId={deletingFormId}
          />
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Trash2 className="mr-2 h-5 w-5 text-destructive" />
              Supprimer le formulaire
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le formulaire "{formToDelete?.title}" ?
              <br />
              <strong className="text-destructive">Cette action est irréversible.</strong> Toutes les données associées à ce formulaire seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteForm}
              disabled={deletingFormId !== null}
            >
              {deletingFormId ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
