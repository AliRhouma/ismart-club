import { useState } from 'react';
import {
  X, Shield, Mail, Phone, MapPin, Calendar, Award, Briefcase,
  CheckCircle2, Clock, AlertCircle, Layers, ListTodo, FolderOpen,
  FileText, BookOpen, Edit3, Download, ExternalLink, ChevronRight,
  RefreshCw, Check, ArrowRight, Users,
  MessageSquare, BarChart2, User, Target,
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, ClipboardList,
} from 'lucide-react';

// ─── Member ───────────────────────────────────────────────────────────────────
const mockMember = {
  name: "Jacer Khaled",
  initials: "JK",
  title: "Entraîneur Principal",
  department: "Commission Technique",
  email: "jacer.khaled@club.tn",
  phone: "+216 55 234 789",
  location: "Tunis, Tunisie",
  joinedAt: "4 mars 2024",
  contractType: "CDI Temps plein",
  status: "active",
  avatarColor: "#0091FF",
};

// ─── Roles (commission technique responsibilities) ─────────────────────────────
const initialRoles = [
  { id: 'r1', text: "Diriger et planifier les séances d'entraînement des équipes seniors" },
  { id: 'r2', text: "Assurer le suivi technique et tactique des joueurs sous sa responsabilité" },
  { id: 'r3', text: "Gérer les convocations et la préparation des matchs (feuilles de match, stratégie)" },
  { id: 'r4', text: "Participer aux réunions techniques de la Commission Technique" },
  { id: 'r5', text: "Contribuer au plan de formation et au développement des éducateurs du club" },
  { id: 'r6', text: "Veiller à l'application de la charte du club lors des entraînements et compétitions" },
  { id: 'r7', text: "Rédiger des rapports d'analyse après chaque match pour la direction technique" },
];

