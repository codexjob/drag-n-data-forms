
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormTitleSectionProps {
  formTitle: string;
  formDescription: string;
  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
}

const FormTitleSection: React.FC<FormTitleSectionProps> = ({
  formTitle,
  formDescription,
  setFormTitle,
  setFormDescription
}) => {
  return (
    <div className="p-4 bg-white rounded-lg border border-dragndrop-gray">
      <div className="mb-4">
        <label className="block text-sm font-medium text-dragndrop-text mb-1">
          Titre du formulaire
        </label>
        <Input
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="font-semibold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dragndrop-text mb-1">
          Description du formulaire
        </label>
        <Textarea
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
};

export default FormTitleSection;
