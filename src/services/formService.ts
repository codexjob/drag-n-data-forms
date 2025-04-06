
import { supabase } from "@/integrations/supabase/client";
import { FormElement } from "@/lib/formElementTypes";

export interface FormData {
  id?: string;
  title: string;
  description: string;
  schema: FormElement[];
  table_name: string;
  created_at?: string;
  published: boolean;
}

// Convertir un élément de formulaire en colonne PostgreSQL compatible
const elementToColumn = (element: FormElement) => {
  const columnName = element.label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return {
    ...element,
    columnName
  };
};

// Sauvegarder un formulaire dans Supabase
export const saveForm = async (title: string, description: string, elements: FormElement[]): Promise<string | null> => {
  try {
    // Générer un nom de table unique basé sur le titre
    const tableName = `form_${title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")}_${Date.now().toString().slice(-6)}`;
    
    // Préparer les éléments avec des noms de colonnes
    const schemaElements = elements.map(elementToColumn);
    
    // Insérer dans Supabase
    const { data, error } = await supabase
      .from('forms')
      .insert({
        title,
        description,
        schema: schemaElements,
        table_name: tableName,
        published: false
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la sauvegarde du formulaire:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du formulaire:", error);
    return null;
  }
};

// Publier un formulaire (ce qui déclenche la création de la table pour les réponses)
export const publishForm = async (formId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('forms')
      .update({ published: true })
      .eq('id', formId);

    if (error) {
      console.error("Erreur lors de la publication du formulaire:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la publication du formulaire:", error);
    return false;
  }
};

// Récupérer tous les formulaires créés
export const fetchForms = async (): Promise<FormData[]> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des formulaires:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des formulaires:", error);
    return [];
  }
};

// Récupérer un formulaire par son ID
export const fetchFormById = async (formId: string): Promise<FormData | null> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du formulaire:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du formulaire:", error);
    return null;
  }
};
