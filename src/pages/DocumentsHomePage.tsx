import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllDocuments, deleteDocument, Document } from '../utils/storage';

export function DocumentsHomePage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');

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
    setShowNewDocModal(false);
    loadDocuments();
    navigate(`/editor/${newDoc.id}`);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
      loadDocuments();
    }
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
          <button
            onClick={() => setShowNewDocModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-neutral-0 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Document
          </button>
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
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
          <div className="bg-neutral-0 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-heading-2 text-default-font mb-4">New Document</h2>
            <div className="mb-6">
              <label className="block text-body text-default-font mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateDocument();
                }}
                placeholder="Enter document title..."
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNewDocModal(false);
                  setNewDocTitle('');
                }}
                className="px-4 py-2 text-subtext-color hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDocument}
                disabled={!newDocTitle.trim()}
                className="px-4 py-2 bg-brand-600 text-neutral-0 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
