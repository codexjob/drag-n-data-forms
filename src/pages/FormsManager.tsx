
import React, { useEffect, useState } from 'react';
import { fetchForms, FormData, publishForm } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays, Copy, Edit, Eye, List, Plus, Settings } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

const FormsManager: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    loadForms();
  }, []);

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
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsManager;
