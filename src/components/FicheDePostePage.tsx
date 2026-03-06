import { useState, useMemo } from 'react';
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
  { id: 1,  title: 'Fiche de Poste – Entraîneur Principal',    type: 'Fiche de Poste',  poste: 'Entraîneur Principal',      updatedAt: '28 Feb 2025', author: 'A. Benali' },
  { id: 2,  title: 'Charte Éthique du Club',                   type: 'Charte',           poste: 'Tous membres',              updatedAt: '14 Jan 2025', author: 'Direction' },
  { id: 3,  title: 'Règlement Intérieur 2025',                 type: 'Règlement',        poste: 'Tous membres',              updatedAt: '01 Jan 2025', author: 'Secrétariat' },
  { id: 4,  title: 'Liste des Rôles – Staff Technique',        type: 'Liste des Rôles',  poste: 'Staff Technique',           updatedAt: '10 Feb 2025', author: 'M. Trabelsi' },
  { id: 5,  title: 'Fiche de Poste – Préparateur Physique',    type: 'Fiche de Poste',  poste: 'Préparateur Physique',       updatedAt: '22 Feb 2025', author: 'A. Benali' },
  { id: 6,  title: 'Charte des Partenaires',                   type: 'Charte',           poste: 'Partenaires Commerciaux',   updatedAt: '05 Dec 2024', author: 'Direction' },
  { id: 7,  title: 'Règlement Sportif – Compétitions',         type: 'Règlement',        poste: 'Joueurs & Staff',           updatedAt: '15 Aug 2024', author: 'Comité Sportif' },
  { id: 8,  title: 'Fiche de Poste – Directeur Général',       type: 'Fiche de Poste',  poste: 'Directeur Général (CEO)',    updatedAt: '11 Mar 2025', author: 'RH' },
  { id: 9,  title: 'Liste des Rôles – Comité Directeur',       type: 'Liste des Rôles',  poste: 'Comité Directeur',          updatedAt: '18 Jan 2025', author: 'Secrétariat' },
  { id: 10, title: 'Fiche de Poste – Analyste Vidéo',          type: 'Fiche de Poste',  poste: 'Analyste Vidéo',            updatedAt: '03 Feb 2025', author: 'A. Benali' },
  { id: 11, title: 'Charte Réseaux Sociaux',                   type: 'Charte',           poste: 'Communication',             updatedAt: '19 Nov 2024', author: 'Resp. Com.' },
  { id: 12, title: 'Fiche de Poste – Kinésithérapeute',        type: 'Fiche de Poste',  poste: 'Kinésithérapeute Sportif',  updatedAt: '27 Jan 2025', author: 'RH' },
];

const ALL_TYPES = ['Tous', ...Object.keys(DOC_TYPES)];

/* ─────────────────────── member data ─────────────────────── */

const STAFF_GROUPS = [
  { id: 'sg-direction', label: 'Comité Directeur',  count: 5  },
  { id: 'sg-technique', label: 'Staff Technique',   count: 6  },
  { id: 'sg-medical',   label: 'Service Médical',   count: 3  },
  { id: 'sg-admin',     label: 'Administration',    count: 4  },
  { id: 'sg-com',       label: 'Communication',     count: 3  },
  { id: 'sg-joueurs',   label: 'Équipe Première',   count: 22 },
];

const POST_GROUPS = [
  { id: 'pg-joueurs',     label: 'Joueurs',                  count: 22, icon: '⚽' },
  { id: 'pg-entraineurs', label: 'Entraîneurs',              count: 3,  icon: '📋' },
  { id: 'pg-prep',        label: 'Préparateurs Physiques',   count: 2,  icon: '💪' },
  { id: 'pg-analystes',   label: 'Analystes Vidéo',          count: 2,  icon: '🎬' },
  { id: 'pg-kine',        label: 'Kinésithérapeutes',        count: 2,  icon: '🏥' },
  { id: 'pg-dirigeants',  label: 'Dirigeants',               count: 5,  icon: '🏛' },
  { id: 'pg-media',       label: 'Responsables Médias',      count: 3,  icon: '📣' },
  { id: 'pg-admin',       label: 'Administratifs',           count: 4,  icon: '📁' },
];

