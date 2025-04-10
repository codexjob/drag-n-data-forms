
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchForms, FormData, publishForm, deleteForm } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Copy, Edit, Eye, List, Plus, Settings, Share2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

const Index = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormData | null>(null);
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
          <Button 
            className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
            onClick={handleNewForm}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Formulaire
          </Button>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-dragndrop-text">{form.title}</CardTitle>
                    <Badge variant={form.published ? "success" : "secondary"}>
                      {form.published ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-dragndrop-darkgray mb-2 text-sm line-clamp-2">{form.description}</p>
                  <p className="text-dragndrop-darkgray text-xs flex items-center">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    Créé le {new Date(form.created_at || '').toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/form/${form.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Éditer
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    className={form.published ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" : "bg-dragndrop-primary hover:bg-dragndrop-secondary"}
                    onClick={() => !form.published && handlePublish(form.id || '')}
                    disabled={form.published}
                  >
                    {form.published ? "Déjà publié" : "Publier"}
                  </Button>
                  
                  {form.published && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/form/${form.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  )}
                  
                  {form.published && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyFormLink(form.id || '')}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copier lien
                    </Button>
                  )}
                  
                  {form.published && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/form/${form.id}/config`)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Config
                  </Button>
                  
                  {form.published && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/responses/${form.id}`)}
                    >
                      <List className="h-4 w-4 mr-1" />
                      Réponses
                    </Button>
                  )}

                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => confirmDeleteForm(form)}
                    disabled={deletingFormId === form.id}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingFormId === form.id ? 'Suppression...' : 'Supprimer'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
