import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import {
  Search, ChevronRight, X, Briefcase, BookOpen, FileText,
  Building2, GitBranch, CheckCircle2, Wrench, Target,
  Plus, Trash2, Edit3, Save, XCircle,
} from 'lucide-react';

type FicheStatus = 'Active' | 'Archived';
type ViewMode = 'pdf' | 'standard';

interface FicheDePosteData {
  id: number;
  jobTitle: string;
  department: string;
  reportsTo: string;
  status: FicheStatus;
  workConditions: string[];
  mainMissions: string[];
  requiredSkills: string[];
}

const SAMPLE_FICHES: FicheDePosteData[] = [
  {
    id: 1,
    jobTitle: 'Entraineur Principal Senior',
    department: 'Staff Technique',
    reportsTo: 'Directeur Sportif',
    status: 'Active',
    workConditions: [
      'Contrat à durée déterminée — saison sportive',
      'Présence obligatoire à tous les entraînements et matchs officiels',
      'Déplacements nationaux et internationaux selon le calendrier',
      'Disponibilité en dehors des horaires standards selon les besoins sportifs',
    ],
    mainMissions: [
      'Planifier, organiser et diriger l\'ensemble des séances d\'entraînement de l\'équipe senior',
      'Définir et mettre en œuvre la stratégie de jeu et les schémas tactiques du club',
      'Assurer le suivi individuel et collectif des joueurs sur le plan sportif et comportemental',
      'Collaborer avec le staff médical pour la gestion des blessures et la préparation physique',
      'Préparer et analyser les matchs adverses en vue des rencontres officielles',
      'Représenter le club lors des conférences de presse et événements officiels',
    ],
    requiredSkills: [
      'Diplôme UEFA Pro Licence ou équivalent reconnu',
      'Expérience minimale de 5 ans en tant qu\'entraîneur de niveau senior',
      'Maîtrise des outils d\'analyse vidéo (Wyscout, InStat ou équivalent)',
      'Excellentes capacités de communication et de leadership',
      'Connaissance approfondie des règlements FIFA et de la fédération nationale',
      'Maîtrise du français ; l\'anglais est un atout',
    ],
  },
  {
    id: 2,
    jobTitle: 'Préparateur Physique',
    department: 'Staff Technique',
    reportsTo: 'Entraineur Principal Senior',
    status: 'Active',
    workConditions: [
      'Contrat à durée déterminée — saison sportive',
      'Présence à tous les entraînements et matchs',
      'Travail en étroite collaboration avec le staff médical',
    ],
    mainMissions: [
      'Concevoir et superviser les programmes de préparation physique individuels et collectifs',
      'Évaluer régulièrement les capacités physiques des joueurs via des tests standardisés',
      'Coordonner la gestion de la charge d\'entraînement avec l\'entraîneur principal',
      'Assurer le suivi des retours de blessure en lien avec le staff médical',
    ],
    requiredSkills: [
      'Master en Sciences du Sport ou STAPS avec spécialisation haute performance',
      'Certification en préparation physique sportive professionnelle',
      'Maîtrise des outils GPS et de la data physique (STATSports, Catapult)',
      'Connaissance des protocoles de récupération et de prévention des blessures',
    ],
  },
  {
    id: 3,
    jobTitle: 'Médecin du Club',
    department: 'Staff Médical',
    reportsTo: 'Directeur Général',
    status: 'Active',
    workConditions: [
      'Contrat à durée déterminée renouvelable',
      'Présence aux entraînements et obligatoirement à tous les matchs officiels',
      'Astreinte disponible pour les urgences médicales liées au club',
    ],
    mainMissions: [
      'Assurer le suivi médical global de l\'ensemble des joueurs et du staff',
      'Diagnostiquer et traiter les blessures sportives, coordonner les soins spécialisés',
      'Valider les aptitudes médicales des joueurs avant chaque compétition',
      'Superviser la politique anti-dopage du club et gérer les contrôles',
      'Tenir à jour les dossiers médicaux confidentiels de l\'effectif',
    ],
    requiredSkills: [
      'Doctorat en médecine avec spécialisation en médecine du sport',
      'Expérience en milieu sportif professionnel exigée',
      'Certifications en traumatologie sportive et premiers secours avancés',
      'Rigueur, confidentialité et sens éthique irréprochables',
    ],
  },
  {
    id: 4,
    jobTitle: 'Responsable Recrutement',
    department: 'Direction Sportive',
    reportsTo: 'Directeur Sportif',
    status: 'Active',
    workConditions: [
      'CDI — statut cadre',
      'Nombreux déplacements en France et à l\'étranger pour le suivi des joueurs',
      'Travail en autonomie avec reporting hebdomadaire à la direction sportive',
    ],
    mainMissions: [
      'Identifier et évaluer les profils de joueurs correspondant aux besoins sportifs du club',
      'Construire et entretenir un réseau de contacts (agents, clubs, scouts)',
      'Rédiger des rapports de scouting détaillés et argumentés',
      'Négocier les conditions préliminaires des transferts en lien avec la direction',
      'Assurer une veille permanente sur le marché des transferts nationaux et internationaux',
    ],
    requiredSkills: [
      'Formation supérieure en management sportif ou équivalent',
      'Expérience significative en scouting ou recrutement dans le football professionnel',
      'Maîtrise des plateformes d\'analyse (Wyscout, Transfermarkt)',
      'Réseau établi dans le milieu footballistique',
      'Langues : français + anglais indispensables, espagnol ou portugais appréciés',
    ],
  },
];

