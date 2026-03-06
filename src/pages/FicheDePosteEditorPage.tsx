import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2, Tag, FileText, Download, Maximize2 } from 'lucide-react';
import { DocumentEditor } from '../components/DocumentEditor';

const DOC_TYPE_COLORS: Record<string, string> = {
  'Fiche de Poste': '#0091ff',
  'Charte': '#a78bfa',
  'Règlement': '#34d399',
  'Liste des Rôles': '#fbbf24',
};

export function FicheDePosteEditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title: initialTitle, poste, type } = (location.state || {}) as { title?: string; poste?: string; type?: string };
  const [title, setTitle] = useState(initialTitle || 'Sans titre');
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [padding, setPadding] = useState(2.54);

  const typeColor = type ? DOC_TYPE_COLORS[type] ?? '#0091ff' : '#0091ff';

  const handleSave = () => {
    setIsSaving(true);
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 600);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>

      {/* Header Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/fiche-de-poste')}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-body">Retour aux documents</span>
            </button>

            <div className="flex items-center gap-4">
              {isSaving ? (
                <div className="flex items-center gap-2 text-neutral-500 text-caption">
                  <Save className="w-4 h-4 animate-pulse" />
                  Enregistrement...
                </div>
              ) : lastSaved ? (
                <div className="flex items-center gap-2 text-green-600 text-caption">
                  <CheckCircle2 className="w-4 h-4" />
                  Enregistré
                </div>
              ) : null}

              <div className="flex items-center gap-3 bg-white px-4 py-2 border border-neutral-300 rounded-lg">
                <Maximize2 className="w-4 h-4 text-neutral-500" />
                <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">Marges :</label>
                <input
                  type="range" min="0" max="4" step="0.1" value={padding}
                  onChange={(e) => setPadding(parseFloat(e.target.value))}
                  className="w-28 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <span className="text-sm font-mono text-neutral-600 w-12 text-right">{padding.toFixed(1)}cm</span>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: typeColor }}
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>

          {/* Document info */}
          <div className="w-full max-w-[21cm] mx-auto">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {type ? (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" style={{ color: typeColor }} />
                  <span className="text-caption-bold px-2 py-0.5 rounded-full border"
                    style={{ color: typeColor, backgroundColor: `${typeColor}14`, borderColor: `${typeColor}33` }}>
                    {type}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-caption text-neutral-400 italic">Sans type</span>
                </div>
              )}
              {poste && (
                <span className="text-caption text-neutral-500 border-l border-neutral-300 pl-2 ml-1">{poste}</span>
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sans titre"
              className="w-full text-2xl font-sans font-bold text-gray-900 placeholder-neutral-400 border-none focus:outline-none bg-transparent focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 w-full py-8 px-4 overflow-y-auto">
        <DocumentEditor content={content} onUpdate={setContent} padding={padding} />
      </div>
    </div>
  );
}
