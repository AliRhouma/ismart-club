import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    location: 'Tunis, Tunisie', category: 'Minime', poste: 'Latéral gauche',
    dob: '5 juil. 2010', height: '1m62', weight: '48 kg', foot: 'Gauche',
    nationality: 'Tunisienne', licence: 'TN-2024-08712', joinedAt: '12 sept. 2022',
    status: 'active',
  },
};

const fallbackPlayer = {
  id: 0, name: 'Joueur Inconnu', initials: '??', color: '#888',
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

  return (
    <div className="flex-1 min-h-screen bg-[#f8f7f5] px-10 py-8 font-[DM_Sans,sans-serif]">

      {/* Back */}
      <button
        onClick={() => navigate('/joueurs')}
        className="flex items-center gap-1.5 text-[13px] text-[#888] hover:text-[#222] bg-transparent border-none cursor-pointer mb-6 p-0 transition-colors"
      >
        ← Retour aux joueurs
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl px-9 pt-8 pb-0 mb-2">

        {/* Top row */}
        <div className="flex items-start gap-5 mb-7">

          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-[14px] flex items-center justify-center text-[18px] font-semibold text-white flex-shrink-0 tracking-wide"
            style={{ background: player.color }}
          >
            {player.initials}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <h1 className="text-[22px] font-semibold text-[#111] tracking-[-0.02em] m-0 leading-none">
                {player.name}
              </h1>
              {player.status === 'active' && (
                <span className="text-[11px] font-medium text-[#2a7a4b] bg-[#edf7f2] rounded-full px-2.5 py-0.5 tracking-wide">
                  Actif
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#888]">{player.poste}</span>
              <span className="text-[#ccc]">·</span>
              <span className="text-[12px] font-medium text-[#1a3a5c] bg-[#eef2f8] rounded-full px-2.5 py-0.5">
                {player.category}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <ActionBtn label="✎ Modifier" />
            <ActionBtn label="✉ Message" />
          </div>
        </div>

        {/* Contact */}
        <div className="flex gap-5 flex-wrap mb-7">
          <ContactItem icon="✉" text={player.email} />
          <ContactItem icon="☎" text={player.phone} />
          <ContactItem icon="⌖" text={player.location} />
          <ContactItem icon="⬚" text={`Né le ${player.dob}`} />
        </div>

        {/* Divider */}
        <div className="border-t border-[#f0eeeb]" />

        {/* Stats strip */}
        <div className="flex">
          {[
            { label: 'Taille',        value: player.height,      accent: false },
            { label: 'Poids',         value: player.weight,      accent: false },
            { label: 'Pied fort',     value: player.foot,        accent: false },
            { label: 'Nationalité',   value: player.nationality, accent: false },
            { label: 'Licence',       value: player.licence,     accent: true  },
            { label: 'Membre depuis', value: player.joinedAt,    accent: false },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className={`flex-1 text-center py-4 px-2 ${i < arr.length - 1 ? 'border-r border-[#f0eeeb]' : ''}`}
            >
              <div className="text-[11px] uppercase tracking-[0.07em] text-[#aaa] mb-1">{s.label}</div>
              <div className={`text-[14px] font-medium ${s.accent ? 'text-[#1a3a5c]' : 'text-[#222]'}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs card */}
      <div className="bg-white rounded-2xl">
        <div className="flex border-b border-[#f0eeeb] px-9">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative py-3.5 mr-6 text-[13px] border-none bg-transparent cursor-pointer font-[DM_Sans,sans-serif] transition-colors ${
                activeTab === id
                  ? 'text-[#111] font-medium'
                  : 'text-[#aaa] hover:text-[#555]'
              }`}
            >
              {label}
              {activeTab === id && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#1a3a5c] rounded-t" />
              )}
            </button>
          ))}
        </div>

        <div className="px-9 py-9 text-center text-[14px] text-[#bbb]">
          Contenu — {TABS.find(t => t.id === activeTab)?.label}
        </div>
      </div>

    </div>
  );
}

function ContactItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] text-[#777]">
      <span className="opacity-40 text-[13px]">{icon}</span>
      {text}
    </div>
  );
}

function ActionBtn({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-[#555] bg-white border border-[#e8e6e2] hover:bg-[#f8f7f5] hover:text-[#222] cursor-pointer transition-all font-[DM_Sans,sans-serif]">
      {label}
    </button>
  );
}