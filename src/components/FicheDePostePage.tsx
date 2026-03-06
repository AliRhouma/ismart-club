import { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, FileText, X, ChevronDown,
  MoreHorizontal, Eye, Pencil, Trash2, Download,
  Shield, List as ListIcon, BookOpen, ClipboardList, ArrowLeft,
  Save, CheckCircle2, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Minus, Type, ChevronRight
} from 'lucide-react';

/* ─────────────────────── constants ─────────────────────── */

const DOC_TYPES = {
  'Fiche de Poste': {
    label: 'Fiche de Poste',
    color: '#0091ff',
    bg: 'rgba(0,145,255,0.08)',
    border: 'rgba(0,145,255,0.2)',
    Icon: ClipboardList,
  },
  'Charte': {
    label: 'Charte',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
    Icon: Shield,
  },
  'Règlement': {
    label: 'Règlement',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
    Icon: BookOpen,
  },
  'Liste des Rôles': {
    label: 'Liste des Rôles',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
    Icon: ListIcon,
  },
  'Sans type': {
    label: 'Sans type',
    color: '#666',
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    Icon: FileText,
  },
};

const initialDocs = [
  { id: 1,  title: 'Fiche de Poste – Entraîneur Principal',      type: 'Fiche de Poste',   poste: 'Entraîneur Principal',       updatedAt: '28 Feb 2025',  author: 'A. Benali' },
  { id: 2,  title: 'Charte Éthique du Club',                     type: 'Charte',            poste: 'Tous membres',               updatedAt: '14 Jan 2025',  author: 'Direction' },
  { id: 3,  title: 'Règlement Intérieur 2025',                   type: 'Règlement',         poste: 'Tous membres',               updatedAt: '01 Jan 2025',  author: 'Secrétariat' },
  { id: 4,  title: 'Liste des Rôles – Staff Technique',          type: 'Liste des Rôles',   poste: 'Staff Technique',            updatedAt: '10 Feb 2025',  author: 'M. Trabelsi' },
  { id: 5,  title: 'Fiche de Poste – Préparateur Physique',      type: 'Fiche de Poste',   poste: 'Préparateur Physique',        updatedAt: '22 Feb 2025',  author: 'A. Benali' },
  { id: 6,  title: 'Charte des Partenaires',                     type: 'Charte',            poste: 'Partenaires Commerciaux',    updatedAt: '05 Dec 2024',  author: 'Direction' },
  { id: 7,  title: 'Règlement Sportif – Compétitions',           type: 'Règlement',         poste: 'Joueurs & Staff',            updatedAt: '15 Aug 2024',  author: 'Comité Sportif' },
  { id: 8,  title: 'Fiche de Poste – Directeur Général',         type: 'Fiche de Poste',   poste: 'Directeur Général (CEO)',     updatedAt: '11 Mar 2025',  author: 'RH' },
];

const ALL_TYPES = ['Tous', ...Object.keys(DOC_TYPES)];

/* ─────────────────────── app shell ─────────────────────── */