// ─── Projects ────────────────────────────────────────────────────────────────
const mockProjects = [
  {
    id: 'p1',
    name: "Suivi Technique & Politique Sportive",
    color: "#0091FF",
    progress: 58,
    tasksCompleted: 3,
    tasksTotal: 6,
    role: "Responsable Technique",
    status: "active",
  },
  {
    id: 'p2',
    name: "Formation & Développement Éducateurs",
    color: "#f59e0b",
    progress: 40,
    tasksCompleted: 2,
    tasksTotal: 5,
    role: "Contributeur",
    status: "active",
  },
  {
    id: 'p3',
    name: "Recrutement & Détection Jeunes",
    color: "#46A758",
    progress: 20,
    tasksCompleted: 1,
    tasksTotal: 5,
    role: "Observateur",
    status: "active",
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────
const mockTasks = [
  { id: 't1', name: "Rapport de suivi de la politique technique",    project: "Suivi Technique & Politique Sportive",  status: 'completed',   priority: 'high',   dueDate: "Jan 30, 2026" },
  { id: 't2', name: "Gestion des convocations — Équipe Seniors",      project: "Suivi Technique & Politique Sportive",  status: 'in-progress', priority: 'high',   dueDate: "Fév 10, 2026" },
  { id: 't3', name: "Préparation tactique — Match vs ES Sahel",       project: "Suivi Technique & Politique Sportive",  status: 'in-progress', priority: 'high',   dueDate: "Fév 8, 2026"  },
  { id: 't4', name: "Réunion technique mensuelle des éducateurs",     project: "Formation & Développement Éducateurs",  status: 'completed',   priority: 'medium', dueDate: "Jan 28, 2026" },
  { id: 't5', name: "Analyse vidéo — Séance tactique défensive",      project: "Suivi Technique & Politique Sportive",  status: 'todo',        priority: 'medium', dueDate: "Fév 15, 2026" },
  { id: 't6', name: "Vérification de l'application des chartes",      project: "Suivi Technique & Politique Sportive",  status: 'todo',        priority: 'low',    dueDate: "Fév 22, 2026" },
];

// ─── Subtasks ─────────────────────────────────────────────────────────────────
const mockSubtaskGroups = [
  {
    taskName: "Rapport de suivi de la politique technique",
    project: "Suivi Technique & Politique Sportive",
    subtasks: [
      { id: 's1', name: "Collecte des données des 3 derniers matchs",       completed: true  },
      { id: 's2', name: "Analyse des écarts vs objectifs de la saison",      completed: true  },
      { id: 's3', name: "Rédaction du rapport pour la direction technique",  completed: true  },
    ],
  },
  {
    taskName: "Gestion des convocations — Équipe Seniors",
    project: "Suivi Technique & Politique Sportive",
    subtasks: [
      { id: 's4', name: "Vérification des disponibilités des joueurs",       completed: true  },
      { id: 's5', name: "Envoi des convocations officielles",                 completed: false },
      { id: 's6', name: "Validation avec le médecin du club",                 completed: false },
    ],
  },
  {
    taskName: "Préparation tactique — Match vs ES Sahel",
    project: "Suivi Technique & Politique Sportive",
    subtasks: [
      { id: 's7', name: "Analyse vidéo de l'adversaire",                     completed: false },
      { id: 's8', name: "Préparation du plan de jeu et des schémas tactiques",completed: false },
      { id: 's9', name: "Briefing des joueurs la veille du match",            completed: false },
    ],
  },
];

// ─── Fiche de Poste ───────────────────────────────────────────────────────────
const ficheDePoste = {
  title: "Entraîneur Principal",
  department: "Commission Technique",
  reportingTo: "Bilel Mansour — Directeur Technique",
  contractType: "CDI Temps plein",
  updatedAt: "15 jan. 2026",
  mission: "Diriger l'ensemble des activités d'entraînement des équipes seniors, assurer la mise en œuvre de la politique technique du club, et contribuer activement au développement sportif des joueurs et des éducateurs sous la supervision de la Commission Technique.",
  responsibilities: [
    "Planifier, organiser et conduire les séances d'entraînement selon le calendrier sportif",
    "Analyser les performances individuelles et collectives et produire des rapports pour la direction",
    "Gérer les convocations, les feuilles de match et la logistique des déplacements",
    "Encadrer et mentorer les éducateurs juniors du club",
    "Veiller au respect de la charte éthique et du règlement intérieur lors des entraînements",
    "Participer aux réunions techniques mensuelles de la Commission Technique",
    "Collaborer avec le staff médical pour le suivi physique et la prévention des blessures",
  ],
};

// ─── Règlement ────────────────────────────────────────────────────────────────
const reglement = {
  updatedAt: "1 fév. 2026",
  signedAt: "10 mars 2024",
  sections: [
    {
      id: 'reg1',
      title: "Horaires & Présence",
      icon: "clock",
      color: "#0091FF",
      articles: [
        { id: 'a1', num: "1.1", text: "Les séances d'entraînement doivent débuter à l'heure fixée par le planning de la Commission Technique." },
        { id: 'a2', num: "1.2", text: "Toute absence doit être signalée au Directeur Technique au minimum 24 heures à l'avance." },
        { id: 'a3', num: "1.3", text: "La présence aux réunions techniques mensuelles est obligatoire pour tous les membres de la commission." },
      ],
    },
    {
      id: 'reg2',
      title: "Code de Conduite",
      icon: "shield",
      color: "#46A758",
      articles: [
        { id: 'a4', num: "2.1", text: "Un comportement exemplaire est attendu de tous les membres du staff vis-à-vis des joueurs, des parents et des arbitres." },
        { id: 'a5', num: "2.2", text: "Les informations confidentielles sur les joueurs et les stratégies ne doivent pas être divulguées à l'extérieur du club." },
        { id: 'a6', num: "2.3", text: "Tout conflit entre membres du staff doit être remonté au Directeur Technique avant toute escalade." },
      ],
    },
    {
      id: 'reg3',
      title: "Communication & Réunions",
      icon: "message",
      color: "#2EC8EE",
      articles: [
        { id: 'a7', num: "3.1", text: "Un ordre du jour doit être partagé 30 minutes avant chaque réunion technique." },
        { id: 'a8', num: "3.2", text: "Les messages internes entre membres du staff doivent recevoir une réponse dans les 2 heures ouvrées." },
      ],
    },
    {
      id: 'reg4',
      title: "Évaluation & Performance",
      icon: "bar",
      color: "#f59e0b",
      articles: [
        { id: 'a9',  num: "4.1", text: "Une évaluation trimestrielle est conduite par le Directeur Technique pour chaque membre du staff." },
        { id: 'a10', num: "4.2", text: "Les objectifs sportifs de la saison sont définis en début de saison et révisés à mi-parcours." },
        { id: 'a11', num: "4.3", text: "Les contributions exceptionnelles sont récompensées lors de la Cérémonie de Fin de Saison du club." },
      ],
    },
  ],
};

// ─── Constants ────────────────────────────────────────────────────────────────
const BLUE  = '#0091FF';
const GREEN = '#46A758';
const RED   = '#E5484D';
const AMBER = '#f59e0b';

// ─── Shared UI ────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    completed:    { label: 'Terminé',  bg: `${GREEN}1E`, color: GREEN, border: `${GREEN}40`, Icon: CheckCircle2 },
    'in-progress':{ label: 'En cours', bg: `${BLUE}1A`,  color: BLUE,  border: `${BLUE}33`,  Icon: Clock },
    todo:         { label: 'À faire',  bg: '#A3A3A31A',  color: '#737373', border: '#A3A3A333', Icon: AlertCircle },
  };
  const { label, bg, color, border, Icon } = map[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const colors = { high: RED, medium: AMBER, low: GREEN };
  const labels = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: colors[priority] }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors[priority] }} />
      {labels[priority]}
    </span>
  );
}

