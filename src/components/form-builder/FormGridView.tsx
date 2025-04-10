
import React from 'react';
import { FormData } from '@/services/formService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from 'lucide-react';
import FormActionButtons from './FormActionButtons';

interface FormGridViewProps {
  forms: FormData[];
  onPublish: (formId: string) => Promise<void>;
  copyFormLink: (formId: string) => void;
  onDeleteForm: (form: FormData) => void;
  deletingFormId: string | null;
}

const FormGridView: React.FC<FormGridViewProps> = ({
  forms,
  onPublish,
  copyFormLink,
  onDeleteForm,
  deletingFormId
}) => {
  const handleDeleteForm = async (form: FormData) => {
    onDeleteForm(form);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => (
        <Card key={form.id} className="bg-white shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-semibold text-dragndrop-text">{form.title}</CardTitle>
              <Badge variant={form.published ? "success" : "secondary"}>
                {form.published ? "Publié" : "Brouillon"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <p className="text-dragndrop-darkgray mb-2 text-sm line-clamp-2">{form.description}</p>
            <p className="text-dragndrop-darkgray text-xs flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              Créé le {new Date(form.created_at || '').toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="pt-2">
            <FormActionButtons
              form={form}
              onPublish={onPublish}
              copyFormLink={copyFormLink}
              onDelete={() => handleDeleteForm(form)}
              isDeleting={deletingFormId === form.id}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FormGridView;
