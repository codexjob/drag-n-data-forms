
import React from 'react';
import { Button } from "@/components/ui/button";
import { FormData } from '@/services/formService';
import { Copy, Edit, Eye, EyeOff, List, Settings, Share2, Trash2 } from 'lucide-react';
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
  onUnpublish: (formId: string) => Promise<void>;
  copyFormLink: (formId: string) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  compact?: boolean;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  form,
  onPublish,
  onUnpublish,
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
          
          {!form.published ? (
            <DropdownMenuItem 
              onClick={() => onPublish(form.id || '')}
            >
              <Eye className="h-4 w-4 mr-2" /> Publier
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onClick={() => navigate(`/form/${form.id}`)}>
                <Eye className="h-4 w-4 mr-2" /> Voir
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onUnpublish(form.id || '')}>
                <EyeOff className="h-4 w-4 mr-2" /> Dépublier
              </DropdownMenuItem>
            </>
          )}
          
          {form.published && (
            <>
              <DropdownMenuItem onClick={() => copyFormLink(form.id || '')}>
                <Copy className="h-4 w-4 mr-2" /> Copier lien
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate(`/form/${form.id}`)}>
                <Share2 className="h-4 w-4 mr-2" /> Partager
              </DropdownMenuItem>
            </>
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
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  // Pour le mode grille, regroupons les boutons dans un layout plus compact
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/form/${form.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Éditer
        </Button>
        
        {!form.published ? (
          <Button 
            variant="default" 
            size="sm" 
            className="bg-dragndrop-primary hover:bg-dragndrop-secondary"
            onClick={() => onPublish(form.id || '')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Publier
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/form/${form.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUnpublish(form.id || '')}
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Dépublier
            </Button>
          </>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {form.published && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => copyFormLink(form.id || '')}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copier
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/responses/${form.id}`)}
            >
              <List className="h-4 w-4 mr-1" />
              Réponses
            </Button>
          </>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/form/${form.id}/config`)}
        >
          <Settings className="h-4 w-4 mr-1" />
          Config
        </Button>
        
        <DeleteFormDialog
          formId={form.id}
          formTitle={form.title}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default FormActionButtons;
