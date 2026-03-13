import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar,
  Shield, Ruler, Weight, Heart, Activity,
  Star, Trophy, Edit3, MessageSquare,
  Clock, Target, Zap, BookOpen, CheckCircle2,
  PlayCircle, PauseCircle, Award, ChevronRight,
  Users, GraduationCap, BarChart2,
} from 'lucide-react';

const playersData: Record<string, {
  id: number; name: string; initials: string;
  email: string; phone: string; location: string;
  category: string; poste: string; dob: string;
  height: string; weight: string; foot: string;
  nationality: string; licence: string; joinedAt: string;
  status: string;
}> = {
  '1': {
    id: 1, name: 'Abdelmalek Smaili', initials: 'AS',
    email: 'abdelmalek.smaili@gmail.com', phone: '+216 55 123 456',
    location: 'Tunis, Tunisie', category: 'Minime', poste: 'Latéral gauche',
    dob: '5 juil. 2010', height: '1m62', weight: '48 kg', foot: 'Gauche',
    nationality: 'Tunisienne', licence: 'TN-2024-08712', joinedAt: '12 sept. 2022',
    status: 'active',
  },
};

const fallbackPlayer = {
  id: 0, name: 'Joueur Inconnu', initials: '??',
  email: '—', phone: '—', location: '—', category: '—', poste: '—',
  dob: '—', height: '—', weight: '—', foot: '—',
  nationality: '—', licence: '—', joinedAt: '—', status: 'active',
};

const TABS = [
  { id: 'infos',       label: 'Informations' },
  { id: 'matchs',      label: 'Matchs' },
  { id: 'seances',     label: 'Séances' },
  { id: 'performance', label: 'Performance' },
  { id: 'stats',       label: 'Statistiques' },
  { id: 'medical',     label: 'Médical' },
  { id: 'formation',   label: 'Formation' },
  { id: 'historique',  label: 'Historique' },
  { id: 'evaluations', label: 'Évaluations' },
  { id: 'documents',   label: 'Documents' },
];

type Comp = 'CL' | 'LL';
type Result = 'W' | 'L' | 'D';

interface Match {
  date: string; comp: Comp; home: string; away: string;
  hs: number; as: number; result: Result; min: string;
  g: number; a: number; yc: number; rc: number; playerHome: boolean;
}

const lastMatches: Match[] = [
  { date: '11.03.26', comp: 'CL', home: 'Real Madrid',   away: 'Manchester City', hs: 3, as: 0, result: 'W', min: "90'", g: 3, a: 0, yc: 0, rc: 0, playerHome: true  },
  { date: '06.03.26', comp: 'LL', home: 'Celta Vigo',    away: 'Real Madrid',     hs: 1, as: 2, result: 'W', min: "90'", g: 1, a: 0, yc: 0, rc: 0, playerHome: false },
  { date: '02.03.26', comp: 'LL', home: 'Real Madrid',   away: 'Getafe',          hs: 0, as: 1, result: 'L', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: true  },
  { date: '25.02.26', comp: 'CL', home: 'Real Madrid',   away: 'Benfica',         hs: 2, as: 1, result: 'W', min: "90'", g: 0, a: 2, yc: 0, rc: 0, playerHome: true  },
  { date: '21.02.26', comp: 'LL', home: 'Osasuna',       away: 'Real Madrid',     hs: 2, as: 1, result: 'L', min: "75'", g: 0, a: 1, yc: 0, rc: 0, playerHome: false },
  { date: '17.02.26', comp: 'CL', home: 'Benfica',       away: 'Real Madrid',     hs: 0, as: 1, result: 'W', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: false },
  { date: '14.02.26', comp: 'LL', home: 'Real Madrid',   away: 'Real Sociedad',   hs: 4, as: 1, result: 'W', min: "73'", g: 1, a: 0, yc: 0, rc: 0, playerHome: true  },
  { date: '08.02.26', comp: 'LL', home: 'Valencia',      away: 'Real Madrid',     hs: 0, as: 2, result: 'W', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: false },
  { date: '01.02.26', comp: 'LL', home: 'Real Madrid',   away: 'Rayo Vallecano',  hs: 2, as: 1, result: 'W', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: true  },
];

const resultBadge: Record<Result, string> = {
  W: 'bg-success-50 text-success-600 border border-success-200',
  L: 'bg-error-50   text-error-600   border border-error-200',
  D: 'bg-warning-50 text-warning-600 border border-warning-200',
};
const resultLabel: Record<Result, string> = { W: 'V', L: 'D', D: 'N' };
const compBadge: Record<Comp, string> = {
  CL: 'bg-brand-50 text-brand-600',
  LL: 'bg-warning-50 text-warning-600',
};
const CardIcon = ({ color }: { color: string }) => (
  <div style={{ width: 12, height: 16, borderRadius: 2, background: color, margin: '0 auto' }} />
);

type CompFilter = 'ALL' | 'CL' | 'LL';