function RegIcon({ icon, color }) {
  const map = {
    clock:   <Clock className="w-4 h-4" />,
    shield:  <Shield className="w-4 h-4" />,
    message: <MessageSquare className="w-4 h-4" />,
    bar:     <BarChart2 className="w-4 h-4" />,
  };
  return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: color + '18', border: `1px solid ${color}33`, color }}>
      {map[icon] ?? <FileText className="w-4 h-4" />}
    </div>
  );
}

// ─── Roles Panel (styled like GroupPreviewModal) ──────────────────────────────
function RolesPanel() {
  const [roles, setRoles] = useState(initialRoles);
  const [collapsed, setCollapsed] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newText, setNewText] = useState('');

  const startEdit = (role) => { setEditingId(role.id); setEditText(role.text); setDeletingId(null); };
  const saveEdit = () => {
    if (!editText.trim()) return;
    setRoles(r => r.map(x => x.id === editingId ? { ...x, text: editText.trim() } : x));
    setEditingId(null);
  };
  const addRole = () => {
    if (!newText.trim()) return;
    setRoles(r => [...r, { id: 'r' + Date.now(), text: newText.trim() }]);
    setNewText(''); setAddingNew(false);
  };

  return (
    <div>
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" style={{ color: BLUE }} />
          <h3 className="text-heading-3 text-default-font">Rôles & Responsabilités</h3>
          <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-caption text-subtext-color">{roles.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAddingNew(true); setCollapsed(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold text-white hover:opacity-85 transition-opacity"
            style={{ background: BLUE }}>
            <Plus className="w-3.5 h-3.5" />Ajouter
          </button>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-subtext-color">
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="rounded-xl border border-neutral-200 overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: BLUE }}>
          {/* Add new */}
          {addingNew && (
            <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ background: BLUE, fontSize: 10 }}>
                <Plus className="w-3 h-3" />
              </div>
              <textarea autoFocus rows={2} value={newText} onChange={e => setNewText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addRole(); } if (e.key === 'Escape') { setAddingNew(false); setNewText(''); } }}
                placeholder="Saisir un nouveau rôle…"
                className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-body text-default-font outline-none resize-none placeholder:text-subtext-color" />
              <div className="flex flex-col gap-1.5">
                <button onClick={addRole} className="px-3 py-1.5 rounded-lg text-white" style={{ background: GREEN }}><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => { setAddingNew(false); setNewText(''); }} className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-subtext-color"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="bg-neutral-100 divide-y divide-neutral-200">
            {roles.map((role, idx) => (
              <div key={role.id}>
                {deletingId === role.id ? (
                  <div className="flex items-center gap-3 px-4 py-3" style={{ background: `${RED}0D`, borderLeft: `3px solid ${RED}` }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />
                    <span className="flex-1 text-body" style={{ color: RED }}>Supprimer ce rôle ?</span>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => setDeletingId(null)} className="px-2.5 py-1 rounded text-caption-bold bg-neutral-100 border border-neutral-200 text-default-font">Annuler</button>
                      <button onClick={() => { setRoles(r => r.filter(x => x.id !== role.id)); setDeletingId(null); }}
                        className="px-2.5 py-1 rounded text-caption-bold text-white" style={{ background: RED }}>Supprimer</button>
                    </div>
                  </div>
                ) : editingId === role.id ? (
                  <div className="flex items-start gap-3 px-4 py-3 bg-white">
                    <div className="mt-1 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold" style={{ background: AMBER, fontSize: 10 }}>{idx + 1}</div>
                    <textarea autoFocus rows={2} value={editText} onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); } if (e.key === 'Escape') setEditingId(null); }}
                      className="flex-1 bg-neutral-50 border border-amber-300 rounded-lg px-3 py-2 text-body text-default-font outline-none resize-none" />
                    <div className="flex flex-col gap-1.5">
                      <button onClick={saveEdit} className="px-3 py-1.5 rounded-lg text-white" style={{ background: GREEN }}><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-subtext-color"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors group">
                    <div className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold" style={{ background: BLUE, fontSize: 10 }}>{idx + 1}</div>
                    <span className="flex-1 text-body text-default-font leading-relaxed">{role.text}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => startEdit(role)} className="p-1.5 rounded-lg hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all" style={{ color: AMBER }}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setDeletingId(role.id); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition-all" style={{ color: RED }}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TAB_CONFIG = [
  { id: 'roles',     label: 'Rôles',          Icon: Award      },
  { id: 'projects',  label: 'Projets',         Icon: FolderOpen },
  { id: 'tasks',     label: 'Tâches',          Icon: ListTodo   },
  { id: 'subtasks',  label: 'Sous-tâches',     Icon: Layers     },
  { id: 'fiche',     label: 'Fiche de Poste',  Icon: FileText   },
  { id: 'reglement', label: 'Règlement',        Icon: BookOpen   },
];

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function MemberPreviewModal({ isOpen = true, onClose = () => {} }) {
  const [activeTab, setActiveTab] = useState('roles');
  const [expandedReg, setExpandedReg] = useState('reg1');

  if (!isOpen) return null;

  const totalSubtasks     = mockSubtaskGroups.reduce((s, g) => s + g.subtasks.length, 0);
  const completedSubtasks = mockSubtaskGroups.reduce((s, g) => s + g.subtasks.filter(st => st.completed).length, 0);
  const activeTasks       = mockTasks.filter(t => t.status !== 'completed').length;
  const completedTasks    = mockTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-50 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>

        {/* ── HEADER ── */}
        <div className="relative flex-shrink-0 border-b border-neutral-200 overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(ellipse at top left, ${mockMember.avatarColor} 0%, transparent 60%)` }} />

          <div className="relative px-6 py-5 flex items-start gap-5 pr-14">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                style={{ background: `linear-gradient(135deg, ${mockMember.avatarColor} 0%, #005FC2 100%)` }}>
                {mockMember.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-50" style={{ background: GREEN }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-heading-2 text-default-font">{mockMember.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-caption-bold"
                  style={{ background: `${GREEN}1E`, color: GREEN, border: `1px solid ${GREEN}40` }}>
                  Actif
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <Briefcase className="w-3.5 h-3.5 text-subtext-color" />
                <span className="text-body text-subtext-color">{mockMember.title}</span>
                <span className="text-subtext-color">·</span>
                <Users className="w-3.5 h-3.5 text-subtext-color" />
                <span className="text-body text-subtext-color">{mockMember.department}</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockMember.email}</span></div>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockMember.phone}</span></div>
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockMember.location}</span></div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">Rejoint le {mockMember.joinedAt}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 mt-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-100 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all">
                <Edit3 className="w-3.5 h-3.5" />Modifier
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-100 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all">
                <MessageSquare className="w-3.5 h-3.5" />Message
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative px-6 pb-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" style={{ color: AMBER }} /><span className="text-caption text-subtext-color">{initialRoles.length} rôles</span></div>
            <div className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockProjects.length} projets</span></div>
            <div className="flex items-center gap-1.5"><ListTodo className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{activeTasks} en cours, {completedTasks} terminées</span></div>
            <div className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{completedSubtasks}/{totalSubtasks} sous-tâches</span></div>
            <div className="flex items-center gap-1.5 ml-auto"><Shield className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockMember.contractType}</span></div>
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-subtext-color" />
          </button>
        </div>

        {/* ── TABS ── */}
        <div className="flex-shrink-0 border-b border-neutral-200 bg-neutral-100 px-6 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {TAB_CONFIG.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="relative flex items-center gap-1.5 px-3 py-3 text-caption-bold transition-all whitespace-nowrap"
                  style={{ color: active ? BLUE : 'rgb(163,163,163)' }}>
                  <Icon className="w-3.5 h-3.5" />{label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: BLUE }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6">

          {/* ROLES — styled exactly like GroupPreviewModal roles panel */}
          {activeTab === 'roles' && <RolesPanel />}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {mockProjects.map(proj => (
                <div key={proj.id}
                  className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: proj.color + '18', border: `1px solid ${proj.color}33` }}>
                      <FolderOpen className="w-5 h-5" style={{ color: proj.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-body-bold text-default-font truncate">{proj.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                            style={{ background: proj.color + '18', color: proj.color, border: `1px solid ${proj.color}33` }}>
                            {proj.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all">
                            <ExternalLink className="w-3 h-3" />Ouvrir
                          </button>
                          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 transition-all">
                            <RefreshCw className="w-3 h-3" />Réaffecter
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-caption text-subtext-color">Progression</span>
                            <span className="text-caption font-semibold" style={{ color: proj.color }}>{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-150 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${proj.progress}%`, background: proj.color }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-caption text-subtext-color flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: GREEN }} />
                          {proj.tasksCompleted}/{proj.tasksTotal} tâches
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-2">
              {mockTasks.map(task => (
                <div key={task.id}
                  className="bg-neutral-100 border border-neutral-200 rounded-lg p-3.5 hover:border-neutral-300 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {task.status === 'completed'    ? <CheckCircle2 className="w-4 h-4" style={{ color: GREEN }} />
                       : task.status === 'in-progress' ? <Clock className="w-4 h-4" style={{ color: BLUE }} />
                       : <AlertCircle className="w-4 h-4 text-subtext-color" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-body text-default-font font-medium">{task.name}</div>
                          <div className="text-caption text-subtext-color mt-0.5">{task.project}</div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all">
                            <RefreshCw className="w-3 h-3" />Réaffecter
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <StatusBadge status={task.status} />
                        <PriorityDot priority={task.priority} />
                        <div className="flex items-center gap-1 ml-auto">
                          <Calendar className="w-3 h-3 text-subtext-color" />
                          <span className="text-caption text-subtext-color">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUBTASKS */}
          {activeTab === 'subtasks' && (
            <div className="space-y-6">
              {mockSubtaskGroups.map(group => (
                <div key={group.taskName}>
                  <div className="flex items-center gap-2 mb-3 px-0.5">
                    <Layers className="w-3.5 h-3.5 text-subtext-color flex-shrink-0" />
                    <span className="text-caption-bold text-subtext-color uppercase tracking-wide whitespace-nowrap">{group.taskName}</span>
                    <span className="text-caption text-subtext-color ml-0.5">— {group.project}</span>
                    <div className="flex-1 h-px bg-neutral-200 ml-1" />
                    <span className="text-caption text-subtext-color ml-1 flex-shrink-0">
                      {group.subtasks.filter(s => s.completed).length}/{group.subtasks.length}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {group.subtasks.map(subtask => (
                      <div key={subtask.id}
                        className="bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2.5 hover:border-neutral-300 transition-all group flex items-center gap-3">
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                          style={subtask.completed
                            ? { background: GREEN, borderColor: GREEN }
                            : { background: 'transparent', borderColor: 'rgb(82,82,82)' }}>
                          {subtask.completed && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`flex-1 text-body min-w-0 ${subtask.completed ? 'line-through text-subtext-color' : 'text-default-font'}`}>
                          {subtask.name}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 flex-shrink-0">
                          <button className="flex items-center gap-1 px-2 py-1 rounded text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all">
                            <RefreshCw className="w-3 h-3" />Réaffecter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FICHE DE POSTE — overview only, no sub-tabs */}
          {activeTab === 'fiche' && (
            <div className="space-y-5">
              {/* Fiche header card */}
              <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${BLUE}1A`, border: `1px solid ${BLUE}33` }}>
                      <FileText className="w-6 h-6" style={{ color: BLUE }} />
                    </div>
                    <div>
                      <div className="text-heading-3 text-default-font mb-0.5">{ficheDePoste.title}</div>
                      <div className="text-caption text-subtext-color">{ficheDePoste.department}</div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-subtext-color" /><span className="text-caption text-subtext-color">{ficheDePoste.reportingTo}</span></div>
                        <div className="flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-subtext-color" /><span className="text-caption text-subtext-color">{ficheDePoste.contractType}</span></div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-subtext-color" /><span className="text-caption text-subtext-color">Mis à jour le {ficheDePoste.updatedAt}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all">
                      <Download className="w-3.5 h-3.5" />PDF
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold text-white hover:opacity-90 transition-opacity"
                      style={{ background: BLUE }}>
                      <Edit3 className="w-3.5 h-3.5" />Modifier
                    </button>
                  </div>
                </div>
              </div>

              {/* Mission */}
              <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" style={{ color: BLUE }} />
                  <h4 className="text-heading-3 text-default-font">Mission</h4>
                </div>
                <p className="text-body text-subtext-color leading-relaxed">{ficheDePoste.mission}</p>
              </div>

              {/* Responsibilities */}
              <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4" style={{ color: GREEN }} />
                  <h4 className="text-heading-3 text-default-font">Responsabilités principales</h4>
                </div>
                <ul className="space-y-2.5">
                  {ficheDePoste.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${GREEN}1E`, border: `1px solid ${GREEN}40` }}>
                        <span className="text-xs font-bold" style={{ color: GREEN }}>{i + 1}</span>
                      </div>
                      <span className="text-body text-subtext-color">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* RÈGLEMENT */}
          {activeTab === 'reglement' && (
            <div>
              {/* Reg header */}
              <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${GREEN}1A`, border: `1px solid ${GREEN}33` }}>
                    <BookOpen className="w-5 h-5" style={{ color: GREEN }} />
                  </div>
                  <div>
                    <div className="text-body-bold text-default-font">Règlement Intérieur</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-caption text-subtext-color">Mis à jour le {reglement.updatedAt}</span>
                      <span className="flex items-center gap-1 text-caption" style={{ color: GREEN }}>
                        <Check className="w-3 h-3" />Signé le {reglement.signedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 transition-all">
                    <Download className="w-3.5 h-3.5" />PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />Envoyer pour signature
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {reglement.sections.map(section => (
                  <div key={section.id} className="bg-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedReg(expandedReg === section.id ? null : section.id)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-neutral-150 transition-colors">
                      <RegIcon icon={section.icon} color={section.color} />
                      <div className="flex-1 min-w-0">
                        <div className="text-body-bold text-default-font">{section.title}</div>
                        <div className="text-caption text-subtext-color">{section.articles.length} articles</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-subtext-color flex-shrink-0 transition-transform"
                        style={{ transform: expandedReg === section.id ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                    </button>

                    {expandedReg === section.id && (
                      <div className="border-t border-neutral-200 divide-y divide-neutral-200">
                        {section.articles.map(article => (
                          <div key={article.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-neutral-50 transition-colors">
                            <span className="text-caption-bold flex-shrink-0 mt-0.5 w-8" style={{ color: section.color }}>{article.num}</span>
                            <p className="text-body text-subtext-color leading-relaxed flex-1">{article.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="flex-shrink-0 border-t border-neutral-200 bg-neutral-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-subtext-color" />
            <span className="text-caption text-subtext-color">Mode aperçu — les modifications nécessitent une confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all">
              <ExternalLink className="w-3.5 h-3.5" />Voir le profil complet
            </button>
            <button onClick={onClose}
              className="px-4 py-2 rounded-lg text-body text-default-font bg-neutral-50 border border-neutral-200 hover:bg-neutral-150 transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}