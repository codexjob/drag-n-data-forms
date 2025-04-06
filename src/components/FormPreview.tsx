import React, { useRef } from 'react';
import { useDrop, useDrag, DropTargetMonitor } from 'react-dnd';
import { FormElement, FormElementType, createNewFormElement } from '@/lib/formElementTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, GripVertical } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FormPreviewProps {
  elements: FormElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onAddElement: (element: FormElement) => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
  formTitle: string;
  formDescription: string;
}

type DragItem = {
  index: number;
  id: string;
  type: string;
};

const FormElementItem = ({ 
  element, 
  index, 
  isSelected, 
  onSelectElement, 
  onMoveElement 
}: { 
  element: FormElement; 
  index: number; 
  isSelected: boolean; 
  onSelectElement: (id: string) => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: 'FORM_ELEMENT_CARD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as { y: number }).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMoveElement(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'FORM_ELEMENT_CARD',
    item: () => {
      return { id: element.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  
  drag(drop(ref));

  const baseClassName = `form-element ${
    isSelected ? 'form-element-selected' : ''
  }`;

  const handleElementClick = () => {
    onSelectElement(element.id);
  };

  const renderElementContent = () => {
    switch (element.type) {
      case FormElementType.TEXT:
      case FormElementType.EMAIL:
      case FormElementType.PHONE:
      case FormElementType.URL:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Input
              type={element.type}
              placeholder={element.placeholder}
              disabled
            />
          </>
        );
        
      case FormElementType.NUMBER:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Input
              type="number"
              placeholder={element.placeholder}
              disabled
            />
          </>
        );
        
      case FormElementType.TEXTAREA:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Textarea placeholder={element.placeholder} disabled />
          </>
        );
        
      case FormElementType.SELECT:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une option" />
              </SelectTrigger>
              <SelectContent>
                {element.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );
        
      case FormElementType.RADIO:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <RadioGroup disabled>
              {element.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.id} disabled />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </>
        );
        
      case FormElementType.CHECKBOX:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <div className="space-y-2">
              {element.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox id={option.id} disabled />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          </>
        );
        
      case FormElementType.DATE:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Input type="date" disabled />
          </>
        );
        
      case FormElementType.TIME:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <Input type="time" disabled />
          </>
        );
        
      case FormElementType.SLIDER:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <div className="pt-4 pb-2">
              <Slider 
                disabled 
                value={[element.validation?.min || 0]} 
                max={element.validation?.max || 100}
              />
            </div>
            <div className="flex justify-between text-sm text-dragndrop-darkgray">
              <span>{element.validation?.min || 0}</span>
              <span>{element.validation?.max || 100}</span>
            </div>
          </>
        );
        
      case FormElementType.TOGGLE:
        return (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
                <Label className="text-sm font-medium">
                  {element.label}
                  {element.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
              <Switch disabled />
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm">{element.description}</p>
            )}
          </>
        );
        
      case FormElementType.RATING:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <div className="flex gap-1">
              {Array.from({ length: (element.validation?.max || 5) }, (_, i) => i + 1).map((star) => (
                <span key={star} className="text-2xl text-gray-300">★</span>
              ))}
            </div>
          </>
        );
        
      case FormElementType.ICON_SELECT:
        return (
          <>
            <div className="flex items-center mb-2">
              <GripVertical className="mr-2 text-dragndrop-darkgray cursor-move" size={18} />
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {element.description && (
              <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
            )}
            <div className="flex flex-wrap gap-1">
              {element.icons?.map((icon, index) => (
                <div 
                  key={index} 
                  className="text-2xl p-2 border border-dragndrop-gray rounded-md"
                >
                  {icon}
                </div>
              ))}
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      ref={ref}
      style={{ opacity }}
      className={baseClassName} 
      onClick={handleElementClick}
      data-handler-id={handlerId}
    >
      {renderElementContent()}
    </div>
  );
};

const FormPreview: React.FC<FormPreviewProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onAddElement,
  onMoveElement,
  formTitle,
  formDescription,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'FORM_ELEMENT',
    drop: (item: { elementType: FormElementType }, monitor) => {
      if (monitor.didDrop()) return;
      
      const newElement = createNewFormElement(item.elementType);
      onAddElement(newElement);
      return { id: newElement.id };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div className="relative flex flex-col h-full">
      <div className="p-4 mb-4 bg-white rounded-lg border border-dragndrop-gray">
        <h2 className="text-xl font-semibold mb-2 text-dragndrop-text">{formTitle || "Titre du formulaire"}</h2>
        <p className="text-dragndrop-darkgray">{formDescription || "Description du formulaire"}</p>
      </div>
      
      <div
        ref={drop}
        className={`flex-1 rounded-lg border border-dragndrop-gray p-4 min-h-[400px] overflow-y-auto ${
          isOver && canDrop ? 'can-drop' : 'bg-white'
        }`}
      >
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-dragndrop-darkgray">
            <AlertCircle className="h-12 w-12 mb-4 text-dragndrop-primary" />
            <p className="text-center">
              Glissez-déposez des éléments de formulaire ici<br />
              ou cliquez sur un élément dans la barre latérale
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {elements.map((element, index) => (
              <FormElementItem 
                key={element.id}
                element={element} 
                index={index}
                isSelected={element.id === selectedElementId}
                onSelectElement={onSelectElement}
                onMoveElement={onMoveElement}
              />
            ))}
          </div>
        )}
      </div>

      {elements.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-dragndrop-gray text-center">
          <Button disabled className="bg-dragndrop-primary hover:bg-dragndrop-secondary">
            Soumettre
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
