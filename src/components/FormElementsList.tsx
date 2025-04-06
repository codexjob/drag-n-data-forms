
import React from 'react';
import DraggableElement from './DraggableElement';
import { FormElementType, formElementTypeToLabel } from '@/lib/formElementTypes';

const FormElementsList: React.FC = () => {
  // Groupes de types d'éléments
  const basicElements = [
    FormElementType.TEXT,
    FormElementType.TEXTAREA,
    FormElementType.EMAIL,
    FormElementType.NUMBER,
    FormElementType.PHONE,
    FormElementType.URL,
  ];

  const choiceElements = [
    FormElementType.SELECT,
    FormElementType.RADIO,
    FormElementType.CHECKBOX,
    FormElementType.TOGGLE,
    FormElementType.ICON_SELECT,
  ];

  const advancedElements = [
    FormElementType.DATE,
    FormElementType.TIME,
    FormElementType.SLIDER,
    FormElementType.RATING,
  ];

  return (
    <div className="p-3 bg-white rounded-lg border border-dragndrop-gray h-full overflow-y-auto">
      <h2 className="text-base font-semibold mb-1.5 text-dragndrop-text">Éléments de formulaire</h2>
      <p className="text-dragndrop-darkgray text-xs mb-2">
        Glissez-déposez les éléments
      </p>
      
      <div className="mb-2">
        <h3 className="font-medium text-xs mb-1 text-dragndrop-text">Éléments basiques</h3>
        <div className="space-y-0.5">
          {basicElements.map((type) => (
            <DraggableElement key={type} type={type} label={formElementTypeToLabel[type]} />
          ))}
        </div>
      </div>

      <div className="mb-2">
        <h3 className="font-medium text-xs mb-1 text-dragndrop-text">Options de choix</h3>
        <div className="space-y-0.5">
          {choiceElements.map((type) => (
            <DraggableElement key={type} type={type} label={formElementTypeToLabel[type]} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-xs mb-1 text-dragndrop-text">Éléments avancés</h3>
        <div className="space-y-0.5">
          {advancedElements.map((type) => (
            <DraggableElement key={type} type={type} label={formElementTypeToLabel[type]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormElementsList;
