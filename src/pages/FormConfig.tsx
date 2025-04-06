
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { fetchFormById, FormData } from '@/services/formService';
import { ArrowLeft, Calendar, CalendarRange, Clock, Loader2, User, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FormConfig = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Configuration options
  const [publicationMode, setPublicationMode] = useState<'permanent' | 'limited' | 'recurring'>('permanent');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startDay, setStartDay] = useState<string>('1');
  const [endDay, setEndDay] = useState<string>('28');
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  
  useEffect(() => {
    const loadForm = async () => {
      if (!id) return;
      
      setLoading(true);
      const formData = await fetchFormById(id);
      
      if (formData) {
        setForm(formData);
        // Ici vous pourriez charger les configurations existantes si elles étaient stockées
      } else {
        toast.error("Formulaire non trouvé");
        navigate('/');
      }
      
      setLoading(false);
    };

    loadForm();
  }, [id, navigate]);

  const handleSaveConfig = async () => {
    if (!form) return;
    
    setSaving(true);
    
    try {
      // Ici, vous pourriez sauvegarder la configuration dans Supabase
      // Pour cet exemple, on simule juste un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Configuration enregistrée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la configuration:", error);
      toast.error("Erreur lors de l'enregistrement de la configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-dragndrop-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-dragndrop-lightgray p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Formulaire non trouvé</h1>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dragndrop-text">Configuration du formulaire</h1>
            <p className="text-dragndrop-darkgray">
              {form.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarRange className="h-5 w-5 mr-2 text-dragndrop-primary" />
                Période de publication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={publicationMode} 
                onValueChange={(value) => setPublicationMode(value as 'permanent' | 'limited' | 'recurring')}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="permanent" id="permanent" />
                  <Label htmlFor="permanent">Publication permanente</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited">Période limitée</Label>
                </div>
                
                {publicationMode === 'limited' && (
                  <div className="ml-6 grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Date de début</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Date de fin</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Récurrence mensuelle</Label>
                </div>
                
                {publicationMode === 'recurring' && (
                  <div className="ml-6 grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDay">Jour de début du mois</Label>
                      <Select value={startDay} onValueChange={setStartDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="Jour de début" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(31)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="endDay">Jour de fin du mois</Label>
                      <Select value={endDay} onValueChange={setEndDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="Jour de fin" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(31)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-dragndrop-primary" />
                Contrôle d'accès
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requiresAuth" className="text-base font-medium">Authentification requise</Label>
                    <p className="text-dragndrop-darkgray text-sm">Les utilisateurs devront se connecter pour répondre</p>
                  </div>
                  <Switch 
                    id="requiresAuth" 
                    checked={requiresAuth} 
                    onCheckedChange={setRequiresAuth}
                  />
                </div>
                
                {requiresAuth && (
                  <div>
                    <Label className="text-base font-medium mb-2 block">Groupes d'utilisateurs autorisés</Label>
                    <p className="text-dragndrop-darkgray text-sm mb-3">Sélectionnez les groupes pouvant accéder au formulaire</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="group-all" 
                          checked={userGroups.includes('all')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserGroups(['all']);
                            } else {
                              setUserGroups([]);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="group-all">Tous les utilisateurs authentifiés</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="group-admin" 
                          checked={userGroups.includes('admin')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserGroups(prev => [...prev.filter(g => g !== 'all'), 'admin']);
                            } else {
                              setUserGroups(prev => prev.filter(g => g !== 'admin'));
                            }
                          }}
                          className="rounded border-gray-300"
                          disabled={userGroups.includes('all')}
                        />
                        <Label htmlFor="group-admin">Administrateurs</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="group-staff" 
                          checked={userGroups.includes('staff')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserGroups(prev => [...prev.filter(g => g !== 'all'), 'staff']);
                            } else {
                              setUserGroups(prev => prev.filter(g => g !== 'staff'));
                            }
                          }}
                          className="rounded border-gray-300"
                          disabled={userGroups.includes('all')}
                        />
                        <Label htmlFor="group-staff">Personnel</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveConfig} 
            className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
            disabled={saving}
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Enregistrer la configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormConfig;
