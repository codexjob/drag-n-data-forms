
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusCircle, Database, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatabaseConnection, DatabaseType, dbTypeLabels, defaultPorts } from '@/lib/dbConnectionTypes';
import { fetchConnections, saveConnection, updateConnection, deleteConnection } from '@/services/dbConnectionService';
import ThemeToggle from '@/components/ThemeToggle';

const DbConnections: React.FC = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedConnection, setSelectedConnection] = useState<DatabaseConnection | null>(null);
  const [formData, setFormData] = useState<Omit<DatabaseConnection, 'id' | 'created_at'>>({
    name: '',
    type: DatabaseType.POSTGRESQL,
    host: '',
    port: defaultPorts[DatabaseType.POSTGRESQL],
    database: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    setLoading(true);
    const fetchedConnections = await fetchConnections();
    setConnections(fetchedConnections);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) : value
    }));
  };

  const handleTypeChange = (value: string) => {
    const dbType = value as DatabaseType;
    setFormData(prev => ({
      ...prev,
      type: dbType,
      port: defaultPorts[dbType]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedConnection) {
        // Mise à jour d'une connexion existante
        const success = await updateConnection(selectedConnection.id, formData);
        if (success) {
          toast.success('Connexion mise à jour avec succès');
          setIsOpen(false);
          loadConnections();
        } else {
          toast.error('Erreur lors de la mise à jour de la connexion');
        }
      } else {
        // Création d'une nouvelle connexion
        const newConnectionId = await saveConnection(formData);
        if (newConnectionId) {
          toast.success('Connexion créée avec succès');
          setIsOpen(false);
          loadConnections();
        } else {
          toast.error('Erreur lors de la création de la connexion');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleEdit = (connection: DatabaseConnection) => {
    setSelectedConnection(connection);
    setFormData({
      name: connection.name,
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: connection.password
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedConnection) return;
    
    try {
      const success = await deleteConnection(selectedConnection.id);
      if (success) {
        toast.success('Connexion supprimée avec succès');
        setIsDeleteDialogOpen(false);
        loadConnections();
      } else {
        toast.error('Erreur lors de la suppression de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleAddNew = () => {
    setSelectedConnection(null);
    setFormData({
      name: '',
      type: DatabaseType.POSTGRESQL,
      host: '',
      port: defaultPorts[DatabaseType.POSTGRESQL],
      database: '',
      username: '',
      password: ''
    });
    setIsOpen(true);
  };

  const handleCreateForm = (connection: DatabaseConnection) => {
    navigate(`/dbform/new?connectionId=${connection.id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Connexions de Base de Données</h1>
        <div className="flex gap-4">
          <ThemeToggle />
          <Button onClick={() => navigate('/')}>Accueil</Button>
          <Button onClick={() => navigate('/forms')}>Formulaires</Button>
          <Button onClick={handleAddNew} className="bg-dragndrop-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle Connexion
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dragndrop-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">Aucune connexion trouvée</h2>
              <p className="text-gray-500 mb-4">Commencez par créer une nouvelle connexion à une base de données</p>
              <Button onClick={handleAddNew} className="bg-dragndrop-primary">
                <PlusCircle className="mr-2 h-4 w-4" />
                Créer une connexion
              </Button>
            </div>
          ) : (
            connections.map((connection) => (
              <Card key={connection.id} className="bg-white shadow-sm dark:bg-dragndrop-dark-lightgray dark:border-dragndrop-dark-gray">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-dragndrop-text dark:text-dragndrop-dark-text">{connection.name}</CardTitle>
                    <Badge variant="outline" className="dark:text-dragndrop-dark-text">
                      {dbTypeLabels[connection.type]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-dragndrop-darkgray dark:text-dragndrop-dark-darkgray">
                    <span className="font-medium">Hôte:</span> {connection.host}
                  </p>
                  <p className="text-sm text-dragndrop-darkgray dark:text-dragndrop-dark-darkgray">
                    <span className="font-medium">Base de données:</span> {connection.database}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 pt-2">
                  <Button 
                    variant="default" 
                    className="flex-1 bg-dragndrop-primary hover:bg-dragndrop-secondary"
                    onClick={() => handleCreateForm(connection)}
                  >
                    Créer Formulaire
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEdit(connection)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setSelectedConnection(connection);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal pour ajouter/éditer une connexion */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedConnection ? 'Modifier la connexion' : 'Nouvelle connexion'}</DialogTitle>
            <DialogDescription>
              Configurez les paramètres de connexion à votre base de données.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DatabaseType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {dbTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="host" className="text-right">
                  Hôte
                </Label>
                <Input
                  id="host"
                  name="host"
                  value={formData.host}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                  Port
                </Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  value={formData.port}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="database" className="text-right">
                  Base de données
                </Label>
                <Input
                  id="database"
                  name="database"
                  value={formData.database}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Utilisateur
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette connexion ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DbConnections;
