import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, FileText, X, ChevronDown,
  MoreHorizontal, Eye, Pencil, Trash2, Download,
  Shield, List, BookOpen, ClipboardList,
  Users, Briefcase, User, Check,
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
    Icon: List,
  },
};

const mockDocs = [
  { id: 1,  title: 'Fiche de Poste – Entraîneur Principal',      type: 'Fiche de Poste',   poste: 'Entraîneur Principal',       updatedAt: '28 Feb 2025',  author: 'A. Benali' },
  { id: 2,  title: 'Charte Éthique du Club',                     type: 'Charte',            poste: 'Tous membres',               updatedAt: '14 Jan 2025',  author: 'Direction' },
  { id: 3,  title: 'Règlement Intérieur 2025',                   type: 'Règlement',         poste: 'Tous membres',               updatedAt: '01 Jan 2025',  author: 'Secrétariat' },
  { id: 4,  title: 'Liste des Rôles – Staff Technique',          type: 'Liste des Rôles',   poste: 'Staff Technique',            updatedAt: '10 Feb 2025',  author: 'M. Trabelsi' },
  { id: 5,  title: 'Fiche de Poste – Préparateur Physique',      type: 'Fiche de Poste',   poste: 'Préparateur Physique',        updatedAt: '22 Feb 2025',  author: 'A. Benali' },
  { id: 6,  title: 'Charte des Partenaires',                     type: 'Charte',            poste: 'Partenaires Commerciaux',    updatedAt: '05 Dec 2024',  author: 'Direction' },
  { id: 7,  title: 'Règlement Sportif – Compétitions',           type: 'Règlement',         poste: 'Joueurs & Staff',            updatedAt: '15 Aug 2024',  author: 'Comité Sportif' },
  { id: 8,  title: 'Fiche de Poste – Directeur Général',         type: 'Fiche de Poste',   poste: 'Directeur Général (CEO)',     updatedAt: '11 Mar 2025',  author: 'RH' },
  { id: 9,  title: 'Liste des Rôles – Comité Directeur',         type: 'Liste des Rôles',   poste: 'Comité Directeur',           updatedAt: '18 Jan 2025',  author: 'Secrétariat' },
  { id: 10, title: 'Fiche de Poste – Analyste Vidéo',            type: 'Fiche de Poste',   poste: 'Analyste Vidéo',             updatedAt: '03 Feb 2025',  author: 'A. Benali' },
  { id: 11, title: 'Charte Réseaux Sociaux',                     type: 'Charte',            poste: 'Communication',              updatedAt: '19 Nov 2024',  author: 'Resp. Com.' },
  { id: 12, title: 'Fiche de Poste – Kinésithérapeute',          type: 'Fiche de Poste',   poste: 'Kinésithérapeute Sportif',   updatedAt: '27 Jan 2025',  author: 'RH' },
];

const ALL_TYPES = ['Tous', ...Object.keys(DOC_TYPES)];

/* ─────────────────────── main page ─────────────────────── */

