import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { DocumentEditor } from '../components/DocumentEditor';

export function FicheDePosteEditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, poste } = location.state || { title: 'Untitled Fiche', poste: '' };

  const handleSave = () => {
    console.log('Save document logic here');
  };

  const handleBack = () => {
    navigate('/fiche-de-poste');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-screen" style={{ backgroundColor: '#131313' }}>

      {/* Header Bar */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ backgroundColor: '#181818', borderColor: '#252525' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-body text-subtext-color transition-colors hover:text-default-font"
            style={{ backgroundColor: '#222' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#222')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#222' }}
            >
              <FileText className="w-5 h-5" style={{ color: '#0091ff' }} />
            </div>
            <div>
              <h1 className="text-heading-3 text-default-font leading-tight">{title}</h1>
              {poste && (
                <p className="text-caption text-subtext-color">{poste}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0091ff' }}
        >
          <Save className="w-4 h-4" />
          Save Document
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden">
        <DocumentEditor />
      </div>
    </div>
  );
}
