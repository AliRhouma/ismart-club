import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, FileText, X, ChevronDown,
  MoreHorizontal, Eye, Pencil, Trash2, Download,
  Shield, List, BookOpen, ClipboardList, ArrowLeft,
  Save, CheckCircle2, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  ListOrdered, Undo, Redo, Type, Minus
} from "lucide-react";
import { List as ListIcon } from "lucide-react";

/* ─────────────────────── constants ─────────────────────── */

const DOC_TYPES = {
  "Fiche de Poste": {
    label: "Fiche de Poste",
    color: "#0091ff",
    bg: "rgba(0,145,255,0.08)",
    border: "rgba(0,145,255,0.2)",
    Icon: ClipboardList,
  },
  Charte: {
    label: "Charte",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    Icon: Shield,
  },
  Règlement: {
    label: "Règlement",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    Icon: BookOpen,
  },
  "Liste des Rôles": {
    label: "Liste des Rôles",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    Icon: List,
  },
  "Sans type": {
    label: "Sans type",
    color: "#888888",
    bg: "rgba(136,136,136,0.08)",
    border: "rgba(136,136,136,0.2)",
    Icon: FileText,
  },
};

const ALL_FILTER_TYPES = ["Tous", "Fiche de Poste", "Charte", "Règlement", "Liste des Rôles"];

const mockDocs = [
  { id: 1,  title: "Fiche de Poste – Entraîneur Principal",    type: "Fiche de Poste",  poste: "Entraîneur Principal",     updatedAt: "28 Feb 2025", author: "A. Benali" },
  { id: 2,  title: "Charte Éthique du Club",                   type: "Charte",           poste: "Tous membres",             updatedAt: "14 Jan 2025", author: "Direction" },
  { id: 3,  title: "Règlement Intérieur 2025",                 type: "Règlement",        poste: "Tous membres",             updatedAt: "01 Jan 2025", author: "Secrétariat" },
  { id: 4,  title: "Liste des Rôles – Staff Technique",        type: "Liste des Rôles",  poste: "Staff Technique",          updatedAt: "10 Feb 2025", author: "M. Trabelsi" },
  { id: 5,  title: "Fiche de Poste – Préparateur Physique",    type: "Fiche de Poste",  poste: "Préparateur Physique",     updatedAt: "22 Feb 2025", author: "A. Benali" },
  { id: 6,  title: "Charte des Partenaires",                   type: "Charte",           poste: "Partenaires Commerciaux",  updatedAt: "05 Dec 2024", author: "Direction" },
  { id: 7,  title: "Règlement Sportif – Compétitions",         type: "Règlement",        poste: "Joueurs & Staff",          updatedAt: "15 Aug 2024", author: "Comité Sportif" },
  { id: 8,  title: "Fiche de Poste – Directeur Général",       type: "Fiche de Poste",  poste: "Directeur Général (CEO)", updatedAt: "11 Mar 2025", author: "RH" },
  { id: 9,  title: "Liste des Rôles – Comité Directeur",       type: "Liste des Rôles",  poste: "Comité Directeur",         updatedAt: "18 Jan 2025", author: "Secrétariat" },
  { id: 10, title: "Fiche de Poste – Analyste Vidéo",          type: "Fiche de Poste",  poste: "Analyste Vidéo",           updatedAt: "03 Feb 2025", author: "A. Benali" },
  { id: 11, title: "Charte Réseaux Sociaux",                   type: "Charte",           poste: "Communication",            updatedAt: "19 Nov 2024", author: "Resp. Com." },
  { id: 12, title: "Fiche de Poste – Kinésithérapeute",        type: "Fiche de Poste",  poste: "Kinésithérapeute Sportif", updatedAt: "27 Jan 2025", author: "RH" },
];

/* ─────────────────────── root ─────────────────────── */

export default function App() {
  const [view, setView] = useState("list");
  const [editingDoc, setEditingDoc] = useState(null);
  const [docs, setDocs] = useState(mockDocs);

  const openEditor = (doc) => { setEditingDoc(doc); setView("editor"); };
  const goBack = () => { setView("list"); setEditingDoc(null); };

  if (view === "editor") {
    return <EditorPage doc={editingDoc} onBack={goBack} />;
  }
  return <ListPage docs={docs} setDocs={setDocs} onOpenEditor={openEditor} />;
}

