
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFormById, FormData } from '@/services/formService';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
      
      // Charger les informations du formulaire
      const formData = await fetchFormById(id);
      setForm(formData);
      
      if (formData && formData.table_name) {
        // Charger les réponses du formulaire
        try {
          const { data, error } = await supabase
            .from(formData.table_name)
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error("Erreur lors du chargement des réponses:", error);
            toast.error("Erreur lors du chargement des réponses");
          } else {
            setResponses(data || []);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des réponses:", error);
          toast.error("Erreur lors du chargement des réponses");
        }
      }
      
      setLoading(false);
    };

    loadFormAndResponses();
  }, [id]);

  const exportToCSV = () => {
    if (!form || !responses.length) return;
    
    // Obtenir les en-têtes (colonnes) du tableau
    const headers = Object.keys(responses[0])
      .filter(key => key !== 'id' && key !== 'form_id') // Exclure certaines colonnes techniques
      .map(key => key.replace(/_/g, ' ')); // Formatter les noms de colonnes
    
    // Créer les lignes de données
    const rows = responses.map(response => 
      Object.entries(response)
        .filter(([key]) => key !== 'id' && key !== 'form_id')
        .map(([, value]) => {
          // Formater les valeurs pour le CSV
          if (value === null || value === undefined) return '';
          if (Array.isArray(value)) return `"${value.join(', ')}"`;
          if (typeof value === 'object') return `"${JSON.stringify(value)}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        })
    );
    
    // Assembler le contenu CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Créer un objet Blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.title.replace(/\s+/g, '_')}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Le formulaire que vous recherchez n'existe pas ou n'a pas été publié.
          </p>
          <Button asChild>
            <Link to="/forms">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux formulaires
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="outline" asChild className="mb-2">
              <Link to="/forms">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux formulaires
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-dragndrop-text">Réponses: {form.title}</h1>
            <p className="text-dragndrop-darkgray">
              {responses.length} réponse{responses.length !== 1 ? 's' : ''} reçue{responses.length !== 1 ? 's' : ''}
            </p>
          </div>
          {responses.length > 0 && (
            <Button onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          )}
        </div>

        {responses.length === 0 ? (
          <div className="bg-white rounded-lg border border-dragndrop-gray p-6">
            <p className="text-center text-dragndrop-darkgray">
              Aucune réponse n'a encore été soumise pour ce formulaire.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-dragndrop-gray overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(responses[0])
                      .filter(key => key !== 'id' && key !== 'form_id')
                      .map(key => (
                        <th
                          key={key}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response) => (
                    <tr key={response.id}>
                      {Object.entries(response)
                        .filter(([key]) => key !== 'id' && key !== 'form_id')
                        .map(([key, value]) => (
                          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                            {Array.isArray(value) ? value.join(', ') : String(value || '')}
                          </td>
                        ))}
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
