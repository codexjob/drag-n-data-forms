
import React from 'react';
import DraggableElement from './DraggableElement';
import { FormElementType, formElementTypeToLabel } from '@/lib/formElementTypes';

const FormElementsList: React.FC = () => {
  const elementTypes = Object.values(FormElementType);

  return (
    <div className="p-4 bg-white rounded-lg border border-dragndrop-gray">
      <h2 className="text-lg font-semibold mb-4 text-dragndrop-text">Éléments de formulaire</h2>
      <p className="text-dragndrop-darkgray mb-4">
        Glissez-déposez les éléments sur la zone de prévisualisation à droite.
      </p>
      <div className="space-y-1">
        {elementTypes.map((type) => (
          <DraggableElement key={type} type={type} label={formElementTypeToLabel[type]} />
        ))}
      </div>
    </div>
  );
};

export default FormElementsList;
