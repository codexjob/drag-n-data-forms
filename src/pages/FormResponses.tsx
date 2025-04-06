
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFormById, FormData } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, DownloadIcon, Loader2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FormElement } from '@/lib/formElementTypes';

interface FormResponse {
  id: string;
  created_at: string;
  [key: string]: any;
}

const FormResponses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFormAndResponses = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Charger le formulaire
        const formData = await fetchFormById(id);
        
        if (!formData) {
          toast.error("Formulaire non trouvé");
          setLoading(false);
          return;
        }
        
        setForm(formData);
        
        // Charger les réponses - assurez-vous que table_name est valide
        if (formData.table_name) {
          // Use the generic query method instead of the typed one
          const { data, error } = await supabase
            .from(formData.table_name as any)
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error("Erreur lors du chargement des réponses:", error);
            toast.error("Erreur lors du chargement des réponses");
          } else {
            setResponses(data || []);
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    loadFormAndResponses();
  }, [id]);

  const handleExportCSV = () => {
    if (!form || !responses.length) return;
    
    try {
      // Obtenir les en-têtes (noms des colonnes)
      const schema = form.schema as FormElement[];
      const headers = ['ID', 'Date de soumission', ...schema.map(el => el.label)];
      
      // Préparer les données
      const csvRows = [
        headers.join(','), // En-têtes
        ...responses.map(response => {
          const rowValues = [
            response.id,
            new Date(response.created_at).toLocaleString(),
            ...schema.map(element => {
              const columnName = element.columnName || element.label
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "_")
                .replace(/_+/g, "_")
                .replace(/^_|_$/g, "");
              
              let value = response[columnName];
              
              // Formater la valeur selon le type
              if (Array.isArray(value)) {
                value = value.join('; ');
              } else if (value === null || value === undefined) {
                value = '';
              }
              
              // Échapper les virgules et les guillemets pour le CSV
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
              }
              
              return value;
            })
          ];
          
          return rowValues.join(',');
        })
      ];
      
      // Créer le contenu CSV
      const csvContent = csvRows.join('\n');
      
      // Créer un Blob et un lien de téléchargement
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `responses_${form.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export CSV téléchargé");
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      toast.error("Erreur lors de l'export CSV");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-dragndrop-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-2xl font-bold text-dragndrop-text mb-4">Formulaire non trouvé</h1>
          <p className="text-dragndrop-darkgray mb-4">
            Le formulaire que vous recherchez n'existe pas.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux formulaires
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const schema = form.schema as FormElement[];

  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <Button variant="outline" asChild className="mr-4">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-dragndrop-text">Réponses au formulaire</h1>
              <p className="text-dragndrop-darkgray">{form.title}</p>
            </div>
          </div>
          
          {responses.length > 0 && (
            <Button onClick={handleExportCSV} variant="outline">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          )}
        </div>

        {responses.length === 0 ? (
          <div className="bg-white rounded-lg border border-dragndrop-gray p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Aucune réponse</h2>
            <p className="text-dragndrop-darkgray mb-4">
              Ce formulaire n'a pas encore reçu de réponses.
            </p>
            <Button asChild>
              <Link to={`/form/${id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Voir le formulaire
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-dragndrop-gray overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dragndrop-lightgray">
                    <th className="px-4 py-3 text-left font-medium text-dragndrop-text">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-dragndrop-text">Date</th>
                    {schema.map((element) => (
                      <th key={element.id} className="px-4 py-3 text-left font-medium text-dragndrop-text">
                        {element.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr key={response.id} className="border-t border-dragndrop-gray hover:bg-dragndrop-lightgray/30">
                      <td className="px-4 py-3 text-dragndrop-darkgray">{response.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-dragndrop-darkgray">
                        {new Date(response.created_at).toLocaleString()}
                      </td>
                      {schema.map((element) => {
                        const columnName = element.columnName || element.label
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "_")
                          .replace(/_+/g, "_")
                          .replace(/^_|_$/g, "");
                        
                        let value = response[columnName];
                        
                        // Formater la valeur selon le type
                        if (Array.isArray(value)) {
                          value = value.join(', ');
                        } else if (value === null || value === undefined) {
                          value = '-';
                        }
                        
                        return (
                          <td key={element.id} className="px-4 py-3 text-dragndrop-darkgray">
                            {String(value)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
