
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FormElement, FormElementType } from '@/lib/formElementTypes';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FormElementRendererProps {
  element: FormElement;
  value: any;
  onChange: (name: string, value: any) => void;
  onCheckboxChange?: (name: string, value: string, checked: boolean) => void;
}

const FormElementRenderer: React.FC<FormElementRendererProps> = ({ 
  element, 
  value, 
  onChange, 
  onCheckboxChange 
}) => {
  const columnName = element.columnName || element.label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  
  switch (element.type) {
    case FormElementType.TEXT:
    case FormElementType.EMAIL:
    case FormElementType.PHONE:
    case FormElementType.URL:
      return (
        <div className="mb-4">
          <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <Input
            id={columnName}
            type={element.type}
            placeholder={element.placeholder}
            value={value || ''}
            onChange={(e) => onChange(columnName, e.target.value)}
            required={element.required}
          />
        </div>
      );
      
    case FormElementType.NUMBER:
      return (
        <div className="mb-4">
          <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <Input
            id={columnName}
            type="number"
            placeholder={element.placeholder}
            value={value || ''}
            onChange={(e) => onChange(columnName, e.target.value)}
            required={element.required}
            min={element.validation?.min}
            max={element.validation?.max}
          />
        </div>
      );
      
    case FormElementType.TEXTAREA:
      return (
        <div className="mb-4">
          <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <Textarea
            id={columnName}
            placeholder={element.placeholder}
            value={value || ''}
            onChange={(e) => onChange(columnName, e.target.value)}
            required={element.required}
          />
        </div>
      );
      
    case FormElementType.SELECT:
      return (
        <div className="mb-4">
          <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <Select 
            value={value || ''} 
            onValueChange={(value) => onChange(columnName, value)}
            required={element.required}
          >
            <SelectTrigger id={columnName}>
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
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <RadioGroup 
            value={value || ''}
            onValueChange={(value) => onChange(columnName, value)}
            required={element.required}
          >
            {element.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${columnName}_${option.id}`} />
                <Label htmlFor={`${columnName}_${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
      
    case FormElementType.CHECKBOX:
      return (
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <div className="space-y-2">
            {element.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${columnName}_${option.id}`} 
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => 
                    onCheckboxChange && onCheckboxChange(columnName, option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`${columnName}_${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      );
      
    case FormElementType.DATE:
      return (
        <div className="mb-4">
          <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <Input
            id={columnName}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(columnName, e.target.value)}
            required={element.required}
          />
        </div>
      );
      
    case FormElementType.TIME:
      return (
        <div className="mb-4">
          <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <Input
            id={columnName}
            type="time"
            value={value || ''}
            onChange={(e) => onChange(columnName, e.target.value)}
            required={element.required}
          />
        </div>
      );
      
    case FormElementType.SLIDER:
      return (
        <div className="mb-4">
          <Label htmlFor={columnName} className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <div className="pt-4 pb-2">
            <Slider
              id={columnName}
              value={[value !== undefined && value !== null ? Number(value) : (element.validation?.min || 0)]}
              min={element.validation?.min || 0}
              max={element.validation?.max || 100}
              step={1}
              onValueChange={(vals) => onChange(columnName, vals[0])}
            />
          </div>
          <div className="flex justify-between text-sm text-dragndrop-darkgray">
            <span>{element.validation?.min || 0}</span>
            <span>{element.validation?.max || 100}</span>
          </div>
        </div>
      );
      
    case FormElementType.TOGGLE:
      return (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={columnName} className="text-sm font-medium">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Switch
              id={columnName}
              checked={!!value}
              onCheckedChange={(checked) => onChange(columnName, checked)}
            />
          </div>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mt-1">{element.description}</p>
          )}
        </div>
      );
      
    case FormElementType.RATING:
      return (
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <div className="flex gap-1">
            {Array.from({ length: (element.validation?.max || 5) }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(columnName, star)}
                className={`text-2xl ${
                  Number(value) >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      );
      
    case FormElementType.ICON_SELECT:
      return (
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {element.description && (
            <p className="text-dragndrop-darkgray text-sm mb-2">{element.description}</p>
          )}
          <ToggleGroup
            type="single"
            value={value || ''}
            onValueChange={(val) => onChange(columnName, val)}
            className="flex justify-start flex-wrap"
          >
            {element.icons?.map((icon, index) => (
              <ToggleGroupItem 
                key={index} 
                value={icon}
                className="text-2xl p-2 data-[state=on]:bg-dragndrop-primary data-[state=on]:text-white"
              >
                {icon}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      );
      
    default:
      return null;
  }
};

export default FormElementRenderer;
