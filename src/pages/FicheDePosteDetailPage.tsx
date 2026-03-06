import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, FileText, Shield, BookOpen,
  ClipboardList, List, Calendar, User, Users,
  CheckCircle2, Clock,
} from 'lucide-react';

const DOC_TYPES = {
  'Fiche de Poste': { color: '#0091ff', bg: 'rgba(0,145,255,0.08)', border: 'rgba(0,145,255,0.2)', Icon: ClipboardList },
  'Charte':         { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', Icon: Shield },
  'Règlement':      { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', Icon: BookOpen },
  'Liste des Rôles':{ color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', Icon: List },
};

const mockDocs = [
  { id: 1,  title: 'Fiche de Poste – Entraîneur Principal',      type: 'Fiche de Poste',  poste: 'Entraîneur Principal',     updatedAt: '28 Feb 2025', author: 'A. Benali',   status: 'Actif',  version: 'v2.1' },
  { id: 2,  title: 'Charte Éthique du Club',                     type: 'Charte',           poste: 'Tous membres',             updatedAt: '14 Jan 2025', author: 'Direction',   status: 'Actif',  version: 'v1.3' },
  { id: 3,  title: 'Règlement Intérieur 2025',                   type: 'Règlement',        poste: 'Tous membres',             updatedAt: '01 Jan 2025', author: 'Secrétariat', status: 'Actif',  version: 'v3.0' },
  { id: 4,  title: 'Liste des Rôles – Staff Technique',          type: 'Liste des Rôles',  poste: 'Staff Technique',          updatedAt: '10 Feb 2025', author: 'M. Trabelsi', status: 'Actif',  version: 'v1.0' },
  { id: 5,  title: 'Fiche de Poste – Préparateur Physique',      type: 'Fiche de Poste',  poste: 'Préparateur Physique',     updatedAt: '22 Feb 2025', author: 'A. Benali',   status: 'Brouillon', version: 'v1.1' },
  { id: 6,  title: 'Charte des Partenaires',                     type: 'Charte',           poste: 'Partenaires Commerciaux',  updatedAt: '05 Dec 2024', author: 'Direction',   status: 'Actif',  version: 'v1.0' },
  { id: 7,  title: 'Règlement Sportif – Compétitions',           type: 'Règlement',        poste: 'Joueurs & Staff',          updatedAt: '15 Aug 2024', author: 'Comité Sportif', status: 'Actif', version: 'v2.4' },
  { id: 8,  title: 'Fiche de Poste – Directeur Général',         type: 'Fiche de Poste',  poste: 'Directeur Général (CEO)', updatedAt: '11 Mar 2025', author: 'RH',          status: 'Actif',  version: 'v1.0' },
  { id: 9,  title: 'Liste des Rôles – Comité Directeur',         type: 'Liste des Rôles',  poste: 'Comité Directeur',         updatedAt: '18 Jan 2025', author: 'Secrétariat', status: 'Actif',  version: 'v2.2' },
  { id: 10, title: 'Fiche de Poste – Analyste Vidéo',            type: 'Fiche de Poste',  poste: 'Analyste Vidéo',           updatedAt: '03 Feb 2025', author: 'A. Benali',   status: 'Actif',  version: 'v1.0' },
  { id: 11, title: 'Charte Réseaux Sociaux',                     type: 'Charte',           poste: 'Communication',            updatedAt: '19 Nov 2024', author: 'Resp. Com.',  status: 'Actif',  version: 'v1.2' },
  { id: 12, title: 'Fiche de Poste – Kinésithérapeute',          type: 'Fiche de Poste',  poste: 'Kinésithérapeute Sportif', updatedAt: '27 Jan 2025', author: 'RH',          status: 'Actif',  version: 'v1.0' },
];

const MOCK_MEMBERS: Record<number, { id: string; name: string; initials: string; role: string; group: string; color: string; since: string; status: string }[]> = {
  1: [
    { id: 'm6',  name: 'Amine Benali',    initials: 'AB', role: 'Entraîneur Principal',    group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Titulaire' },
  ],
  2: [
    { id: 'm1',  name: 'Khalil Ayari',    initials: 'KA', role: 'Président',               group: 'Comité Directeur', color: '#a78bfa', since: 'Jan 2021', status: 'Signataire' },
    { id: 'm6',  name: 'Amine Benali',    initials: 'AB', role: 'Entraîneur Principal',    group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Signataire' },
    { id: 'm12', name: 'Dr. Mehdi Karray',initials: 'MK', role: 'Médecin du Club',         group: 'Service Médical',  color: '#34d399', since: 'Mar 2023', status: 'Signataire' },
    { id: 'm15', name: 'Ines Turki',      initials: 'IT', role: 'Directrice Admin.',       group: 'Administration',   color: '#fbbf24', since: 'Feb 2022', status: 'Signataire' },
    { id: 'm19', name: 'Karim Slama',     initials: 'KS', role: 'Responsable Com.',        group: 'Communication',    color: '#f472b6', since: 'Jul 2023', status: 'Signataire' },
  ],
  3: [
    { id: 'm1',  name: 'Khalil Ayari',    initials: 'KA', role: 'Président',               group: 'Comité Directeur', color: '#a78bfa', since: 'Jan 2021', status: 'Validé' },
    { id: 'm2',  name: 'Nadia Rekik',     initials: 'NR', role: 'Vice-Présidente',         group: 'Comité Directeur', color: '#a78bfa', since: 'Jan 2021', status: 'Validé' },
    { id: 'm3',  name: 'Sami Trabelsi',   initials: 'ST', role: 'Trésorier',               group: 'Comité Directeur', color: '#a78bfa', since: 'Jan 2021', status: 'Validé' },
    { id: 'm4',  name: 'Leila Guesmi',    initials: 'LG', role: 'Secrétaire Générale',     group: 'Comité Directeur', color: '#a78bfa', since: 'Jan 2021', status: 'Validé' },
    { id: 'm5',  name: 'Hedi Ben Ammar',  initials: 'HB', role: 'Membre CD',               group: 'Comité Directeur', color: '#a78bfa', since: 'Jan 2021', status: 'Validé' },
    { id: 'm6',  name: 'Amine Benali',    initials: 'AB', role: 'Entraîneur Principal',    group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Validé' },
    { id: 'm7',  name: 'Riadh Zouari',    initials: 'RZ', role: 'Entraîneur Adjoint',      group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Validé' },
  ],
  4: [
    { id: 'm6',  name: 'Amine Benali',    initials: 'AB', role: 'Entraîneur Principal',    group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Assigné' },
    { id: 'm7',  name: 'Riadh Zouari',    initials: 'RZ', role: 'Entraîneur Adjoint',      group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Assigné' },
    { id: 'm8',  name: 'Omar Hamdi',      initials: 'OH', role: 'Entraîneur des Gardiens', group: 'Staff Technique',  color: '#0091ff', since: 'Oct 2023', status: 'Assigné' },
    { id: 'm9',  name: 'Tarek Mansouri',  initials: 'TM', role: 'Préparateur Physique',    group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Assigné' },
    { id: 'm10', name: 'Wissem Dridi',    initials: 'WD', role: 'Préparateur Physique',    group: 'Staff Technique',  color: '#0091ff', since: 'Jan 2024', status: 'Assigné' },
    { id: 'm11', name: 'Cyrine Lajmi',    initials: 'CL', role: 'Analyste Vidéo',          group: 'Staff Technique',  color: '#0091ff', since: 'Feb 2024', status: 'Assigné' },
  ],
};

const DEFAULT_MEMBERS = [
  { id: 'mx1', name: 'Khalil Ayari',    initials: 'KA', role: 'Président',            group: 'Comité Directeur', color: '#a78bfa', since: 'Jan 2021', status: 'Concerné' },
  { id: 'mx2', name: 'Amine Benali',    initials: 'AB', role: 'Entraîneur Principal', group: 'Staff Technique',  color: '#0091ff', since: 'Sep 2022', status: 'Concerné' },
  { id: 'mx3', name: 'Ines Turki',      initials: 'IT', role: 'Directrice Admin.',    group: 'Administration',   color: '#fbbf24', since: 'Feb 2022', status: 'Concerné' },
];

export function FicheDePosteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = mockDocs.find(d => d.id === Number(id));

  if (!doc) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#0e0e0e' }}>
        <p style={{ color: '#444', fontSize: 14 }}>Document introuvable.</p>
      </div>
    );
  }

  const cfg = DOC_TYPES[doc.type] ?? { color: '#aaa', bg: '#1a1a1a', border: '#333', Icon: FileText };
  const members = MOCK_MEMBERS[doc.id] ?? DEFAULT_MEMBERS;
  const statusActive = doc.status === 'Actif';

  return (
    <div className="flex-1 overflow-y-auto min-h-screen" style={{ backgroundColor: '#0e0e0e', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .member-row:hover { background: #161616 !important; }
      `}</style>

      <div className="max-w-[900px] mx-auto px-8 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/fiche-poste')}
          className="flex items-center gap-2 mb-8 text-xs transition-colors"
          style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#aaa'}
          onMouseLeave={e => e.currentTarget.style.color = '#444'}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour aux documents
        </button>

        {/* Doc header card */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <cfg.Icon className="w-5 h-5" style={{ color: cfg.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    {doc.type}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: statusActive ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.08)',
                      color: statusActive ? '#34d399' : '#fbbf24',
                      border: `1px solid ${statusActive ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`,
                    }}
                  >
                    {statusActive ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {doc.status}
                  </span>
                  <span style={{ fontSize: 10, color: '#333', fontFamily: "'DM Mono', monospace" }}>{doc.version}</span>
                </div>
                <h1 className="text-xl font-semibold mb-1" style={{ color: '#f0f0f0', letterSpacing: '-0.3px' }}>
                  {doc.title}
                </h1>
                <p className="text-xs" style={{ color: '#444' }}>{doc.poste}</p>
              </div>
            </div>

            {/* Open document button */}
            <a
              href="#"
              onClick={e => { e.preventDefault(); navigate('/fiche-de-poste/create'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-shrink-0 transition-opacity"
              style={{ backgroundColor: '#0091ff', color: '#fff', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ouvrir le document
            </a>
          </div>

          {/* Meta row */}
          <div
            className="flex items-center gap-6 mt-5 pt-5 flex-wrap"
            style={{ borderTop: '1px solid #1a1a1a' }}
          >
            <MetaItem icon={Calendar} label="Mis à jour" value={doc.updatedAt} />
            <MetaItem icon={User}     label="Auteur"     value={doc.author} />
            <MetaItem icon={Users}    label="Membres"    value={`${members.length} concerné${members.length > 1 ? 's' : ''}`} />
          </div>
        </div>

        {/* Members table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <h2 className="text-sm font-semibold" style={{ color: '#e0e0e0' }}>
              Membres concernés
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#444' }}>
              Personnes liées à ce document
            </p>
          </div>

          {/* Table header */}
          <div
            className="grid px-5 py-2.5 text-[10px] font-medium tracking-widest uppercase"
            style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 120px 100px', color: '#333', backgroundColor: '#0e0e0e' }}
          >
            <span>Membre</span>
            <span>Rôle</span>
            <span>Groupe</span>
            <span>Depuis</span>
            <span>Statut</span>
          </div>

          {/* Rows */}
          <div>
            {members.map((m, i) => (
              <div
                key={m.id}
                className="member-row grid items-center px-5 py-3.5 transition-colors"
                style={{
                  gridTemplateColumns: '2fr 1.5fr 1.5fr 120px 100px',
                  backgroundColor: '#111',
                  borderTop: i === 0 ? 'none' : '1px solid #161616',
                  cursor: 'default',
                }}
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center rounded-full text-[10px] font-semibold flex-shrink-0"
                    style={{
                      width: 30, height: 30,
                      backgroundColor: `${m.color}22`,
                      color: m.color,
                      border: `1px solid ${m.color}40`,
                    }}
                  >
                    {m.initials}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#d0d0d0' }}>{m.name}</span>
                </div>

                {/* Role */}
                <span className="text-xs" style={{ color: '#666' }}>{m.role}</span>

                {/* Group */}
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs w-fit"
                  style={{
                    backgroundColor: `${m.color}12`,
                    color: m.color,
                    border: `1px solid ${m.color}25`,
                  }}
                >
                  {m.group}
                </span>

                {/* Since */}
                <span className="text-xs" style={{ color: '#444', fontFamily: "'DM Mono', monospace" }}>{m.since}</span>

                {/* Status */}
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs w-fit"
                  style={{
                    backgroundColor: 'rgba(52,211,153,0.08)',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.2)',
                  }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5" style={{ color: '#333' }} />
      <span className="text-xs" style={{ color: '#444' }}>{label}:</span>
      <span className="text-xs font-medium" style={{ color: '#888' }}>{value}</span>
    </div>
  );
}
