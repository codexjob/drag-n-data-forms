
import React from 'react';
import { useDrop } from 'react-dnd';
import { FormElement, FormElementType, createNewFormElement } from '@/lib/formElementTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, GripVertical } from 'lucide-react';

interface FormPreviewProps {
  elements: FormElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onAddElement: (element: FormElement) => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
  formTitle: string;
  formDescription: string;
}

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

  const renderFormElement = (element: FormElement) => {
    const isSelected = element.id === selectedElementId;
    
    const baseClassName = `form-element ${
      isSelected ? 'form-element-selected' : ''
    }`;

    const handleElementClick = () => {
      onSelectElement(element.id);
    };

    switch (element.type) {
      case FormElementType.TEXT:
      case FormElementType.EMAIL:
      case FormElementType.PHONE:
      case FormElementType.URL:
        return (
          <div className={baseClassName} onClick={handleElementClick}>
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
              type={element.type === FormElementType.NUMBER ? 'number' : element.type}
              placeholder={element.placeholder}
              disabled
            />
          </div>
        );
        
      case FormElementType.NUMBER:
        return (
          <div className={baseClassName} onClick={handleElementClick}>
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
          </div>
        );
        
      case FormElementType.TEXTAREA:
        return (
          <div className={baseClassName} onClick={handleElementClick}>
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
          </div>
        );
        
      case FormElementType.SELECT:
        return (
          <div className={baseClassName} onClick={handleElementClick}>
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
          </div>
        );
        
      case FormElementType.RADIO:
        return (
          <div className={baseClassName} onClick={handleElementClick}>
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
          </div>
        );
        
      case FormElementType.CHECKBOX:
        return (
          <div className={baseClassName} onClick={handleElementClick}>
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
          </div>
        );
        
      case FormElementType.DATE:
        return (
          <div className={baseClassName} onClick={handleElementClick}>
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
          </div>
        );
        
      default:
        return null;
    }
  };

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
            {elements.map((element) => (
              <div key={element.id}>{renderFormElement(element)}</div>
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
