export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: FormElementOption[];
  validation?: {
    type?: string;
    min?: number;
    max?: number;
    pattern?: string;
  };
  columnName?: string;
}

export interface FormElementOption {
  id: string;
  label: string;
  value: string;
}

export enum FormElementType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  EMAIL = 'email',
  NUMBER = 'number',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  PHONE = 'phone',
  URL = 'url',
}

export interface DragItem {
  id: string;
  type: string;
  elementType: FormElementType;
}

export const formElementTypeToLabel: Record<FormElementType, string> = {
  [FormElementType.TEXT]: 'Texte court',
  [FormElementType.TEXTAREA]: 'Texte long',
  [FormElementType.EMAIL]: 'Email',
  [FormElementType.NUMBER]: 'Nombre',
  [FormElementType.SELECT]: 'Liste déroulante',
  [FormElementType.RADIO]: 'Boutons radio',
  [FormElementType.CHECKBOX]: 'Cases à cocher',
  [FormElementType.DATE]: 'Date',
  [FormElementType.PHONE]: 'Téléphone',
  [FormElementType.URL]: 'URL',
};

export const formElementTypeToPostgresType: Record<FormElementType, string> = {
  [FormElementType.TEXT]: 'VARCHAR(255)',
  [FormElementType.TEXTAREA]: 'TEXT',
  [FormElementType.EMAIL]: 'VARCHAR(255)',
  [FormElementType.NUMBER]: 'NUMERIC',
  [FormElementType.SELECT]: 'VARCHAR(255)',
  [FormElementType.RADIO]: 'VARCHAR(255)',
  [FormElementType.CHECKBOX]: 'BOOLEAN[]',
  [FormElementType.DATE]: 'DATE',
  [FormElementType.PHONE]: 'VARCHAR(20)',
  [FormElementType.URL]: 'VARCHAR(255)',
};

export const formElementIcons: Record<FormElementType, string> = {
  [FormElementType.TEXT]: '✓ Aa',
  [FormElementType.TEXTAREA]: '✓ Aaa',
  [FormElementType.EMAIL]: '✓ @',
  [FormElementType.NUMBER]: '✓ 123',
  [FormElementType.SELECT]: '✓ ▾',
  [FormElementType.RADIO]: '✓ ○',
  [FormElementType.CHECKBOX]: '✓ ☑',
  [FormElementType.DATE]: '✓ 📅',
  [FormElementType.PHONE]: '✓ 📞',
  [FormElementType.URL]: '✓ 🔗',
};

export const createNewFormElement = (type: FormElementType): FormElement => {
  const id = `element_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  const baseElement: FormElement = {
    id,
    type,
    label: formElementTypeToLabel[type],
    required: false,
    placeholder: 'Entrez votre texte ici',
    description: 'Description du champ',
  };

  switch (type) {
    case FormElementType.SELECT:
    case FormElementType.RADIO:
    case FormElementType.CHECKBOX:
      return {
        ...baseElement,
        options: [
          { id: `option_1_${id}`, label: 'Option 1', value: 'option_1' },
          { id: `option_2_${id}`, label: 'Option 2', value: 'option_2' },
          { id: `option_3_${id}`, label: 'Option 3', value: 'option_3' },
        ],
      };
    case FormElementType.NUMBER:
      return {
        ...baseElement,
        validation: {
          type: 'number',
        },
        placeholder: 'Entrez un nombre',
      };
    case FormElementType.EMAIL:
      return {
        ...baseElement,
        validation: {
          type: 'email',
        },
        placeholder: 'exemple@email.com',
      };
    case FormElementType.PHONE:
      return {
        ...baseElement,
        validation: {
          type: 'phone',
        },
        placeholder: '+33 6 12 34 56 78',
      };
    case FormElementType.URL:
      return {
        ...baseElement,
        validation: {
          type: 'url',
        },
        placeholder: 'https://exemple.com',
      };
    case FormElementType.DATE:
      return {
        ...baseElement,
        placeholder: '',
      };
    default:
      return baseElement;
  }
};
