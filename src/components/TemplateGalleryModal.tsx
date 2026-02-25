import { X, FileText } from 'lucide-react';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content: any;
}

const ficheDePosteTemplate: Template = {
  id: 'fiche-de-poste',
  title: 'Fiche de Poste',
  category: 'HR Documents',
  description: 'Job description template with title, related position, and full description',
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Chef de Projet Digital' }]
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', marks: [{ type: 'bold' }], text: 'Poste relié: ' },
          { type: 'text', text: 'Département Digital & Innovation' }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Description du poste' }]
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Le Chef de Projet Digital est responsable de la planification, de l\'exécution et de la livraison de projets numériques au sein de l\'organisation. Il travaille en étroite collaboration avec les équipes techniques et fonctionnelles pour garantir le succès des initiatives digitales.'
          }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Missions principales' }]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Définir et suivre les objectifs des projets digitaux' }]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Coordonner les équipes internes et les prestataires externes' }]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Gérer les budgets et les ressources allouées' }]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Assurer la communication avec les parties prenantes' }]
              }
            ]
          }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Compétences requises' }]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Maîtrise des méthodologies de gestion de projet (Agile, Scrum)' }]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Excellentes capacités de communication et de leadership' }]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Connaissance des technologies web et mobile' }]
              }
            ]
          }
        ]
      }
    ]
  }
};

interface TemplateGalleryModalProps {
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export function TemplateGalleryModal({ onClose, onSelectTemplate }: TemplateGalleryModalProps) {
  const templates = [ficheDePosteTemplate];

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
      <div className="bg-neutral-0 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-neutral-border">
          <div>
            <h2 className="text-heading-2 text-default-font mb-1">Choose a Template</h2>
            <p className="text-body text-subtext-color">
              Start with a pre-designed template to save time
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-subtext-color" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-neutral-0 rounded-xl border border-neutral-border p-6 hover:shadow-lg hover:border-brand-600 transition-all cursor-pointer group"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <FileText className="w-6 h-6 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-heading-3 text-default-font mb-2 group-hover:text-brand-600 transition-colors">
                  {template.title}
                </h3>
                <p className="text-caption text-subtext-color mb-3">
                  {template.category}
                </p>
                <p className="text-body text-default-font">
                  {template.description}
                </p>
                <div className="mt-4 pt-4 border-t border-neutral-border">
                  <button className="text-caption text-brand-600 hover:text-brand-700 font-medium transition-colors">
                    Use Template →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
