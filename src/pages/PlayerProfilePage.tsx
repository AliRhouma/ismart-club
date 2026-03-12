import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, Ruler, Weight, Heart, Activity, Star, Trophy, CreditCard as Edit3, MessageSquare } from 'lucide-react';

const BLUE  = '#0091FF';
const GREEN = '#46A758';
const AMBER = '#f59e0b';

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
  { id: 'infos',        label: 'Informations' },
  { id: 'stats',        label: 'Statistiques' },
  { id: 'medical',      label: 'Medical' },
  { id: 'historique',   label: 'Historique' },
  { id: 'evaluations',  label: 'Evaluations' },
  { id: 'documents',    label: 'Documents' },
];

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('infos');

  const player = playersData[id || ''] || fallbackPlayer;

  return (
    <div className="flex-1 min-h-screen" style={{ background: '#131313', fontFamily: "'Rubik', sans-serif" }}>

      {/* Back button */}
      <div style={{ padding: '16px 36px 0' }}>
        <button
          onClick={() => navigate('/joueurs')}
          className="group"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#737373', fontSize: 13, fontFamily: 'inherit',
            padding: '6px 0', transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#d4d4d4')}
          onMouseLeave={e => (e.currentTarget.style.color = '#737373')}
        >
          <ArrowLeft size={15} />
          Retour aux joueurs
        </button>
      </div>

      {/* ── HEADER CARD ── */}
      <div style={{ padding: '12px 36px 0' }}>
        <div style={{
          position: 'relative',
          background: '#181818',
          border: '1px solid #2a2a2a',
          borderRadius: 10,
          overflow: 'hidden',
         
        }}>
         

          {/* ── REMOVED: Subtle radial glow ── */}

          <div style={{ position: 'relative', padding: '28px 32px 0' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 16,
                  background: `linear-gradient(135deg, ${player.color || BLUE} 0%, ${player.color || BLUE}88 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.92)',
                  letterSpacing: '0.02em',
                  boxShadow: `0 8px 32px ${player.color || BLUE}44, 0 0 0 2px #2a2a2a`,
                }}>
                  {player.initials}
                </div>
                <div style={{
                  position: 'absolute', bottom: -3, right: -3,
                  width: 18, height: 18, borderRadius: '50%',
                  background: player.status === 'active' ? GREEN : '#737373',
                  border: '3px solid #181818',
                }} />
              </div>

              {/* Main info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fafafa', letterSpacing: '-0.01em', margin: 0 }}>
                    {player.name}
                  </h1>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 10px', borderRadius: 20,
                    fontSize: 11, fontWeight: 600,
                    background: `${GREEN}1a`, color: GREEN, border: `1px solid ${GREEN}33`,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN }} />
                    Actif
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 13, color: '#a3a3a3',
                  }}>
                    <Shield size={13} style={{ color: BLUE }} />
                    {player.poste}
                  </span>
                  <span style={{ color: '#525252' }}>·</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
                    padding: '2px 9px', borderRadius: 16,
                    background: 'rgba(0,145,255,0.1)', color: '#52a9ff',
                  }}>
                    {player.category}
                  </span>
                </div>

                {/* Contact row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <InfoChip icon={<Mail size={13} />} text={player.email} />
                  <InfoChip icon={<Phone size={13} />} text={player.phone} />
                  <InfoChip icon={<MapPin size={13} />} text={player.location} />
                  <InfoChip icon={<Calendar size={13} />} text={`Ne le ${player.dob}`} />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, paddingTop: 4 }}>
                <ActionBtn icon={<Edit3 size={14} />} label="Modifier" />
                <ActionBtn icon={<MessageSquare size={14} />} label="Message" />
              </div>
            </div>

            {/* Stats strip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0, marginTop: 22,
              borderTop: '1px solid #2a2a2a',
              paddingTop: 0,
            }}>
              <StatCell icon={<Ruler size={13} />} label="Taille" value={player.height} color="#a3a3a3" />
              <StatDivider />
              <StatCell icon={<Weight size={13} />} label="Poids" value={player.weight} color="#a3a3a3" />
              <StatDivider />
              <StatCell icon={<Heart size={13} />} label="Pied fort" value={player.foot} color="#a3a3a3" />
              <StatDivider />
              <StatCell icon={<Activity size={13} />} label="Nationalite" value={player.nationality} color="#a3a3a3" />
              <StatDivider />
              <StatCell icon={<Star size={13} />} label="Licence" value={player.licence} color={AMBER} />
              <StatDivider />
              <StatCell icon={<Trophy size={13} />} label="Membre depuis" value={player.joinedAt} color="#a3a3a3" />
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ padding: '0 36px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          marginTop: 20,
          borderBottom: '1px solid #2a2a2a',
          paddingBottom: 0,
        }}>
          {TAB_CONFIG.map(({ id, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  position: 'relative',
                  padding: '10px 18px',
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  color: active ? BLUE : '#737373',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'color 0.15s',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#a3a3a3'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#737373'; }}
              >
                {label}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: -1, left: 12, right: 12,
                    height: 2, borderRadius: 1,
                    background: BLUE,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ padding: '28px 36px 40px' }}>
        <div style={{
          background: '#181818',
          border: '1px solid #2a2a2a',
          borderRadius: 12,
          padding: '48px 32px',
          textAlign: 'center',
          color: '#525252',
          fontSize: 14,
        }}>
          Contenu de l'onglet "{TAB_CONFIG.find(t => t.id === activeTab)?.label}" -- a completer
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

function InfoChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#737373' }}>
      <span style={{ color: '#525252', display: 'flex' }}>{icon}</span>
      {text}
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 8,
        fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
        cursor: 'pointer', transition: 'all 0.14s',
        background: hov ? '#252525' : '#1f1f1f',
        border: `1px solid ${hov ? '#3a3a3a' : '#2a2a2a'}`,
        color: hov ? '#d4d4d4' : '#737373',
      }} 
    >
      {icon}{label}
    </button>
  );
}

function StatCell({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 4, padding: '14px 8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#525252', fontWeight: 500 }}>
        <span style={{ display: 'flex', color: '#525252' }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color, letterSpacing: '-0.01em' }}>
        {value}
      </div>
    </div>
  );
}

function StatDivider() {
  return <div style={{ width: 1, height: 28, background: '#2a2a2a', flexShrink: 0 }} />;
}