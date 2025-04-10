
import React from 'react';
import { Button } from "@/components/ui/button";
import { FormData } from '@/services/formService';
import { Copy, Edit, Eye, List, Settings, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteFormDialog from './DeleteFormDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from 'lucide-react';

interface FormActionButtonsProps {
  form: FormData;
  onPublish: (formId: string) => Promise<void>;
  copyFormLink: (formId: string) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  compact?: boolean;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  form,
  onPublish,
  copyFormLink,
  onDelete,
  isDeleting,
  compact = false
}) => {
  const navigate = useNavigate();
  
  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border border-border">
          <DropdownMenuItem onClick={() => navigate(`/form/${form.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Éditer
          </DropdownMenuItem>
          
          {!form.published && (
            <DropdownMenuItem 
              onClick={() => onPublish(form.id || '')}
              disabled={form.published}
            >
              Publier
            </DropdownMenuItem>
          )}
          
          {form.published && (
            <DropdownMenuItem onClick={() => navigate(`/form/${form.id}`)}>
              <Eye className="h-4 w-4 mr-2" /> Voir
            </DropdownMenuItem>
          )}
          
          {form.published && (
            <DropdownMenuItem onClick={() => copyFormLink(form.id || '')}>
              <Copy className="h-4 w-4 mr-2" /> Copier lien
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => navigate(`/form/${form.id}/config`)}>
            <Settings className="h-4 w-4 mr-2" /> Config
          </DropdownMenuItem>
          
          {form.published && (
            <DropdownMenuItem onClick={() => navigate(`/responses/${form.id}`)}>
              <List className="h-4 w-4 mr-2" /> Réponses
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(`/form/${form.id}/edit`)}
      >
        <Edit className="h-4 w-4 mr-1" />
        Éditer
      </Button>
      
      <Button 
        variant="default" 
        size="sm" 
        className={form.published ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" : "bg-dragndrop-primary hover:bg-dragndrop-secondary"}
        onClick={() => !form.published && onPublish(form.id || '')}
        disabled={form.published}
      >
        {form.published ? "Déjà publié" : "Publier"}
      </Button>
      
      {form.published && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/form/${form.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
      )}
      
      {form.published && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => copyFormLink(form.id || '')}
        >
          <Copy className="h-4 w-4 mr-1" />
          Copier lien
        </Button>
      )}
      
      {form.published && (
        <Button 
          variant="outline" 
          size="sm" 
        >
          <Share2 className="h-4 w-4 mr-1" />
          Partager
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(`/form/${form.id}/config`)}
      >
        <Settings className="h-4 w-4 mr-1" />
        Config
      </Button>
      
      {form.published && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/responses/${form.id}`)}
        >
          <List className="h-4 w-4 mr-1" />
          Réponses
        </Button>
      )}

      <DeleteFormDialog
        formId={form.id}
        formTitle={form.title}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default FormActionButtons;
