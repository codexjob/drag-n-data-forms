
import FormBuilder from '@/components/FormBuilder';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Index = () => {
  return (
    <div className="min-h-screen bg-dragndrop-lightgray">
      <div className="container mx-auto py-6 px-4">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note importante</AlertTitle>
          <AlertDescription>
            Cette application est une démonstration de création de formulaires par drag-and-drop. 
            Pour une intégration avec une base de données PostgreSQL, vous devez connecter votre application
            à un service backend comme Supabase.
          </AlertDescription>
        </Alert>
        
        <FormBuilder />
      </div>
    </div>
  );
};

export default Index;