/* ─────────────────────── list page ─────────────────────── */

function ListPage({ docs, setDocs, onOpenEditor }) {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("Tous");
  const [showModal, setShowModal] = useState(false);

  const filtered = docs.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.poste.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "Tous" || d.type === activeType;
    return matchSearch && matchType;
  });

  const handleCreate = (newDoc) => {
    const doc = {
      id: Date.now(),
      ...newDoc,
      updatedAt: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      author: "Vous",
    };
    setDocs((prev) => [doc, ...prev]);
    setShowModal(false);
    onOpenEditor(doc);
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-screen" style={{ backgroundColor: "#0e0e0e", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .doc-row:hover .row-actions { opacity: 1; }
        .doc-row:hover { background: #161616 !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "#444" }}>Club Documents</p>
          <h1 className="text-3xl font-semibold" style={{ color: "#f0f0f0", letterSpacing: "-0.5px" }}>
            Fiches &amp; Documents
          </h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg w-72"
            style={{ backgroundColor: "#151515", border: "1px solid #222" }}>
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#444" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un document..."
              className="bg-transparent border-none outline-none w-full text-sm"
              style={{ color: "#d4d4d4" }} />
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "#0091ff" }}>
            <Plus className="w-3.5 h-3.5" />
            Nouveau document
          </button>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2 mb-7 overflow-x-auto scrollbar-hide">
          {ALL_FILTER_TYPES.map((t) => {
            const active = activeType === t;
            const cfg = DOC_TYPES[t];
            return (
              <button key={t} onClick={() => setActiveType(t)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: active ? (cfg ? cfg.bg : "rgba(255,255,255,0.06)") : "transparent",
                  border: `1px solid ${active ? (cfg ? cfg.border : "rgba(255,255,255,0.12)") : "#222"}`,
                  color: active ? (cfg ? cfg.color : "#d4d4d4") : "#555",
                }}>
                {cfg && <cfg.Icon className="w-3 h-3" />}
                {t}
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    backgroundColor: active ? (cfg ? cfg.border : "rgba(255,255,255,0.08)") : "#1c1c1c",
                    color: active ? (cfg ? cfg.color : "#aaa") : "#444",
                  }}>
                  {t === "Tous" ? docs.length : docs.filter((d) => d.type === t).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table header */}
        <div className="grid text-[11px] font-medium tracking-widest uppercase px-4 py-2.5 mb-1 rounded-md"
          style={{ gridTemplateColumns: "1fr 140px 160px 110px 80px", color: "#3a3a3a", backgroundColor: "#111" }}>
          <span>Titre du document</span>
          <span>Type</span>
          <span>Poste / Périmètre</span>
          <span>Mis à jour</span>
          <span />
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {filtered.map((doc, i) => (
            <DocRow key={doc.id} doc={doc} index={i} onOpen={() => onOpenEditor(doc)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-8 h-8 mb-3" style={{ color: "#252525" }} />
            <p className="text-sm" style={{ color: "#3a3a3a" }}>Aucun document trouvé.</p>
          </div>
        )}
      </div>

      {showModal && <CreateModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}

/* ─────────────────────── doc row ─────────────────────── */

function DocRow({ doc, index, onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = DOC_TYPES[doc.type] || DOC_TYPES["Sans type"];

  return (
    <div className="doc-row grid items-center px-4 py-3.5 rounded-lg cursor-pointer transition-all relative"
      style={{ gridTemplateColumns: "1fr 140px 160px 110px 80px", backgroundColor: "#111", border: "1px solid #181818" }}
      onClick={onOpen}>
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
          <cfg.Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
        </div>
        <span className="text-sm font-medium truncate" style={{ color: "#e0e0e0" }}>{doc.title}</span>
      </div>
      <div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
          {doc.type}
        </span>
      </div>
      <span className="text-xs truncate" style={{ color: "#555" }}>{doc.poste}</span>
      <div>
        <p className="text-xs" style={{ color: "#444" }}>{doc.updatedAt}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#333" }}>{doc.author}</p>
      </div>
      <div className="row-actions flex items-center justify-end gap-1 opacity-0 transition-opacity"
        onClick={(e) => e.stopPropagation()}>
        <ActionBtn icon={Eye} title="Voir" onClick={onOpen} />
        <ActionBtn icon={Pencil} title="Modifier" onClick={onOpen} />
        <div className="relative">
          <ActionBtn icon={MoreHorizontal} title="Plus"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} />
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
      style={{ color: "#444" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1e1e1e"; e.currentTarget.style.color = "#aaa"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#444"; }}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function DropMenu({ onClose }) {
  const items = [
    { icon: Eye, label: "Voir", color: "#aaa" },
    { icon: Pencil, label: "Modifier", color: "#aaa" },
    { icon: Download, label: "Télécharger", color: "#aaa" },
    { icon: Trash2, label: "Supprimer", color: "#f87171" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-8 z-20 rounded-lg overflow-hidden py-1 w-40"
        style={{ backgroundColor: "#181818", border: "1px solid #252525", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
        {items.map(({ icon: Icon, label, color }) => (
          <button key={label}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors"
            style={{ color }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────── create modal ─────────────────────── */

function CreateModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({ title: "", type: "", poste: "" });
  const [typeOpen, setTypeOpen] = useState(false);
  const valid = formData.title.trim() && formData.type;
  const allTypeKeys = Object.keys(DOC_TYPES);
  const selectedCfg = formData.type ? DOC_TYPES[formData.type] : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-md rounded-xl overflow-visible"
        style={{ backgroundColor: "#151515", border: "1px solid #222", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>

        {/* Header */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid #1e1e1e" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ color: "#f0f0f0" }}>Nouveau document</h2>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md"
              style={{ color: "#444" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1e1e1e"; e.currentTarget.style.color = "#aaa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#444"; }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: "#444" }}>Créer un nouveau document pour le club</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Type dropdown */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "#666" }}>Type de document</label>
            <div className="relative">
              <button onClick={() => setTypeOpen(!typeOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: selectedCfg ? selectedCfg.bg : "#1a1a1a",
                  border: `1px solid ${selectedCfg ? selectedCfg.border : "#252525"}`,
                  color: selectedCfg ? selectedCfg.color : "#555",
                }}>
                <span className="flex items-center gap-2">
                  {selectedCfg ? (
                    <>
                      <selectedCfg.Icon className="w-3.5 h-3.5" />
                      {formData.type}
                    </>
                  ) : (
                    <span style={{ color: "#555" }}>Sélectionner un type…</span>
                  )}
                </span>
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
                  style={{ transform: typeOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>

              {typeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setTypeOpen(false)} />
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-20 rounded-lg overflow-hidden py-1"
                    style={{ backgroundColor: "#181818", border: "1px solid #252525", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
                    {allTypeKeys.map((key) => {
                      const cfg = DOC_TYPES[key];
                      const isSelected = formData.type === key;
                      const isSansType = key === "Sans type";
                      return (
                        <button key={key}
                          onClick={() => { setFormData({ ...formData, type: key }); setTypeOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors"
                          style={{
                            backgroundColor: isSelected ? cfg.bg : "transparent",
                            color: isSelected ? cfg.color : "#888",
                            borderTop: isSansType ? "1px solid #222" : "none",
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#222"; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}>
                          <cfg.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                          <span>{cfg.label}</span>
                          {isSansType && (
                            <span className="ml-auto text-[10px]" style={{ color: "#444" }}>Aucune catégorie</span>
                          )}
                          {isSelected && (
                            <span className="ml-auto text-[10px]" style={{ color: cfg.color }}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "#666" }}>Titre du document</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="ex. Fiche de Poste – Trésorier"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #252525", color: "#e0e0e0" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0091ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#252525")} />
          </div>

          {/* Poste */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "#666" }}>Poste / Périmètre</label>
            <input type="text" value={formData.poste}
              onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
              placeholder="ex. Tous membres, Staff Technique…"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #252525", color: "#e0e0e0" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0091ff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#252525")} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #252525", color: "#666" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#202020")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}>
            Annuler
          </button>
          <button disabled={!valid} onClick={() => valid && onCreate(formData)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity"
            style={{ backgroundColor: "#0091ff", opacity: valid ? 1 : 0.35, cursor: valid ? "pointer" : "not-allowed" }}>
            <Plus className="w-3.5 h-3.5" />
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── editor page ─────────────────────── */

function EditorPage({ doc, onBack }) {
  const [title, setTitle] = useState(doc?.title || "");
  const [savedAt, setSavedAt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [padding, setPadding] = useState(2.54);
  const editorRef = useRef(null);
  const cfg = DOC_TYPES[doc?.type] || DOC_TYPES["Sans type"];

  // Auto-save trigger
  useEffect(() => {
    if (!title) return;
    const timer = setTimeout(triggerSave, 2000);
    return () => clearTimeout(timer);
  }, [title]);

  const triggerSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); setSavedAt(new Date()); }, 600);
  };

  const formatSaved = () => {
    if (!savedAt) return "";
    const diff = Math.floor((Date.now() - savedAt.getTime()) / 1000);
    if (diff < 5) return "Sauvegardé à l'instant";
    if (diff < 60) return `Sauvegardé il y a ${diff}s`;
    return `Sauvegardé à ${savedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  const toolbarGroups = [
    [
      { icon: Undo, action: () => exec("undo"), title: "Annuler" },
      { icon: Redo, action: () => exec("redo"), title: "Rétablir" },
    ],
    [
      { icon: Bold,      action: () => exec("bold"),      title: "Gras" },
      { icon: Italic,    action: () => exec("italic"),    title: "Italique" },
      { icon: Underline, action: () => exec("underline"), title: "Souligné" },
    ],
    [
      { icon: AlignLeft,    action: () => exec("justifyLeft"),   title: "Gauche" },
      { icon: AlignCenter,  action: () => exec("justifyCenter"), title: "Centre" },
      { icon: AlignRight,   action: () => exec("justifyRight"),  title: "Droite" },
      { icon: AlignJustify, action: () => exec("justifyFull"),   title: "Justifié" },
    ],
    [
      { icon: ListIcon,   action: () => exec("insertUnorderedList"), title: "Liste à puces" },
      { icon: ListOrdered, action: () => exec("insertOrderedList"),  title: "Liste numérotée" },
    ],
    [
      { icon: Minus, action: () => exec("insertHorizontalRule"), title: "Séparateur" },
    ],
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f3f4f6", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .editor-area { outline: none; }
        .editor-area:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; display: block; }
        .editor-area h1 { font-size: 1.875rem; font-weight: 700; margin: 0.75em 0 0.4em; color: #111827; line-height: 1.2; }
        .editor-area h2 { font-size: 1.375rem; font-weight: 600; margin: 0.75em 0 0.35em; color: #1f2937; }
        .editor-area h3 { font-size: 1.125rem; font-weight: 600; margin: 0.6em 0 0.3em; color: #374151; }
        .editor-area p  { margin: 0 0 0.6em; line-height: 1.75; color: #374151; font-size: 0.9375rem; }
        .editor-area ul { list-style: disc;    padding-left: 1.75em; margin: 0.4em 0 0.8em; }
        .editor-area ol { list-style: decimal; padding-left: 1.75em; margin: 0.4em 0 0.8em; }
        .editor-area li { margin: 0.2em 0; line-height: 1.65; color: #374151; font-size: 0.9375rem; }
        .editor-area hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
        .editor-area b, .editor-area strong { font-weight: 600; color: #111827; }
        .toolbar-btn:hover { background: #f3f4f6 !important; color: #111 !important; }
      `}</style>

      {/* ── Top bar ── */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors flex-shrink-0"
              style={{ color: "#6b7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <div className="w-px h-5 flex-shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
              style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              <cfg.Icon className="w-3 h-3" />
              {doc?.type || "Sans type"}
            </span>
            {doc?.poste && (
              <span className="text-xs truncate hidden sm:block" style={{ color: "#9ca3af" }}>
                {doc.poste}
              </span>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#9ca3af" }}>
                <Save className="w-3.5 h-3.5 animate-pulse" />Enregistrement…
              </span>
            ) : savedAt ? (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#22c55e" }}>
                <CheckCircle2 className="w-3.5 h-3.5" />{formatSaved()}
              </span>
            ) : null}

            {/* Margin slider */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <span style={{ color: "#6b7280" }}>Marges</span>
              <input type="range" min="0" max="4" step="0.1" value={padding}
                onChange={(e) => setPadding(parseFloat(e.target.value))}
                className="w-20 cursor-pointer" style={{ accentColor: "#0091ff" }} />
              <span className="w-10 text-right font-mono" style={{ color: "#374151" }}>
                {padding.toFixed(1)}cm
              </span>
            </div>

            <button onClick={triggerSave}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "#0091ff" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              <Save className="w-3.5 h-3.5" />
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Title row */}
        <div className="max-w-[21cm] mx-auto px-6 pb-3 pt-1">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du document"
            className="w-full text-2xl font-bold border-none outline-none bg-transparent"
            style={{ color: "#111827", letterSpacing: "-0.5px" }} />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border-b sticky top-[109px] z-10" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-[21cm] mx-auto px-4 py-1.5 flex items-center gap-0.5 flex-wrap">

          {/* Format select */}
          <select
            onChange={(e) => { exec("formatBlock", e.target.value); e.target.value = "p"; }}
            className="text-xs px-2 py-1.5 rounded-md cursor-pointer mr-1"
            style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#374151" }}>
            <option value="p">Paragraphe</option>
            <option value="h1">Titre 1</option>
            <option value="h2">Titre 2</option>
            <option value="h3">Titre 3</option>
          </select>

          <div className="w-px h-5 mx-1" style={{ backgroundColor: "#e5e7eb" }} />

          {toolbarGroups.map((group, gi) => (
            <div key={gi} className="flex items-center">
              {group.map(({ icon: Icon, action, title }) => (
                <button key={title} title={title} onClick={action}
                  className="toolbar-btn w-7 h-7 flex items-center justify-center rounded transition-colors"
                  style={{ color: "#6b7280", backgroundColor: "transparent" }}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
              {gi < toolbarGroups.length - 1 && (
                <div className="w-px h-5 mx-1" style={{ backgroundColor: "#e5e7eb" }} />
              )}
            </div>
          ))}

          <div className="w-px h-5 mx-1" style={{ backgroundColor: "#e5e7eb" }} />

          {/* Font size */}
          <div className="flex items-center gap-1">
            <Type className="w-3 h-3" style={{ color: "#9ca3af" }} />
            <select onChange={(e) => exec("fontSize", e.target.value)}
              className="text-xs px-1.5 py-1 rounded border cursor-pointer"
              style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#374151" }}>
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <option key={s} value={s}>{[8, 10, 12, 14, 16, 18, 24][s - 1]}px</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── A4 area ── */}
      <div className="flex-1 py-10 px-4 overflow-y-auto">

        {/* Meta info banner */}
        <div className="max-w-[21cm] mx-auto mb-5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <cfg.Icon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-semibold" style={{ color: cfg.color }}>{doc?.type || "Sans type"}</span>
              {doc?.poste && (
                <>
                  <span style={{ color: cfg.color, opacity: 0.35 }}>·</span>
                  <span style={{ color: cfg.color, opacity: 0.75 }}>{doc.poste}</span>
                </>
              )}
              <span style={{ color: cfg.color, opacity: 0.35 }}>·</span>
              <span style={{ color: cfg.color, opacity: 0.5 }}>
                Modifié le {doc?.updatedAt || "—"} · {doc?.author || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* A4 page sheet */}
        <div className="max-w-[21cm] mx-auto bg-white shadow-lg"
          style={{
            minHeight: "29.7cm",
            padding: `${padding}cm`,
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.08)",
          }}>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Commencez à écrire ou tapez / pour insérer un bloc…"
            className="editor-area w-full"
            style={{ minHeight: "24cm" }}
          />
        </div>

        <p className="max-w-[21cm] mx-auto text-center text-xs mt-5 pb-10"
          style={{ color: "#c4c9d4" }}>
          Appuyez sur{" "}
          <kbd className="px-1.5 py-0.5 rounded text-[10px]"
            style={{ backgroundColor: "#e5e7eb", color: "#6b7280", fontFamily: "monospace" }}>/</kbd>
          {" "}pour les blocs ·{" "}
          <kbd className="px-1.5 py-0.5 rounded text-[10px]"
            style={{ backgroundColor: "#e5e7eb", color: "#6b7280", fontFamily: "monospace" }}>Ctrl+S</kbd>
          {" "}pour sauvegarder
        </p>
      </div>
    </div>
  );
}