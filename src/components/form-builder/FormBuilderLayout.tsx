
import React from 'react';
import { FormElement } from '@/lib/formElementTypes';
import FormElementsList from '../FormElementsList';
import FormPreview from '../FormPreview';
import ConfigPanel from '../ConfigPanel';

interface FormBuilderLayoutProps {
  formElements: FormElement[];
  selectedElementId: string | null;
  selectedElement: FormElement | null;
  formTitle: string;
  formDescription: string;
  onSelectElement: (id: string) => void;
  onAddElement: (element: FormElement) => void;
  onUpdateElement: (element: FormElement) => void;
  onDeleteElement: (id: string) => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
}

const FormBuilderLayout: React.FC<FormBuilderLayoutProps> = ({
  formElements,
  selectedElementId,
  selectedElement,
  formTitle,
  formDescription,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onMoveElement
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-4 lg:col-span-3">
        <FormElementsList />
      </div>

      <div className="md:col-span-8 lg:col-span-6">
        <FormPreview
          elements={formElements}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          onAddElement={onAddElement}
          onMoveElement={onMoveElement}
          formTitle={formTitle}
          formDescription={formDescription}
        />
      </div>

      <div className="md:col-span-12 lg:col-span-3">
        <ConfigPanel
          element={selectedElement}
          onUpdate={onUpdateElement}
          onDelete={onDeleteElement}
        />
      </div>
    </div>
  );
};

export default FormBuilderLayout;