const STATUS_CONFIG: Record<FicheStatus, { label: string; bg: string; text: string; border: string }> = {
  Active:   { label: 'Actif',    bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  Archived: { label: 'Archivé', bg: '#f8fafc', text: '#475569', border: '#cbd5e1' },
};

const DEPT_ACCENT: Record<string, string> = {
  'Staff Technique':   '#2563eb',
  'Staff Médical':     '#16a34a',
  'Direction Sportive':'#9333ea',
  'Administration':    '#ea580c',
};
const getAccent = (dept: string) => DEPT_ACCENT[dept] ?? '#374151';

const ViewToggle = ({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) => (
  <div
    className="print:hidden"
    style={{ display: 'inline-flex', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden', background: '#f9fafb' }}
  >
    {([
      { id: 'pdf' as ViewMode,      icon: <BookOpen size={12} />, label: 'Document' },
      { id: 'standard' as ViewMode, icon: <FileText size={12} />, label: 'Texte' },
    ] as const).map(({ id, icon, label }, i) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '5px 13px', fontSize: '11px', fontFamily: "'Arial', sans-serif",
          fontWeight: 600, letterSpacing: '0.03em', border: 'none',
          borderRight: i === 0 ? '1px solid #e5e7eb' : 'none',
          cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
          background: view === id ? '#111827' : 'transparent',
          color:      view === id ? '#ffffff' : '#6b7280',
        }}
      >
        {icon}{label}
      </button>
    ))}
  </div>
);

const EditModal = ({
  initial,
  onSave,
  onClose,
}: {
  initial: FicheDePosteData;
  onSave: (data: FicheDePosteData) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<FicheDePosteData>({ ...initial, workConditions: [...initial.workConditions], mainMissions: [...initial.mainMissions], requiredSkills: [...initial.requiredSkills] });

  const setField = <K extends keyof FicheDePosteData>(key: K, val: FicheDePosteData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setListItem = (key: 'workConditions' | 'mainMissions' | 'requiredSkills', i: number, val: string) =>
    setForm((f) => ({ ...f, [key]: f[key].map((x, j) => (j === i ? val : x)) }));
  const addListItem = (key: 'workConditions' | 'mainMissions' | 'requiredSkills') =>
    setForm((f) => ({ ...f, [key]: [...f[key], ''] }));
  const removeListItem = (key: 'workConditions' | 'mainMissions' | 'requiredSkills', i: number) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }));

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '7px 10px', fontSize: '13px',
    fontFamily: "'Georgia', serif", border: '1px solid #e5e7eb',
    borderRadius: '4px', color: '#111827', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: '#6b7280', fontFamily: "'Arial', sans-serif", marginBottom: '5px',
  };
  const sectionTitle = (icon: React.ReactNode, text: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0 10px' }}>
      <span style={{ color: '#374151' }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#374151', fontFamily: "'Arial', sans-serif" }}>{text}</span>
      <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
    </div>
  );
  const listEditor = (key: 'workConditions' | 'mainMissions' | 'requiredSkills') => (
    <div>
      {form[key].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'flex-start' }}>
          <span style={{ marginTop: '9px', color: '#9ca3af', flexShrink: 0 }}>•</span>
          <textarea
            value={item}
            rows={2}
            onChange={(e) => setListItem(key, i, e.target.value)}
            style={{ ...inputStyle, resize: 'vertical', flex: 1, lineHeight: 1.5 }}
          />
          <button
            onClick={() => removeListItem(key, i)}
            style={{ marginTop: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', flexShrink: 0 }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={() => addListItem(key)}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: "'Arial', sans-serif", fontWeight: 600, color: '#2563eb', background: 'none', border: '1px dashed #bfdbfe', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', marginTop: '4px' }}
      >
        <Plus size={11} /> Ajouter
      </button>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onMouseDown={onClose}>
      <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
        onMouseDown={(e) => e.stopPropagation()}>

        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafaf9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Edit3 size={18} style={{ color: '#374151' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: "'Georgia', serif" }}>Modifier la fiche de poste</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

          {sectionTitle(<Briefcase size={13} />, 'Informations générales')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Intitulé du poste</label>
              <input style={inputStyle} value={form.jobTitle} onChange={(e) => setField('jobTitle', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Département</label>
              <input style={inputStyle} value={form.department} onChange={(e) => setField('department', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Rattachement hiérarchique</label>
              <input style={inputStyle} value={form.reportsTo} onChange={(e) => setField('reportsTo', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Statut</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.status}
                onChange={(e) => setField('status', e.target.value as FicheStatus)}
              >
                <option value="Active">Actif</option>
                <option value="Archived">Archivé</option>
              </select>
            </div>
          </div>

          {sectionTitle(<Target size={13} />, 'Conditions de travail')}
          {listEditor('workConditions')}

          {sectionTitle(<CheckCircle2 size={13} />, 'Missions principales')}
          {listEditor('mainMissions')}

          {sectionTitle(<Wrench size={13} />, 'Compétences requises')}
          {listEditor('requiredSkills')}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#fafaf9' }}>
          <button
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '12px', fontFamily: "'Arial', sans-serif", fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: '5px', background: '#fff', color: '#6b7280', cursor: 'pointer' }}
          >
            <XCircle size={13} /> Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 18px', fontSize: '12px', fontFamily: "'Arial', sans-serif", fontWeight: 600, border: 'none', borderRadius: '5px', background: '#111827', color: '#fff', cursor: 'pointer' }}
          >
            <Save size={13} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectionModal = ({
  onSelect,
  onClose,
}: {
  onSelect: (f: FicheDePosteData) => void;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState('');
  const filtered = SAMPLE_FICHES.filter(
    (f) => !search || f.jobTitle.toLowerCase().includes(search.toLowerCase()) || f.department.toLowerCase().includes(search.toLowerCase()),
  );
  const depts = [...new Set(SAMPLE_FICHES.map((f) => f.department))];
  const [selDept, setSelDept] = useState<string | null>(null);
  const visible = filtered.filter((f) => !selDept || f.department === selDept);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onMouseDown={onClose}>
      <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '580px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}
        onMouseDown={(e) => e.stopPropagation()}>

        <div style={{ padding: '18px 22px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafaf9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={18} style={{ color: '#374151' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: "'Georgia', serif" }}>Insérer une fiche de poste</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '12px 22px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={15} style={{ color: '#9ca3af', flexShrink: 0 }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
            placeholder="Rechercher un poste..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', fontFamily: "'Georgia', serif", color: '#111827', background: 'transparent' }}
          />
        </div>

        <div style={{ padding: '10px 22px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid #f3f4f6' }}>
          {[null, ...depts].map((d) => (
            <button key={d ?? 'all'} onClick={() => setSelDept(d)}
              style={{ fontSize: '11px', fontFamily: "'Arial', sans-serif", fontWeight: 600, padding: '3px 10px', borderRadius: '999px', border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', background: selDept === d ? '#111827' : '#f9fafb', color: selDept === d ? '#fff' : '#6b7280', borderColor: selDept === d ? '#111827' : '#e5e7eb' }}>
              {d ?? 'Tous'}
            </button>
          ))}
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {visible.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Aucun poste trouvé</div>}
          {visible.map((f) => {
            const accent = getAccent(f.department);
            const sc = STATUS_CONFIG[f.status];
            return (
              <button key={f.id} onClick={() => onSelect(f)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 22px', background: 'none', border: 'none', borderBottom: '1px solid #f9fafb', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Briefcase size={16} style={{ color: accent }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', fontFamily: "'Georgia', serif" }}>{f.jobTitle}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 7px', borderRadius: '3px', border: `1px solid ${sc.border}`, background: sc.bg, color: sc.text, fontFamily: "'Arial', sans-serif" }}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#6b7280', fontFamily: "'Arial', sans-serif" }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Building2 size={10} />{f.department}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><GitBranch size={10} />{f.reportsTo}</span>
                  </div>
                </div>
                <ChevronRight size={15} style={{ color: '#d1d5db', flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PdfView = ({ data }: { data: FicheDePosteData }) => {
  const accent = getAccent(data.department);
  const sc = STATUS_CONFIG[data.status];

  const SectionHeading = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0 12px' }}>
      <span style={{ color: accent }}>{icon}</span>
      <span style={{ fontFamily: "'Arial', sans-serif", fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#374151' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: '#fff', border: '1px solid #d1d5db', borderTop: `4px solid ${accent}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07),0 10px 24px -4px rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden', maxWidth: '860px', margin: '0 auto' }}>

      <div style={{ background: '#fafaf9', borderBottom: '1px solid #e5e7eb', padding: '32px 48px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Arial', sans-serif", fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '14px' }}>
          Fiche de Poste
        </div>
        <div style={{ width: '40px', height: '3px', background: accent, margin: '0 auto 16px', borderRadius: '2px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>{data.jobTitle}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: "'Arial', sans-serif", background: accent + '12', color: accent, border: `1px solid ${accent}30`, borderRadius: '4px', padding: '4px 12px', fontWeight: 600 }}>
            <Building2 size={11} />{data.department}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: "'Arial', sans-serif", background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 12px', fontWeight: 600 }}>
            <GitBranch size={11} />Rattaché à : {data.reportsTo}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: "'Arial', sans-serif", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, borderRadius: '4px', padding: '4px 12px', fontWeight: 600 }}>
            <CheckCircle2 size={11} />{sc.label}
          </span>
        </div>
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right,transparent,#d1d5db 20%,#d1d5db 80%,transparent)' }} />
      </div>

      <div style={{ padding: '0 48px 36px' }}>

        <SectionHeading icon={<Target size={14} />} title="Conditions de travail" />
        <ul style={{ margin: 0, padding: '0 0 0 18px', listStyleType: 'none' }}>
          {data.workConditions.map((c, i) => (
            <li key={i} style={{ fontSize: '13px', color: '#374151', lineHeight: 1.75, paddingLeft: '14px', position: 'relative', marginBottom: '4px' }}>
              <span style={{ position: 'absolute', left: 0, top: '8px', width: '5px', height: '5px', borderRadius: '50%', background: accent, display: 'block' }} />
              {c}
            </li>
          ))}
        </ul>

        <SectionHeading icon={<CheckCircle2 size={14} />} title="Missions principales" />
        {data.mainMissions.map((m, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: '0 10px', marginBottom: '10px', alignItems: 'start' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Arial', sans-serif", fontSize: '10px', fontWeight: 800, color: accent, flexShrink: 0, marginTop: '1px' }}>
              {i + 1}
            </div>
            <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.75, margin: 0, textAlign: 'justify', hyphens: 'auto' }}>{m}</p>
          </div>
        ))}

        <SectionHeading icon={<Wrench size={14} />} title="Compétences requises" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {data.requiredSkills.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 12px', background: '#fafaf9', border: '1px solid #f3f4f6', borderRadius: '4px' }}>
              <span style={{ width: '16px', height: '16px', borderRadius: '3px', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                <CheckCircle2 size={10} color="#fff" />
              </span>
              <span style={{ fontSize: '12px', color: '#374151', lineHeight: 1.55 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fafaf9', borderTop: '1px solid #e5e7eb', padding: '10px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Arial', sans-serif", fontSize: '10px', color: '#9ca3af' }}>
          {data.mainMissions.length} missions · {data.requiredSkills.length} compétences
        </span>
        <span style={{ fontFamily: "'Arial', sans-serif", fontSize: '10px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Briefcase size={10} />Document officiel du club
        </span>
      </div>
    </div>
  );
};

const StandardView = ({ data }: { data: FicheDePosteData }) => {
  const sc = STATUS_CONFIG[data.status];
  return (
    <div style={{ fontFamily: 'inherit', color: '#111827', lineHeight: 1.7, maxWidth: '860px', margin: '0 auto', padding: '4px 0' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', lineHeight: 1.2 }}>{data.jobTitle}</h1>
      <h2 style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontStyle: 'italic', margin: '0 0 14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
        Fiche de Poste — {data.department}
      </h2>
      <ul style={{ listStyle: 'none', margin: '0 0 20px', padding: 0, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <li style={{ fontSize: '13px' }}><strong>Rattachement :</strong> {data.reportsTo}</li>
        <li style={{ fontSize: '13px' }}><strong>Statut :</strong> {sc.label}</li>
      </ul>

      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Conditions de travail</h3>
      <ul style={{ margin: '0 0 20px', paddingLeft: '18px' }}>
        {data.workConditions.map((c, i) => <li key={i} style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>{c}</li>)}
      </ul>

      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Missions principales</h3>
      <ol style={{ margin: '0 0 20px', paddingLeft: '18px' }}>
        {data.mainMissions.map((m, i) => <li key={i} style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', lineHeight: 1.7 }}>{m}</li>)}
      </ol>

      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Compétences requises</h3>
      <ul style={{ margin: 0, paddingLeft: '18px' }}>
        {data.requiredSkills.map((s, i) => <li key={i} style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>{s}</li>)}
      </ul>
    </div>
  );
};

const FicheDePosteBlockComponent = ({ node, updateAttributes }: any) => {
  const attrs = node.attrs;
  const [showSelectModal, setShowSelectModal] = useState(!attrs.ficheId);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [view, setView] = useState<ViewMode>('pdf');

  const hasFiche = !!attrs.ficheId;

  const applyFiche = (f: FicheDePosteData) =>
    updateAttributes({
      ficheId: f.id, ficheJobTitle: f.jobTitle, ficheDepartment: f.department,
      ficheReportsTo: f.reportsTo, ficheStatus: f.status,
      ficheWorkConditions: f.workConditions, ficheMainMissions: f.mainMissions,
      ficheRequiredSkills: f.requiredSkills,
    });

  const handleSelect = (f: FicheDePosteData) => { applyFiche(f); setShowSelectModal(false); };
  const handleSave   = (f: FicheDePosteData) => { applyFiche(f); setShowEditModal(false); };

  const currentData: FicheDePosteData | null = hasFiche
    ? {
        id: attrs.ficheId, jobTitle: attrs.ficheJobTitle, department: attrs.ficheDepartment,
        reportsTo: attrs.ficheReportsTo, status: attrs.ficheStatus,
        workConditions: attrs.ficheWorkConditions ?? [],
        mainMissions:   attrs.ficheMainMissions ?? [],
        requiredSkills: attrs.ficheRequiredSkills ?? [],
      }
    : null;

  return (
    <NodeViewWrapper as="div" className="fdp-block-wrapper">
      {showSelectModal && (
        <SelectionModal
          onSelect={handleSelect}
          onClose={() => { if (hasFiche) setShowSelectModal(false); }}
        />
      )}
      {showEditModal && currentData && (
        <EditModal
          initial={currentData}
          onSave={handleSave}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {currentData ? (
        <div>
          <div className="print:hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <ViewToggle view={view} onChange={setView} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setShowEditModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', fontSize: '11px', fontFamily: "'Arial', sans-serif", fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: '5px', background: '#fff', color: '#374151', cursor: 'pointer' }}
              >
                <Edit3 size={12} /> Modifier
              </button>
              <button
                onClick={() => setShowSelectModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', fontSize: '11px', fontFamily: "'Arial', sans-serif", fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: '5px', background: '#fff', color: '#374151', cursor: 'pointer' }}
              >
                <Briefcase size={12} /> Changer
              </button>
            </div>
          </div>
          {view === 'pdf' ? <PdfView data={currentData} /> : <StandardView data={currentData} />}
        </div>
      ) : (
        <div
          onClick={() => setShowSelectModal(true)}
          style={{ border: '2px dashed #e5e7eb', borderRadius: '6px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', color: '#9ca3af', background: '#fafaf9', transition: 'border-color 0.2s, background 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.background = '#f3f4f6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fafaf9'; }}
        >
          <Briefcase size={32} strokeWidth={1.5} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151', fontFamily: "'Georgia', serif" }}>Insérer une fiche de poste</span>
          <span style={{ fontSize: '12px', fontFamily: "'Arial', sans-serif" }}>Cliquez pour sélectionner un poste du club</span>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export const FicheDePosteBlock = Node.create({
  name: 'ficheDePosteBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      ficheId:             { default: null },
      ficheJobTitle:       { default: '' },
      ficheDepartment:     { default: '' },
      ficheReportsTo:      { default: '' },
      ficheStatus:         { default: 'Active' },
      ficheWorkConditions: { default: [] },
      ficheMainMissions:   { default: [] },
      ficheRequiredSkills: { default: [] },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="fiche-de-poste-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'fiche-de-poste-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FicheDePosteBlockComponent);
  },

  addCommands() {
    return {
      setFicheDePosteBlock:
        () =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name }),
    } as any;
  },
});
