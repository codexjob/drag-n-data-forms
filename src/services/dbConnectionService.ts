
import { supabase } from "@/integrations/supabase/client";
import { DatabaseConnection } from "@/lib/dbConnectionTypes";

// Récupérer toutes les connexions
export const fetchConnections = async (): Promise<DatabaseConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('database_connections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des connexions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des connexions:", error);
    return [];
  }
};

// Récupérer une connexion par ID
export const fetchConnectionById = async (id: string): Promise<DatabaseConnection | null> => {
  try {
    const { data, error } = await supabase
      .from('database_connections')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error("Erreur lors de la récupération de la connexion:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la connexion:", error);
    return null;
  }
};

// Sauvegarder une connexion
export const saveConnection = async (connection: Omit<DatabaseConnection, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('database_connections')
      .insert(connection)
      .select();

    if (error) {
      console.error("Erreur lors de la sauvegarde de la connexion:", error);
      return null;
    }

    return data?.[0]?.id || null;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la connexion:", error);
    return null;
  }
};

// Mettre à jour une connexion
export const updateConnection = async (id: string, connection: Omit<DatabaseConnection, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('database_connections')
      .update(connection)
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la mise à jour de la connexion:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la connexion:", error);
    return false;
  }
};

// Supprimer une connexion
export const deleteConnection = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('database_connections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la suppression de la connexion:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de la connexion:", error);
    return false;
  }
};
