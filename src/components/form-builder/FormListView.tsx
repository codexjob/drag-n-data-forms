
import React, { useState } from 'react';
import { FormData } from '@/services/formService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FormActionButtons from './FormActionButtons';
import { CalendarDays } from 'lucide-react';

interface FormListViewProps {
  forms: FormData[];
  onPublish: (formId: string) => Promise<void>;
  onUnpublish: (formId: string) => Promise<void>;
  copyFormLink: (formId: string) => void;
  onDeleteForm: (form: FormData) => void;
  deletingFormId: string | null;
}

const FormListView: React.FC<FormListViewProps> = ({
  forms,
  onPublish,
  onUnpublish,
  copyFormLink,
  onDeleteForm,
  deletingFormId
}) => {
  const handleDeleteForm = async (form: FormData) => {
    onDeleteForm(form);
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formulaire</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.title}</TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate">{form.description}</p>
              </TableCell>
              <TableCell>
                <Badge variant={form.published ? "success" : "secondary"}>
                  {form.published ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-dragndrop-darkgray text-xs flex items-center">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {new Date(form.created_at || '').toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <FormActionButtons
                  form={form}
                  onPublish={onPublish}
                  onUnpublish={onUnpublish}
                  copyFormLink={copyFormLink}
                  onDelete={() => handleDeleteForm(form)}
                  isDeleting={deletingFormId === form.id}
                  compact={true}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FormListView;
