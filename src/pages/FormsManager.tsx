
import React, { useEffect, useState } from 'react';
import { fetchForms, FormData, publishForm } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, BookOpen, Check, FileText, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const FormsManager: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadForms = async () => {
    setLoading(true);
    const formsList = await fetchForms();
    setForms(formsList);
    setLoading(false);
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handlePublish = async (formId: string) => {
    const result = await publishForm(formId);
    if (result) {
      toast.success("Formulaire publié avec succès");
      // Recharger la liste des formulaires pour voir les changements
      loadForms();
    } else {
      toast.error("Erreur lors de la publication du formulaire");
    }
  };

  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dragndrop-text">Gestionnaire de Formulaires</h1>
            <p className="text-dragndrop-darkgray">
              Gérez vos formulaires créés et publiés
            </p>
          </div>
          <Link to="/">
            <Button className="bg-dragndrop-primary hover:bg-dragndrop-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Formulaire
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-dragndrop-darkgray">Chargement des formulaires...</p>
          </div>
        ) : forms.length === 0 ? (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aucun formulaire trouvé</AlertTitle>
            <AlertDescription>
              Vous n'avez pas encore créé de formulaires. Cliquez sur "Nouveau Formulaire" pour commencer.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <div key={form.id} className="bg-white rounded-lg border border-dragndrop-gray p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-dragndrop-text">{form.title}</h2>
                  <Badge variant={form.published ? "success" : "secondary"}>
                    {form.published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <p className="text-dragndrop-darkgray mb-4 text-sm line-clamp-2">{form.description}</p>
                <p className="text-dragndrop-darkgray mb-4 text-xs">
                  Créé le {new Date(form.created_at || '').toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  {form.published ? (
                    <Button variant="outline" asChild>
                      <Link to={`/form/${form.id}`}>
                        <FileText className="w-4 h-4 mr-2" />
                        Voir
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={() => handlePublish(form.id!)} className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-2" />
                      Publier
                    </Button>
                  )}
                  {form.published && (
                    <Button variant="outline" asChild>
                      <Link to={`/responses/${form.id}`}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Réponses
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsManager;