const MEMBERS = [
  { id: 'm1',  name: 'Khalil Ayari',     initials: 'KA', post: 'Président',              group: 'Comité Directeur' },
  { id: 'm2',  name: 'Nadia Rekik',      initials: 'NR', post: 'Vice-Présidente',        group: 'Comité Directeur' },
  { id: 'm3',  name: 'Sami Trabelsi',    initials: 'ST', post: 'Trésorier',              group: 'Comité Directeur' },
  { id: 'm4',  name: 'Leila Guesmi',     initials: 'LG', post: 'Secrétaire Générale',    group: 'Comité Directeur' },
  { id: 'm5',  name: 'Hedi Ben Ammar',   initials: 'HB', post: 'Membre CD',              group: 'Comité Directeur' },
  { id: 'm6',  name: 'Amine Benali',     initials: 'AB', post: 'Entraîneur Principal',   group: 'Staff Technique'  },
  { id: 'm7',  name: 'Riadh Zouari',     initials: 'RZ', post: 'Entraîneur Adjoint',     group: 'Staff Technique'  },
  { id: 'm8',  name: 'Omar Hamdi',       initials: 'OH', post: 'Entraîneur des Gardiens', group: 'Staff Technique' },
  { id: 'm9',  name: 'Tarek Mansouri',   initials: 'TM', post: 'Préparateur Physique',   group: 'Staff Technique'  },
  { id: 'm10', name: 'Wissem Dridi',     initials: 'WD', post: 'Préparateur Physique',   group: 'Staff Technique'  },
  { id: 'm11', name: 'Cyrine Lajmi',     initials: 'CL', post: 'Analyste Vidéo',         group: 'Staff Technique'  },
  { id: 'm12', name: 'Dr. Mehdi Karray', initials: 'MK', post: 'Médecin du Club',        group: 'Service Médical'  },
  { id: 'm13', name: 'Asma Ferchichi',   initials: 'AF', post: 'Kinésithérapeute',       group: 'Service Médical'  },
  { id: 'm14', name: 'Bilel Chaabane',   initials: 'BC', post: 'Kinésithérapeute',       group: 'Service Médical'  },
  { id: 'm15', name: 'Ines Turki',       initials: 'IT', post: 'Directrice Admin.',      group: 'Administration'   },
  { id: 'm16', name: 'Mohamed Gharbi',   initials: 'MG', post: 'Comptable',              group: 'Administration'   },
  { id: 'm17', name: 'Dorra Slim',       initials: 'DS', post: 'Assistante RH',          group: 'Administration'   },
  { id: 'm18', name: 'Farouk Belhaj',    initials: 'FB', post: 'Logisticien',            group: 'Administration'   },
  { id: 'm19', name: 'Karim Slama',      initials: 'KS', post: 'Responsable Com.',       group: 'Communication'    },
  { id: 'm20', name: 'Rim Mabrouk',      initials: 'RM', post: 'Community Manager',      group: 'Communication'    },
  { id: 'm21', name: 'Yassine Nasr',     initials: 'YN', post: 'Photographe',            group: 'Communication'    },
];

/* accent used for ALL selection highlights */
const SEL = '#0091ff';

/* ─────────────────────── shared micro-components ─────────────────────── */

