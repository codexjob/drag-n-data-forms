
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FormSubmissionSuccessProps {
  formTitle: string;
  onResubmit: () => void;
}

const FormSubmissionSuccess: React.FC<FormSubmissionSuccessProps> = ({ formTitle, onResubmit }) => {
  return (
    <div className="bg-white rounded-lg border border-dragndrop-gray p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-dragndrop-text mb-4">Formulaire soumis avec succès</h1>
      <p className="text-dragndrop-darkgray mb-6">
        Merci d'avoir soumis le formulaire "{formTitle}". Votre réponse a été enregistrée.
      </p>
      <div className="flex space-x-2">
        <Button onClick={onResubmit}>
          Soumettre un autre formulaire
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux formulaires
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FormSubmissionSuccess;
