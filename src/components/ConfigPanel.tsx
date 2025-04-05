
import React, { useState } from 'react';
import { 
  FormElement, 
  FormElementOption, 
  FormElementType 
} from '@/lib/formElementTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';

interface ConfigPanelProps {
  element: FormElement | null;
  onUpdate: (updatedElement: FormElement) => void;
  onDelete: (id: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ element, onUpdate, onDelete }) => {
  const [newOptionText, setNewOptionText] = useState('');

  if (!element) {
    return (
      <div className="p-4 bg-white rounded-lg border border-dragndrop-gray h-full flex items-center justify-center">
        <p className="text-dragndrop-darkgray text-center">
          Sélectionnez un élément pour voir ses options de configuration
        </p>
      </div>
    );
  }

  const handleChange = (field: keyof FormElement, value: any) => {
    onUpdate({
      ...element,
      [field]: value,
    });
  };

  const handleAddOption = () => {
    if (!newOptionText.trim()) return;
    
    const newOption: FormElementOption = {
      id: `option_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      label: newOptionText,
      value: newOptionText.toLowerCase().replace(/\s+/g, '_'),
    };

    onUpdate({
      ...element,
      options: [...(element.options || []), newOption],
    });

    setNewOptionText('');
  };

  const handleRemoveOption = (optionId: string) => {
    onUpdate({
      ...element,
      options: element.options?.filter(option => option.id !== optionId) || [],
    });
  };

  const handleValidationChange = (field: string, value: any) => {
    onUpdate({
      ...element,
      validation: {
        ...(element.validation || {}),
        [field]: value,
      },
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-dragndrop-gray h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-dragndrop-text">Configuration de l'élément</h2>
      
      <div className="space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-dragndrop-text mb-1">
            Libellé
          </label>
          <Input
            value={element.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dragndrop-text mb-1">
            Description
          </label>
          <Textarea
            value={element.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Placeholder */}
        {[
          FormElementType.TEXT,
          FormElementType.TEXTAREA,
          FormElementType.EMAIL,
          FormElementType.NUMBER,
          FormElementType.PHONE,
          FormElementType.URL,
        ].includes(element.type) && (
          <div>
            <label className="block text-sm font-medium text-dragndrop-text mb-1">
              Placeholder
            </label>
            <Input
              value={element.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {/* Required */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dragndrop-text">
            Obligatoire
          </label>
          <Switch
            checked={element.required}
            onCheckedChange={(checked) => handleChange('required', checked)}
          />
        </div>

        {/* Validation for NUMBER */}
        {element.type === FormElementType.NUMBER && (
          <div className="space-y-4 pt-2 border-t border-dragndrop-gray">
            <h3 className="text-sm font-medium text-dragndrop-text">Validation</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragndrop-text mb-1">
                  Min
                </label>
                <Input
                  type="number"
                  value={element.validation?.min || ''}
                  onChange={(e) => handleValidationChange('min', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dragndrop-text mb-1">
                  Max
                </label>
                <Input
                  type="number"
                  value={element.validation?.max || ''}
                  onChange={(e) => handleValidationChange('max', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Options for SELECT, RADIO, CHECKBOX */}
        {[FormElementType.SELECT, FormElementType.RADIO, FormElementType.CHECKBOX].includes(
          element.type
        ) && (
          <div className="space-y-4 pt-2 border-t border-dragndrop-gray">
            <h3 className="text-sm font-medium text-dragndrop-text">Options</h3>
            
            <div className="space-y-2">
              {element.options?.map((option) => (
                <div key={option.id} className="flex items-center">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const updatedOptions = element.options?.map((o) =>
                        o.id === option.id
                          ? { ...o, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') }
                          : o
                      );
                      handleChange('options', updatedOptions);
                    }}
                    className="flex-1 mr-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4 text-dragndrop-darkgray" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center">
              <Input
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                placeholder="Nouvelle option"
                className="flex-1 mr-2"
              />
              <Button type="button" variant="outline" onClick={handleAddOption}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        )}

        {/* Delete Button */}
        <div className="pt-4">
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => onDelete(element.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer l'élément
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