function ActionBtn({ icon: Icon, title, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
      style={{ color: '#444', background: 'transparent', border: 'none', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1e1e1e'; e.currentTarget.style.color = '#aaa'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#444'; }}
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
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs"
            style={{ color, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#222')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────── doc row ─────────────────────── */

function DocRow({ doc, index }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = DOC_TYPES[doc.type];
  return (
    <div
      className="doc-row grid items-center px-4 py-3.5 rounded-lg cursor-pointer transition-all relative"
      style={{ gridTemplateColumns: '1fr 140px 160px 110px 80px', backgroundColor: '#111', border: '1px solid #181818' }}
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
      <div className="row-actions flex items-center justify-end gap-1 opacity-0 transition-opacity">
        <ActionBtn icon={Eye} title="Voir" />
        <ActionBtn icon={Pencil} title="Modifier" />
        <div className="relative">
          <ActionBtn icon={MoreHorizontal} title="Plus"
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }} />
          {menuOpen && <DropMenu onClose={() => setMenuOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── member selector ─────────────────────── */

const MODES = [
  { id: 'group',  label: 'Groupe Staff', Icon: Users },
  { id: 'post',   label: 'Par Poste',    Icon: Briefcase },
  { id: 'member', label: 'Individuel',   Icon: User },
];

function SelectionChip({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: 'rgba(0,145,255,0.12)', color: SEL, border: '1px solid rgba(0,145,255,0.25)' }}
    >
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex', opacity: 0.7 }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

function Checkbox({ active }) {
  return (
    <div style={{
      width: 15, height: 15, borderRadius: 4, flexShrink: 0,
      border: `1.5px solid ${active ? SEL : '#2e2e2e'}`,
      backgroundColor: active ? SEL : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.12s',
    }}>
      {active && <Check className="w-2.5 h-2.5" style={{ color: '#fff' }} />}
    </div>
  );
}

function MemberSelector({ selectedGroupIds, setSelectedGroupIds, selectedPostIds, setSelectedPostIds, selectedMemberIds, setSelectedMemberIds }) {
  const [mode, setMode] = useState('group');
  const [memberSearch, setMemberSearch] = useState('');

  const toggleGroup  = id => setSelectedGroupIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  const togglePost   = id => setSelectedPostIds(ids  => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  const toggleMember = id => setSelectedMemberIds(ids=> ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);

  const filteredMembers = useMemo(() =>
    MEMBERS.filter(m =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.post.toLowerCase().includes(memberSearch.toLowerCase())
    ), [memberSearch]);

  const groupedMembers = useMemo(() => {
    const map = {};
    filteredMembers.forEach(m => { if (!map[m.group]) map[m.group] = []; map[m.group].push(m); });
    return map;
  }, [filteredMembers]);

  const chips = useMemo(() => [
    ...STAFF_GROUPS.filter(g => selectedGroupIds.includes(g.id)).map(g => ({ key: g.id, label: g.label, kind: 'group' })),
    ...POST_GROUPS.filter(g => selectedPostIds.includes(g.id)).map(g => ({ key: g.id, label: g.label, kind: 'post' })),
    ...MEMBERS.filter(m => selectedMemberIds.includes(m.id)).map(m => ({ key: m.id, label: m.name, kind: 'member' })),
  ], [selectedGroupIds, selectedPostIds, selectedMemberIds]);

  const removeChip = chip => {
    if (chip.kind === 'group')  setSelectedGroupIds(ids => ids.filter(x => x !== chip.key));
    if (chip.kind === 'post')   setSelectedPostIds(ids  => ids.filter(x => x !== chip.key));
    if (chip.kind === 'member') setSelectedMemberIds(ids=> ids.filter(x => x !== chip.key));
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#555', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Membres concernés
      </label>

      <div style={{ border: '1px solid #202020', borderRadius: 10, overflow: 'hidden', backgroundColor: '#0f0f0f' }}>

        {/* Mode tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #181818' }}>
          {MODES.map(m => {
            const active = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '9px 6px',
                  background: active ? '#161616' : 'transparent',
                  borderBottom: `2px solid ${active ? SEL : 'transparent'}`,
                  color: active ? '#d0d0d0' : '#3a3a3a',
                  border: 'none', borderBottom: `2px solid ${active ? SEL : 'transparent'}`,
                  cursor: 'pointer', fontSize: 11, fontWeight: active ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.12s',
                }}
              >
                <m.Icon style={{ width: 11, height: 11, color: active ? SEL : '#333' }} />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* ── Group Staff panel ── */}
        {mode === 'group' && (
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {STAFF_GROUPS.map(g => {
              const active = selectedGroupIds.includes(g.id);
              return (
                <div key={g.id} onClick={() => toggleGroup(g.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
                    background: active ? 'rgba(0,145,255,0.06)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(0,145,255,0.2)' : 'transparent'}`,
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#171717'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: active ? SEL : '#2a2a2a',
                      transition: 'background 0.12s',
                    }} />
                    <span style={{ color: active ? '#e0e0e0' : '#666', fontSize: 12, fontWeight: active ? 500 : 400 }}>
                      {g.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10, padding: '1px 6px', borderRadius: 20,
                      backgroundColor: active ? 'rgba(0,145,255,0.1)' : '#171717',
                      color: active ? SEL : '#333',
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {g.count}
                    </span>
                    <Checkbox active={active} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Post panel ── */}
        {mode === 'post' && (
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {POST_GROUPS.map(g => {
              const active = selectedPostIds.includes(g.id);
              return (
                <div key={g.id} onClick={() => togglePost(g.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
                    background: active ? 'rgba(0,145,255,0.06)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(0,145,255,0.2)' : 'transparent'}`,
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#171717'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontSize: 13, lineHeight: 1 }}>{g.icon}</span>
                    <span style={{ color: active ? '#e0e0e0' : '#666', fontSize: 12, fontWeight: active ? 500 : 400 }}>
                      {g.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10, padding: '1px 6px', borderRadius: 20,
                      backgroundColor: active ? 'rgba(0,145,255,0.1)' : '#171717',
                      color: active ? SEL : '#333',
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {g.count}
                    </span>
                    <Checkbox active={active} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Individual panel ── */}
        {mode === 'member' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderBottom: '1px solid #181818' }}>
              <Search style={{ width: 11, height: 11, color: '#333', flexShrink: 0 }} />
              <input type="text" value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                placeholder="Rechercher un membre..."
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#ccc', fontSize: 12, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
              />
              {memberSearch && (
                <button onClick={() => setMemberSearch('')}
                  style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X style={{ width: 11, height: 11 }} />
                </button>
              )}
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {Object.entries(groupedMembers).map(([groupName, members]) => (
                <div key={groupName}>
                  <div style={{ padding: '6px 12px 3px', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: '#2a2a2a', textTransform: 'uppercase' }}>
                    {groupName}
                  </div>
                  {members.map(m => {
                    const active = selectedMemberIds.includes(m.id);
                    return (
                      <div key={m.id} onClick={() => toggleMember(m.id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '6px 12px', cursor: 'pointer',
                          background: active ? 'rgba(0,145,255,0.05)' : 'transparent',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#161616'; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(0,145,255,0.05)' : 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                            backgroundColor: active ? 'rgba(0,145,255,0.15)' : '#1c1c1c',
                            border: `1px solid ${active ? 'rgba(0,145,255,0.3)' : '#252525'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 600, color: active ? SEL : '#444',
                            fontFamily: "'DM Mono', monospace",
                            transition: 'all 0.12s',
                          }}>
                            {m.initials}
                          </div>
                          <div>
                            <p style={{ color: active ? '#e0e0e0' : '#777', fontSize: 12, fontWeight: active ? 500 : 400, lineHeight: 1.3 }}>{m.name}</p>
                            <p style={{ color: '#2e2e2e', fontSize: 10, lineHeight: 1.3 }}>{m.post}</p>
                          </div>
                        </div>
                        <Checkbox active={active} />
                      </div>
                    );
                  })}
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <p style={{ color: '#2e2e2e', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>Aucun membre trouvé</p>
              )}
            </div>
          </div>
        )}

        {/* Summary bar */}
        <div style={{ borderTop: '1px solid #181818', padding: '8px 12px', backgroundColor: '#0a0a0a', minHeight: 36, display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
          {chips.length > 0 ? (
            <>
              <span style={{ fontSize: 10, color: '#2e2e2e', flexShrink: 0, marginRight: 2 }}>
                {chips.length} sélection{chips.length > 1 ? 's' : ''} :
              </span>
              {chips.map(c => (
                <SelectionChip key={c.key} label={c.label} onRemove={() => removeChip(c)} />
              ))}
            </>
          ) : (
            <p style={{ fontSize: 10, color: '#282828', fontStyle: 'italic' }}>
              Aucun membre sélectionné — accessible à tous par défaut
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── type dropdown ─────────────────────── */

const TYPE_OPTIONS = [
  { value: '', label: 'Sans type' },
  ...Object.entries(DOC_TYPES).map(([key, cfg]) => ({ value: key, label: cfg.label, cfg })),
];

/* ─────────────────────── create modal ─────────────────────── */

function CreateModal({ formData, setFormData, onClose, onCreate }) {
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedGroupIds, setSelectedGroupIds]   = useState([]);
  const [selectedPostIds, setSelectedPostIds]     = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const valid = formData.title.trim();
  const selectedType = TYPE_OPTIONS.find(o => o.value === formData.type);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={() => setTypeOpen(false)}
    >
      <div
        className="w-full max-w-[480px] rounded-xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: '#141414', border: '1px solid #1e1e1e',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold" style={{ color: '#f0f0f0', letterSpacing: '-0.2px' }}>
              Nouveau document
            </h2>
            <button onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-md"
              style={{ color: '#444', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1e1e1e'; e.currentTarget.style.color = '#aaa'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#444'; }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs" style={{ color: '#3a3a3a' }}>Créer un nouveau document pour le club</p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a transparent' }}>
          <div className="px-6 py-5 space-y-4">

            {/* Type selector */}
            <div className="relative">
              <label className="block text-xs font-medium mb-2" style={{ color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Type de document
              </label>
              <button type="button" onClick={() => setTypeOpen(!typeOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #252525', color: formData.type ? '#e0e0e0' : '#444', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-2">
                  {selectedType?.cfg
                    ? <selectedType.cfg.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: selectedType.cfg.color }} />
                    : <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#444' }} />
                  }
                  <span>{selectedType?.label ?? 'Sans type'}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: '#444', transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
              {typeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-20"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #252525', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {TYPE_OPTIONS.map(opt => {
                    const isSel = formData.type === opt.value;
                    return (
                      <button key={opt.value} type="button"
                        onClick={() => { setFormData({ ...formData, type: opt.value }); setTypeOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left"
                        style={{ backgroundColor: isSel ? '#222' : 'transparent', color: opt.cfg ? opt.cfg.color : '#444', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.backgroundColor = '#1e1e1e'; }}
                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {opt.cfg
                          ? <opt.cfg.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: opt.cfg.color }} />
                          : <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#444' }} />
                        }
                        {opt.value === '' ? <span style={{ fontStyle: 'italic' }}>{opt.label}</span> : opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Titre du document <span style={{ color: '#e05353' }}>*</span>
              </label>
              <input type="text" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="ex. Fiche de Poste – Trésorier"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #252525', color: '#e0e0e0' }}
                onFocus={e => e.currentTarget.style.borderColor = SEL}
                onBlur={e => e.currentTarget.style.borderColor = '#252525'}
              />
            </div>

            {/* Member selector */}
            <MemberSelector
              selectedGroupIds={selectedGroupIds}   setSelectedGroupIds={setSelectedGroupIds}
              selectedPostIds={selectedPostIds}     setSelectedPostIds={setSelectedPostIds}
              selectedMemberIds={selectedMemberIds} setSelectedMemberIds={setSelectedMemberIds}
            />

          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid #1a1a1a' }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #252525', color: '#555', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#202020'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
          >
            Annuler
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onCreate({ ...formData, selectedGroupIds, selectedPostIds, selectedMemberIds })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: SEL, opacity: valid ? 1 : 0.3, cursor: valid ? 'pointer' : 'not-allowed', border: 'none' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Créer le document
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── main page ─────────────────────── */

export default function FicheDePostePage() {
  const [search, setSearch]         = useState('');
  const [activeType, setActiveType] = useState('Tous');
  const [showModal, setShowModal]   = useState(false);
  const [formData, setFormData]     = useState({ title: '', type: '' });

  const handleCreate = data => {
    setShowModal(false);
    setFormData({ title: '', type: '' });
    // navigate or handle creation here
  };

  const filtered = mockDocs.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.poste.toLowerCase().includes(search.toLowerCase());
    const matchType   = activeType === 'Tous' || d.type === activeType;
    return matchSearch && matchType;
  });

  return (
    <div className="flex-1 overflow-y-auto min-h-screen" style={{ backgroundColor: '#0e0e0e', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .doc-row:hover .row-actions { opacity: 1 !important; }
        .doc-row:hover { background: #161616 !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#333' }}>Club Documents</p>
          <h1 className="text-3xl font-semibold" style={{ color: '#f0f0f0', letterSpacing: '-0.5px' }}>
            Fiches &amp; Documents
          </h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg w-72"
            style={{ backgroundColor: '#151515', border: '1px solid #1e1e1e' }}>
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3a3a3a' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un document..."
              className="bg-transparent border-none outline-none w-full text-sm"
              style={{ color: '#d4d4d4' }}
            />
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: SEL, border: 'none', cursor: 'pointer' }}>
            <Plus className="w-3.5 h-3.5" />
            Nouveau document
          </button>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2 mb-7 overflow-x-auto scrollbar-hide">
          {ALL_TYPES.map(t => {
            const active = activeType === t;
            const cfg = DOC_TYPES[t];
            return (
              <button key={t} onClick={() => setActiveType(t)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: active ? (cfg ? cfg.bg : 'rgba(255,255,255,0.06)') : 'transparent',
                  border: `1px solid ${active ? (cfg ? cfg.border : 'rgba(255,255,255,0.12)') : '#1e1e1e'}`,
                  color: active ? (cfg ? cfg.color : '#d4d4d4') : '#444',
                  cursor: 'pointer',
                }}>
                {cfg && <cfg.Icon className="w-3 h-3" />}
                {t}
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    backgroundColor: active ? (cfg ? cfg.border : 'rgba(255,255,255,0.08)') : '#181818',
                    color: active ? (cfg ? cfg.color : '#aaa') : '#333',
                  }}>
                  {t === 'Tous' ? mockDocs.length : mockDocs.filter(d => d.type === t).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table header */}
        <div className="grid text-[11px] font-medium tracking-widest uppercase px-4 py-2.5 mb-1 rounded-md"
          style={{ gridTemplateColumns: '1fr 140px 160px 110px 80px', color: '#2e2e2e', backgroundColor: '#0e0e0e' }}>
          <span>Titre du document</span>
          <span>Type</span>
          <span>Poste / Périmètre</span>
          <span>Mis à jour</span>
          <span />
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {filtered.map((doc, i) => <DocRow key={doc.id} doc={doc} index={i} />)}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-8 h-8 mb-3" style={{ color: '#202020' }} />
            <p className="text-sm" style={{ color: '#303030' }}>Aucun document trouvé.</p>
          </div>
        )}
      </div>

      {showModal && (
        <CreateModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => { setShowModal(false); setFormData({ title: '', type: '' }); }}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}