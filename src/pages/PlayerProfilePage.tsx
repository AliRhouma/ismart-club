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