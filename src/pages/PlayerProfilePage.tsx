import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar,
  Shield, Ruler, Weight, Heart, Activity,
  Star, Trophy, Edit3, MessageSquare
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
  { id: 'stats',       label: 'Statistiques' },
  { id: 'medical',     label: 'Médical' },
  { id: 'historique',  label: 'Historique' },
  { id: 'evaluations', label: 'Évaluations' },
  { id: 'documents',   label: 'Documents' },
];

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('infos');

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

          {/* Top row: avatar + name + actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">

              {/* Avatar */}
              <div className="w-16 h-16 rounded-lg bg-brand-600 flex items-center justify-center text-white text-heading-2 font-bold flex-shrink-0">
                {player.initials}
              </div>

              {/* Name + role */}
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

            {/* Action buttons */}
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

          {/* Contact grid — same pattern as meeting detail info cells */}
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
          <div className="flex border-b border-neutral-200 px-6">
            {TABS.map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative py-4 mr-6 text-body border-none bg-transparent cursor-pointer transition-colors ${
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

          <div className="p-12 text-center">
            <p className="text-body text-subtext-color">
              Contenu — {TABS.find(t => t.id === activeTab)?.label}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}