export function FicheDePostePage() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState('');
  const [activeType, setActiveType] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData]   = useState({ title: '', type: '', poste: '' });

  const handleCreate = (data: { title: string; type: string; poste: string }) => {
    setShowModal(false);
    setFormData({ title: '', type: '', poste: '' });
    navigate('/fiche-de-poste/create', { state: { title: data.title, type: data.type, poste: data.poste } });
  };

  const filtered = mockDocs.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.poste.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === 'Tous' || d.type === activeType;
    return matchSearch && matchType;
  });

  return (
    <div className="flex-1 overflow-y-auto min-h-screen" style={{ backgroundColor: '#0e0e0e', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .doc-row:hover .row-actions { opacity: 1; }
        .doc-row:hover { background: #161616 !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#444' }}>
            Club Documents
          </p>
          <h1 className="text-3xl font-semibold" style={{ color: '#f0f0f0', letterSpacing: '-0.5px' }}>
            Fiches &amp; Documents
          </h1>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg w-72"
            style={{ backgroundColor: '#151515', border: '1px solid #222' }}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#444' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        {/* ── Type Filter Tabs ── */}
        <div className="flex items-center gap-2 mb-7 overflow-x-auto scrollbar-hide">
          {ALL_TYPES.map((t) => {
            const active = activeType === t;
            const cfg    = DOC_TYPES[t];
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
                <span
                  className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    backgroundColor: active ? (cfg ? cfg.border : 'rgba(255,255,255,0.08)') : '#1c1c1c',
                    color: active ? (cfg ? cfg.color : '#aaa') : '#444',
                  }}
                >
                  {t === 'Tous' ? mockDocs.length : mockDocs.filter(d => d.type === t).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Table header ── */}
        <div
          className="grid text-[11px] font-medium tracking-widest uppercase px-4 py-2.5 mb-1 rounded-md"
          style={{
            gridTemplateColumns: '1fr 140px 160px 110px 80px',
            color: '#3a3a3a',
            backgroundColor: '#111',
          }}
        >
          <span>Titre du document</span>
          <span>Type</span>
          <span>Poste / Périmètre</span>
          <span>Mis à jour</span>
          <span />
        </div>

        {/* ── Rows ── */}
        <div className="space-y-1">
          {filtered.map((doc, i) => (
            <DocRow key={doc.id} doc={doc} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-8 h-8 mb-3" style={{ color: '#252525' }} />
            <p className="text-sm" style={{ color: '#3a3a3a' }}>Aucun document trouvé.</p>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <CreateModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => { setShowModal(false); setFormData({ title: '', type: '', poste: '' }); }}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

/* ─────────────────────── doc row ─────────────────────── */

function DocRow({ doc, index }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = DOC_TYPES[doc.type];

  return (
    <div
      onClick={() => navigate(`/fiche-poste/${doc.id}`)}
      className="doc-row grid items-center px-4 py-3.5 rounded-lg cursor-pointer transition-all relative"
      style={{
        gridTemplateColumns: '1fr 140px 160px 110px 80px',
        backgroundColor: '#111',
        border: '1px solid #181818',
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <cfg.Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
        </div>
        <span className="text-sm font-medium truncate" style={{ color: '#e0e0e0' }}>
          {doc.title}
        </span>
      </div>

      {/* Type badge */}
      <div>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
        >
          {doc.type}
        </span>
      </div>

      {/* Poste */}
      <span className="text-xs truncate" style={{ color: '#555' }}>
        {doc.poste}
      </span>

      {/* Date + author */}
      <div>
        <p className="text-xs" style={{ color: '#444' }}>{doc.updatedAt}</p>
        <p className="text-[11px] mt-0.5" style={{ color: '#333' }}>{doc.author}</p>
      </div>

      {/* Actions */}
      <div className="row-actions flex items-center justify-end gap-1 opacity-0 transition-opacity">
        <ActionBtn icon={Eye}    title="Voir" />
        <ActionBtn icon={Pencil} title="Modifier" />
        <div className="relative">
          <ActionBtn
            icon={MoreHorizontal}
            title="Plus"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          />
          {menuOpen && (
            <DropMenu onClose={() => setMenuOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, title, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
      style={{ color: '#444' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1e1e1e';
        e.currentTarget.style.color = '#aaa';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#444';
      }}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function DropMenu({ onClose }) {
  const items = [
    { icon: Eye,      label: 'Voir',        color: '#aaa' },
    { icon: Pencil,   label: 'Modifier',    color: '#aaa' },
    { icon: Download, label: 'Télécharger', color: '#aaa' },
    { icon: Trash2,   label: 'Supprimer',   color: '#f87171' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        className="absolute right-0 top-8 z-20 rounded-lg overflow-hidden py-1 w-40"
        style={{ backgroundColor: '#181818', border: '1px solid #252525', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}
      >
        {items.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors"
            style={{ color }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────── create modal data ─────────────────────── */

const STAFF_GROUPS = [
  { id: 'sg-direction', label: 'Comité Directeur',  color: '#a78bfa', count: 5 },
  { id: 'sg-technique', label: 'Staff Technique',   color: '#0091ff', count: 6 },
  { id: 'sg-medical',   label: 'Service Médical',   color: '#34d399', count: 3 },
  { id: 'sg-admin',     label: 'Administration',    color: '#fbbf24', count: 4 },
  { id: 'sg-com',       label: 'Communication',     color: '#f472b6', count: 3 },
  { id: 'sg-joueurs',   label: 'Équipe Première',   color: '#fb923c', count: 22 },
];

const POST_GROUPS = [
  { id: 'pg-joueurs',    label: 'Joueurs',                  color: '#fb923c', count: 22 },
  { id: 'pg-entraineurs',label: 'Entraîneurs',              color: '#0091ff', count: 3  },
  { id: 'pg-prep',       label: 'Préparateurs Physiques',   color: '#34d399', count: 2  },
  { id: 'pg-analystes',  label: 'Analystes Vidéo',          color: '#a78bfa', count: 2  },
  { id: 'pg-kine',       label: 'Kinésithérapeutes',        color: '#34d399', count: 2  },
  { id: 'pg-dirigeants', label: 'Dirigeants',               color: '#fbbf24', count: 5  },
  { id: 'pg-media',      label: 'Responsables Médias',      color: '#f472b6', count: 3  },
  { id: 'pg-admin',      label: 'Administratifs',           color: '#e2e8f0', count: 4  },
];

const MODAL_MEMBERS = [
  { id: 'm1',  name: 'Khalil Ayari',     initials: 'KA', post: 'Président',              group: 'Comité Directeur', color: '#a78bfa' },
  { id: 'm2',  name: 'Nadia Rekik',      initials: 'NR', post: 'Vice-Présidente',        group: 'Comité Directeur', color: '#a78bfa' },
  { id: 'm3',  name: 'Sami Trabelsi',    initials: 'ST', post: 'Trésorier',              group: 'Comité Directeur', color: '#a78bfa' },
  { id: 'm4',  name: 'Leila Guesmi',     initials: 'LG', post: 'Secrétaire Générale',    group: 'Comité Directeur', color: '#a78bfa' },
  { id: 'm5',  name: 'Hedi Ben Ammar',   initials: 'HB', post: 'Membre CD',              group: 'Comité Directeur', color: '#a78bfa' },
  { id: 'm6',  name: 'Amine Benali',     initials: 'AB', post: 'Entraîneur Principal',   group: 'Staff Technique',  color: '#0091ff' },
  { id: 'm7',  name: 'Riadh Zouari',     initials: 'RZ', post: 'Entraîneur Adjoint',     group: 'Staff Technique',  color: '#0091ff' },
  { id: 'm8',  name: 'Omar Hamdi',       initials: 'OH', post: 'Entraîneur des Gardiens',group: 'Staff Technique',  color: '#0091ff' },
  { id: 'm9',  name: 'Tarek Mansouri',   initials: 'TM', post: 'Préparateur Physique',   group: 'Staff Technique',  color: '#0091ff' },
  { id: 'm10', name: 'Wissem Dridi',     initials: 'WD', post: 'Préparateur Physique',   group: 'Staff Technique',  color: '#0091ff' },
  { id: 'm11', name: 'Cyrine Lajmi',     initials: 'CL', post: 'Analyste Vidéo',         group: 'Staff Technique',  color: '#0091ff' },
  { id: 'm12', name: 'Dr. Mehdi Karray', initials: 'MK', post: 'Médecin du Club',        group: 'Service Médical',  color: '#34d399' },
  { id: 'm13', name: 'Asma Ferchichi',   initials: 'AF', post: 'Kinésithérapeute',       group: 'Service Médical',  color: '#34d399' },
  { id: 'm14', name: 'Bilel Chaabane',   initials: 'BC', post: 'Kinésithérapeute',       group: 'Service Médical',  color: '#34d399' },
  { id: 'm15', name: 'Ines Turki',       initials: 'IT', post: 'Directrice Admin.',      group: 'Administration',   color: '#fbbf24' },
  { id: 'm16', name: 'Mohamed Gharbi',   initials: 'MG', post: 'Comptable',              group: 'Administration',   color: '#fbbf24' },
  { id: 'm17', name: 'Dorra Slim',       initials: 'DS', post: 'Assistante RH',          group: 'Administration',   color: '#fbbf24' },
  { id: 'm18', name: 'Farouk Belhaj',    initials: 'FB', post: 'Logisticien',            group: 'Administration',   color: '#fbbf24' },
  { id: 'm19', name: 'Karim Slama',      initials: 'KS', post: 'Responsable Com.',       group: 'Communication',    color: '#f472b6' },
  { id: 'm20', name: 'Rim Mabrouk',      initials: 'RM', post: 'Community Manager',      group: 'Communication',    color: '#f472b6' },
  { id: 'm21', name: 'Yassine Nasr',     initials: 'YN', post: 'Photographe',            group: 'Communication',    color: '#f472b6' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'Sans type' },
  ...Object.entries(DOC_TYPES).map(([key, cfg]) => ({ value: key, label: cfg.label, cfg })),
];

const SELECTION_MODES = [
  { id: 'group',  label: 'Groupe Staff', Icon: Users },
  { id: 'post',   label: 'Par Poste',    Icon: Briefcase },
  { id: 'member', label: 'Individuel',   Icon: User },
];

/* ─────────────────────── small helpers ─────────────────────── */

function SelectionChip({ label, color, onRemove }: { label: string; color: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}35` }}
    >
      {label}
      <button onClick={onRemove} className="opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

function MemberAvatar({ member }: { member: typeof MODAL_MEMBERS[0] }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-[10px] font-semibold flex-shrink-0"
      style={{
        width: 26, height: 26,
        backgroundColor: `${member.color}22`,
        color: member.color,
        border: `1px solid ${member.color}40`,
      }}
    >
      {member.initials}
    </span>
  );
}

/* ─────────────────────── create modal ─────────────────────── */

function CreateModal({ formData, setFormData, onClose, onCreate }: {
  formData: { title: string; type: string; poste: string };
  setFormData: (d: { title: string; type: string; poste: string }) => void;
  onClose: () => void;
  onCreate: (d: { title: string; type: string; poste: string }) => void;
}) {
  const [typeOpen, setTypeOpen] = useState(false);
  const [selMode, setSelMode] = useState('group');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const valid = formData.title.trim();
  const selectedType = TYPE_OPTIONS.find(o => o.value === formData.type);

  const toggleGroup  = (id: string) => setSelectedGroupIds(ids => ids.includes(id)  ? ids.filter(x => x !== id) : [...ids, id]);
  const togglePost   = (id: string) => setSelectedPostIds(ids  => ids.includes(id)  ? ids.filter(x => x !== id) : [...ids, id]);
  const toggleMember = (id: string) => setSelectedMemberIds(ids=> ids.includes(id)  ? ids.filter(x => x !== id) : [...ids, id]);

  const chips = useMemo(() => {
    const out: { key: string; label: string; color: string; kind: string }[] = [];
    STAFF_GROUPS.filter(g => selectedGroupIds.includes(g.id)).forEach(g => out.push({ key: g.id, label: g.label, color: g.color, kind: 'group' }));
    POST_GROUPS.filter(g => selectedPostIds.includes(g.id)).forEach(g => out.push({ key: g.id, label: g.label, color: g.color, kind: 'post' }));
    MODAL_MEMBERS.filter(m => selectedMemberIds.includes(m.id)).forEach(m => out.push({ key: m.id, label: m.name, color: m.color, kind: 'member' }));
    return out;
  }, [selectedGroupIds, selectedPostIds, selectedMemberIds]);

  const removeChip = (chip: typeof chips[0]) => {
    if (chip.kind === 'group')  setSelectedGroupIds(ids => ids.filter(x => x !== chip.key));
    if (chip.kind === 'post')   setSelectedPostIds(ids  => ids.filter(x => x !== chip.key));
    if (chip.kind === 'member') setSelectedMemberIds(ids=> ids.filter(x => x !== chip.key));
  };

  const filteredMembers = useMemo(() =>
    MODAL_MEMBERS.filter(m =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.post.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.group.toLowerCase().includes(memberSearch.toLowerCase())
    ), [memberSearch]);

  const groupedMembers = useMemo(() => {
    const map: Record<string, typeof MODAL_MEMBERS> = {};
    filteredMembers.forEach(m => { if (!map[m.group]) map[m.group] = []; map[m.group].push(m); });
    return map;
  }, [filteredMembers]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={() => setTypeOpen(false)}
    >
      <style>{`
        .sel-row { transition: background 0.1s; cursor: pointer; }
        .sel-row:hover { background: #1c1c1c !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>
      <div
        style={{
          width: '100%', maxWidth: 520,
          backgroundColor: '#141414',
          border: '1px solid #222',
          borderRadius: 16,
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={{ color: '#f0f0f0', fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px' }}>
              Nouveau document
            </h2>
            <button
              onClick={onClose}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'transparent', color: '#444', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#aaa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#444'; }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p style={{ color: '#444', fontSize: 11 }}>Créer un nouveau document pour le club</p>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Type dropdown */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#666', marginBottom: 8, letterSpacing: '0.04em' }}>
                TYPE DE DOCUMENT
              </label>
              <button
                type="button"
                onClick={() => setTypeOpen(!typeOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 10, border: '1px solid #252525',
                  backgroundColor: '#1a1a1a', color: formData.type ? '#e0e0e0' : '#444',
                  cursor: 'pointer', fontSize: 13,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selectedType && 'cfg' in selectedType && selectedType.cfg
                    ? <selectedType.cfg.Icon className="w-3.5 h-3.5" style={{ color: selectedType.cfg.color, flexShrink: 0 }} />
                    : <FileText className="w-3.5 h-3.5" style={{ color: '#444', flexShrink: 0 }} />
                  }
                  <span>{selectedType?.label ?? 'Sans type'}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: '#444', transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
              {typeOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
                  backgroundColor: '#1a1a1a', border: '1px solid #252525', borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)', overflow: 'hidden',
                }}>
                  {TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setFormData({ ...formData, type: opt.value }); setTypeOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px',
                        background: formData.type === opt.value ? '#202020' : 'transparent',
                        color: 'cfg' in opt && opt.cfg ? opt.cfg.color : '#555',
                        border: 'none', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                      }}
                      onMouseEnter={e => { if (formData.type !== opt.value) e.currentTarget.style.background = '#1e1e1e'; }}
                      onMouseLeave={e => { if (formData.type !== opt.value) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {'cfg' in opt && opt.cfg
                        ? <opt.cfg.Icon className="w-3.5 h-3.5" style={{ color: opt.cfg.color }} />
                        : <FileText className="w-3.5 h-3.5" style={{ color: '#444' }} />
                      }
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#666', marginBottom: 8, letterSpacing: '0.04em' }}>
                TITRE DU DOCUMENT <span style={{ color: '#e05353' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="ex. Règlement Intérieur 2025"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1px solid #252525', backgroundColor: '#1a1a1a',
                  color: '#e0e0e0', fontSize: 13, outline: 'none',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#0091ff'}
                onBlur={e => e.currentTarget.style.borderColor = '#252525'}
              />
            </div>

            {/* Members selector */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#666', marginBottom: 8, letterSpacing: '0.04em' }}>
                MEMBRES CONCERNÉS
              </label>
              <div style={{ border: '1px solid #222', borderRadius: 12, overflow: 'hidden', backgroundColor: '#111' }}>

                {/* Mode tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a', backgroundColor: '#0e0e0e' }}>
                  {SELECTION_MODES.map(m => {
                    const active = selMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelMode(m.id)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: 6, padding: '10px 8px',
                          background: active ? '#161616' : 'transparent',
                          borderBottom: active ? '1px solid #0091ff' : '1px solid transparent',
                          color: active ? '#e0e0e0' : '#444',
                          border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: active ? 600 : 400,
                          marginBottom: active ? -1 : 0,
                          transition: 'all 0.15s',
                        }}
                      >
                        <m.Icon className="w-3 h-3" style={{ color: active ? '#0091ff' : '#333' }} />
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                {/* Panel: Groupe Staff */}
                {selMode === 'group' && (
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ color: '#333', fontSize: 10, marginBottom: 4, paddingLeft: 2, letterSpacing: '0.04em' }}>
                      Sélectionner un ou plusieurs groupes
                    </p>
                    {STAFF_GROUPS.map(g => {
                      const active = selectedGroupIds.includes(g.id);
                      return (
                        <div
                          key={g.id}
                          className="sel-row"
                          onClick={() => toggleGroup(g.id)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 12px', borderRadius: 8,
                            background: active ? `${g.color}0d` : 'transparent',
                            border: `1px solid ${active ? g.color + '35' : 'transparent'}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 8, height: 8, borderRadius: '50%',
                              backgroundColor: g.color,
                              boxShadow: active ? `0 0 6px ${g.color}80` : 'none',
                              flexShrink: 0,
                            }} />
                            <span style={{ color: active ? '#e0e0e0' : '#777', fontSize: 13, fontWeight: active ? 500 : 400 }}>
                              {g.label}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontSize: 10, color: active ? g.color : '#333',
                              backgroundColor: active ? `${g.color}18` : '#1a1a1a',
                              padding: '2px 7px', borderRadius: 20,
                            }}>
                              {g.count} membres
                            </span>
                            <div style={{
                              width: 16, height: 16, borderRadius: 4,
                              border: `1.5px solid ${active ? g.color : '#333'}`,
                              backgroundColor: active ? g.color : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s',
                            }}>
                              {active && <Check className="w-2.5 h-2.5" style={{ color: '#fff' }} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Panel: Par Poste */}
                {selMode === 'post' && (
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ color: '#333', fontSize: 10, marginBottom: 4, paddingLeft: 2, letterSpacing: '0.04em' }}>
                      Sélectionner par catégorie de poste
                    </p>
                    {POST_GROUPS.map(g => {
                      const active = selectedPostIds.includes(g.id);
                      return (
                        <div
                          key={g.id}
                          className="sel-row"
                          onClick={() => togglePost(g.id)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '8px 12px', borderRadius: 8,
                            background: active ? `${g.color}0d` : 'transparent',
                            border: `1px solid ${active ? g.color + '35' : 'transparent'}`,
                          }}
                        >
                          <span style={{ color: active ? '#e0e0e0' : '#777', fontSize: 13, fontWeight: active ? 500 : 400 }}>
                            {g.label}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontSize: 10, color: active ? g.color : '#333',
                              backgroundColor: active ? `${g.color}18` : '#1a1a1a',
                              padding: '2px 7px', borderRadius: 20,
                            }}>
                              {g.count}
                            </span>
                            <div style={{
                              width: 16, height: 16, borderRadius: 4,
                              border: `1.5px solid ${active ? g.color : '#333'}`,
                              backgroundColor: active ? g.color : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s',
                            }}>
                              {active && <Check className="w-2.5 h-2.5" style={{ color: '#fff' }} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Panel: Individuel */}
                {selMode === 'member' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '1px solid #1a1a1a' }}>
                      <Search className="w-3 h-3" style={{ color: '#333', flexShrink: 0 }} />
                      <input
                        type="text"
                        value={memberSearch}
                        onChange={e => setMemberSearch(e.target.value)}
                        placeholder="Rechercher un membre..."
                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#d0d0d0', fontSize: 12, outline: 'none' }}
                      />
                      {memberSearch && (
                        <button onClick={() => setMemberSearch('')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                      {Object.entries(groupedMembers).map(([groupName, members]) => (
                        <div key={groupName}>
                          <div style={{ padding: '7px 12px 4px', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: '#2e2e2e', textTransform: 'uppercase' }}>
                            {groupName}
                          </div>
                          {members.map(m => {
                            const active = selectedMemberIds.includes(m.id);
                            return (
                              <div
                                key={m.id}
                                className="sel-row"
                                onClick={() => toggleMember(m.id)}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '6px 12px',
                                  background: active ? `${m.color}0d` : 'transparent',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                  <MemberAvatar member={m} />
                                  <div>
                                    <p style={{ color: active ? '#e0e0e0' : '#888', fontSize: 12, fontWeight: active ? 500 : 400, lineHeight: 1.3 }}>{m.name}</p>
                                    <p style={{ color: '#383838', fontSize: 10, lineHeight: 1.3 }}>{m.post}</p>
                                  </div>
                                </div>
                                <div style={{
                                  width: 15, height: 15, borderRadius: 4,
                                  border: `1.5px solid ${active ? m.color : '#2a2a2a'}`,
                                  backgroundColor: active ? m.color : 'transparent',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.15s', flexShrink: 0,
                                }}>
                                  {active && <Check className="w-2 h-2" style={{ color: '#fff' }} />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      {filteredMembers.length === 0 && (
                        <p style={{ color: '#333', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>Aucun membre trouvé</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Selection summary */}
                {chips.length > 0 ? (
                  <div style={{ borderTop: '1px solid #1a1a1a', padding: '10px 12px', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', backgroundColor: '#0e0e0e' }}>
                    <span style={{ fontSize: 10, color: '#333', marginRight: 2, flexShrink: 0 }}>
                      {chips.length} sélection{chips.length > 1 ? 's' : ''} :
                    </span>
                    {chips.map(c => (
                      <SelectionChip key={c.key} label={c.label} color={c.color} onRemove={() => removeChip(c)} />
                    ))}
                  </div>
                ) : (
                  <div style={{ borderTop: '1px solid #1a1a1a', padding: '8px 12px', backgroundColor: '#0e0e0e' }}>
                    <p style={{ fontSize: 10, color: '#2a2a2a', fontStyle: 'italic' }}>
                      Aucun membre sélectionné — document accessible à tous par défaut
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px 22px', display: 'flex', gap: 10, flexShrink: 0, borderTop: '1px solid #1a1a1a' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid #252525', backgroundColor: '#1a1a1a', color: '#666', fontSize: 13, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#202020'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
          >
            Annuler
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onCreate(formData)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 0', borderRadius: 10, border: 'none',
              backgroundColor: '#0091ff', color: '#fff', fontSize: 13, fontWeight: 500,
              opacity: valid ? 1 : 0.35, cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Créer le document
          </button>
        </div>
      </div>
    </div>
  );
}