
import React from 'react';
import { useDrag } from 'react-dnd';
import { FormElementType, formElementIcons } from '@/lib/formElementTypes';

interface DraggableElementProps {
  type: FormElementType;
  label: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_ELEMENT',
    item: { type: 'FORM_ELEMENT', elementType: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 mb-1 rounded-md cursor-grab ${
        isDragging ? 'opacity-50' : ''
      } hover:bg-dragndrop-lightgray border border-dragndrop-gray transition-all`}
    >
      <div className="p-1 mr-2 bg-dragndrop-lightgray rounded-md text-dragndrop-primary text-xs">
        {formElementIcons[type]}
      </div>
      <span className="text-dragndrop-text text-sm">{label}</span>
    </div>
  );
};

export default DraggableElement;
