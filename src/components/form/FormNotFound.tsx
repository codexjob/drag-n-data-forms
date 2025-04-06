
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FormNotFound: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-dragndrop-text mb-4">Formulaire non trouvé</h1>
      <p className="text-dragndrop-darkgray mb-4">
        Le formulaire que vous recherchez n'existe pas ou n'a pas été publié.
      </p>
      <Button asChild>
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux formulaires
        </Link>
      </Button>
    </div>
  );
};

export default FormNotFound;
