import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar,
  Shield, Ruler, Weight, Heart, Activity,
  Star, Trophy, Edit3, MessageSquare,
  Clock, Target, Zap,
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
  { id: 'stats',       label: 'Statistiques' },
  { id: 'medical',     label: 'Médical' },
  { id: 'historique',  label: 'Historique' },
  { id: 'evaluations', label: 'Évaluations' },
  { id: 'documents',   label: 'Documents' },
];

type Comp = 'CL' | 'LL';
type Result = 'W' | 'L' | 'D';

interface Match {
  date: string;
  comp: Comp;
  home: string;
  away: string;
  hs: number;
  as: number;
  result: Result;
  min: string;
  g: number;
  a: number;
  yc: number;
  rc: number;
  playerHome: boolean;
}

const lastMatches: Match[] = [
  { date: '11.03.26', comp: 'CL', home: 'Real Madrid',    away: 'Manchester City', hs: 3, as: 0, result: 'W', min: "90'", g: 3, a: 0, yc: 0, rc: 0, playerHome: true  },
  { date: '06.03.26', comp: 'LL', home: 'Celta Vigo',     away: 'Real Madrid',     hs: 1, as: 2, result: 'W', min: "90'", g: 1, a: 0, yc: 0, rc: 0, playerHome: false },
  { date: '02.03.26', comp: 'LL', home: 'Real Madrid',    away: 'Getafe',          hs: 0, as: 1, result: 'L', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: true  },
  { date: '25.02.26', comp: 'CL', home: 'Real Madrid',    away: 'Benfica',         hs: 2, as: 1, result: 'W', min: "90'", g: 0, a: 2, yc: 0, rc: 0, playerHome: true  },
  { date: '21.02.26', comp: 'LL', home: 'Osasuna',        away: 'Real Madrid',     hs: 2, as: 1, result: 'L', min: "75'", g: 0, a: 1, yc: 0, rc: 0, playerHome: false },
  { date: '17.02.26', comp: 'CL', home: 'Benfica',        away: 'Real Madrid',     hs: 0, as: 1, result: 'W', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: false },
  { date: '14.02.26', comp: 'LL', home: 'Real Madrid',    away: 'Real Sociedad',   hs: 4, as: 1, result: 'W', min: "73'", g: 1, a: 0, yc: 0, rc: 0, playerHome: true  },
  { date: '08.02.26', comp: 'LL', home: 'Valencia',       away: 'Real Madrid',     hs: 0, as: 2, result: 'W', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: false },
  { date: '01.02.26', comp: 'LL', home: 'Real Madrid',    away: 'Rayo Vallecano',  hs: 2, as: 1, result: 'W', min: "90'", g: 0, a: 0, yc: 0, rc: 0, playerHome: true  },
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

  const wins   = filtered.filter(m => m.result === 'W').length;
  const losses = filtered.filter(m => m.result === 'L').length;
  const draws  = filtered.filter(m => m.result === 'D').length;
  const goals  = filtered.reduce((s, m) => s + m.g, 0);
  const assists = filtered.reduce((s, m) => s + m.a, 0);

  const summaryCards = [
    { label: 'Matchs joués',  value: filtered.length, icon: <Shield className="w-4 h-4 text-brand-600" />, accent: false },
    { label: 'Victoires',     value: wins,            icon: <Trophy className="w-4 h-4 text-success-600" />, accent: false },
    { label: 'Défaites',      value: losses,          icon: <Target className="w-4 h-4 text-error-600" />,   accent: false },
    { label: 'Nuls',          value: draws,           icon: <Activity className="w-4 h-4 text-warning-600" />, accent: false },
    { label: 'Buts',          value: goals,           icon: <Zap className="w-4 h-4 text-brand-600" />,     accent: true  },
    { label: 'Passes déc.',   value: assists,         icon: <Star className="w-4 h-4 text-brand-600" />,    accent: true  },
  ];

  const filterOptions: { value: CompFilter; label: string }[] = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'CL',  label: 'Champions League' },
    { value: 'LL',  label: 'Liga' },
  ];

  return (
    <div className="p-6">

      {/* Summary strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 border border-neutral-200 rounded-lg mb-6 divide-x divide-neutral-200 bg-neutral-50">
        {summaryCards.map(({ label, value, icon, accent }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 py-4 px-2">
            <div className="p-2 bg-brand-50 rounded-lg">{icon}</div>
            <span className="text-xs text-subtext-color text-center leading-tight">{label}</span>
            <span className={`text-lg font-semibold ${accent ? 'text-brand-600' : 'text-default-font'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Section title + filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-default-font">Derniers matchs</h2>
          <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">
            {filtered.length} matchs
          </span>
        </div>

        {/* Competition filter pills */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg">
          {filterOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCompFilter(value)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors border-none cursor-pointer ${
                compFilter === value
                  ? 'bg-neutral-50 text-brand-600 shadow-sm border border-neutral-200'
                  : 'bg-transparent text-subtext-color hover:text-default-font'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color w-24">Date</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color w-12">Comp.</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color">Match</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color w-14">Résultat</th>
              <th className="text-center px-3 py-3 w-10" title="Minutes jouées">
                <Clock className="w-3.5 h-3.5 text-subtext-color mx-auto" />
              </th>
              <th className="text-center px-3 py-3 w-10" title="Buts">
                <span className="text-xs font-medium text-subtext-color">⚽</span>
              </th>
              <th className="text-center px-3 py-3 w-10" title="Passes décisives">
                <span className="text-xs font-medium text-subtext-color">A</span>
              </th>
              <th className="text-center px-3 py-3 w-10" title="Cartons jaunes">
                <CardIcon color="#d97706" />
              </th>
              <th className="text-center px-3 py-3 w-10" title="Cartons rouges">
                <CardIcon color="#dc2626" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-50 divide-y divide-neutral-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-subtext-color text-sm">
                  Aucun match pour cette compétition.
                </td>
              </tr>
            ) : null}
            {filtered.map((m, i) => (
              <tr key={i} className="hover:bg-neutral-100 transition-colors">

                {/* Date */}
                <td className="px-4 py-3 text-subtext-color text-xs tabular-nums">
                  {m.date}
                </td>

                {/* Competition */}
                <td className="px-3 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${compBadge[m.comp]}`}>
                    {m.comp}
                  </span>
                </td>

                {/* Teams + scores */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-4 max-w-[220px]">
                      <span className={`text-sm ${m.playerHome ? 'font-semibold text-default-font' : 'text-subtext-color'}`}>
                        {m.home}
                      </span>
                      <span className={`tabular-nums text-sm font-semibold ${m.playerHome ? 'text-default-font' : 'text-subtext-color'}`}>
                        {m.hs}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 max-w-[220px]">
                      <span className={`text-sm ${!m.playerHome ? 'font-semibold text-default-font' : 'text-subtext-color'}`}>
                        {m.away}
                      </span>
                      <span className={`tabular-nums text-sm font-semibold ${!m.playerHome ? 'text-default-font' : 'text-subtext-color'}`}>
                        {m.as}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Result badge */}
                <td className="px-3 py-3 text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${resultBadge[m.result]}`}>
                    {resultLabel[m.result]}
                  </span>
                </td>

                {/* Minutes */}
                <td className="px-3 py-3 text-center text-subtext-color text-xs tabular-nums">
                  {m.min}
                </td>

                {/* Goals */}
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm font-semibold ${m.g > 0 ? 'text-brand-600' : 'text-subtext-color'}`}>
                    {m.g}
                  </span>
                </td>

                {/* Assists */}
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm font-semibold ${m.a > 0 ? 'text-brand-600' : 'text-subtext-color'}`}>
                    {m.a}
                  </span>
                </td>

                {/* Yellow cards */}
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm ${m.yc > 0 ? 'text-warning-600 font-semibold' : 'text-subtext-color'}`}>
                    {m.yc}
                  </span>
                </td>

                {/* Red cards */}
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm ${m.rc > 0 ? 'text-error-600 font-semibold' : 'text-subtext-color'}`}>
                    {m.rc}
                  </span>
                </td>

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
  date: string;
  name: string;
  type: SessionType;
  duree: string;
  presence: Presence;
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
    total: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    present: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
    absent: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    justifie: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    blesse: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    retard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
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

      {/* KPI strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 border border-neutral-200 rounded-lg mb-6 divide-x divide-neutral-200 bg-neutral-50">
        {kpiCards.map(({ key, label, iconType, iconBg, iconColor, valueClass }) => (
          <div key={key} className="flex flex-col items-center gap-1.5 py-4 px-2">
            <div className={`w-9 h-9 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
              <KpiIcon type={iconType} />
            </div>
            <span className="text-xs text-subtext-color text-center leading-tight">{label}</span>
            <span className={`text-lg font-semibold ${valueClass}`}>{counts[key]}</span>
          </div>
        ))}
      </div>

      {/* Taux de présence bar */}
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

      {/* Section title */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-default-font">Présences aux séances</h2>
        <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">
          {sessions.length} séances
        </span>
      </div>

      {/* Table */}
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
                <td className="px-4 py-3 text-xs text-subtext-color tabular-nums whitespace-nowrap">
                  {s.date}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-default-font">{s.name}</span>
                </td>
                <td className="px-4 py-3 text-center text-xs text-subtext-color tabular-nums">
                  {s.duree}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${presenceConfig[s.presence].badge}`}>
                    {presenceConfig[s.presence].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
        <button
          onClick={() => navigate('/joueurs')}
          className="flex items-center gap-2 text-body text-brand-600 hover:text-brand-700 mb-6 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux joueurs
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
                    <span className="px-3 py-1 rounded-full text-caption-bold border bg-success-50 text-success-600 border-success-200">
                      Actif
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                  <span className="text-body text-subtext-color">{player.poste}</span>
                  <span className="text-subtext-color">·</span>
                  <span className="px-3 py-1 rounded-full text-caption-bold bg-brand-50 text-brand-600">
                    {player.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-200 text-subtext-color rounded-lg text-body hover:bg-neutral-150 hover:text-default-font transition-colors">
                <Edit3 className="w-4 h-4" />
                Modifier
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Message
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
                <div className={`text-body-bold text-center ${accent ? 'text-brand-600' : 'text-default-font'}`}>
                  {value}
                </div>
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
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative py-4 mr-6 text-body whitespace-nowrap border-none bg-transparent cursor-pointer transition-colors ${
                    active
                      ? 'text-brand-600 font-semibold'
                      : 'text-subtext-color hover:text-default-font'
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t" />
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === 'matchs' ? (
            <MatchsTab />
          ) : activeTab === 'seances' ? (
            <SeancesTab />
          ) : (
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