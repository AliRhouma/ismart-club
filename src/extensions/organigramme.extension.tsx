import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState, useCallback } from 'react';
import {
  X, BookOpen, FileText, Edit3, Save, XCircle,
  Plus, Trash2, ChevronDown, Network, Users,
  GitBranch, UserCircle2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'pdf' | 'standard';

interface GroupMember {
  id: string;
  name: string;
  role?: string;
}

interface OrgNode {
  id: string;
  groupName: string;
  leader: string;
  department?: string;
  members: GroupMember[];
  children: OrgNode[];
}

interface OrgChartData {
  id: number;
  label: string;
  root: OrgNode;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_ORGS: OrgChartData[] = [
  {
    id: 1,
    label: 'Organigramme Club — Saison 2025-26',
    root: {
      id: 'g1',
      groupName: 'Direction Générale',
      leader: 'Mohamed Karim',
      department: 'Direction',
      members: [
        { id: 'm1', name: 'Sami Trabelsi', role: 'Directeur Général' },
        { id: 'm2', name: 'Amira Jebali', role: 'Secrétaire Générale' },
      ],
      children: [
        {
          id: 'g2',
          groupName: 'Direction Sportive',
          leader: 'Bilel Mzoughi',
          department: 'Sportif',
          members: [
            { id: 'm3', name: 'Sofiane Dridi', role: 'Responsable Recrutement' },
            { id: 'm4', name: 'Nabil Kacem', role: 'Analyste Vidéo' },
          ],
          children: [
            {
              id: 'g3',
              groupName: 'Staff Technique',
              leader: 'Riadh Ben Ali',
              department: 'Staff Technique',
              members: [
                { id: 'm5', name: 'Hassen Slim', role: 'Entraîneur Adjoint' },
                { id: 'm6', name: 'Fares Amri', role: 'Préparateur Physique' },
                { id: 'm7', name: 'Khaled Bougha', role: 'Entraîneur Gardiens' },
              ],
              children: [],
            },
          ],
        },
        {
          id: 'g4',
          groupName: 'Administration',
          leader: 'Leila Gharbi',
          department: 'Administration',
          members: [
            { id: 'm8', name: 'Anis Ferjani', role: 'Responsable Financier' },
            { id: 'm9', name: 'Sara Ben Salah', role: 'Gestionnaire RH' },
          ],
          children: [
            {
              id: 'g5',
              groupName: 'Communication',
              leader: 'Rim Chaabane',
              department: 'Communication',
              members: [
                { id: 'm10', name: 'Yassine Mejri', role: 'Community Manager' },
                { id: 'm11', name: 'Dorra Hadj', role: 'Graphiste' },
              ],
              children: [],
            },
          ],
        },
        {
          id: 'g6',
          groupName: 'Équipe Médicale',
          leader: 'Dr. Youssef Ayari',
          department: 'Médical',
          members: [
            { id: 'm12', name: 'Ines Mbarki', role: 'Kinésithérapeute' },
            { id: 'm13', name: 'Ahmed Triki', role: 'Préparateur Mental' },
          ],
          children: [],
        },
      ],
    },
  },
  {
    id: 2,
    label: 'Structure Académie',
    root: {
      id: 'a1',
      groupName: 'Académie du Club',
      leader: 'Mehdi Jouini',
      department: 'Académie',
      members: [
        { id: 'ma1', name: 'Karim Oueslati', role: 'Coordinateur Administratif' },
      ],
      children: [
        {
          id: 'a2',
          groupName: 'Équipe U21',
          leader: 'Omar Ferchichi',
          department: 'Académie',
          members: [
            { id: 'ma2', name: 'Wassim Tlili', role: 'Assistant Coach' },
            { id: 'ma3', name: 'Sonia Mansour', role: 'Préparatrice Physique' },
          ],
          children: [],
        },
        {
          id: 'a3',
          groupName: 'Équipe U18',
          leader: 'Tarek Ghanem',
          department: 'Académie',
          members: [
            { id: 'ma4', name: 'Faouzi Gharbi', role: 'Assistant Coach' },
            { id: 'ma5', name: 'Lina Baklouti', role: 'Nutritionniste' },
          ],
          children: [],
        },
      ],
    },
  },
];

// ─── Department color map ─────────────────────────────────────────────────────

const DEPT_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  'Direction':       { bg: '#1e1b4b', text: '#fff',    accent: '#6366f1' },
  'Sportif':         { bg: '#1e3a5f', text: '#fff',    accent: '#2563eb' },
  'Staff Technique': { bg: '#14532d', text: '#fff',    accent: '#16a34a' },
  'Médical':         { bg: '#7f1d1d', text: '#fff',    accent: '#dc2626' },
  'Administration':  { bg: '#1c1917', text: '#fff',    accent: '#78716c' },
  'Communication':   { bg: '#78350f', text: '#fff',    accent: '#d97706' },
  'Académie':        { bg: '#4c1d95', text: '#fff',    accent: '#9333ea' },
};
const getDeptColor = (dept?: string) =>
  DEPT_COLORS[dept ?? ''] ?? { bg: '#1f2937', text: '#fff', accent: '#374151' };

// ─── Unique ID helper ─────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Deep clone ───────────────────────────────────────────────────────────────

const cloneNode = (n: OrgNode): OrgNode => ({ ...n, children: n.children.map(cloneNode) });

// ─── View Toggle ──────────────────────────────────────────────────────────────

const ViewToggle = ({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) => (
  <div className="print:hidden" style={{ display: 'inline-flex', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden', background: '#f9fafb' }}>
    {([
      { id: 'pdf' as ViewMode,      icon: <BookOpen size={12} />, label: 'Document' },
      { id: 'standard' as ViewMode, icon: <FileText size={12} />, label: 'Texte' },
    ] as const).map(({ id, icon, label }, i) => (
      <button key={id} onClick={() => onChange(id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 13px', fontSize: '11px', fontFamily: "'Arial',sans-serif", fontWeight: 600, letterSpacing: '0.03em', border: 'none', borderRight: i === 0 ? '1px solid #e5e7eb' : 'none', cursor: 'pointer', background: view === id ? '#111827' : 'transparent', color: view === id ? '#fff' : '#6b7280' }}>
        {icon}{label}
      </button>
    ))}
  </div>
);

// ─── Edit Modal: node editor (recursive) ──────────────────────────────────────

const NodeEditor = ({
  node,
  onChange,
  onDelete,
  depth = 0,
}: {
  node: OrgNode;
  onChange: (updated: OrgNode) => void;
  onDelete?: () => void;
  depth?: number;
}) => {
  const [open, setOpen] = useState(depth < 2);

  const setField = (key: keyof OrgNode, val: string) => onChange({ ...node, [key]: val });

  const updateChild = (i: number, updated: OrgNode) =>
    onChange({ ...node, children: node.children.map((c, j) => (j === i ? updated : c)) });

  const addChild = () =>
    onChange({ ...node, children: [...node.children, { id: uid(), groupName: '', leader: '', department: node.department, members: [], children: [] }] });

  const removeChild = (i: number) =>
    onChange({ ...node, children: node.children.filter((_, j) => j !== i) });

  const addMember = () =>
    onChange({ ...node, members: [...node.members, { id: uid(), name: '', role: '' }] });

  const updateMember = (i: number, field: keyof GroupMember, value: string) =>
    onChange({ ...node, members: node.members.map((m, j) => (j === i ? { ...m, [field]: value } : m)) });

  const removeMember = (i: number) =>
    onChange({ ...node, members: node.members.filter((_, j) => j !== i) });

  const deptColor = getDeptColor(node.department);
  const inputStyle: React.CSSProperties = {
    flex: 1, padding: '5px 8px', fontSize: '12px', fontFamily: "'Georgia',serif",
    border: '1px solid #e5e7eb', borderRadius: '4px', color: '#111827',
    background: '#fff', outline: 'none', minWidth: 0,
  };

  return (
    <div style={{ marginLeft: depth > 0 ? '20px' : 0, borderLeft: depth > 0 ? `2px solid ${deptColor.accent}30` : 'none', paddingLeft: depth > 0 ? '12px' : 0, marginBottom: '6px' }}>
      {/* Group row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fafaf9', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 10px', marginBottom: (node.children.length > 0 || node.members.length > 0) && open ? '6px' : 0 }}>
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', flexShrink: 0 }}>
          <ChevronDown size={14} style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
        </button>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: deptColor.accent, flexShrink: 0 }} />
        <input style={inputStyle} value={node.groupName} onChange={(e) => setField('groupName', e.target.value)} placeholder="Nom du groupe" />
        <input style={inputStyle} value={node.leader} onChange={(e) => setField('leader', e.target.value)} placeholder="Chef de groupe" />
        <input style={{ ...inputStyle, maxWidth: '130px' }} value={node.department ?? ''} onChange={(e) => setField('department', e.target.value)} placeholder="Département" />
        <button onClick={addChild} title="Ajouter un sous-groupe" style={{ background: 'none', border: '1px solid #bbf7d0', borderRadius: '4px', cursor: 'pointer', color: '#16a34a', padding: '3px 6px', display: 'flex', flexShrink: 0 }}>
          <Plus size={12} />
        </button>
        {onDelete && (
          <button onClick={onDelete} title="Supprimer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', display: 'flex', flexShrink: 0 }}>
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Members */}
      {open && node.members.length > 0 && (
        <div style={{ marginLeft: '26px', marginBottom: '8px', padding: '8px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={10} /> Membres
          </div>
          {node.members.map((member, i) => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={member.name}
                onChange={(e) => updateMember(i, 'name', e.target.value)}
                placeholder="Nom du membre"
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={member.role ?? ''}
                onChange={(e) => updateMember(i, 'role', e.target.value)}
                placeholder="Rôle"
              />
              <button onClick={() => removeMember(i)} title="Retirer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', display: 'flex', flexShrink: 0 }}>
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add member button */}
      {open && (
        <button
          onClick={addMember}
          style={{ marginLeft: '26px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '10px', fontFamily: "'Arial',sans-serif", fontWeight: 600, border: '1px dashed #d1d5db', borderRadius: '4px', background: '#fff', color: '#6b7280', cursor: 'pointer' }}
        >
          <Plus size={10} /> Ajouter un membre
        </button>
      )}

      {/* Children groups */}
      {open && node.children.map((child, i) => (
        <NodeEditor
          key={child.id}
          node={child}
          onChange={(u) => updateChild(i, u)}
          onDelete={() => removeChild(i)}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

const EditModal = ({
  initial,
  onSave,
  onClose,
}: {
  initial: OrgChartData;
  onSave: (data: OrgChartData) => void;
  onClose: () => void;
}) => {
  const [label, setLabel] = useState(initial.label);
  const [root, setRoot]   = useState<OrgNode>(() => cloneNode(initial.root));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onMouseDown={onClose}>
      <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
        onMouseDown={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafaf9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Edit3 size={16} style={{ color: '#374151' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: "'Georgia',serif" }}>Modifier l'organigramme</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '16px 22px 10px', borderBottom: '1px solid #f3f4f6' }}>
          <label style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', fontFamily: "'Arial',sans-serif", display: 'block', marginBottom: '5px' }}>Titre de l'organigramme</label>
          <input
            value={label} onChange={(e) => setLabel(e.target.value)}
            style={{ width: '100%', padding: '7px 10px', fontSize: '13px', fontFamily: "'Georgia',serif", border: '1px solid #e5e7eb', borderRadius: '4px', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Tree editor */}
        <div style={{ padding: '14px 22px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: "'Arial',sans-serif", marginBottom: '10px' }}>
            Structure hiérarchique
          </div>
          <NodeEditor node={root} onChange={setRoot} depth={0} />
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: '#fafaf9' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 15px', fontSize: '12px', fontFamily: "'Arial',sans-serif", fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: '5px', background: '#fff', color: '#6b7280', cursor: 'pointer' }}>
            <XCircle size={12} /> Annuler
          </button>
          <button onClick={() => onSave({ ...initial, label, root })} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 16px', fontSize: '12px', fontFamily: "'Arial',sans-serif", fontWeight: 600, border: 'none', borderRadius: '5px', background: '#111827', color: '#fff', cursor: 'pointer' }}>
            <Save size={12} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Selection Modal ──────────────────────────────────────────────────────────

const SelectionModal = ({
  onSelect,
  onClose,
  onCreateBlank,
}: {
  onSelect: (o: OrgChartData) => void;
  onClose: () => void;
  onCreateBlank: () => void;
}) => {
  const countNodes = (n: OrgNode): number => 1 + n.children.reduce((s, c) => s + countNodes(c), 0);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onMouseDown={onClose}>
      <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '520px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}
        onMouseDown={(e) => e.stopPropagation()}>

        <div style={{ padding: '16px 22px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafaf9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Network size={18} style={{ color: '#374151' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: "'Georgia',serif" }}>Insérer un organigramme</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={18} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {/* Blank option */}
          <button
            onClick={onCreateBlank}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 22px', background: 'none', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={18} style={{ color: '#6b7280' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', fontFamily: "'Georgia',serif" }}>Créer un organigramme vide</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: "'Arial',sans-serif", marginTop: '2px' }}>Commencer depuis zéro</div>
            </div>
          </button>

          {SAMPLE_ORGS.map((org) => {
            const total = countNodes(org.root);
            return (
              <button key={org.id} onClick={() => onSelect(org)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 22px', background: 'none', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Network size={16} style={{ color: '#2563eb' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', fontFamily: "'Georgia',serif" }}>{org.label}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: "'Arial',sans-serif", marginTop: '2px', display: 'flex', gap: '12px' }}>
                    <span><Users size={10} style={{ display: 'inline', marginRight: '3px' }} />{total} groupes</span>
                    <span><GitBranch size={10} style={{ display: 'inline', marginRight: '3px' }} />{org.root.groupName}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── PDF View: recursive visual tree ─────────────────────────────────────────

/**
 * Print-scaling strategy
 * ─────────────────────
 * A4 printable width  ≈ 794px (at 96 dpi, 210 mm).
 * We constrain the tree wrapper to 754px (794 − 40px side margins) and use
 * CSS `zoom` inside @media print so the browser scales it down automatically
 * before sending to the PDF engine.  `zoom` is honoured by Chromium (used by
 * most PDF-export tools including Puppeteer / html2pdf / browser Print-to-PDF).
 * The class `org-tree-scaler` is targeted by the injected <style> tag below.
 */
const ORG_PRINT_STYLE = `
@media print {
  .org-tree-scaler {
    zoom: 0.62;
    /* fallback for non-Chromium engines */
    -moz-transform: scale(0.62);
    -moz-transform-origin: top center;
  }
}
`;

const OrgCard = ({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) => {
  const dc = getDeptColor(node.department);
  const totalMembers = node.members.length + 1;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '0 4px' }}>
      {/* Card */}
      <div style={{
        background: isRoot ? dc.bg : '#fff',
        border: `1.5px solid ${isRoot ? dc.accent : '#e5e7eb'}`,
        borderTop: `3px solid ${dc.accent}`,
        borderRadius: '5px',
        padding: isRoot ? '10px 12px' : '8px 10px',
        minWidth: isRoot ? '140px' : '120px',
        maxWidth: isRoot ? '180px' : '160px',
        boxShadow: isRoot ? '0 3px 10px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
        textAlign: 'center',
      }}>
        {/* Group icon */}
        {isRoot && (
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: dc.accent + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
            <Users size={14} style={{ color: dc.accent }} />
          </div>
        )}

        {/* Group name */}
        <div style={{ fontSize: isRoot ? '12px' : '11px', fontWeight: 700, color: isRoot ? dc.text : '#111827', fontFamily: "'Georgia',serif", lineHeight: 1.3, marginBottom: '3px' }}>
          {node.groupName || '—'}
        </div>

        {/* Leader */}
        <div style={{ fontSize: '9px', color: isRoot ? dc.text + 'cc' : '#6b7280', fontFamily: "'Arial',sans-serif", lineHeight: 1.35, marginBottom: '4px' }}>
          <span style={{ fontWeight: 600 }}>Chef:</span> {node.leader || '—'}
        </div>

        {/* Members count */}
        <div style={{ fontSize: '8px', color: isRoot ? dc.text + 'aa' : '#9ca3af', fontFamily: "'Arial',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '4px' }}>
          <Users size={8} />
          {totalMembers} membre{totalMembers > 1 ? 's' : ''}
        </div>

        {/* Department badge */}
        {node.department && (
          <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: dc.accent, fontFamily: "'Arial',sans-serif", background: dc.accent + '15', borderRadius: '2px', padding: '2px 5px', display: 'inline-block' }}>
            {node.department}
          </div>
        )}

        {/* Members list (collapsed) */}
        {node.members.length > 0 && (
          <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${isRoot ? dc.accent + '30' : '#e5e7eb'}` }}>
            {node.members.map((member, i) => (
              <div key={member.id} style={{ fontSize: '8px', color: isRoot ? dc.text + 'bb' : '#6b7280', fontFamily: "'Arial',sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
                • {member.name}{member.role ? ` (${member.role})` : ''}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Children connectors */}
      {node.children.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ width: '2px', height: '14px', background: '#d1d5db' }} />
          {node.children.length > 1 && (
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute', top: 0,
                left: `calc(50% / ${node.children.length})`,
                right: `calc(50% / ${node.children.length})`,
                height: '2px', background: '#d1d5db',
              }} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            {node.children.map((child) => (
              <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '2px', height: '14px', background: '#d1d5db' }} />
                <OrgCard node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PdfView = ({ data }: { data: OrgChartData }) => {
  const countNodes = (n: OrgNode): number => 1 + n.children.reduce((s, c) => s + countNodes(c), 0);
  const total = countNodes(data.root);

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: '#fff', border: '1px solid #d1d5db', borderTop: '4px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07),0 10px 24px -4px rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden', maxWidth: '794px', margin: '0 auto' }}>

      {/* Inject print-scaling CSS once */}
      <style dangerouslySetInnerHTML={{ __html: ORG_PRINT_STYLE }} />

      {/* Header */}
      <div style={{ background: '#fafaf9', borderBottom: '1px solid #e5e7eb', padding: '20px 32px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: "'Arial',sans-serif", marginBottom: '10px' }}>Organigramme</div>
        <div style={{ width: '36px', height: '3px', background: '#2563eb', margin: '0 auto 12px', borderRadius: '2px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{data.label}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', fontFamily: "'Arial',sans-serif", color: '#6b7280' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={11} style={{ color: '#2563eb' }} /><strong style={{ color: '#374151' }}>{total}</strong> groupes</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitBranch size={11} style={{ color: '#2563eb' }} />Sommet : <strong style={{ color: '#374151', marginLeft: '3px' }}>{data.root.groupName}</strong></span>
        </div>
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right,transparent,#d1d5db 20%,#d1d5db 80%,transparent)', marginTop: '14px' }} />
      </div>

      {/* Tree — wrapped in scaler div targeted by @media print */}
      <div
        className="org-tree-scaler"
        style={{ padding: '24px 16px 20px', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}
      >
        <OrgCard node={data.root} isRoot />
      </div>

      {/* Legend */}
      <div style={{ background: '#fafaf9', borderTop: '1px solid #e5e7eb', padding: '12px 40px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: "'Arial',sans-serif", marginRight: '4px' }}>Départements :</span>
        {Object.entries(DEPT_COLORS).map(([dept, colors]) => (
          <span key={dept} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontFamily: "'Arial',sans-serif", color: '#374151' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent, display: 'inline-block' }} />
            {dept}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Standard (prose) View ────────────────────────────────────────────────────

const renderStandardNode = (node: OrgNode, depth = 0): React.ReactNode => (
  <li key={node.id} style={{ marginBottom: '8px' }}>
    <div>
      <span style={{ fontWeight: depth === 0 ? 800 : depth === 1 ? 700 : 600, fontSize: depth === 0 ? '16px' : depth === 1 ? '14px' : '13px', color: '#111827' }}>{node.groupName || '—'}</span>
      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>— Chef: {node.leader}{node.department ? ` (${node.department})` : ''}</span>
    </div>
    {node.members.length > 0 && (
      <ul style={{ margin: '4px 0 0', paddingLeft: '18px', listStyleType: 'circle', fontSize: '12px', color: '#6b7280' }}>
        {node.members.map((m) => (
          <li key={m.id} style={{ marginBottom: '2px' }}>
            {m.name}{m.role ? ` — ${m.role}` : ''}
          </li>
        ))}
      </ul>
    )}
    {node.children.length > 0 && (
      <ul style={{ margin: '6px 0 0', paddingLeft: '20px', listStyleType: depth === 0 ? 'disc' : depth === 1 ? 'circle' : 'square' }}>
        {node.children.map((c) => renderStandardNode(c, depth + 1))}
      </ul>
    )}
  </li>
);

const StandardView = ({ data }: { data: OrgChartData }) => (
  <div style={{ fontFamily: 'inherit', color: '#111827', lineHeight: 1.7, maxWidth: '860px', margin: '0 auto', padding: '4px 0' }}>
    <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px' }}>{data.label}</h1>
    <h2 style={{ fontSize: '14px', fontWeight: 400, fontStyle: 'italic', color: '#6b7280', margin: '0 0 16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
      Structure par groupes — {data.root.groupName} → …
    </h2>
    <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'none' }}>
      {renderStandardNode(data.root, 0)}
    </ul>
  </div>
);

// ─── Block Component ──────────────────────────────────────────────────────────

const BLANK_ORG = (): OrgChartData => ({
  id: Date.now(),
  label: 'Nouvel organigramme',
  root: { id: uid(), groupName: '', leader: '', department: 'Direction', members: [], children: [] },
});

const OrganigrammeBlockComponent = ({ node, updateAttributes }: any) => {
  const attrs = node.attrs;
  const [showSelectModal, setShowSelectModal] = useState(!attrs.orgId);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [view, setView] = useState<ViewMode>('pdf');

  const hasOrg = !!attrs.orgId;

  const applyOrg = (org: OrgChartData) =>
    updateAttributes({ orgId: org.id, orgLabel: org.label, orgRoot: org.root });

  const handleSelect = (org: OrgChartData) => { applyOrg(org); setShowSelectModal(false); };
  const handleSave   = (org: OrgChartData) => { applyOrg(org); setShowEditModal(false); };
  const handleCreateBlank = () => { const b = BLANK_ORG(); applyOrg(b); setShowSelectModal(false); setShowEditModal(true); };

  const currentData: OrgChartData | null = hasOrg
    ? { id: attrs.orgId, label: attrs.orgLabel ?? '', root: attrs.orgRoot ?? { id: 'r', groupName: '', leader: '', members: [], children: [] } }
    : null;

  return (
    <NodeViewWrapper as="div">
      {showSelectModal && (
        <SelectionModal
          onSelect={handleSelect}
          onClose={() => { if (hasOrg) setShowSelectModal(false); }}
          onCreateBlank={handleCreateBlank}
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
          {/* Toolbar */}
          <div className="print:hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <ViewToggle view={view} onChange={setView} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setShowEditModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', fontSize: '11px', fontFamily: "'Arial',sans-serif", fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: '5px', background: '#fff', color: '#374151', cursor: 'pointer' }}>
                <Edit3 size={12} /> Modifier
              </button>
              <button onClick={() => setShowSelectModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', fontSize: '11px', fontFamily: "'Arial',sans-serif", fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: '5px', background: '#fff', color: '#374151', cursor: 'pointer' }}>
                <Network size={12} /> Changer
              </button>
            </div>
          </div>
          {view === 'pdf' ? <PdfView data={currentData} /> : <StandardView data={currentData} />}
        </div>
      ) : (
        <div
          onClick={() => setShowSelectModal(true)}
          style={{ border: '2px dashed #e5e7eb', borderRadius: '6px', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', color: '#9ca3af', background: '#fafaf9', transition: 'border-color 0.2s, background 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.background = '#f3f4f6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fafaf9'; }}
        >
          <Network size={36} strokeWidth={1.5} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151', fontFamily: "'Georgia',serif" }}>Insérer un organigramme</span>
          <span style={{ fontSize: '12px', fontFamily: "'Arial',sans-serif" }}>Choisir un modèle ou créer depuis zéro</span>
        </div>
      )}
    </NodeViewWrapper>
  );
};

// ─── Tiptap Node ──────────────────────────────────────────────────────────────

export const OrganigrammeBlock = Node.create({
  name: 'organigrammeBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      orgId:    { default: null },
      orgLabel: { default: '' },
      orgRoot:  { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="organigramme-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'organigramme-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(OrganigrammeBlockComponent);
  },

  addCommands() {
    return {
      setOrganigrammeBlock:
        () =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name }),
    } as any;
  },
});