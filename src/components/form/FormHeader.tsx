
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  description?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-6">
      <Button variant="outline" asChild className="mb-4">
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux formulaires
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold text-dragndrop-text">{title}</h1>
      {description && <p className="text-dragndrop-darkgray mt-2">{description}</p>}
    </div>
  );
};

export default FormHeader;
