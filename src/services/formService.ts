import { supabase } from "@/integrations/supabase/client";
import { FormElement } from "@/lib/formElementTypes";
import { Json } from "@/integrations/supabase/types";

export interface FormData {
  id?: string;
  title: string;
  description: string;
  schema: FormElement[];
  table_name?: string; // Make this optional as we'll be using a single table
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
    console.log("Saving form with title:", title, "and elements:", elements);
    console.log("Form description:", description);
    console.log("Form ID (if updating):", formId);
    
    // Si on a un formId, c'est une mise à jour
    if (formId) {
      console.log("Mise à jour du formulaire:", formId);
      
      // Vérifier si le formulaire existe
      const { data: existingForm, error: checkError } = await supabase
        .from('forms')
        .select('published, schema')
        .eq('id', formId)
        .maybeSingle();

      if (checkError) {
        console.error("Erreur lors de la vérification du formulaire:", checkError);
        return null;
      }

      if (!existingForm) {
        console.error("Formulaire non trouvé pour mise à jour");
        return null;
      }

      // Préparer les éléments avec des noms de colonnes
      const schemaElements = elements.map(elementToColumn);
      
      // Convertir schemaElements en JSON avant insertion
      const schemaJson = safeJsonConvert(schemaElements);
      
      console.log("Schema JSON pour mise à jour:", schemaJson);
      
      // Affichage de la requête SQL équivalente
      console.log("SQL équivalent: UPDATE forms SET title = '" + title + "', description = '" + description + "', schema = '" + JSON.stringify(schemaJson).replace(/'/g, "''") + "' WHERE id = '" + formId + "'");
      
      // Mettre à jour le formulaire existant
      const { data: updateData, error: updateError } = await supabase
        .from('forms')
        .update({
          title,
          description,
          schema: schemaJson
        })
        .eq('id', formId)
        .select();

      if (updateError) {
        console.error("Erreur lors de la mise à jour du formulaire:", updateError);
        console.error("Code d'erreur:", updateError.code);
        console.error("Message d'erreur:", updateError.message);
        console.error("Détails:", updateError.details);
        return null;
      }
      
      console.log("Mise à jour réussie pour le formulaire:", updateData);
      return formId;
    } else {
      console.log("Création d'un nouveau formulaire");
      
      // Préparer les éléments avec des noms de colonnes
      const schemaElements = elements.map(elementToColumn);
      
      // Convertir schemaElements en JSON avant insertion
      const schemaJson = safeJsonConvert(schemaElements);
      
      // Generate a simple table name (not used anymore but kept for backwards compatibility)
      const table_name = `form_${Date.now()}`;
      
      console.log("Attempting to insert new form with schema:", schemaJson);
      
      // Affichage de la requête SQL équivalente
      console.log("SQL équivalent: INSERT INTO forms (title, description, schema, table_name, published) VALUES ('" + 
                 title + "', '" + 
                 description + "', '" + 
                 JSON.stringify(schemaJson).replace(/'/g, "''") + "', '" + 
                 table_name + "', true)");
      
      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('forms')
        .insert({
          title,
          description,
          schema: schemaJson,
          table_name, // Required by schema but not used anymore
          published: true // Auto-publish since we're not creating custom tables anymore
        })
        .select();

      if (error) {
        console.error("Erreur lors de la sauvegarde du formulaire:", error);
        console.error("Code d'erreur:", error.code);
        console.error("Message d'erreur:", error.message);
        console.error("Détails:", error.details);
        return null;
      }

      console.log("Form created successfully:", data);
      return data?.[0]?.id || null;
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du formulaire:", error);
    return null;
  }
};

// Supprimer un formulaire de Supabase
export const deleteForm = async (formId: string): Promise<boolean> => {
  try {
    console.log("Suppression du formulaire avec l'ID:", formId);
    
    // Vérifier si le formulaire existe
    const { data: existingForm, error: checkError } = await supabase
      .from('forms')
      .select('published')
      .eq('id', formId)
      .maybeSingle();

    if (checkError) {
      console.error("Erreur lors de la vérification du formulaire:", checkError);
      return false;
    }

    if (!existingForm) {
      console.error("Formulaire non trouvé pour suppression");
      return false;
    }

    // Supprimer d'abord toutes les données associées au formulaire
    const { error: deleteDataError } = await supabase
      .from('data')
      .delete()
      .eq('form_id', formId);

    if (deleteDataError) {
      console.error("Erreur lors de la suppression des données du formulaire:", deleteDataError);
      return false;
    }

    // Supprimer le formulaire
    const { error: deleteFormError } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId);

    if (deleteFormError) {
      console.error("Erreur lors de la suppression du formulaire:", deleteFormError);
      return false;
    }

    console.log("Formulaire supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du formulaire:", error);
    return false;
  }
};

// Publier un formulaire (simplifié car nous n'avons plus besoin de créer de table)
export const publishForm = async (formId: string): Promise<boolean> => {
  try {
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

// Dépublier un formulaire
export const unpublishForm = async (formId: string): Promise<boolean> => {
  try {
    // Update the form as unpublished
    const { error: updateError } = await supabase
      .from('forms')
      .update({ published: false })
      .eq('id', formId);

    if (updateError) {
      console.error("Erreur lors de la dépublication du formulaire:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la dépublication du formulaire:", error);
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
    console.log("Fetching form with ID:", formId);
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .maybeSingle();

    if (error) {
      console.error("Erreur lors de la récupération du formulaire:", error);
      return null;
    }

    console.log("Form data retrieved:", data);
    
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
