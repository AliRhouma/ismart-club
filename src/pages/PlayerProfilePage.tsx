import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Shield,
  Ruler, Weight, Heart, Activity, Star, Trophy,
  CreditCard as Edit3, MessageSquare
} from 'lucide-react';

const playersData: Record<string, {
  id: number; name: string; initials: string; color: string;
  email: string; phone: string; location: string;
  category: string; poste: string; dob: string;
  height: string; weight: string; foot: string;
  nationality: string; licence: string; joinedAt: string;
  status: string;
}> = {
  '1': {
    id: 1, name: 'Abdelmalek Smaili', initials: 'AS', color: '#1a3a5c',
    email: 'abdelmalek.smaili@gmail.com', phone: '+216 55 123 456',
    location: 'Tunis, Tunisie', category: 'Minime', poste: 'Lateral gauche',
    dob: '5 juil. 2010', height: '1m62', weight: '48 kg', foot: 'Gauche',
    nationality: 'Tunisienne', licence: 'TN-2024-08712', joinedAt: '12 sept. 2022',
    status: 'active',
  },
};

const fallbackPlayer = {
  id: 0, name: 'Joueur Inconnu', initials: '??', color: '#333',
  email: '—', phone: '—', location: '—', category: '—', poste: '—',
  dob: '—', height: '—', weight: '—', foot: '—',
  nationality: '—', licence: '—', joinedAt: '—', status: 'active',
};

const TAB_CONFIG = [
  { id: 'infos',       label: 'Informations' },
  { id: 'stats',       label: 'Statistiques' },
  { id: 'medical',     label: 'Medical' },
  { id: 'historique',  label: 'Historique' },
  { id: 'evaluations', label: 'Evaluations' },
  { id: 'documents',   label: 'Documents' },
];

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('infos');

  const player = playersData[id || ''] || fallbackPlayer;

  return (
    <div className="flex-1 min-h-screen bg-default-background">

      {/* Back button */}
      <div className="px-9 pt-4">
        <button
          onClick={() => navigate('/joueurs')}
          className="flex items-center gap-2 text-body text-brand-600 hover:text-brand-700 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux joueurs
        </button>
      </div>

      {/* ── HEADER CARD ── */}
      <div className="px-9 pt-3">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
          <div className="p-7 pb-0">
            <div className="flex gap-6 items-start">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${player.color} 0%, ${player.color}88 100%)`,
                    boxShadow: `0 8px 32px ${player.color}44`,
                  }}
                >
                  {player.initials}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-neutral-50 ${
                    player.status === 'active' ? 'bg-success-500' : 'bg-neutral-400'
                  }`}
                />
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-heading-1 text-default-font m-0">{player.name}</h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption-bold bg-success-50 text-success-600 border border-success-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                    Actif
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-body text-subtext-color">
                    <Shield className="w-3.5 h-3.5 text-brand-600" />
                    {player.poste}
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="inline-flex items-center text-caption-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600">
                    {player.category}
                  </span>
                </div>

                {/* Contact row */}
                <div className="flex items-center gap-5 flex-wrap">
                  <InfoChip icon={<Mail className="w-3.5 h-3.5" />} text={player.email} />
                  <InfoChip icon={<Phone className="w-3.5 h-3.5" />} text={player.phone} />
                  <InfoChip icon={<MapPin className="w-3.5 h-3.5" />} text={player.location} />
                  <InfoChip icon={<Calendar className="w-3.5 h-3.5" />} text={`Né le ${player.dob}`} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0 pt-1">
                <ActionBtn icon={<Edit3 className="w-3.5 h-3.5" />} label="Modifier" />
                <ActionBtn icon={<MessageSquare className="w-3.5 h-3.5" />} label="Message" />
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex items-center mt-5 border-t border-neutral-200">
              <StatCell icon={<Ruler className="w-3.5 h-3.5" />}   label="Taille"        value={player.height}      highlight={false} />
              <StatDivider />
              <StatCell icon={<Weight className="w-3.5 h-3.5" />}  label="Poids"         value={player.weight}      highlight={false} />
              <StatDivider />
              <StatCell icon={<Heart className="w-3.5 h-3.5" />}   label="Pied fort"     value={player.foot}        highlight={false} />
              <StatDivider />
              <StatCell icon={<Activity className="w-3.5 h-3.5" />} label="Nationalité"  value={player.nationality} highlight={false} />
              <StatDivider />
              <StatCell icon={<Star className="w-3.5 h-3.5" />}    label="Licence"       value={player.licence}     highlight={true} />
              <StatDivider />
              <StatCell icon={<Trophy className="w-3.5 h-3.5" />}  label="Membre depuis" value={player.joinedAt}    highlight={false} />
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="px-9">
        <div className="flex items-center gap-0.5 mt-5 border-b border-neutral-200">
          {TAB_CONFIG.map(({ id, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative px-4 py-2.5 text-body border-none bg-transparent cursor-pointer transition-colors ${
                  active
                    ? 'text-brand-600 font-semibold'
                    : 'text-subtext-color hover:text-default-font'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-sm bg-brand-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="px-9 py-7">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-12 text-center">
          <p className="text-body text-subtext-color">
            Contenu de l'onglet "{TAB_CONFIG.find(t => t.id === activeTab)?.label}" — à compléter
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-caption text-subtext-color">
      <span className="text-subtext-color flex">{icon}</span>
      {text}
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-caption-bold text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 hover:text-default-font transition-all cursor-pointer">
      {icon}
      {label}
    </button>
  );
}

function StatCell({
  icon, label, value, highlight
}: {
  icon: React.ReactNode; label: string; value: string; highlight: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 py-3.5 px-2">
      <div className="flex items-center gap-1.5 text-caption text-subtext-color">
        <span className="flex text-subtext-color">{icon}</span>
        {label}
      </div>
      <div className={`text-body-bold ${highlight ? 'text-brand-600' : 'text-default-font'}`}>
        {value}
      </div>
    </div>
  );
}

function StatDivider() {
  return <div className="w-px h-7 bg-neutral-200 flex-shrink-0" />;
}