import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Calendar, Layout, ChevronDown, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllDocuments, deleteDocument, Document } from '../utils/storage';
import { TemplateGalleryModal, Template } from '../components/TemplateGalleryModal';

const DOC_TYPE_OPTIONS = [
  { value: '', label: 'Sans type' },
  { value: 'Rapport', label: 'Rapport' },
  { value: 'Compte Rendu', label: 'Compte Rendu' },
  { value: 'Note Interne', label: 'Note Interne' },
  { value: 'Procédure', label: 'Procédure' },
  { value: 'Fiche de Poste', label: 'Fiche de Poste' },
  { value: 'Charte', label: 'Charte' },
  { value: 'Règlement', label: 'Règlement' },
];

export function DocumentsHomePage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const docs = getAllDocuments();
    setDocuments(docs);
  };

  const handleCreateDocument = () => {
    if (!newDocTitle.trim()) return;

    const newDoc: Document = {
      id: Date.now().toString(),
      title: newDocTitle,
      content: { type: 'doc', content: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingDocs = getAllDocuments();
    localStorage.setItem('documents', JSON.stringify([...existingDocs, newDoc]));

    setNewDocTitle('');
    setNewDocType('');
    setShowNewDocModal(false);
    loadDocuments();
    navigate(`/editor/${newDoc.id}`, { state: { docType: newDocType } });
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
      loadDocuments();
    }
  };

  const handleSelectTemplate = (template: Template) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: template.title,
      content: template.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingDocs = getAllDocuments();
    localStorage.setItem('documents', JSON.stringify([...existingDocs, newDoc]));

    setShowTemplateModal(false);
    loadDocuments();
    navigate(`/editor/${newDoc.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-heading-1 text-default-font mb-2">Documents</h1>
            <p className="text-body text-subtext-color">
              Create and manage your organizational documents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-0 text-default-font border border-neutral-border rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <Layout className="w-4 h-4" />
              From Template
            </button>
            <button
              onClick={() => setShowNewDocModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-neutral-0 rounded-lg hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Document
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16 bg-neutral-0 rounded-xl border border-neutral-border">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-heading-3 text-default-font mb-2">No documents yet</h3>
            <p className="text-body text-subtext-color mb-6">
              Create your first document to get started
            </p>
            <button
              onClick={() => setShowNewDocModal(true)}
              className="px-6 py-2 bg-brand-600 text-neutral-0 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Create Document
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-neutral-0 rounded-xl border border-neutral-border p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div
                  onClick={() => navigate(`/editor/${doc.id}`)}
                  className="flex-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <FileText className="w-8 h-8 text-brand-600" />
                  </div>
                  <h3 className="text-heading-3 text-default-font mb-2 group-hover:text-brand-600 transition-colors">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-2 text-caption text-subtext-color">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {formatDate(doc.updatedAt)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc.id);
                    }}
                    className="flex items-center gap-2 text-caption text-error-600 hover:text-error-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewDocModal && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50" onClick={() => setTypeDropdownOpen(false)}>
          <div className="bg-neutral-0 rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-heading-2 text-default-font mb-1">Nouveau document</h2>
            <p className="text-body text-subtext-color mb-6">Renseignez les informations de base du document.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-caption-bold text-default-font mb-1.5">
                  Titre du document <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateDocument(); }}
                  placeholder="Ex : Compte rendu réunion du 5 mars..."
                  className="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body text-default-font focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="relative">
                <label className="block text-caption-bold text-default-font mb-1.5">
                  Type de document
                </label>
                <button
                  type="button"
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-neutral-border rounded-lg text-body bg-neutral-0 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-subtext-color" />
                    <span className={newDocType ? 'text-default-font' : 'text-subtext-color'}>
                      {newDocType ? DOC_TYPE_OPTIONS.find(o => o.value === newDocType)?.label : 'Sans type'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-subtext-color transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {typeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-0 border border-neutral-border rounded-lg shadow-lg z-10 overflow-hidden">
                    {DOC_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => { setNewDocType(option.value); setTypeDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-body hover:bg-neutral-50 transition-colors flex items-center gap-2 ${newDocType === option.value ? 'bg-brand-50 text-brand-600' : 'text-default-font'}`}
                      >
                        {option.value === '' ? (
                          <span className="text-subtext-color italic">{option.label}</span>
                        ) : option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowNewDocModal(false); setNewDocTitle(''); setNewDocType(''); setTypeDropdownOpen(false); }}
                className="px-4 py-2 text-subtext-color hover:bg-neutral-100 rounded-lg transition-colors text-body"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateDocument}
                disabled={!newDocTitle.trim()}
                className="px-5 py-2 bg-brand-600 text-neutral-0 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-body font-medium"
              >
                Créer le document
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <TemplateGalleryModal
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
    </div>
  );
}
