
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormBuilderHeaderProps {
  isEditing: boolean;
  onSave: () => void;
  title: string;
  description: string;
}

const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({
  isEditing,
  onSave,
  title,
  description
}) => {
  return (
    <div className="space-y-4">
      <Button variant="outline" asChild className="mb-2">
        <Link to="/forms">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux formulaires
        </Link>
      </Button>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dragndrop-text">
            {isEditing ? "Modifier le Formulaire" : "Nouveau Formulaire"}
          </h1>
          <p className="text-dragndrop-darkgray">
            {isEditing ? "Modifiez votre formulaire existant" : "Créez votre formulaire en glissant-déposant des éléments"}
          </p>
        </div>
        <Button 
          className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
          onClick={onSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default FormBuilderHeader;
