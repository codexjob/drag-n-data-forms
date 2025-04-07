
import { supabase } from "@/integrations/supabase/client";
import { FormElement } from "@/lib/formElementTypes";
import { Json } from "@/integrations/supabase/types";

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
  const columnName = element.columnName || element.label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return {
    ...element,
    columnName
  };
};

// Helper to convert FormElement[] to JSON safely
const safeJsonConvert = (schema: FormElement[]): Json => {
  return JSON.parse(JSON.stringify(schema)) as Json;
};

// Sauvegarder un formulaire dans Supabase
export const saveForm = async (title: string, description: string, elements: FormElement[], formId?: string): Promise<string | null> => {
  try {
    // Si on a un formId, c'est une mise à jour
    if (formId) {
      const { data: existingForm } = await supabase
        .from('forms')
        .select('table_name, published')
        .eq('id', formId)
        .single();

      if (!existingForm) {
        console.error("Formulaire non trouvé pour mise à jour");
        return null;
      }

      // Préparer les éléments avec des noms de colonnes
      const schemaElements = elements.map(elementToColumn);
      
      // Convertir schemaElements en JSON avant insertion
      const schemaJson = safeJsonConvert(schemaElements);
      
      // Mettre à jour le formulaire existant
      const { data, error } = await supabase
        .from('forms')
        .update({
          title,
          description,
          schema: schemaJson
        })
        .eq('id', formId)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour du formulaire:", error);
        return null;
      }

      return data?.id || null;
    } else {
      // Générer un nom de table unique basé sur le titre
      const tableName = `form_${title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")}_${Date.now().toString().slice(-6)}`;
      
      // Préparer les éléments avec des noms de colonnes
      const schemaElements = elements.map(elementToColumn);
      
      // Convertir schemaElements en JSON avant insertion
      const schemaJson = safeJsonConvert(schemaElements);
      
      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('forms')
        .insert({
          title,
          description,
          schema: schemaJson,
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
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du formulaire:", error);
    return null;
  }
};

// Publier un formulaire (ce qui déclenche la création de la table pour les réponses)
export const publishForm = async (formId: string): Promise<boolean> => {
  try {
    // Fetch the form first to check its schema and table_name
    const { data: form, error: fetchError } = await supabase
      .from('forms')
      .select('schema, table_name')
      .eq('id', formId)
      .single();
    
    if (fetchError) {
      console.error("Erreur lors de la récupération du formulaire:", fetchError);
      return false;
    }
    
    // Invoke the RPC function to create the responses table
    if (form) {
      const { error: rpcError } = await supabase.rpc('create_form_responses_table', {
        form_id: formId,
        form_table_name: form.table_name,
        form_schema: form.schema
      });
      
      if (rpcError) {
        console.error("Erreur lors de la création de la table de réponses:", rpcError);
        return false;
      }
    }
    
    // Update the form as published
    const { error: updateError } = await supabase
      .from('forms')
      .update({ published: true })
      .eq('id', formId);

    if (updateError) {
      console.error("Erreur lors de la publication du formulaire:", updateError);
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

    // Convertir les données de Supabase en FormData[]
    return (data || []).map(form => ({
      ...form,
      schema: form.schema as unknown as FormElement[]
    }));
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

    // Convertir les données de Supabase en FormData
    return data ? {
      ...data,
      schema: data.schema as unknown as FormElement[]
    } : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du formulaire:", error);
    return null;
  }
};
