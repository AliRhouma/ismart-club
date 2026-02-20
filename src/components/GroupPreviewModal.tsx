import { useState } from 'react';
import {
  X, Crown, UserPlus, Trash2, Edit3, Check, ChevronRight,
  Trophy, Users, Clock, CheckCircle2, AlertCircle,
  ArrowRight, Search, FolderOpen, ListTodo, Layers, RefreshCw, Shield,
  Plus, Pencil, ClipboardList, ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── Roles ───────────────────────────────────────────────────────────────────
const initialRoles = [
  { id: 'r1',  text: "Effectuer un suivi de la politique technique mise en place" },
  { id: 'r2',  text: "Gérer l'ensemble des équipes du club (Matchs, rassemblements…)" },
  { id: 'r3',  text: "Gérer les effectifs et le suivi des convocations" },
  { id: 'r4',  text: "Réaliser des réunions techniques et d'aides aux éducateurs" },
  { id: 'r5',  text: "Veiller à l'application des chartes" },
  { id: 'r6',  text: "Etablir un plan de formation des éducateurs" },
  { id: 'r7',  text: "Suivre et soutenir les éducateurs du club" },
  { id: 'r8',  text: "Etablir un suivi des joueurs" },
  { id: 'r9',  text: "Organiser des journées de recrutement, des journées portes ouvertes" },
  { id: 'r10', text: "Repérer certains jeunes joueurs afin de les recruter" },
];

// ─── Group meta ───────────────────────────────────────────────────────────────
const mockGroup = {
  name: "Commission Technique",
  description: "Organe de pilotage technique du club, responsable de la politique sportive, de la gestion des équipes, du suivi des joueurs et du développement des éducateurs.",
  badge: "Technique",
  createdAt: "Jan 12, 2026",
  totalTasks: 16,
  completedTasks: 6,
};

const mockManager = {
  name: "Bilel Mansour",
  role: "Directeur Technique",
  initials: "BM",
  joinedAt: "Jan 12, 2026",
};

// ─── Members (roles matching the commission's actual functions) ───────────────
const mockMembers = [
  { id: 'm1', name: "Jacer Khaled",   role: "Entraîneur Principal",    initials: "JK", tasksCount: 3 },
  { id: 'm2', name: "Amira Benali",   role: "Coordinatrice Sportive",  initials: "AB", tasksCount: 3 },
  { id: 'm3', name: "Sami Trabelsi",  role: "Responsable Formation",   initials: "ST", tasksCount: 3 },
  { id: 'm4', name: "Nour Jebali",    role: "Éducateur Jeunes",        initials: "NJ", tasksCount: 2 },
  { id: 'm5', name: "Youssef Gharbi", role: "Responsable Recrutement", initials: "YG", tasksCount: 3 },
  { id: 'm6', name: "Karim Bouzid",   role: "Analyste Vidéo & Scout",  initials: "KB", tasksCount: 2 },
];

const availableToAdd = [
  { id: 'a1', name: "Leila Amor",    role: "Préparatrice Physique",   initials: "LA" },
  { id: 'a2', name: "Fatma Sassi",   role: "Médecin du Club",         initials: "FS" },
  { id: 'a3', name: "Rania Meddeb",  role: "Responsable des Chartes", initials: "RM" },
  { id: 'a4', name: "Tarek Bellili", role: "Scout Régional",          initials: "TB" },
];

// ─── Projects (3 clusters matching the 10 roles) ──────────────────────────────
const mockProjects = [
  {
    id: 'p1',
    name: "Suivi Technique & Politique Sportive",
    description: "Pilotage de la politique technique, application des chartes et gestion des équipes",
    color: "#0091FF",
    progress: 58,
    tasksTotal: 6,
    tasksCompleted: 3,
    departments: ["Coaching", "Équipes", "Chartes"],
    assignee: "Bilel Mansour",
  },
  {
    id: 'p2',
    name: "Formation & Développement Éducateurs",
    description: "Plan de formation, réunions techniques et soutien des éducateurs du club",
    color: "#f59e0b",
    progress: 40,
    tasksTotal: 5,
    tasksCompleted: 2,
    departments: ["Formation", "Éducateurs"],
    assignee: "Sami Trabelsi",
  },
  {
    id: 'p3',
    name: "Recrutement & Détection Jeunes",
    description: "Journées de recrutement, portes ouvertes et repérage de jeunes talents",
    color: "#46A758",
    progress: 20,
    tasksTotal: 5,
    tasksCompleted: 1,
    departments: ["Scouting", "Détection", "Recrutement"],
    assignee: "Youssef Gharbi",
  },
];

// ─── Tasks (11 tasks mapped to the 10 commission roles) ──────────────────────
const mockTasks = [
  { id: 't1',  name: "Rapport de suivi de la politique technique",      project: "Suivi Technique & Politique Sportive",  status: 'completed',   priority: 'high',   assignee: "Bilel Mansour",  dueDate: "Jan 30, 2026" },
  { id: 't2',  name: "Gestion des convocations — Équipe Seniors",        project: "Suivi Technique & Politique Sportive",  status: 'in-progress', priority: 'high',   assignee: "Jacer Khaled",   dueDate: "Fév 10, 2026" },
  { id: 't3',  name: "Mise à jour des effectifs & liste des joueurs",    project: "Suivi Technique & Politique Sportive",  status: 'in-progress', priority: 'medium', assignee: "Amira Benali",   dueDate: "Fév 14, 2026" },
  { id: 't4',  name: "Vérification de l'application des chartes",        project: "Suivi Technique & Politique Sportive",  status: 'todo',        priority: 'medium', assignee: "Amira Benali",   dueDate: "Fév 22, 2026" },
  { id: 't5',  name: "Coordination matchs & rassemblements — Saison",   project: "Suivi Technique & Politique Sportive",  status: 'completed',   priority: 'high',   assignee: "Jacer Khaled",   dueDate: "Jan 25, 2026" },
  { id: 't6',  name: "Réunion technique mensuelle des éducateurs",       project: "Formation & Développement Éducateurs",  status: 'completed',   priority: 'high',   assignee: "Sami Trabelsi",  dueDate: "Jan 28, 2026" },
  { id: 't7',  name: "Plan de formation des éducateurs — Saison 2026",  project: "Formation & Développement Éducateurs",  status: 'in-progress', priority: 'high',   assignee: "Sami Trabelsi",  dueDate: "Fév 18, 2026" },
  { id: 't8',  name: "Suivi individuel des éducateurs du club",          project: "Formation & Développement Éducateurs",  status: 'todo',        priority: 'medium', assignee: "Nour Jebali",    dueDate: "Fév 25, 2026" },
  { id: 't9',  name: "Fiches de suivi des performances joueurs",         project: "Formation & Développement Éducateurs",  status: 'completed',   priority: 'medium', assignee: "Nour Jebali",    dueDate: "Jan 25, 2026" },
  { id: 't10', name: "Organisation journée portes ouvertes",             project: "Recrutement & Détection Jeunes",        status: 'in-progress', priority: 'high',   assignee: "Youssef Gharbi", dueDate: "Fév 28, 2026" },
  { id: 't11', name: "Session de détection jeunes — U15 & U17",         project: "Recrutement & Détection Jeunes",        status: 'todo',        priority: 'high',   assignee: "Karim Bouzid",   dueDate: "Mar 5, 2026"  },
  { id: 't12', name: "Liste des jeunes talents repérés — Région Nord",  project: "Recrutement & Détection Jeunes",        status: 'completed',   priority: 'low',    assignee: "Youssef Gharbi", dueDate: "Jan 20, 2026" },
];

// ─── Subtasks (grouped under key tasks) ──────────────────────────────────────
const mockSubtaskGroups = [
  {
    taskName: "Rapport de suivi de la politique technique",
    subtasks: [
      { id: 'st1', name: "Collecte des données techniques des 3 derniers matchs",  completed: true,  assignee: "Bilel Mansour" },
      { id: 'st2', name: "Analyse des écarts vs objectifs de la saison",           completed: true,  assignee: "Jacer Khaled"  },
      { id: 'st3', name: "Rédaction du rapport de synthèse pour la direction",     completed: true,  assignee: "Amira Benali"  },
    ],
  },
  {
    taskName: "Plan de formation des éducateurs — Saison 2026",
    subtasks: [
      { id: 'st4', name: "Identification des besoins en formation par éducateur",    completed: true,  assignee: "Sami Trabelsi"  },
      { id: 'st5', name: "Planification des sessions et intervenants externes",      completed: false, assignee: "Sami Trabelsi"  },
      { id: 'st6', name: "Validation du calendrier de formation avec la direction",  completed: false, assignee: "Bilel Mansour"  },
      { id: 'st7', name: "Envoi des convocations aux éducateurs concernés",          completed: false, assignee: "Amira Benali"   },
    ],
  },
  {
    taskName: "Organisation journée portes ouvertes",
    subtasks: [
      { id: 'st8',  name: "Définition de la date et du lieu",                       completed: true,  assignee: "Youssef Gharbi" },
      { id: 'st9',  name: "Préparation des supports de communication",              completed: false, assignee: "Karim Bouzid"   },
      { id: 'st10', name: "Coordination avec les éducateurs pour les ateliers",     completed: false, assignee: "Nour Jebali"    },
      { id: 'st11', name: "Mise en place des critères d'évaluation des jeunes",     completed: false, assignee: "Jacer Khaled"   },
    ],
  },
  {
    taskName: "Session de détection jeunes — U15 & U17",
    subtasks: [
      { id: 'st12', name: "Sélection des terrains et créneaux horaires",            completed: false, assignee: "Karim Bouzid"   },
      { id: 'st13', name: "Préparation des fiches d'observation individuelles",     completed: false, assignee: "Nour Jebali"    },
      { id: 'st14', name: "Invitation des jeunes joueurs repérés en amont",         completed: false, assignee: "Youssef Gharbi" },
    ],
  },
];

// ─── Theme ────────────────────────────────────────────────────────────────────
const AMBER = '#f59e0b';
const AMBER_BG = 'rgba(245,158,11,0.08)';
const AMBER_BORDER = 'rgba(245,158,11,0.25)';
const BLUE = '#0091FF';
const GREEN = '#46A758';
const RED = '#E5484D';

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Avatar({ initials, color = BLUE, size = 9 }) {
  const px = size * 4;
  return (
    <div className="flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0"
      style={{ width: px, height: px, background: color, fontSize: px * 0.35 }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed:    { label: 'Terminé',  bg: `${GREEN}1E`, color: GREEN, border: `${GREEN}40`, Icon: CheckCircle2 },
    'in-progress':{ label: 'En cours', bg: `${BLUE}1A`,  color: BLUE,  border: `${BLUE}33`,  Icon: Clock },
    todo:         { label: 'À faire',  bg: '#A3A3A31A',  color: '#A3A3A3', border: '#A3A3A333', Icon: AlertCircle },
  };
  const { label, bg, color, border, Icon } = map[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    high:   { label: 'Haute',  bg: `${RED}1A`,   color: RED,   border: `${RED}33`   },
    medium: { label: 'Moyenne',bg: `${AMBER}1A`, color: AMBER, border: `${AMBER}33` },
    low:    { label: 'Basse',  bg: `${GREEN}1A`, color: GREEN, border: `${GREEN}33` },
  };
  const { label, bg, color, border } = map[priority];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  );
}

// ─── Roles Panel ──────────────────────────────────────────────────────────────
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
    <div className="mx-6 mt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" style={{ color: BLUE }} />
          <h3 className="text-heading-3 text-default-font">Rôles de la Commission</h3>
          <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-caption text-subtext-color">{roles.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setAddingNew(true); setCollapsed(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold text-white hover:opacity-85 transition-opacity"
            style={{ background: BLUE }}>
            <Plus className="w-3.5 h-3.5" />Ajouter
          </button>
          <button onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-subtext-color">
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="rounded-xl border border-neutral-200 overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: BLUE }}>
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

// ─── Reassign Overlay ─────────────────────────────────────────────────────────
function ReassignOverlay({ reassigning, onCancel, onConfirm }) {
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState(null);
  if (!reassigning) return null;

  const handleCancel  = () => { setStep(1); setTarget(null); onCancel();  };
  const handleConfirm = () => { setStep(1); setTarget(null); onConfirm(); };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
      <div className="bg-neutral-50 rounded-lg w-full max-w-sm border border-neutral-200 overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="text-heading-3 text-default-font">{step === 1 ? 'Réaffecter' : 'Confirmer la réaffectation'}</div>
            <div className="text-caption text-subtext-color mt-0.5 truncate max-w-[220px]">{reassigning.name}</div>
          </div>
          <button onClick={handleCancel} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"><X className="w-4 h-4 text-subtext-color" /></button>
        </div>
        {step === 1 ? (
          <div className="p-4">
            <div className="text-caption text-subtext-color mb-3">Choisir un nouveau responsable :</div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {mockMembers.map(member => (
                <button key={member.id} onClick={() => { setTarget(member.name); setStep(2); }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-neutral-200 hover:border-brand-600 bg-neutral-100 hover:bg-brand-50 transition-all text-left group">
                  <Avatar initials={member.initials} size={8} />
                  <div className="flex-1 min-w-0">
                    <div className="text-body text-default-font font-medium truncate">{member.name}</div>
                    <div className="text-caption text-subtext-color">{member.role}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-subtext-color opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-brand-600" />
                <span className="text-caption-bold text-brand-600 uppercase tracking-wide">Résumé</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-caption text-subtext-color w-24 flex-shrink-0">Élément</span>
                  <span className="text-caption text-default-font">{reassigning.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-caption text-subtext-color w-24 flex-shrink-0">Nouveau responsable</span>
                  <span className="text-caption text-default-font font-medium">{target}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setStep(1); setTarget(null); }} className="flex-1 py-2 rounded-lg text-body text-default-font bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors">Retour</button>
              <button onClick={handleConfirm} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors">
                <Check className="w-4 h-4" />Confirmer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function GroupPreviewModal({ isOpen = true, onClose = () => {} }) {
  const [activeTab, setActiveTab] = useState('projects');
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [showAddMemberPopover, setShowAddMemberPopover] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState('');
  const [editingManager, setEditingManager] = useState(false);
  const [selectedNewManager, setSelectedNewManager] = useState(null);
  const [reassigning, setReassigning] = useState(null);

  if (!isOpen) return null;

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const completionPercent = Math.round((mockGroup.completedTasks / mockGroup.totalTasks) * 100);
  const totalSubtasks = mockSubtaskGroups.reduce((s, g) => s + g.subtasks.length, 0);
  const filteredAddMembers = availableToAdd.filter(m =>
    m.name.toLowerCase().includes(addMemberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(addMemberSearch.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-neutral-50 rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>

          {/* ── HEADER ── */}
          <div className="relative flex-shrink-0 bg-neutral-100 border-b border-neutral-200 px-6 py-5">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-150 rounded-lg transition-colors">
              <X className="w-5 h-5 text-subtext-color" />
            </button>
            <div className="flex items-start gap-5 pr-12">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #005FC2 100%)` }}>
                CT
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1.5">
                  <h2 className="text-heading-2 text-default-font">{mockGroup.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-caption-bold"
                    style={{ background: `${BLUE}1F`, color: BLUE, border: `1px solid ${BLUE}40` }}>
                    {mockGroup.badge}
                  </span>
                </div>
                <p className="text-body text-subtext-color mb-4 leading-relaxed">{mockGroup.description}</p>
                <div className="flex items-center gap-5 flex-wrap">
                  <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockMembers.length + 1} membres</span></div>
                  <div className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockProjects.length} projets</span></div>
                  <div className="flex items-center gap-1.5"><ListTodo className="w-3.5 h-3.5 text-subtext-color" /><span className="text-caption text-subtext-color">{mockGroup.totalTasks} tâches</span></div>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-neutral-150 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${completionPercent}%`, background: GREEN }} />
                    </div>
                    <span className="text-caption font-medium" style={{ color: GREEN }}>{completionPercent}%</span>
                  </div>
                  <span className="text-caption text-subtext-color">Créé le {mockGroup.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="flex-1 overflow-y-auto min-h-0">

            <RolesPanel />

            {/* Manager */}
            <div className="mx-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4" style={{ color: AMBER }} />
                <h3 className="text-heading-3 text-default-font">Responsable du Groupe</h3>
              </div>
              <div className="rounded-lg border border-neutral-200 overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: AMBER }}>
                <div className="bg-neutral-100 px-5 py-4">
                  {!editingManager ? (
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: AMBER }}>BM</div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: AMBER }}><Crown className="w-3 h-3 text-white" /></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-body-bold text-default-font">{mockManager.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: AMBER_BG, color: AMBER, border: `1px solid ${AMBER_BORDER}` }}>Responsable</span>
                        </div>
                        <div className="text-caption text-subtext-color">{mockManager.role}</div>
                        <div className="text-caption text-subtext-color">Membre depuis {mockManager.joinedAt}</div>
                      </div>
                      <button onClick={() => { setEditingManager(true); setSelectedNewManager(null); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-caption-bold transition-all hover:opacity-80 flex-shrink-0"
                        style={{ background: AMBER_BG, color: AMBER, border: `1px solid ${AMBER_BORDER}` }}>
                        <Edit3 className="w-3.5 h-3.5" />Modifier
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" style={{ color: AMBER }} />
                          <span className="text-body-bold text-default-font">Promouvoir un membre</span>
                        </div>
                        <button onClick={() => { setEditingManager(false); setSelectedNewManager(null); }} className="text-caption text-subtext-color hover:text-default-font">Annuler</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {mockMembers.map(member => (
                          <button key={member.id} onClick={() => setSelectedNewManager(member.name)}
                            className="flex items-center gap-3 p-3 rounded-lg border transition-all text-left"
                            style={selectedNewManager === member.name
                              ? { borderColor: AMBER, background: `${AMBER}12` }
                              : { borderColor: 'rgb(37,37,37)', background: 'rgb(19,19,19)' }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-caption-bold flex-shrink-0"
                              style={{ background: selectedNewManager === member.name ? AMBER : BLUE }}>
                              {member.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-body text-default-font truncate">{member.name}</div>
                              <div className="text-caption text-subtext-color truncate">{member.role}</div>
                            </div>
                            {selectedNewManager === member.name && <Check className="w-4 h-4 flex-shrink-0" style={{ color: AMBER }} />}
                          </button>
                        ))}
                      </div>
                      {selectedNewManager
                        ? <button onClick={() => { setEditingManager(false); setSelectedNewManager(null); }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-body-bold text-white hover:opacity-90"
                            style={{ background: AMBER }}>
                            <Crown className="w-4 h-4" />Promouvoir {selectedNewManager}
                          </button>
                        : <div className="text-center text-caption text-subtext-color py-1">Sélectionner un membre ci-dessus</div>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="mx-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-subtext-color" />
                <h3 className="text-heading-3 text-default-font">Membres</h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-caption text-subtext-color">{mockMembers.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {mockMembers.map(member => (
                  <div key={member.id}>
                    {deletingMemberId === member.id ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg border-2" style={{ borderColor: RED, background: `${RED}0F` }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-caption-bold flex-shrink-0" style={{ background: RED }}>{member.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-body text-default-font font-medium">{member.name}</div>
                          <div className="text-caption" style={{ color: RED }}>Retirer du groupe ?</div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => setDeletingMemberId(null)} className="px-2.5 py-1 rounded text-caption-bold bg-neutral-100 border border-neutral-200 text-default-font">Annuler</button>
                          <button onClick={() => setDeletingMemberId(null)} className="px-2.5 py-1 rounded text-caption-bold text-white" style={{ background: RED }}>Retirer</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-100 hover:border-neutral-300 transition-all group">
                        <Avatar initials={member.initials} size={9} />
                        <div className="flex-1 min-w-0">
                          <div className="text-body text-default-font font-medium truncate">{member.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-caption text-subtext-color truncate">{member.role}</span>
                            <span className="px-1.5 py-0.5 rounded text-xs flex-shrink-0" style={{ background: `${BLUE}14`, color: BLUE }}>{member.tasksCount} tâches</span>
                          </div>
                        </div>
                        <button onClick={() => setDeletingMemberId(member.id)} className="p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0" style={{ color: RED }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Add member */}
              <div className="relative">
                <button onClick={() => { setShowAddMemberPopover(!showAddMemberPopover); setAddMemberSearch(''); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-neutral-300 text-caption-bold text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all"
                  style={showAddMemberPopover ? { borderColor: BLUE, color: BLUE, background: `${BLUE}0D` } : {}}>
                  <UserPlus className="w-4 h-4" />Ajouter un membre
                </button>
                {showAddMemberPopover && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden z-10" style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.4)' }}>
                    <div className="p-3 border-b border-neutral-200">
                      <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2">
                        <Search className="w-3.5 h-3.5 text-subtext-color flex-shrink-0" />
                        <input type="text" placeholder="Rechercher…" value={addMemberSearch} onChange={e => setAddMemberSearch(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-caption text-default-font placeholder:text-subtext-color" autoFocus />
                      </div>
                    </div>
                    <div className="max-h-44 overflow-y-auto p-2 space-y-1">
                      {filteredAddMembers.length > 0
                        ? filteredAddMembers.map(m => (
                          <button key={m.id} onClick={() => setShowAddMemberPopover(false)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-600 transition-all text-left">
                            <Avatar initials={m.initials} color={GREEN} size={8} />
                            <div className="flex-1 min-w-0">
                              <div className="text-body text-default-font font-medium truncate">{m.name}</div>
                              <div className="text-caption text-subtext-color">{m.role}</div>
                            </div>
                            <UserPlus className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                          </button>
                        ))
                        : <div className="text-center py-5 text-caption text-subtext-color">Aucun résultat</div>
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="mx-6 mt-6 mb-6">
              <div className="flex items-center p-1 bg-neutral-100 border border-neutral-200 rounded-lg mb-4 gap-1">
                {(['projects', 'tasks', 'subtasks']).map(tab => {
                  const count  = tab === 'projects' ? mockProjects.length : tab === 'tasks' ? mockTasks.length : totalSubtasks;
                  const labels = { projects: 'Projets', tasks: 'Tâches', subtasks: 'Sous-tâches' };
                  const icons  = { projects: <FolderOpen className="w-3.5 h-3.5" />, tasks: <ListTodo className="w-3.5 h-3.5" />, subtasks: <Layers className="w-3.5 h-3.5" /> };
                  const active = activeTab === tab;
                  return (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-caption-bold transition-all"
                      style={active ? { background: 'rgb(24,24,24)', color: 'rgb(250,250,250)', border: '1px solid rgb(37,37,37)' } : { color: 'rgb(163,163,163)' }}>
                      {icons[tab]}<span>{labels[tab]}</span>
                      <span className="px-1.5 py-0.5 rounded text-xs" style={active ? { background: BLUE, color: 'white' } : { background: 'rgb(48,48,48)', color: 'rgb(163,163,163)' }}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Projects */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {mockProjects.map(proj => (
                    <div key={proj.id} className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-all group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: proj.color + '18', border: `1px solid ${proj.color}33` }}>
                          <Trophy className="w-5 h-5" style={{ color: proj.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div className="min-w-0">
                              <div className="text-body-bold text-default-font">{proj.name}</div>
                              <div className="text-caption text-subtext-color mt-0.5">{proj.description}</div>
                            </div>
                            <button onClick={() => setReassigning({ id: proj.id, type: 'project', name: proj.name })}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                              <RefreshCw className="w-3 h-3" />Réaffecter
                            </button>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
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
                          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            {proj.departments.map(dept => (
                              <span key={dept} className="px-2 py-0.5 rounded bg-neutral-150 text-caption text-subtext-color">{dept}</span>
                            ))}
                            <div className="flex items-center gap-1.5 ml-auto">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: BLUE, fontSize: 9, fontWeight: 700 }}>{getInitials(proj.assignee)}</div>
                              <span className="text-caption text-subtext-color">{proj.assignee}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {activeTab === 'tasks' && (
                <div className="space-y-2">
                  {mockTasks.map(task => (
                    <div key={task.id} className="bg-neutral-100 border border-neutral-200 rounded-lg p-3.5 hover:border-neutral-300 transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {task.status === 'completed' ? <CheckCircle2 className="w-4 h-4" style={{ color: GREEN }} />
                           : task.status === 'in-progress' ? <Clock className="w-4 h-4" style={{ color: BLUE }} />
                           : <AlertCircle className="w-4 h-4 text-subtext-color" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-body text-default-font font-medium">{task.name}</div>
                              <div className="text-caption text-subtext-color mt-0.5">{task.project}</div>
                            </div>
                            <button onClick={() => setReassigning({ id: task.id, type: 'task', name: task.name })}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                              <RefreshCw className="w-3 h-3" />Réaffecter
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                            <div className="flex items-center gap-1.5 ml-auto">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: BLUE, fontSize: 9, fontWeight: 700 }}>{getInitials(task.assignee)}</div>
                              <span className="text-caption text-subtext-color">{task.assignee}</span>
                              <span className="text-caption text-subtext-color">·</span>
                              <span className="text-caption text-subtext-color">{task.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtasks */}
              {activeTab === 'subtasks' && (
                <div className="space-y-5">
                  {mockSubtaskGroups.map(group => (
                    <div key={group.taskName}>
                      <div className="flex items-center gap-2 mb-2 px-0.5">
                        <Layers className="w-3.5 h-3.5 text-subtext-color flex-shrink-0" />
                        <span className="text-caption-bold text-subtext-color uppercase tracking-wide whitespace-nowrap">{group.taskName}</span>
                        <div className="flex-1 h-px bg-neutral-200 ml-1" />
                        <span className="text-caption text-subtext-color ml-1 flex-shrink-0">{group.subtasks.filter(s => s.completed).length}/{group.subtasks.length}</span>
                      </div>
                      <div className="space-y-1.5">
                        {group.subtasks.map(subtask => (
                          <div key={subtask.id} className="bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2.5 hover:border-neutral-300 transition-all group flex items-center gap-3">
                            <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                              style={subtask.completed ? { background: GREEN, borderColor: GREEN } : { background: 'transparent', borderColor: 'rgb(82,82,82)' }}>
                              {subtask.completed && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`flex-1 text-body min-w-0 ${subtask.completed ? 'line-through text-subtext-color' : 'text-default-font'}`}>
                              {subtask.name}
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: BLUE, fontSize: 9, fontWeight: 700 }}>{getInitials(subtask.assignee)}</div>
                                <span className="text-caption text-subtext-color whitespace-nowrap">{subtask.assignee}</span>
                              </div>
                              <button onClick={() => setReassigning({ id: subtask.id, type: 'subtask', name: subtask.name })}
                                className="flex items-center gap-1 px-2 py-1 rounded text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all">
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
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="flex-shrink-0 border-t border-neutral-200 px-6 py-4 bg-neutral-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-subtext-color" />
              <span className="text-caption text-subtext-color">Mode aperçu — les modifications nécessitent une confirmation</span>
            </div>
            <button onClick={onClose} className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors">Fermer</button>
          </div>
        </div>
      </div>

      <ReassignOverlay
        reassigning={reassigning}
        onCancel={() => setReassigning(null)}
        onConfirm={() => setReassigning(null)}
      />
    </>
  );
}