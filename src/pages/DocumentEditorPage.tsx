import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2, Download, Maximize2 } from 'lucide-react';
import { DocumentEditor } from '../components/DocumentEditor';
import { storage } from '../utils/storage';
import { Document } from '../types/document';

export function DocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [padding, setPadding] = useState<number>(2.54); // in cm, default A4 normal margin

  useEffect(() => {
    if (id) {
      const doc = storage.getDocument(id);
      if (doc) {
        setDocument(doc);
        setTitle(doc.title);
        setContent(doc.content);
      }
    }
  }, [id]);

  const saveDocument = useCallback(() => {
    if (!id) return;

    setIsSaving(true);
    const updatedDoc: Document = {
      id,
      title: title || 'Untitled Document',
      content,
      createdAt: document?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    storage.saveDocument(updatedDoc);
    setDocument(updatedDoc);
    setLastSaved(new Date());
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  }, [id, title, content, document]);

  // Auto-save
  useEffect(() => {
    if (!content && !title) return;
    
    const timer = setTimeout(() => {
      saveDocument();
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, title, saveDocument]);

  const handleContentUpdate = (newContent: any) => {
    setContent(newContent);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diffSeconds < 5) return 'Saved just now';
    if (diffSeconds < 60) return `Saved ${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `Saved ${diffMinutes}m ago`;
    
    return `Saved at ${lastSaved.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })}`;
  };

  const handleExportPDF = () => {
    // Trigger browser print dialog
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-100 print:bg-white">
      {/* Header - Sticky, hidden on print */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20 print:hidden shadow-sm">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/documents')}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-body">Back to Documents</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Save Status */}
              {isSaving ? (
                <div className="flex items-center gap-2 text-neutral-500 text-caption">
                  <Save className="w-4 h-4 animate-pulse" />
                  Saving...
                </div>
              ) : lastSaved ? (
                <div className="flex items-center gap-2 text-green-600 text-caption">
                  <CheckCircle2 className="w-4 h-4" />
                  {formatLastSaved()}
                </div>
              ) : null}

              {/* Padding Control */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 border border-neutral-300 rounded-lg">
                <Maximize2 className="w-4 h-4 text-neutral-500" />
                <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                  Margins:
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.1"
                  value={padding}
                  onChange={(e) => setPadding(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  title="Adjust page margins"
                />
                <span className="text-sm font-mono text-neutral-600 w-12 text-right">
                  {padding.toFixed(1)}cm
                </span>
              </div>

              {/* Export PDF Button */}
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                title="Export to PDF (or save as PDF from print dialog)"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Document Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Document"
            className="w-full max-w-[21cm] mx-auto text-2xl font-sans font-bold text-gray-900 placeholder-neutral-400 border-none focus:outline-none bg-transparent focus:ring-0"
          />
        </div>
      </div>

      {/* Print Title (only visible when printing) */}
      <div className="hidden print:block text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">{title || 'Untitled Document'}</h1>
      </div>

      {/* Editor Container */}
      <div className="flex-1 w-full py-8 px-4 print:py-0 print:px-0 overflow-y-auto">
        <DocumentEditor content={content} onUpdate={handleContentUpdate} padding={padding} />
      </div>
    </div>
  );
}