export default function App() {
  const [docs, setDocs] = useState(initialDocs);
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [activeDoc, setActiveDoc] = useState(null);

  const handleCreate = (newDoc) => {
    const doc = {
      ...newDoc,
      id: Date.now(),
      updatedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: 'Vous',
      content: '',
    };
    setDocs(prev => [doc, ...prev]);
    setActiveDoc(doc);
    setView('editor');
  };

  const handleOpenDoc = (doc) => {
    setActiveDoc(doc);
    setView('editor');
  };

  const handleBack = () => {
    setView('list');
    setActiveDoc(null);
  };

  const handleSave = (updatedDoc) => {
    setDocs(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    setActiveDoc(updatedDoc);
  };

  if (view === 'editor' && activeDoc) {
    return <EditorPage doc={activeDoc} onBack={handleBack} onSave={handleSave} />;
  }

  return <ListPage docs={docs} onCreate={handleCreate} onOpenDoc={handleOpenDoc} />;
}

/* ─────────────────────── list page ─────────────────────── */

function ListPage({ docs, onCreate, onOpenDoc }) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('Tous');
  const [showModal, setShowModal] = useState(false);

  const filtered = docs.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.poste.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === 'Tous' || d.type === activeType;
    return matchSearch && matchType;
  });

  return (
    <div className="flex-1 overflow-y-auto min-h-screen" style={{ backgroundColor: '#0e0e0e', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .doc-row:hover .row-actions { opacity: 1; }
        .doc-row:hover { background: #161616 !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .editor-content:focus { outline: none; }
        .editor-content p { margin: 0 0 0.75em; }
        .editor-content h1 { font-size: 1.6em; font-weight: 600; margin: 0.8em 0 0.4em; color: #f0f0f0; }
        .editor-content h2 { font-size: 1.3em; font-weight: 600; margin: 0.8em 0 0.4em; color: #e0e0e0; }
        .editor-content ul, .editor-content ol { padding-left: 1.5em; margin: 0.5em 0; }
        .editor-content li { margin: 0.2em 0; }
        .editor-content hr { border: none; border-top: 1px solid #252525; margin: 1em 0; }
        .type-dropdown { position: relative; }
        .type-dropdown-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 50; }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#444' }}>Club Documents</p>
          <h1 className="text-3xl font-semibold" style={{ color: '#f0f0f0', letterSpacing: '-0.5px' }}>Fiches &amp; Documents</h1>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg w-72" style={{ backgroundColor: '#151515', border: '1px solid #222' }}>
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#444' }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un document..."
              className="bg-transparent border-none outline-none w-full text-sm"
              style={{ color: '#d4d4d4' }}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: '#0091ff' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau document
          </button>
        </div>

        <div className="flex items-center gap-2 mb-7 overflow-x-auto scrollbar-hide">
          {ALL_TYPES.map((t) => {
            const active = activeType === t;
            const cfg = DOC_TYPES[t];
            return (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: active ? (cfg ? cfg.bg : 'rgba(255,255,255,0.06)') : 'transparent',
                  border: `1px solid ${active ? (cfg ? cfg.border : 'rgba(255,255,255,0.12)') : '#222'}`,
                  color: active ? (cfg ? cfg.color : '#d4d4d4') : '#555',
                }}
              >
                {cfg && <cfg.Icon className="w-3 h-3" />}
                {t}
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]" style={{
                  backgroundColor: active ? (cfg ? cfg.border : 'rgba(255,255,255,0.08)') : '#1c1c1c',
                  color: active ? (cfg ? cfg.color : '#aaa') : '#444',
                }}>
                  {t === 'Tous' ? docs.length : docs.filter(d => d.type === t).length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid text-[11px] font-medium tracking-widest uppercase px-4 py-2.5 mb-1 rounded-md"
          style={{ gridTemplateColumns: '1fr 140px 160px 110px 80px', color: '#3a3a3a', backgroundColor: '#111' }}>
          <span>Titre du document</span><span>Type</span><span>Poste / Périmètre</span><span>Mis à jour</span><span />
        </div>

        <div className="space-y-1">
          {filtered.map((doc, i) => (
            <DocRow key={doc.id} doc={doc} index={i} onOpen={() => onOpenDoc(doc)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-8 h-8 mb-3" style={{ color: '#252525' }} />
            <p className="text-sm" style={{ color: '#3a3a3a' }}>Aucun document trouvé.</p>
          </div>
        )}
      </div>

      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onCreate={(data) => { setShowModal(false); onCreate(data); }} />
      )}
    </div>
  );
}

/* ─────────────────────── doc row ─────────────────────── */

function DocRow({ doc, index, onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = DOC_TYPES[doc.type] || DOC_TYPES['Sans type'];

  return (
    <div
      className="doc-row grid items-center px-4 py-3.5 rounded-lg cursor-pointer transition-all relative"
      style={{ gridTemplateColumns: '1fr 140px 160px 110px 80px', backgroundColor: '#111', border: '1px solid #181818' }}
      onClick={onOpen}
    >
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
          <cfg.Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
        </div>
        <span className="text-sm font-medium truncate" style={{ color: '#e0e0e0' }}>{doc.title}</span>
      </div>
      <div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
          {doc.type}
        </span>
      </div>
      <span className="text-xs truncate" style={{ color: '#555' }}>{doc.poste}</span>
      <div>
        <p className="text-xs" style={{ color: '#444' }}>{doc.updatedAt}</p>
        <p className="text-[11px] mt-0.5" style={{ color: '#333' }}>{doc.author}</p>
      </div>
      <div className="row-actions flex items-center justify-end gap-1 opacity-0 transition-opacity" onClick={e => e.stopPropagation()}>
        <ActionBtn icon={Eye} title="Voir" onClick={onOpen} />
        <ActionBtn icon={Pencil} title="Modifier" onClick={onOpen} />
        <div className="relative">
          <ActionBtn icon={MoreHorizontal} title="Plus" onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} />
          {menuOpen && <DropMenu onClose={() => setMenuOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, title, onClick }) {
  return (
    <button title={title} onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
      style={{ color: '#444' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e1e1e'; e.currentTarget.style.color = '#aaa'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#444'; }}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function DropMenu({ onClose }) {
  const items = [
    { icon: Eye, label: 'Voir', color: '#aaa' },
    { icon: Pencil, label: 'Modifier', color: '#aaa' },
    { icon: Download, label: 'Télécharger', color: '#aaa' },
    { icon: Trash2, label: 'Supprimer', color: '#f87171' },
  ];
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-8 z-20 rounded-lg overflow-hidden py-1 w-40"
        style={{ backgroundColor: '#181818', border: '1px solid #252525', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
        {items.map(({ icon: Icon, label, color }) => (
          <button key={label} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors" style={{ color }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────── create modal ─────────────────────── */

function CreateModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({ title: '', type: '', poste: '' });
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const valid = formData.title.trim() && formData.type;

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedCfg = formData.type ? DOC_TYPES[formData.type] : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-xl overflow-hidden"
        style={{ backgroundColor: '#151515', border: '1px solid #222', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid #1e1e1e' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ color: '#f0f0f0' }}>Nouveau document</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md"
              style={{ color: '#444' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e1e1e'; e.currentTarget.style.color = '#aaa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#444'; }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: '#444' }}>Créer un nouveau document pour le club</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Type dropdown */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#666' }}>Type de document</label>
            <div className="type-dropdown" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${dropOpen ? '#0091ff' : '#252525'}`,
                  color: selectedCfg ? selectedCfg.color : '#555',
                }}
              >
                <div className="flex items-center gap-2.5">
                  {selectedCfg
                    ? <><selectedCfg.Icon className="w-3.5 h-3.5" /><span>{selectedCfg.label}</span></>
                    : <span className="text-sm" style={{ color: '#444' }}>Sélectionner un type…</span>
                  }
                </div>
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform" style={{ color: '#444', transform: dropOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {dropOpen && (
                <div className="type-dropdown-menu rounded-lg overflow-hidden py-1"
                  style={{ backgroundColor: '#181818', border: '1px solid #252525', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
                  {Object.entries(DOC_TYPES).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => { setFormData({ ...formData, type: key }); setDropOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors"
                      style={{ color: formData.type === key ? cfg.color : '#888' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        <cfg.Icon className="w-3 h-3" style={{ color: cfg.color }} />
                      </div>
                      <span className="font-medium">{cfg.label}</span>
                      {key === 'Sans type' && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: '#252525', color: '#444' }}>défaut</span>
                      )}
                      {formData.type === key && <CheckCircle2 className="w-3 h-3 ml-auto" style={{ color: cfg.color }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#666' }}>Titre du document</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="ex. Fiche de Poste – Trésorier"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #252525', color: '#e0e0e0' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#0091ff')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#252525')}
            />
          </div>

          {/* Poste */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#666' }}>Poste / Périmètre</label>
            <input type="text" value={formData.poste} onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
              placeholder="ex. Tous membres, Staff Technique…"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #252525', color: '#e0e0e0' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#0091ff')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#252525')}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #252525', color: '#666' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#202020')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}>
            Annuler
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onCreate(formData)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity"
            style={{ backgroundColor: '#0091ff', opacity: valid ? 1 : 0.35, cursor: valid ? 'pointer' : 'not-allowed' }}>
            <Plus className="w-3.5 h-3.5" />
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── editor page ─────────────────────── */

function EditorPage({ doc, onBack, onSave }) {
  const [title, setTitle] = useState(doc.title);
  const [saved, setSaved] = useState(false);
  const editorRef = useRef(null);
  const cfg = DOC_TYPES[doc.type] || DOC_TYPES['Sans type'];

  const triggerSave = () => {
    setSaved(true);
    onSave({ ...doc, title });
    setTimeout(() => setSaved(false), 2500);
  };

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0e0e0e', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .editor-content { outline: none; min-height: 100%; }
        .editor-content p { margin: 0 0 0.85em; color: #c8c8c8; line-height: 1.75; }
        .editor-content h1 { font-size: 1.5em; font-weight: 600; margin: 1em 0 0.5em; color: #f0f0f0; line-height: 1.3; }
        .editor-content h2 { font-size: 1.2em; font-weight: 600; margin: 0.9em 0 0.4em; color: #e0e0e0; line-height: 1.35; }
        .editor-content ul, .editor-content ol { padding-left: 1.6em; margin: 0.5em 0 0.85em; color: #c8c8c8; }
        .editor-content li { margin: 0.25em 0; line-height: 1.65; }
        .editor-content hr { border: none; border-top: 1px solid #252525; margin: 1.2em 0; }
        .editor-content:empty:before { content: attr(data-placeholder); color: #333; pointer-events: none; }
        .toolbar-btn:hover { background: #222 !important; color: #ccc !important; }
      `}</style>

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-3.5"
        style={{ backgroundColor: '#0e0e0e', borderBottom: '1px solid #1a1a1a' }}>

        {/* Left: back + breadcrumb */}
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: '#555' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#aaa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}>
            <ArrowLeft className="w-4 h-4" />
            <span>Documents</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#333' }} />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <cfg.Icon className="w-3 h-3" style={{ color: cfg.color }} />
            </div>
            <span className="text-sm font-medium truncate max-w-[280px]" style={{ color: '#888' }}>{title || 'Sans titre'}</span>
          </div>
        </div>

        {/* Right: save status + button */}
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#34d399' }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Enregistré
            </div>
          )}
          <button onClick={triggerSave}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: '#0091ff' }}>
            <Save className="w-3.5 h-3.5" />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Doc meta strip */}
      <div className="flex items-center gap-6 px-8 py-3" style={{ borderBottom: '1px solid #141414' }}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest font-medium" style={{ color: '#333' }}>Type</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
            <cfg.Icon className="w-3 h-3" />{doc.type}
          </span>
        </div>
        {doc.poste && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-medium" style={{ color: '#333' }}>Poste</span>
            <span className="text-xs" style={{ color: '#555' }}>{doc.poste}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest font-medium" style={{ color: '#333' }}>Auteur</span>
          <span className="text-xs" style={{ color: '#555' }}>{doc.author}</span>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col max-w-[860px] w-full mx-auto px-8 py-10">

        {/* Document title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du document"
          className="w-full bg-transparent border-none outline-none mb-8 font-semibold"
          style={{ color: '#f0f0f0', fontSize: '2rem', letterSpacing: '-0.5px' }}
        />

        {/* Toolbar */}
        <div className="flex items-center gap-0.5 mb-6 p-1.5 rounded-lg sticky top-[57px] z-10"
          style={{ backgroundColor: '#131313', border: '1px solid #1e1e1e' }}>
          {[
            { icon: Bold, cmd: 'bold', title: 'Gras' },
            { icon: Italic, cmd: 'italic', title: 'Italique' },
            { icon: Underline, cmd: 'underline', title: 'Souligné' },
          ].map(({ icon: Icon, cmd, title }) => (
            <button key={cmd} title={title} onClick={() => exec(cmd)}
              className="toolbar-btn w-7 h-7 flex items-center justify-center rounded transition-colors"
              style={{ color: '#555', backgroundColor: 'transparent' }}>
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}

          <div className="w-px h-4 mx-1.5" style={{ backgroundColor: '#252525' }} />

          <button title="Titre H1" onClick={() => exec('formatBlock', 'h1')}
            className="toolbar-btn flex items-center gap-1 px-2 h-7 rounded text-[11px] font-medium transition-colors"
            style={{ color: '#555', backgroundColor: 'transparent' }}>H1</button>
          <button title="Titre H2" onClick={() => exec('formatBlock', 'h2')}
            className="toolbar-btn flex items-center gap-1 px-2 h-7 rounded text-[11px] font-medium transition-colors"
            style={{ color: '#555', backgroundColor: 'transparent' }}>H2</button>
          <button title="Paragraphe" onClick={() => exec('formatBlock', 'p')}
            className="toolbar-btn w-7 h-7 flex items-center justify-center rounded transition-colors"
            style={{ color: '#555', backgroundColor: 'transparent' }}>
            <Type className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 mx-1.5" style={{ backgroundColor: '#252525' }} />

          {[
            { icon: AlignLeft, cmd: 'justifyLeft', title: 'Gauche' },
            { icon: AlignCenter, cmd: 'justifyCenter', title: 'Centre' },
            { icon: AlignRight, cmd: 'justifyRight', title: 'Droite' },
          ].map(({ icon: Icon, cmd, title }) => (
            <button key={cmd} title={title} onClick={() => exec(cmd)}
              className="toolbar-btn w-7 h-7 flex items-center justify-center rounded transition-colors"
              style={{ color: '#555', backgroundColor: 'transparent' }}>
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}

          <div className="w-px h-4 mx-1.5" style={{ backgroundColor: '#252525' }} />

          <button title="Liste" onClick={() => exec('insertUnorderedList')}
            className="toolbar-btn w-7 h-7 flex items-center justify-center rounded transition-colors"
            style={{ color: '#555', backgroundColor: 'transparent' }}>
            <ListIcon className="w-3.5 h-3.5" />
          </button>
          <button title="Séparateur" onClick={() => exec('insertHorizontalRule')}
            className="toolbar-btn w-7 h-7 flex items-center justify-center rounded transition-colors"
            style={{ color: '#555', backgroundColor: 'transparent' }}>
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editable area — A4-like paper card */}
        <div className="rounded-xl flex-1 p-10"
          style={{ backgroundColor: '#111', border: '1px solid #1c1c1c', minHeight: '600px' }}>
          <div
            ref={editorRef}
            className="editor-content w-full h-full text-sm"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Commencez à rédiger votre document…"
            style={{ color: '#c8c8c8', lineHeight: '1.75' }}
          />
        </div>
      </div>
    </div>
  );
}