
import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchConnections } from '@/services/dbConnectionService';
import { DatabaseConnection } from '@/lib/dbConnectionTypes';

interface DbSchemaDialogProps {
  showDbDialog: boolean;
  setShowDbDialog: (show: boolean) => void;
  formTitle: string;
  handleFormSave: () => Promise<void>;
  saving: boolean;
  dbMode?: boolean;
  tableName?: string;
  setTableName?: (name: string) => void;
  connectionId?: string;
  setConnectionId?: (id: string) => void;
}

const DbSchemaDialog: React.FC<DbSchemaDialogProps> = ({
  showDbDialog,
  setShowDbDialog,
  formTitle,
  handleFormSave,
  saving,
  dbMode = false,
  tableName = '',
  setTableName,
  connectionId = '',
  setConnectionId
}) => {
  const [tabValue, setTabValue] = useState(dbMode ? 'external' : 'internal');
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showDbDialog && dbMode) {
      loadConnections();
    }
  }, [showDbDialog, dbMode]);

  const loadConnections = async () => {
    setLoading(true);
    const fetchedConnections = await fetchConnections();
    setConnections(fetchedConnections);
    setLoading(false);
  };

  return (
    <AlertDialog open={showDbDialog} onOpenChange={setShowDbDialog}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-dragndrop-primary" />
            Enregistrer le formulaire
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dbMode 
              ? "Configurez la destination pour votre formulaire." 
              : "Ce formulaire sera enregistré et les données soumises seront stockées dans la table \"data\". Voulez-vous enregistrer ce formulaire?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {dbMode && (
          <Tabs defaultValue={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="internal">Stockage Interne</TabsTrigger>
              <TabsTrigger value="external">Base de Données Externe</TabsTrigger>
            </TabsList>
            <TabsContent value="internal" className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Les données du formulaire seront stockées dans la base de données Supabase intégrée.
              </p>
            </TabsContent>
            <TabsContent value="external" className="py-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="connection">Connexion à la base de données</Label>
                  {loading ? (
                    <div className="animate-pulse h-10 w-full bg-gray-200 rounded-md"></div>
                  ) : (
                    <Select 
                      value={connectionId} 
                      onValueChange={(value) => setConnectionId && setConnectionId(value)}
                      disabled={connections.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une connexion" />
                      </SelectTrigger>
                      <SelectContent>
                        {connections.map((conn) => (
                          <SelectItem key={conn.id} value={conn.id}>
                            {conn.name} ({conn.database})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {connections.length === 0 && (
                    <p className="text-sm text-red-500">
                      Aucune connexion disponible. Veuillez d'abord créer une connexion.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tableName">Nom de la table</Label>
                  <Input
                    id="tableName"
                    value={tableName}
                    onChange={(e) => setTableName && setTableName(e.target.value)}
                    disabled={!connectionId}
                    placeholder="Nom de la table à créer ou mettre à jour"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-dragndrop-primary hover:bg-dragndrop-secondary" 
            onClick={handleFormSave} 
            disabled={saving || (tabValue === 'external' && (connections.length === 0 || !connectionId || !tableName))}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DbSchemaDialog;
