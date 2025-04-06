
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
import { Slider } from '@/components/ui/slider';

interface ConfigPanelProps {
  element: FormElement | null;
  onUpdate: (updatedElement: FormElement) => void;
  onDelete: (id: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ element, onUpdate, onDelete }) => {
  const [newOptionText, setNewOptionText] = useState('');
  const [newIconText, setNewIconText] = useState('');

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

  const handleAddIcon = () => {
    if (!newIconText.trim()) return;
    
    onUpdate({
      ...element,
      icons: [...(element.icons || []), newIconText],
    });

    setNewIconText('');
  };

  const handleRemoveOption = (optionId: string) => {
    onUpdate({
      ...element,
      options: element.options?.filter(option => option.id !== optionId) || [],
    });
  };

  const handleRemoveIcon = (iconIndex: number) => {
    const newIcons = [...(element.icons || [])];
    newIcons.splice(iconIndex, 1);
    
    onUpdate({
      ...element,
      icons: newIcons,
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

        {/* Validation for SLIDER */}
        {element.type === FormElementType.SLIDER && (
          <div className="space-y-4 pt-2 border-t border-dragndrop-gray">
            <h3 className="text-sm font-medium text-dragndrop-text">Paramètres du curseur</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragndrop-text mb-1">
                  Valeur minimale
                </label>
                <Input
                  type="number"
                  value={element.validation?.min || 0}
                  onChange={(e) => handleValidationChange('min', e.target.value ? Number(e.target.value) : 0)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dragndrop-text mb-1">
                  Valeur maximale
                </label>
                <Input
                  type="number"
                  value={element.validation?.max || 100}
                  onChange={(e) => handleValidationChange('max', e.target.value ? Number(e.target.value) : 100)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <label className="block text-sm font-medium text-dragndrop-text mb-3">
                Aperçu
              </label>
              <Slider
                value={[element.validation?.min || 0]}
                min={element.validation?.min || 0}
                max={element.validation?.max || 100}
                step={1}
                disabled
              />
              <div className="flex justify-between text-sm text-dragndrop-darkgray mt-2">
                <span>{element.validation?.min || 0}</span>
                <span>{element.validation?.max || 100}</span>
              </div>
            </div>
          </div>
        )}

        {/* Validation for RATING */}
        {element.type === FormElementType.RATING && (
          <div className="space-y-4 pt-2 border-t border-dragndrop-gray">
            <h3 className="text-sm font-medium text-dragndrop-text">Paramètres de notation</h3>
            
            <div>
              <label className="block text-sm font-medium text-dragndrop-text mb-1">
                Nombre d'étoiles
              </label>
              <Input
                type="number"
                value={element.validation?.max || 5}
                min={1}
                max={10}
                onChange={(e) => handleValidationChange('max', e.target.value ? Number(e.target.value) : 5)}
                className="w-full"
              />
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-medium text-dragndrop-text mb-2">
                Aperçu
              </label>
              <div className="flex gap-1">
                {Array.from({ length: (element.validation?.max || 5) }, (_, i) => i + 1).map((star) => (
                  <span key={star} className="text-2xl text-yellow-400">★</span>
                ))}
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

        {/* Icons for ICON_SELECT */}
        {element.type === FormElementType.ICON_SELECT && (
          <div className="space-y-4 pt-2 border-t border-dragndrop-gray">
            <h3 className="text-sm font-medium text-dragndrop-text">Icônes</h3>
            
            <div className="space-y-2">
              {element.icons?.map((icon, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1 mr-2 p-2 border border-dragndrop-gray rounded-md flex items-center">
                    <span className="text-xl mr-2">{icon}</span>
                    <span className="text-dragndrop-darkgray text-sm">{icon}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIcon(index)}
                  >
                    <Trash2 className="h-4 w-4 text-dragndrop-darkgray" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center">
              <Input
                value={newIconText}
                onChange={(e) => setNewIconText(e.target.value)}
                placeholder="Nouvel emoji ou icône"
                className="flex-1 mr-2"
              />
              <Button type="button" variant="outline" onClick={handleAddIcon}>
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