function MatchsTab() {
  const [compFilter, setCompFilter] = useState<CompFilter>('ALL');
  const filtered = compFilter === 'ALL' ? lastMatches : lastMatches.filter(m => m.comp === compFilter);
  const wins    = filtered.filter(m => m.result === 'W').length;
  const losses  = filtered.filter(m => m.result === 'L').length;
  const draws   = filtered.filter(m => m.result === 'D').length;
  const goals   = filtered.reduce((s, m) => s + m.g, 0);
  const assists = filtered.reduce((s, m) => s + m.a, 0);
  const summaryCards = [
    { label: 'Matchs joués',  value: filtered.length, icon: <Shield className="w-4 h-4 text-brand-600" />,   accent: false },
    { label: 'Victoires',     value: wins,            icon: <Trophy className="w-4 h-4 text-success-600" />, accent: false },
    { label: 'Défaites',      value: losses,          icon: <Target className="w-4 h-4 text-error-600" />,   accent: false },
    { label: 'Nuls',          value: draws,           icon: <Activity className="w-4 h-4 text-warning-600" />, accent: false },
    { label: 'Buts',          value: goals,           icon: <Zap className="w-4 h-4 text-brand-600" />,      accent: true  },
    { label: 'Passes déc.',   value: assists,         icon: <Star className="w-4 h-4 text-brand-600" />,     accent: true  },
  ];
  const filterOptions: { value: CompFilter; label: string }[] = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'CL',  label: 'Champions League' },
    { value: 'LL',  label: 'Liga' },
  ];
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 md:grid-cols-6 border border-neutral-200 rounded-lg mb-6 divide-x divide-neutral-200 bg-neutral-50">
        {summaryCards.map(({ label, value, icon, accent }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 py-4 px-2">
            <div className="p-2 bg-brand-50 rounded-lg">{icon}</div>
            <span className="text-xs text-subtext-color text-center leading-tight">{label}</span>
            <span className={`text-lg font-semibold ${accent ? 'text-brand-600' : 'text-default-font'}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-default-font">Derniers matchs</h2>
          <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">{filtered.length} matchs</span>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg">
          {filterOptions.map(({ value, label }) => (
            <button key={value} onClick={() => setCompFilter(value)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors border-none cursor-pointer ${
                compFilter === value ? 'bg-neutral-50 text-brand-600 shadow-sm border border-neutral-200' : 'bg-transparent text-subtext-color hover:text-default-font'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color w-24">Date</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color w-12">Comp.</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color">Match</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color w-14">Résultat</th>
              <th className="text-center px-3 py-3 w-10" title="Minutes jouées"><Clock className="w-3.5 h-3.5 text-subtext-color mx-auto" /></th>
              <th className="text-center px-3 py-3 w-10" title="Buts"><span className="text-xs font-medium text-subtext-color">⚽</span></th>
              <th className="text-center px-3 py-3 w-10" title="Passes décisives"><span className="text-xs font-medium text-subtext-color">A</span></th>
              <th className="text-center px-3 py-3 w-10" title="Cartons jaunes"><CardIcon color="#d97706" /></th>
              <th className="text-center px-3 py-3 w-10" title="Cartons rouges"><CardIcon color="#dc2626" /></th>
            </tr>
          </thead>
          <tbody className="bg-neutral-50 divide-y divide-neutral-200">
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-subtext-color text-sm">Aucun match pour cette compétition.</td></tr>
            ) : null}
            {filtered.map((m, i) => (
              <tr key={i} className="hover:bg-neutral-100 transition-colors">
                <td className="px-4 py-3 text-subtext-color text-xs tabular-nums">{m.date}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${compBadge[m.comp]}`}>{m.comp}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-4 max-w-[220px]">
                      <span className={`text-sm ${m.playerHome ? 'font-semibold text-default-font' : 'text-subtext-color'}`}>{m.home}</span>
                      <span className={`tabular-nums text-sm font-semibold ${m.playerHome ? 'text-default-font' : 'text-subtext-color'}`}>{m.hs}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 max-w-[220px]">
                      <span className={`text-sm ${!m.playerHome ? 'font-semibold text-default-font' : 'text-subtext-color'}`}>{m.away}</span>
                      <span className={`tabular-nums text-sm font-semibold ${!m.playerHome ? 'text-default-font' : 'text-subtext-color'}`}>{m.as}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${resultBadge[m.result]}`}>{resultLabel[m.result]}</span>
                </td>
                <td className="px-3 py-3 text-center text-subtext-color text-xs tabular-nums">{m.min}</td>
                <td className="px-3 py-3 text-center"><span className={`text-sm font-semibold ${m.g > 0 ? 'text-brand-600' : 'text-subtext-color'}`}>{m.g}</span></td>
                <td className="px-3 py-3 text-center"><span className={`text-sm font-semibold ${m.a > 0 ? 'text-brand-600' : 'text-subtext-color'}`}>{m.a}</span></td>
                <td className="px-3 py-3 text-center"><span className={`text-sm ${m.yc > 0 ? 'text-warning-600 font-semibold' : 'text-subtext-color'}`}>{m.yc}</span></td>
                <td className="px-3 py-3 text-center"><span className={`text-sm ${m.rc > 0 ? 'text-error-600 font-semibold' : 'text-subtext-color'}`}>{m.rc}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Presence = 'present' | 'absent' | 'justifie' | 'blesse' | 'retard';
type SessionType = 'Entraînement' | 'Match' | 'Récupération' | 'Préparation physique' | 'Tactique';

interface Session {
  date: string; name: string; type: SessionType; duree: string; presence: Presence;
}

const sessions: Session[] = [
  { date: '11.03.26', name: 'Entraînement collectif — Mardi matin',        type: 'Entraînement',         duree: '90 min', presence: 'present'  },
  { date: '09.03.26', name: 'Séance tactique pré-CL',                      type: 'Tactique',             duree: '60 min', presence: 'present'  },
  { date: '07.03.26', name: 'Récupération post-match',                     type: 'Récupération',         duree: '45 min', presence: 'present'  },
  { date: '05.03.26', name: 'Entraînement collectif — Mercredi',           type: 'Entraînement',         duree: '90 min', presence: 'retard'   },
  { date: '03.03.26', name: 'Préparation physique — Force',                type: 'Préparation physique', duree: '75 min', presence: 'present'  },
  { date: '01.03.26', name: 'Entraînement collectif — Samedi',             type: 'Entraînement',         duree: '90 min', presence: 'absent'   },
  { date: '27.02.26', name: 'Séance vidéo + tactique',                     type: 'Tactique',             duree: '50 min', presence: 'present'  },
  { date: '25.02.26', name: 'Entraînement veille de match',                type: 'Entraînement',         duree: '60 min', presence: 'present'  },
  { date: '23.02.26', name: 'Préparation physique — Vitesse',              type: 'Préparation physique', duree: '70 min', presence: 'blesse'   },
  { date: '21.02.26', name: 'Entraînement collectif — Vendredi',           type: 'Entraînement',         duree: '90 min', presence: 'blesse'   },
  { date: '19.02.26', name: 'Récupération active',                         type: 'Récupération',         duree: '40 min', presence: 'justifie' },
  { date: '17.02.26', name: 'Séance tactique pré-CL Benfica',              type: 'Tactique',             duree: '60 min', presence: 'present'  },
  { date: '15.02.26', name: 'Entraînement collectif — Samedi matin',       type: 'Entraînement',         duree: '90 min', presence: 'present'  },
  { date: '13.02.26', name: 'Préparation physique — Endurance',            type: 'Préparation physique', duree: '80 min', presence: 'present'  },
  { date: '11.02.26', name: 'Entraînement collectif — Mardi',              type: 'Entraînement',         duree: '90 min', presence: 'absent'   },
  { date: '09.02.26', name: 'Récupération post-Valencia',                  type: 'Récupération',         duree: '45 min', presence: 'present'  },
  { date: '07.02.26', name: 'Séance finition — Attaquants',                type: 'Entraînement',         duree: '75 min', presence: 'retard'   },
  { date: '05.02.26', name: 'Entraînement collectif — Mercredi',           type: 'Entraînement',         duree: '90 min', presence: 'present'  },
];

const presenceConfig: Record<Presence, { label: string; badge: string }> = {
  present:  { label: 'Présent',   badge: 'bg-success-50 text-success-600 border border-success-200' },
  absent:   { label: 'Absent',    badge: 'bg-error-50 text-error-600 border border-error-200'       },
  justifie: { label: 'Justifié',  badge: 'bg-warning-50 text-warning-600 border border-warning-200' },
  blesse:   { label: 'Blessé',    badge: 'bg-error-50 text-error-600 border border-error-200'       },
  retard:   { label: 'Retard',    badge: 'bg-brand-50 text-brand-600 border border-brand-200'       },
};

const KpiIcon = ({ type }: { type: 'total' | 'present' | 'absent' | 'justifie' | 'blesse' | 'retard' }) => {
  const icons: Record<string, JSX.Element> = {
    total: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    present: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>),
    absent: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
    justifie: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>),
    blesse: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M12 8v4l3 3"/></svg>),
    retard: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  };
  return icons[type];
};

const kpiCards: { key: keyof typeof counts; label: string; iconType: 'total'|'present'|'absent'|'justifie'|'blesse'|'retard'; iconBg: string; iconColor: string; valueClass: string }[] = [
  { key: 'total',    label: 'Séances totales', iconType: 'total',    iconBg: 'bg-brand-50',   iconColor: 'text-brand-600',   valueClass: 'text-default-font'  },
  { key: 'present',  label: 'Présent',         iconType: 'present',  iconBg: 'bg-success-50', iconColor: 'text-success-600', valueClass: 'text-success-600'   },
  { key: 'absent',   label: 'Absent',          iconType: 'absent',   iconBg: 'bg-error-50',   iconColor: 'text-error-600',   valueClass: 'text-error-600'     },
  { key: 'justifie', label: 'Justifié',        iconType: 'justifie', iconBg: 'bg-warning-50', iconColor: 'text-warning-600', valueClass: 'text-warning-600'   },
  { key: 'blesse',   label: 'Blessé',          iconType: 'blesse',   iconBg: 'bg-error-50',   iconColor: 'text-error-600',   valueClass: 'text-error-600'     },
  { key: 'retard',   label: 'Retard',          iconType: 'retard',   iconBg: 'bg-brand-50',   iconColor: 'text-brand-600',   valueClass: 'text-brand-600'     },
];

const counts = {
  total:    sessions.length,
  present:  sessions.filter(s => s.presence === 'present').length,
  absent:   sessions.filter(s => s.presence === 'absent').length,
  justifie: sessions.filter(s => s.presence === 'justifie').length,
  blesse:   sessions.filter(s => s.presence === 'blesse').length,
  retard:   sessions.filter(s => s.presence === 'retard').length,
};

function SeancesTab() {
  const tauxPresence = Math.round((counts.present / counts.total) * 100);
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 md:grid-cols-6 border border-neutral-200 rounded-lg mb-6 divide-x divide-neutral-200 bg-neutral-50">
        {kpiCards.map(({ key, label, iconType, iconBg, iconColor, valueClass }) => (
          <div key={key} className="flex flex-col items-center gap-1.5 py-4 px-2">
            <div className={`w-9 h-9 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}><KpiIcon type={iconType} /></div>
            <span className="text-xs text-subtext-color text-center leading-tight">{label}</span>
            <span className={`text-lg font-semibold ${valueClass}`}>{counts[key]}</span>
          </div>
        ))}
      </div>
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-subtext-color">Taux de présence</span>
          <span className="text-sm font-semibold text-success-600">{tauxPresence}%</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-success-600 rounded-full transition-all" style={{ width: `${tauxPresence}%` }} />
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {[
            { label: 'Présent',  pct: Math.round((counts.present  / counts.total) * 100), dot: 'bg-success-600' },
            { label: 'Absent',   pct: Math.round((counts.absent   / counts.total) * 100), dot: 'bg-error-600'   },
            { label: 'Blessé',   pct: Math.round((counts.blesse   / counts.total) * 100), dot: 'bg-error-200'   },
            { label: 'Justifié', pct: Math.round((counts.justifie / counts.total) * 100), dot: 'bg-warning-600' },
            { label: 'Retard',   pct: Math.round((counts.retard   / counts.total) * 100), dot: 'bg-brand-600'   },
          ].map(({ label, pct, dot }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
              <span className="text-xs text-subtext-color">{label} <span className="font-medium text-default-font">{pct}%</span></span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-default-font">Présences aux séances</h2>
        <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">{sessions.length} séances</span>
      </div>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color w-24">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color">Nom de la séance</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-subtext-color w-24">Durée</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-subtext-color w-32">Présence</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-50 divide-y divide-neutral-200">
            {sessions.map((s, i) => (
              <tr key={i} className="hover:bg-neutral-100 transition-colors">
                <td className="px-4 py-3 text-xs text-subtext-color tabular-nums whitespace-nowrap">{s.date}</td>
                <td className="px-4 py-3"><span className="text-sm text-default-font">{s.name}</span></td>
                <td className="px-4 py-3 text-center text-xs text-subtext-color tabular-nums">{s.duree}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${presenceConfig[s.presence].badge}`}>{presenceConfig[s.presence].label}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface Questionnaire {
  id: number; nom: string; coach: string; envoyes: number;
  startDate: string; reponses: number; statut: 'actif' | 'termine' | 'en_attente';
}

const questionnaires: Questionnaire[] = [
  { id: 1, nom: 'Hooper',                coach: 'Coach Hatem', envoyes: 7,  startDate: '17/08/2024', reponses: 6,  statut: 'actif'      },
  { id: 2, nom: 'Bien-être général',     coach: 'Coach Hatem', envoyes: 12, startDate: '02/09/2024', reponses: 12, statut: 'termine'    },
  { id: 3, nom: 'Charge perçue (RPE)',   coach: 'Coach Slim',  envoyes: 9,  startDate: '15/09/2024', reponses: 7,  statut: 'actif'      },
  { id: 4, nom: 'Récupération post-match',coach: 'Coach Slim', envoyes: 5,  startDate: '01/10/2024', reponses: 3,  statut: 'en_attente' },
  { id: 5, nom: 'Motivation & confiance',coach: 'Coach Hatem', envoyes: 10, startDate: '14/10/2024', reponses: 9,  statut: 'actif'      },
];

const statutConfig: Record<Questionnaire['statut'], { label: string; badge: string }> = {
  actif:      { label: 'Actif',      badge: 'bg-success-50 text-success-600 border border-success-200' },
  termine:    { label: 'Terminé',    badge: 'bg-neutral-100 text-subtext-color border border-neutral-200' },
  en_attente: { label: 'En attente', badge: 'bg-warning-50 text-warning-600 border border-warning-200' },
};

interface QInstance {
  num: number; label: string; date: string;
  score: number | null; stress: number | null;
  courbature: number | null; fatigue: number | null; sleep: number | null;
}

const questionnaireInstances: Record<number, QInstance[]> = {
  1: [
    { num:1, label:'Questionnaire 1 : Indice de Hooper', date:'12/02/2024', score:14, stress:1,  courbature:14, fatigue:17, sleep:3 },
    { num:2, label:'Questionnaire 2 : Indice de Hooper', date:'13/02/2024', score:18, stress:1,  courbature:14, fatigue:17, sleep:3 },
    { num:3, label:'Questionnaire 3 : Indice de Hooper', date:'14/02/2024', score:12, stress:1,  courbature:14, fatigue:17, sleep:3 },
    { num:4, label:'Questionnaire 4 : Indice de Hooper', date:'15/02/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:5, label:'Questionnaire 5 : Indice de Hooper', date:'16/02/2024', score:14, stress:1,  courbature:14, fatigue:17, sleep:4 },
    { num:6, label:'Questionnaire 6 : Indice de Hooper', date:'17/02/2024', score:16, stress:2,  courbature:12, fatigue:15, sleep:3 },
    { num:7, label:'Questionnaire 7 : Indice de Hooper', date:'18/02/2024', score:10, stress:3,  courbature:16, fatigue:19, sleep:2 },
  ],
  2: [
    { num:1,  label:'Questionnaire 1 : Bien-être général', date:'02/09/2024', score:17, stress:2, courbature:13, fatigue:16, sleep:4 },
    { num:2,  label:'Questionnaire 2 : Bien-être général', date:'09/09/2024', score:15, stress:3, courbature:15, fatigue:18, sleep:3 },
    { num:3,  label:'Questionnaire 3 : Bien-être général', date:'16/09/2024', score:19, stress:1, courbature:11, fatigue:14, sleep:5 },
    { num:4,  label:'Questionnaire 4 : Bien-être général', date:'23/09/2024', score:13, stress:4, courbature:17, fatigue:16, sleep:3 },
    { num:5,  label:'Questionnaire 5 : Bien-être général', date:'30/09/2024', score:20, stress:1, courbature:10, fatigue:13, sleep:5 },
    { num:6,  label:'Questionnaire 6 : Bien-être général', date:'07/10/2024', score:16, stress:2, courbature:14, fatigue:17, sleep:4 },
    { num:7,  label:'Questionnaire 7 : Bien-être général', date:'14/10/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:8,  label:'Questionnaire 8 : Bien-être général', date:'21/10/2024', score:18, stress:1, courbature:12, fatigue:15, sleep:4 },
    { num:9,  label:'Questionnaire 9 : Bien-être général', date:'28/10/2024', score:14, stress:3, courbature:16, fatigue:18, sleep:3 },
    { num:10, label:'Questionnaire 10 : Bien-être général',date:'04/11/2024', score:17, stress:2, courbature:13, fatigue:16, sleep:4 },
    { num:11, label:'Questionnaire 11 : Bien-être général',date:'11/11/2024', score:11, stress:4, courbature:18, fatigue:19, sleep:2 },
    { num:12, label:'Questionnaire 12 : Bien-être général',date:'18/11/2024', score:20, stress:1, courbature:10, fatigue:12, sleep:5 },
  ],
  3: [
    { num:1, label:'Questionnaire 1 : Charge perçue (RPE)', date:'15/09/2024', score:16, stress:2, courbature:14, fatigue:16, sleep:4 },
    { num:2, label:'Questionnaire 2 : Charge perçue (RPE)', date:'22/09/2024', score:14, stress:3, courbature:16, fatigue:18, sleep:3 },
    { num:3, label:'Questionnaire 3 : Charge perçue (RPE)', date:'29/09/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:4, label:'Questionnaire 4 : Charge perçue (RPE)', date:'06/10/2024', score:18, stress:1, courbature:12, fatigue:15, sleep:5 },
    { num:5, label:'Questionnaire 5 : Charge perçue (RPE)', date:'13/10/2024', score:12, stress:4, courbature:17, fatigue:19, sleep:2 },
    { num:6, label:'Questionnaire 6 : Charge perçue (RPE)', date:'20/10/2024', score:15, stress:2, courbature:13, fatigue:16, sleep:4 },
    { num:7, label:'Questionnaire 7 : Charge perçue (RPE)', date:'27/10/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:8, label:'Questionnaire 8 : Charge perçue (RPE)', date:'03/11/2024', score:17, stress:1, courbature:11, fatigue:14, sleep:5 },
    { num:9, label:'Questionnaire 9 : Charge perçue (RPE)', date:'10/11/2024', score:13, stress:3, courbature:15, fatigue:17, sleep:3 },
  ],
  4: [
    { num:1, label:'Questionnaire 1 : Récupération post-match', date:'01/10/2024', score:15, stress:2, courbature:15, fatigue:16, sleep:4 },
    { num:2, label:'Questionnaire 2 : Récupération post-match', date:'08/10/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:3, label:'Questionnaire 3 : Récupération post-match', date:'15/10/2024', score:18, stress:1, courbature:12, fatigue:14, sleep:5 },
    { num:4, label:'Questionnaire 4 : Récupération post-match', date:'22/10/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:5, label:'Questionnaire 5 : Récupération post-match', date:'29/10/2024', score:16, stress:3, courbature:14, fatigue:17, sleep:3 },
  ],
  5: [
    { num:1,  label:'Questionnaire 1 : Motivation & confiance', date:'14/10/2024', score:17, stress:2, courbature:13, fatigue:15, sleep:4 },
    { num:2,  label:'Questionnaire 2 : Motivation & confiance', date:'21/10/2024', score:19, stress:1, courbature:11, fatigue:13, sleep:5 },
    { num:3,  label:'Questionnaire 3 : Motivation & confiance', date:'28/10/2024', score:14, stress:3, courbature:16, fatigue:18, sleep:3 },
    { num:4,  label:'Questionnaire 4 : Motivation & confiance', date:'04/11/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:5,  label:'Questionnaire 5 : Motivation & confiance', date:'11/11/2024', score:16, stress:2, courbature:14, fatigue:16, sleep:4 },
    { num:6,  label:'Questionnaire 6 : Motivation & confiance', date:'18/11/2024', score:12, stress:4, courbature:18, fatigue:19, sleep:2 },
    { num:7,  label:'Questionnaire 7 : Motivation & confiance', date:'25/11/2024', score:18, stress:1, courbature:11, fatigue:14, sleep:5 },
    { num:8,  label:'Questionnaire 8 : Motivation & confiance', date:'02/12/2024', score:15, stress:3, courbature:15, fatigue:17, sleep:3 },
    { num:9,  label:'Questionnaire 9 : Motivation & confiance', date:'09/12/2024', score:null,stress:null,courbature:null,fatigue:null,sleep:null },
    { num:10, label:'Questionnaire 10 : Motivation & confiance',date:'16/12/2024', score:20, stress:1, courbature:10, fatigue:12, sleep:5 },
  ],
};

function heatColor(val: number | null, max: number): string {
  if (val === null) return 'var(--color-background-secondary, #f5f5f5)';
  const ratio = val / max;
  if (ratio >= 0.85) return '#e53e3e';
  if (ratio >= 0.70) return '#fc6060';
  if (ratio >= 0.55) return '#fc8686';
  if (ratio >= 0.40) return '#6b1212';
  return '#3d0a0a';
}

function scoreColor(score: number | null): string {
  if (score === null) return '';
  if (score >= 17) return 'text-success-600';
  if (score >= 13) return 'text-warning-600';
  return 'text-error-600';
}

function QuestionnaireDetail({ q, onBack }: { q: Questionnaire; onBack: () => void }) {
  const instances = questionnaireInstances[q.id] ?? [];
  const heatRows: { label: string; key: keyof QInstance; max: number }[] = [
    { label: 'Fatigue',    key: 'fatigue',    max: 20 },
    { label: 'Stress',     key: 'stress',     max: 5  },
    { label: 'Courbature', key: 'courbature', max: 20 },
    { label: 'Sleep',      key: 'sleep',      max: 5  },
  ];
  return (
    <div className="p-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 mb-5 bg-transparent border-none cursor-pointer p-0 transition-colors">
        <ArrowLeft className="w-4 h-4" />Retour aux questionnaires
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-default-font">{q.nom}</h2>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutConfig[q.statut].badge}`}>{statutConfig[q.statut].label}</span>
          </div>
          <p className="text-xs text-subtext-color mt-0.5">{q.coach} · Depuis le {q.startDate}</p>
        </div>
      </div>
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 mb-6">
        <h3 className="text-xs font-semibold text-subtext-color uppercase tracking-wide mb-4">Carte de chaleur</h3>
        <div style={{ width: '100%' }}>
          <div className="flex mb-2" style={{ paddingLeft: 96 }}>
            {instances.map((_, i) => (
              <div key={i} style={{ flex: 1, minWidth: 0 }} className="text-center text-xs text-subtext-color font-medium">{i + 1}</div>
            ))}
          </div>
          {heatRows.map(({ label, key, max }) => (
            <div key={label} className="flex items-center mb-2">
              <div style={{ width: 96, flexShrink: 0 }} className="text-xs text-subtext-color pr-3 text-right">{label}</div>
              {instances.map((inst, ci) => {
                const val = inst[key] as number | null;
                const bg = heatColor(val, max);
                return (
                  <div key={ci} title={val !== null ? `${label}: ${val}` : 'Non renseigné'}
                    style={{ flex: 1, minWidth: 0, height: 32, borderRadius: 6, background: bg, margin: '0 3px' }} />
                );
              })}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-4" style={{ paddingLeft: 96 }}>
            <span className="text-xs text-subtext-color">Faible</span>
            {['#3d0a0a','#6b1212','#fc8686','#fc6060','#e53e3e'].map(c => (
              <div key={c} style={{ width: 20, height: 12, borderRadius: 3, background: c }} />
            ))}
            <span className="text-xs text-subtext-color">Élevé</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-semibold text-subtext-color uppercase tracking-wide">Tableau</h3>
        <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">{instances.length} envois</span>
      </div>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color" style={{ width: '38%' }}>Séances &amp; Matchs</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color" style={{ width: '16%' }}>Date</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-warning-600" style={{ width: '12%' }}>Score</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color" style={{ width: '10%' }}>Stress</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color" style={{ width: '12%' }}>Courbature</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color" style={{ width: '12%' }}>Fatigue</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-50 divide-y divide-neutral-200">
            {instances.map((inst) => (
              <tr key={inst.num} className="hover:bg-neutral-100 transition-colors">
                <td className="px-4 py-3 text-sm text-default-font">{inst.label}</td>
                <td className="px-3 py-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-xs text-subtext-color tabular-nums">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {inst.date}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  {inst.score !== null
                    ? <span className={`text-sm font-semibold ${scoreColor(inst.score)}`}>{inst.score}/20</span>
                    : <span className="text-subtext-color text-sm">—</span>}
                </td>
                <td className="px-3 py-3 text-center text-sm text-default-font">{inst.stress !== null ? inst.stress : <span className="text-subtext-color">—</span>}</td>
                <td className="px-3 py-3 text-center text-sm text-default-font">{inst.courbature !== null ? inst.courbature : <span className="text-subtext-color">—</span>}</td>
                <td className="px-3 py-3 text-center">
                  {inst.fatigue !== null
                    ? <span className={inst.fatigue >= 17 ? 'text-error-600 text-sm font-semibold' : 'text-sm text-default-font'}>{inst.fatigue}</span>
                    : <span className="text-subtext-color text-sm">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerformanceTab() {
  const [detailId, setDetailId] = useState<number | null>(null);
  const detail = detailId !== null ? questionnaires.find(q => q.id === detailId) : null;
  if (detail) return <QuestionnaireDetail q={detail} onBack={() => setDetailId(null)} />;
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-sm font-semibold text-default-font">Liste de questionnaires</h2>
        <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">{questionnaires.length} questionnaires</span>
      </div>
      <div className="flex flex-col gap-3">
        {questionnaires.map((q) => {
          const tauxReponse = Math.round((q.reponses / q.envoyes) * 100);
          return (
            <button key={q.id} onClick={() => setDetailId(q.id)}
              className="w-full text-left bg-neutral-50 rounded-lg border border-neutral-200 hover:border-brand-600 transition-all cursor-pointer p-0">
              <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
                        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-default-font">{q.nom}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutConfig[q.statut].badge}`}>{statutConfig[q.statut].label}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-subtext-color">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                          {q.coach}
                        </span>
                        <span className="text-neutral-200 text-xs">·</span>
                        <span className="flex items-center gap-1 text-xs text-subtext-color">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          Depuis le {q.startDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-base font-semibold text-default-font">{q.envoyes}</div>
                      <div className="text-xs text-subtext-color">Envoyés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-semibold text-success-600">{q.reponses}</div>
                      <div className="text-xs text-subtext-color">Réponses</div>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `conic-gradient(var(--color-success-600, #16a34a) ${tauxReponse * 3.6}deg, var(--color-background-secondary, #e5e7eb) 0deg)` }}>
                        <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center">
                          <span className="text-xs font-semibold text-default-font">{tauxReponse}%</span>
                        </div>
                      </div>
                      <span className="text-xs text-subtext-color">Taux</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-subtext-color">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMATION TAB
// ─────────────────────────────────────────────────────────────────────────────

type FormationStatut = 'en_cours' | 'termine' | 'non_commence' | 'suspendu';
type FormationCategorie = 'Langue' | 'Mental' | 'Nutrition' | 'Réglementaire' | 'Leadership' | 'Tactique';

interface FormationModule {
  titre: string;
  duree: string;
  complete: boolean;
}

interface Formation {
  id: number;
  titre: string;
  categorie: FormationCategorie;
  description: string;
  formateur: string;
  dateDebut: string;
  dateFin: string;
  dureeTotal: string;
  statut: FormationStatut;
  progression: number;   // 0-100
  modules: FormationModule[];
  note: number | null;   // sur 5
  certifie: boolean;
}

const formations: Formation[] = [
  {
    id: 1,
    titre: 'Anglais pour footballeurs',
    categorie: 'Langue',
    description: 'Vocabulaire sportif, entretiens media, communication avec les coéquipiers étrangers.',
    formateur: 'Mme Leila Hamdi',
    dateDebut: '10/09/2024',
    dateFin: '30/04/2025',
    dureeTotal: '48 heures',
    statut: 'en_cours',
    progression: 62,
    note: null,
    certifie: false,
    modules: [
      { titre: 'Introduction & vocabulaire de base',   duree: '4h', complete: true  },
      { titre: 'Communication terrain & vestiaire',    duree: '6h', complete: true  },
      { titre: 'Entretiens et relations presse',        duree: '8h', complete: true  },
      { titre: 'Niveau intermédiaire — expression orale', duree: '10h', complete: false },
      { titre: 'Anglais professionnel avancé',          duree: '12h', complete: false },
      { titre: 'Examen de certification',               duree: '8h', complete: false },
    ],
  },
  {
    id: 2,
    titre: 'Préparation mentale & gestion du stress',
    categorie: 'Mental',
    description: 'Techniques de visualisation, contrôle des émotions, concentration et confiance en soi avant les matchs.',
    formateur: 'Dr. Karim Mansour',
    dateDebut: '01/10/2024',
    dateFin: '28/02/2025',
    dureeTotal: '24 heures',
    statut: 'termine',
    progression: 100,
    note: 4.5,
    certifie: true,
    modules: [
      { titre: 'Bases de la psychologie sportive',        duree: '4h', complete: true },
      { titre: 'Visualisation & routines pré-match',      duree: '6h', complete: true },
      { titre: 'Gestion du stress et de la pression',     duree: '6h', complete: true },
      { titre: 'Confiance en soi & leadership',           duree: '5h', complete: true },
      { titre: 'Évaluation finale',                       duree: '3h', complete: true },
    ],
  },
  {
    id: 3,
    titre: 'Nutrition sportive du footballeur',
    categorie: 'Nutrition',
    description: 'Alimentation pré et post-match, hydratation, compléments alimentaires autorisés, gestion du poids.',
    formateur: 'Mme Ines Trabelsi',
    dateDebut: '15/11/2024',
    dateFin: '15/03/2025',
    dureeTotal: '16 heures',
    statut: 'en_cours',
    progression: 45,
    note: null,
    certifie: false,
    modules: [
      { titre: 'Les macronutriments et l\'énergie',         duree: '3h', complete: true  },
      { titre: 'Nutrition pré-compétition',                  duree: '3h', complete: true  },
      { titre: 'Récupération et nutrition post-match',       duree: '4h', complete: false },
      { titre: 'Compléments & réglementation antidopage',   duree: '3h', complete: false },
      { titre: 'Plan nutritionnel personnalisé',             duree: '3h', complete: false },
    ],
  },
  {
    id: 4,
    titre: 'Règles du jeu & fair-play',
    categorie: 'Réglementaire',
    description: 'Lois du jeu FIFA, conduite sportive, respect de l\'arbitre, règlement disciplinaire du club.',
    formateur: 'M. Nabil Chahed',
    dateDebut: '01/09/2024',
    dateFin: '30/09/2024',
    dureeTotal: '8 heures',
    statut: 'termine',
    progression: 100,
    note: 5,
    certifie: true,
    modules: [
      { titre: 'Lois du jeu FIFA (édition 2024)',      duree: '3h', complete: true },
      { titre: 'Éthique sportive & fair-play',          duree: '2h', complete: true },
      { titre: 'Règlement intérieur du club',           duree: '2h', complete: true },
      { titre: 'Quiz de validation',                    duree: '1h', complete: true },
    ],
  },
  {
    id: 5,
    titre: 'Leadership & esprit d\'équipe',
    categorie: 'Leadership',
    description: 'Développer son rôle au sein du groupe, communication positive, gestion des conflits et capitanat.',
    formateur: 'Coach Hatem Jaziri',
    dateDebut: '01/02/2025',
    dateFin: '30/06/2025',
    dureeTotal: '20 heures',
    statut: 'non_commence',
    progression: 0,
    note: null,
    certifie: false,
    modules: [
      { titre: 'Comprendre son rôle dans le groupe',    duree: '4h', complete: false },
      { titre: 'Communication non-violente',             duree: '4h', complete: false },
      { titre: 'Gestion des conflits',                   duree: '4h', complete: false },
      { titre: 'Ateliers pratiques en équipe',           duree: '6h', complete: false },
      { titre: 'Bilan & certification',                  duree: '2h', complete: false },
    ],
  },
  {
    id: 6,
    titre: 'Analyse vidéo & compréhension tactique',
    categorie: 'Tactique',
    description: 'Lecture du jeu, analyse des schémas adverses, prise de décision rapide et positionnement.',
    formateur: 'Coach Slim Dridi',
    dateDebut: '01/10/2024',
    dateFin: '20/01/2025',
    dureeTotal: '30 heures',
    statut: 'suspendu',
    progression: 33,
    note: null,
    certifie: false,
    modules: [
      { titre: 'Introduction à l\'analyse vidéo',         duree: '4h', complete: true  },
      { titre: 'Schémas tactiques offensifs',              duree: '6h', complete: true  },
      { titre: 'Schémas tactiques défensifs',              duree: '6h', complete: false },
      { titre: 'Analyse des adversaires',                  duree: '8h', complete: false },
      { titre: 'Prise de décision & lecture du jeu',      duree: '6h', complete: false },
    ],
  },
];

const formationStatutConfig: Record<FormationStatut, { label: string; badge: string; icon: JSX.Element }> = {
  en_cours:     { label: 'En cours',       badge: 'bg-brand-50 text-brand-600 border border-brand-200',       icon: <PlayCircle className="w-3 h-3" /> },
  termine:      { label: 'Terminé',        badge: 'bg-success-50 text-success-600 border border-success-200', icon: <CheckCircle2 className="w-3 h-3" /> },
  non_commence: { label: 'Non commencé',   badge: 'bg-neutral-100 text-subtext-color border border-neutral-200', icon: <PauseCircle className="w-3 h-3" /> },
  suspendu:     { label: 'Suspendu',       badge: 'bg-error-50 text-error-600 border border-error-200',       icon: <PauseCircle className="w-3 h-3" /> },
};

const categorieConfig: Record<FormationCategorie, { bg: string; text: string; dot: string }> = {
  Langue:          { bg: 'bg-brand-50',   text: 'text-brand-600',   dot: 'bg-brand-600'   },
  Mental:          { bg: 'bg-warning-50', text: 'text-warning-600', dot: 'bg-warning-600' },
  Nutrition:       { bg: 'bg-success-50', text: 'text-success-600', dot: 'bg-success-600' },
  Réglementaire:   { bg: 'bg-neutral-100',text: 'text-subtext-color',dot: 'bg-neutral-400'},
  Leadership:      { bg: 'bg-error-50',   text: 'text-error-600',   dot: 'bg-error-600'   },
  Tactique:        { bg: 'bg-brand-50',   text: 'text-brand-600',   dot: 'bg-brand-600'   },
};

const categorieIconMap: Record<FormationCategorie, JSX.Element> = {
  Langue:          <BookOpen className="w-4 h-4" />,
  Mental:          <Heart className="w-4 h-4" />,
  Nutrition:       <Activity className="w-4 h-4" />,
  Réglementaire:   <Shield className="w-4 h-4" />,
  Leadership:      <Users className="w-4 h-4" />,
  Tactique:        <BarChart2 className="w-4 h-4" />,
};

function StarRating({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(note) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={i <= Math.round(note) ? 'text-warning-600' : 'text-neutral-300'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="text-xs text-subtext-color ml-1">{note}/5</span>
    </div>
  );
}

function FormationDetail({ f, onBack }: { f: Formation; onBack: () => void }) {
  const completedModules = f.modules.filter(m => m.complete).length;
  const catConf = categorieConfig[f.categorie];
  const statConf = formationStatutConfig[f.statut];

  return (
    <div className="p-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 mb-5 bg-transparent border-none cursor-pointer p-0 transition-colors">
        <ArrowLeft className="w-4 h-4" />Retour aux formations
      </button>

      {/* Header */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 mb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${catConf.bg} ${catConf.text} flex items-center justify-center flex-shrink-0`}>
              {categorieIconMap[f.categorie]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-sm font-semibold text-default-font">{f.titre}</h2>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statConf.badge}`}>
                  {statConf.icon}{statConf.label}
                </span>
                {f.certifie && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning-50 text-warning-600 border border-warning-200">
                    <Award className="w-3 h-3" />Certifié
                  </span>
                )}
              </div>
              <p className="text-xs text-subtext-color leading-relaxed max-w-lg">{f.description}</p>
            </div>
          </div>
          {f.note !== null && (
            <div className="flex-shrink-0">
              <StarRating note={f.note} />
            </div>
          )}
        </div>

        {/* Meta info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
          {[
            { icon: <GraduationCap className="w-3.5 h-3.5 text-brand-600" />, label: 'Formateur',   value: f.formateur  },
            { icon: <Calendar className="w-3.5 h-3.5 text-brand-600" />,     label: 'Début',        value: f.dateDebut  },
            { icon: <Calendar className="w-3.5 h-3.5 text-brand-600" />,     label: 'Fin prévue',   value: f.dateFin    },
            { icon: <Clock className="w-3.5 h-3.5 text-brand-600" />,        label: 'Durée totale', value: f.dureeTotal },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-50 rounded-md flex-shrink-0">{icon}</div>
              <div>
                <div className="text-xs text-subtext-color">{label}</div>
                <div className="text-xs font-medium text-default-font">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-subtext-color">Progression globale</span>
          <span className={`text-sm font-semibold ${f.progression === 100 ? 'text-success-600' : 'text-brand-600'}`}>
            {f.progression}%
          </span>
        </div>
        <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all ${f.progression === 100 ? 'bg-success-600' : 'bg-brand-600'}`}
            style={{ width: `${f.progression}%` }}
          />
        </div>
        <span className="text-xs text-subtext-color">{completedModules} module{completedModules > 1 ? 's' : ''} complété{completedModules > 1 ? 's' : ''} sur {f.modules.length}</span>
      </div>

      {/* Modules */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-semibold text-subtext-color uppercase tracking-wide">Modules</h3>
        <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">{f.modules.length} modules</span>
      </div>

      <div className="flex flex-col gap-2">
        {f.modules.map((mod, idx) => (
          <div key={idx}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
              mod.complete
                ? 'bg-success-50 border-success-200'
                : 'bg-neutral-50 border-neutral-200'
            }`}>
            {/* Step number */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              mod.complete ? 'bg-success-600 text-white' : 'bg-neutral-100 text-subtext-color'
            }`}>
              {mod.complete
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                : idx + 1}
            </div>
            <span className={`flex-1 text-sm ${mod.complete ? 'text-success-600 font-medium' : 'text-default-font'}`}>
              {mod.titre}
            </span>
            <span className="text-xs text-subtext-color tabular-nums">{mod.duree}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type FormationFilter = 'TOUS' | FormationStatut;

function FormationTab() {
  const [detailId, setDetailId] = useState<number | null>(null);
  const [filter, setFilter]     = useState<FormationFilter>('TOUS');

  const detail = detailId !== null ? formations.find(f => f.id === detailId) : null;
  if (detail) return <FormationDetail f={detail} onBack={() => setDetailId(null)} />;

  const filtered = filter === 'TOUS' ? formations : formations.filter(f => f.statut === filter);

  const totalFormations  = formations.length;
  const terminees        = formations.filter(f => f.statut === 'termine').length;
  const enCours          = formations.filter(f => f.statut === 'en_cours').length;
  const nonCommence      = formations.filter(f => f.statut === 'non_commence').length;
  const certifications   = formations.filter(f => f.certifie).length;
  const heuresTotal      = formations.reduce((s, f) => {
    const h = parseInt(f.dureeTotal.replace(' heures', ''));
    return s + (isNaN(h) ? 0 : h);
  }, 0);
  const heuresCompleted  = formations.reduce((s, f) => {
    const h = parseInt(f.dureeTotal.replace(' heures', ''));
    const completed = isNaN(h) ? 0 : Math.round(h * f.progression / 100);
    return s + completed;
  }, 0);

  const kpis = [
    { label: 'Formations',     value: totalFormations, icon: <BookOpen className="w-4 h-4 text-brand-600" />,   cls: 'text-default-font' },
    { label: 'Terminées',      value: terminees,       icon: <CheckCircle2 className="w-4 h-4 text-success-600" />, cls: 'text-success-600' },
    { label: 'En cours',       value: enCours,         icon: <PlayCircle className="w-4 h-4 text-brand-600" />,  cls: 'text-brand-600'   },
    { label: 'Non commencées', value: nonCommence,     icon: <PauseCircle className="w-4 h-4 text-subtext-color" />, cls: 'text-subtext-color' },
    { label: 'Certifications', value: certifications,  icon: <Award className="w-4 h-4 text-warning-600" />,    cls: 'text-warning-600' },
    { label: `H. complétées`,  value: `${heuresCompleted}h`, icon: <Clock className="w-4 h-4 text-brand-600" />, cls: 'text-brand-600' },
  ];

  const filterOptions: { value: FormationFilter; label: string }[] = [
    { value: 'TOUS',           label: 'Toutes'         },
    { value: 'en_cours',       label: 'En cours'       },
    { value: 'termine',        label: 'Terminées'      },
    { value: 'non_commence',   label: 'Non commencées' },
    { value: 'suspendu',       label: 'Suspendues'     },
  ];

  return (
    <div className="p-6">

      {/* KPI strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 border border-neutral-200 rounded-lg mb-6 divide-x divide-neutral-200 bg-neutral-50">
        {kpis.map(({ label, value, icon, cls }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 py-4 px-2">
            <div className="p-2 bg-brand-50 rounded-lg">{icon}</div>
            <span className="text-xs text-subtext-color text-center leading-tight">{label}</span>
            <span className={`text-lg font-semibold ${cls}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Progress bar global */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-subtext-color">Heures de formation complétées</span>
          <span className="text-sm font-semibold text-brand-600">{heuresCompleted}h / {heuresTotal}h</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${Math.round(heuresCompleted / heuresTotal * 100)}%` }} />
        </div>
      </div>

      {/* Section header + filter */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-default-font">Liste des formations</h2>
          <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">{filtered.length} formations</span>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg flex-wrap">
          {filterOptions.map(({ value, label }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors border-none cursor-pointer ${
                filter === value
                  ? 'bg-neutral-50 text-brand-600 shadow-sm border border-neutral-200'
                  : 'bg-transparent text-subtext-color hover:text-default-font'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Formation cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-subtext-color text-sm">
            Aucune formation pour ce filtre.
          </div>
        )}
        {filtered.map((f) => {
          const statConf = formationStatutConfig[f.statut];
          const catConf  = categorieConfig[f.categorie];
          const completedCount = f.modules.filter(m => m.complete).length;

          return (
            <button key={f.id} onClick={() => setDetailId(f.id)}
              className="w-full text-left bg-neutral-50 rounded-lg border border-neutral-200 hover:border-brand-600 transition-all cursor-pointer p-0 group">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">

                  {/* Left — icon + info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg ${catConf.bg} ${catConf.text} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {categorieIconMap[f.categorie]}
                    </div>
                    <div className="min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-semibold text-default-font">{f.titre}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statConf.badge}`}>
                          {statConf.icon}{statConf.label}
                        </span>
                        {f.certifie && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning-50 text-warning-600 border border-warning-200">
                            <Award className="w-3 h-3" />Certifié
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${catConf.bg} ${catConf.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${catConf.dot}`} />
                          {f.categorie}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-subtext-color">
                          <GraduationCap className="w-3 h-3" />{f.formateur}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-subtext-color">
                          <Clock className="w-3 h-3" />{f.dureeTotal}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${f.progression === 100 ? 'bg-success-600' : 'bg-brand-600'}`}
                            style={{ width: `${f.progression}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium flex-shrink-0 ${f.progression === 100 ? 'text-success-600' : 'text-brand-600'}`}>
                          {f.progression}%
                        </span>
                        <span className="text-xs text-subtext-color flex-shrink-0">
                          {completedCount}/{f.modules.length} modules
                        </span>
                      </div>

                      {/* Note */}
                      {f.note !== null && (
                        <div className="mt-2">
                          <StarRating note={f.note} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right — dates + arrow */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="text-xs text-subtext-color">Début</div>
                      <div className="text-xs font-medium text-default-font tabular-nums">{f.dateDebut}</div>
                      <div className="text-xs text-subtext-color mt-1">Fin prévue</div>
                      <div className="text-xs font-medium text-default-font tabular-nums">{f.dateFin}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-subtext-color group-hover:text-brand-600 transition-colors" />
                  </div>

                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matchs');

  const player = playersData[id ?? ''] ?? fallbackPlayer;

  const stats = [
    { icon: <Ruler className="w-4 h-4 text-brand-600" />,    label: 'Taille',        value: player.height,      accent: false },
    { icon: <Weight className="w-4 h-4 text-brand-600" />,   label: 'Poids',         value: player.weight,      accent: false },
    { icon: <Heart className="w-4 h-4 text-brand-600" />,    label: 'Pied fort',     value: player.foot,        accent: false },
    { icon: <Activity className="w-4 h-4 text-brand-600" />, label: 'Nationalité',   value: player.nationality, accent: false },
    { icon: <Star className="w-4 h-4 text-brand-600" />,     label: 'Licence',       value: player.licence,     accent: true  },
    { icon: <Trophy className="w-4 h-4 text-brand-600" />,   label: 'Membre depuis', value: player.joinedAt,    accent: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-7xl mx-auto p-8">

        {/* Back */}
        <button onClick={() => navigate('/joueurs')}
          className="flex items-center gap-2 text-body text-brand-600 hover:text-brand-700 mb-6 transition-colors bg-transparent border-none cursor-pointer p-0">
          <ArrowLeft className="w-4 h-4" />Retour aux joueurs
        </button>

        {/* ── HEADER CARD ── */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-brand-600 flex items-center justify-center text-white text-heading-2 font-bold flex-shrink-0">
                {player.initials}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h1 className="text-heading-1 text-default-font">{player.name}</h1>
                  {player.status === 'active' && (
                    <span className="px-3 py-1 rounded-full text-caption-bold border bg-success-50 text-success-600 border-success-200">Actif</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                  <span className="text-body text-subtext-color">{player.poste}</span>
                  <span className="text-subtext-color">·</span>
                  <span className="px-3 py-1 rounded-full text-caption-bold bg-brand-50 text-brand-600">{player.category}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-200 text-subtext-color rounded-lg text-body hover:bg-neutral-150 hover:text-default-font transition-colors">
                <Edit3 className="w-4 h-4" />Modifier
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors">
                <MessageSquare className="w-4 h-4" />Message
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-200">
            {[
              { icon: <Mail className="w-4 h-4 text-brand-600" />,     label: 'Email',             value: player.email    },
              { icon: <Phone className="w-4 h-4 text-brand-600" />,    label: 'Téléphone',         value: player.phone    },
              { icon: <MapPin className="w-4 h-4 text-brand-600" />,   label: 'Localisation',      value: player.location },
              { icon: <Calendar className="w-4 h-4 text-brand-600" />, label: 'Date de naissance', value: player.dob      },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 rounded-lg flex-shrink-0">{icon}</div>
                <div>
                  <div className="text-caption text-subtext-color">{label}</div>
                  <div className="text-body-bold text-default-font">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg mb-6">
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-neutral-200">
            {stats.map(({ icon, label, value, accent }) => (
              <div key={label} className="flex flex-col items-center gap-2 py-5 px-3">
                <div className="p-2 bg-brand-50 rounded-lg">{icon}</div>
                <div className="text-caption text-subtext-color text-center">{label}</div>
                <div className={`text-body-bold text-center ${accent ? 'text-brand-600' : 'text-default-font'}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex border-b border-neutral-200 px-6 overflow-x-auto">
            {TABS.map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`relative py-4 mr-6 text-body whitespace-nowrap border-none bg-transparent cursor-pointer transition-colors ${
                    active ? 'text-brand-600 font-semibold' : 'text-subtext-color hover:text-default-font'
                  }`}>
                  {label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t" />}
                </button>
              );
            })}
          </div>

          {activeTab === 'matchs'      ? <MatchsTab />      :
           activeTab === 'seances'     ? <SeancesTab />     :
           activeTab === 'performance' ? <PerformanceTab /> :
           activeTab === 'formation'   ? <FormationTab />   : (
            <div className="p-12 text-center">
              <p className="text-body text-subtext-color">
                Contenu — {TABS.find(t => t.id === activeTab)?.label}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}