import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Calendar,
  Layers,
  CheckCircle2,
  Pencil,
  Plus,
  X,
  GripVertical,
  ImageIcon,
  AlignLeft,
  ChevronDown,
} from 'lucide-react';

// ─── Mock data (replace with your real imports) ───────────────────────────────
const PROJET_META = {
  name: 'Projet de Jeu',
  description: 'Saison 2024-2025',
  status: 'En cours',
};

const SLIDES = [
  {
    id: 1,
    phase: 'Phase de jeu',
    title: 'Organisation défensive',
    content: [
      '## Principes généraux\n- **Bloc bas** en dehors du ballon\n- Compacité entre les lignes\n- Pressing coordonné sur signal',
      '## Déclencheurs\n- Perte du ballon dans le camp adverse\n- «Presser immédiatement sur la perte»',
    ],
  },
  {
    id: 2,
    phase: 'Phase de jeu',
    title: 'Transition défensive',
    content: [
      '## Réaction immédiate\n- Repli rapide sous le ballon\n- **Refermer les espaces centraux**\n- Bloquer les lignes de passe directes',
    ],
  },
  {
    id: 3,
    phase: 'Conserver - Progresser',
    title: 'Construction depuis l\'arrière',
    content: [
      '## Principes\n- Gardien intégré dans la construction\n- **Supériorité numérique** en première ligne\n- Sorties de balle propres',
    ],
  },
  {
    id: 4,
    phase: 'Conserver - Progresser',
    title: 'Progression milieu',
    content: [
      '## Combinaisons\n- Jeu en triangle\n- **Appels en profondeur** sur les demi-espaces\n- Permutations milieu-attaque',
    ],
  },
  {
    id: 5,
    phase: 'Déséquilibrer - Finir',
    title: 'Attaque placée',
    content: [
      '## Mouvements\n- Décalages extérieurs\n- **Courses croisées** en surface\n- Timing des appels',
    ],
  },
  {
    id: 6,
    phase: 'Déséquilibrer - Finir',
    title: 'Finition',
    content: [
      '## Principes de finition\n- Arrivées décalées\n- **Cadrer au premier poteau**\n- Second poteau systématiquement occupé',
    ],
  },
];

const PROJET_IMAGES = [
  'https://images.unsplash.com/photo-1551958219-acbc68f5e63d?w=900&q=80',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900&q=80',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=900&q=80',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=900&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&q=80',
];

// ─── Inline markdown renderer ─────────────────────────────────────────────────
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} style={{ color: 'rgb(250,250,250)', fontWeight: 600 }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function renderLine(line, index) {
  if (line.startsWith('## ')) {
    return (
      <div key={index} style={{ marginTop: index === 0 ? 0 : 24, marginBottom: 8 }}>
        <h3 style={{ color: 'rgb(0,145,255)', fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8 }}>
          {line.replace('## ', '')}
        </h3>
        <div style={{ height: 1, background: 'rgb(48,48,48)' }} />
      </div>
    );
  }
  if (line.startsWith('- ')) {
    return (
      <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '3px 0' }}>
        <span style={{ marginTop: 8, width: 5, height: 5, borderRadius: '50%', background: 'rgb(0,145,255)', flexShrink: 0 }} />
        <p style={{ color: 'rgb(250,250,250)', fontSize: 14, lineHeight: '22px', margin: 0 }}>
          {renderInline(line.replace(/^- /, ''))}
        </p>
      </div>
    );
  }
  if (line.startsWith('«')) {
    return (
      <div key={index} style={{ margin: '12px 0', padding: '12px 16px', background: 'rgb(36,36,36)', border: '1px solid rgb(48,48,48)', borderLeft: '3px solid rgb(0,145,255)', borderRadius: 8 }}>
        <p style={{ color: 'rgb(212,212,212)', fontSize: 14, lineHeight: '22px', fontStyle: 'italic', margin: 0 }}>{line}</p>
      </div>
    );
  }
  if (line.trim() === '') return <div key={index} style={{ height: 6 }} />;
  return (
    <p key={index} style={{ color: 'rgb(250,250,250)', fontSize: 14, lineHeight: '22px', margin: '3px 0' }}>
      {renderInline(line)}
    </p>
  );
}

function SlideContent({ content }) {
  const lines = content.flatMap((item) => item.split('\n'));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
}

// ─── Phase badge color ────────────────────────────────────────────────────────
const PHASE_COLORS = {
  'Phase de jeu': 'bg-brand-50 text-brand-600 border-brand-200',
  'Conserver - Progresser': 'bg-success-50 text-success-600 border-success-200',
  'Déséquilibrer - Finir': 'bg-warning-50 text-warning-600 border-warning-200',
};
function phaseBadge(phase) {
  return PHASE_COLORS[phase] ?? 'bg-neutral-100 text-subtext-color border-neutral-300';
}

// ─── Edit Panel (right overlay) ───────────────────────────────────────────────
function EditPanel({ slide, onClose }) {
  const [tab, setTab] = useState('content');

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 40,
        display: 'flex', flexDirection: 'row',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(3px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Slide-in panel from right */}
      <div style={{ flex: 1 }} onClick={onClose} />
      <div
        style={{
          width: 480,
          background: 'rgb(18,18,18)',
          borderLeft: '1px solid rgb(40,40,40)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          animation: 'slideInRight 0.22s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgb(36,36,36)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 7, background: 'rgb(0,145,255,0.12)', borderRadius: 8, display: 'flex' }}>
              <Pencil size={15} color="rgb(0,145,255)" />
            </div>
            <div>
              <p style={{ color: 'rgb(250,250,250)', fontSize: 14, fontWeight: 600, margin: 0 }}>Modifier la slide</p>
              <p style={{ color: 'rgb(120,120,120)', fontSize: 12, margin: 0 }}>#{slide.id} · {slide.phase}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgb(36,36,36)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex' }}>
            <X size={15} color="rgb(180,180,180)" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, padding: '0 24px', borderBottom: '1px solid rgb(36,36,36)' }}>
          {[
            { key: 'content', label: 'Contenu', icon: <AlignLeft size={13} /> },
            { key: 'image', label: 'Image', icon: <ImageIcon size={13} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '11px 16px', background: 'none', border: 'none',
                borderBottom: tab === t.key ? '2px solid rgb(0,145,255)' : '2px solid transparent',
                color: tab === t.key ? 'rgb(0,145,255)' : 'rgb(120,120,120)',
                fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {tab === 'content' && (
            <>
              {/* Title field */}
              <div>
                <label style={{ display: 'block', color: 'rgb(140,140,140)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Titre de la slide
                </label>
                <input
                  defaultValue={slide.title}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgb(26,26,26)', border: '1px solid rgb(48,48,48)',
                    borderRadius: 8, padding: '10px 14px',
                    color: 'rgb(250,250,250)', fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              {/* Phase selector */}
              <div>
                <label style={{ display: 'block', color: 'rgb(140,140,140)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Phase
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    defaultValue={slide.phase}
                    style={{
                      width: '100%', appearance: 'none',
                      background: 'rgb(26,26,26)', border: '1px solid rgb(48,48,48)',
                      borderRadius: 8, padding: '10px 36px 10px 14px',
                      color: 'rgb(250,250,250)', fontSize: 14, outline: 'none', cursor: 'pointer',
                    }}
                  >
                    <option>Phase de jeu</option>
                    <option>Conserver - Progresser</option>
                    <option>Déséquilibrer - Finir</option>
                  </select>
                  <ChevronDown size={14} color="rgb(120,120,120)" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Content textarea */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: 'rgb(140,140,140)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Contenu (Markdown)
                </label>
                <textarea
                  defaultValue={slide.content.join('\n')}
                  rows={12}
                  style={{
                    width: '100%', boxSizing: 'border-box', resize: 'vertical',
                    background: 'rgb(26,26,26)', border: '1px solid rgb(48,48,48)',
                    borderRadius: 8, padding: '10px 14px',
                    color: 'rgb(250,250,250)', fontSize: 13, lineHeight: '21px',
                    fontFamily: 'monospace', outline: 'none',
                  }}
                />
                <p style={{ color: 'rgb(80,80,80)', fontSize: 11, marginTop: 6 }}>
                  Utilisez ## pour les titres, - pour les bullets, **texte** pour le gras
                </p>
              </div>
            </>
          )}

          {tab === 'image' && (
            <div>
              <label style={{ display: 'block', color: 'rgb(140,140,140)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                URL de l'image
              </label>
              <input
                defaultValue={PROJET_IMAGES[slide.id % PROJET_IMAGES.length]}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgb(26,26,26)', border: '1px solid rgb(48,48,48)',
                  borderRadius: 8, padding: '10px 14px',
                  color: 'rgb(250,250,250)', fontSize: 13, fontFamily: 'monospace', outline: 'none',
                }}
              />
              <div style={{ marginTop: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid rgb(40,40,40)' }}>
                <img
                  src={PROJET_IMAGES[slide.id % PROJET_IMAGES.length]}
                  alt="preview"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
              <p style={{ color: 'rgb(80,80,80)', fontSize: 11, marginTop: 8 }}>
                L'image s'affichera dans son ratio naturel dans la slide.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgb(36,36,36)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 18px', background: 'rgb(30,30,30)', border: '1px solid rgb(48,48,48)', borderRadius: 8, color: 'rgb(180,180,180)', fontSize: 13, cursor: 'pointer' }}
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            style={{ padding: '9px 18px', background: 'rgb(0,145,255)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Slide Panel ──────────────────────────────────────────────────────────
function AddSlidePanel({ onClose, insertAfterIndex }) {
  const [step, setStep] = useState(1); // 1=type, 2=fill

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: 560, background: 'rgb(18,18,18)',
          border: '1px solid rgb(40,40,40)',
          borderRadius: 14,
          display: 'flex', flexDirection: 'column',
          animation: 'fadeScaleIn 0.2s cubic-bezier(.4,0,.2,1)',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgb(36,36,36)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 7, background: 'rgba(0,145,255,0.12)', borderRadius: 8, display: 'flex' }}>
              <Plus size={15} color="rgb(0,145,255)" />
            </div>
            <div>
              <p style={{ color: 'rgb(250,250,250)', fontSize: 14, fontWeight: 600, margin: 0 }}>
                {step === 1 ? 'Nouvelle slide' : 'Remplir le contenu'}
              </p>
              <p style={{ color: 'rgb(120,120,120)', fontSize: 12, margin: 0 }}>
                {step === 1 ? `Insérée après la slide ${insertAfterIndex + 1}` : 'Étape 2 sur 2'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Step dots */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2].map(s => (
                <div key={s} style={{ width: s === step ? 18 : 6, height: 6, borderRadius: 3, background: s === step ? 'rgb(0,145,255)' : s < step ? 'rgb(0,100,200)' : 'rgb(48,48,48)', transition: 'all .2s' }} />
              ))}
            </div>
            <button onClick={onClose} style={{ background: 'rgb(36,36,36)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex' }}>
              <X size={15} color="rgb(180,180,180)" />
            </button>
          </div>
        </div>

        {/* Step 1 — choose type */}
        {step === 1 && (
          <div style={{ padding: 24 }}>
            <p style={{ color: 'rgb(140,140,140)', fontSize: 12, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Choisir un modèle
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Slide vierge', desc: 'Titre + contenu libre', icon: '📄' },
                { label: 'Avec image', desc: 'Bannière image + contenu', icon: '🖼️' },
                { label: 'Liste à puces', desc: 'Structure en bullets', icon: '📋' },
                { label: 'Citation', desc: 'Blockquote mis en avant', icon: '💬' },
              ].map(({ label, desc, icon }) => (
                <button
                  key={label}
                  onClick={() => setStep(2)}
                  style={{
                    background: 'rgb(24,24,24)', border: '1px solid rgb(40,40,40)',
                    borderRadius: 10, padding: '16px', textAlign: 'left',
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgb(0,145,255)'; e.currentTarget.style.background = 'rgb(0,145,255,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgb(40,40,40)'; e.currentTarget.style.background = 'rgb(24,24,24)'; }}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ color: 'rgb(250,250,250)', fontSize: 13, fontWeight: 600 }}>{label}</div>
                  <div style={{ color: 'rgb(100,100,100)', fontSize: 12, marginTop: 2 }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — fill content */}
        {step === 2 && (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: 'rgb(140,140,140)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Titre</label>
              <input
                placeholder="Titre de la nouvelle slide..."
                autoFocus
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgb(26,26,26)', border: '1px solid rgb(48,48,48)', borderRadius: 8, padding: '10px 14px', color: 'rgb(250,250,250)', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgb(140,140,140)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Phase</label>
              <div style={{ position: 'relative' }}>
                <select style={{ width: '100%', appearance: 'none', background: 'rgb(26,26,26)', border: '1px solid rgb(48,48,48)', borderRadius: 8, padding: '10px 36px 10px 14px', color: 'rgb(250,250,250)', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                  <option>Phase de jeu</option>
                  <option>Conserver - Progresser</option>
                  <option>Déséquilibrer - Finir</option>
                </select>
                <ChevronDown size={14} color="rgb(120,120,120)" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgb(140,140,140)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Contenu</label>
              <textarea
                placeholder="## Section&#10;- Bullet point&#10;- **Texte en gras**"
                rows={7}
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', background: 'rgb(26,26,26)', border: '1px solid rgb(48,48,48)', borderRadius: 8, padding: '10px 14px', color: 'rgb(250,250,250)', fontSize: 13, lineHeight: '21px', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgb(36,36,36)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            style={{ padding: '9px 18px', background: 'rgb(30,30,30)', border: '1px solid rgb(48,48,48)', borderRadius: 8, color: 'rgb(180,180,180)', fontSize: 13, cursor: 'pointer' }}
          >
            {step === 1 ? 'Annuler' : '← Retour'}
          </button>
          {step === 2 && (
            <button
              onClick={onClose}
              style={{ padding: '9px 18px', background: 'rgb(0,145,255)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Créer la slide →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProjetPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const navRef = useRef(null);
  const activeItemRef = useRef(null);

  const slide = SLIDES[activeIndex];
  const image = PROJET_IMAGES[activeIndex % PROJET_IMAGES.length];

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < SLIDES.length) setActiveIndex(idx);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (editOpen || addOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(activeIndex + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(activeIndex - 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, goTo, editOpen, addOpen]);

  useEffect(() => {
    if (activeItemRef.current && navRef.current) {
      const container = navRef.current;
      const item = activeItemRef.current;
      const cRect = container.getBoundingClientRect();
      const iRect = item.getBoundingClientRect();
      if (iRect.top < cRect.top || iRect.bottom > cRect.bottom) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes fadeScaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>

      <div
        style={{
          display: 'flex', flexDirection: 'column', height: '100vh',
          background: 'rgb(12,12,12)', overflow: 'hidden', position: 'relative',
        }}
      >
        {/* ── Top header ── */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-8 py-4 shrink-0">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Target className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h1 className="text-heading-2 text-default-font">{PROJET_META.name}</h1>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1.5 text-caption text-subtext-color">
                    <Calendar className="w-3.5 h-3.5" />
                    {PROJET_META.description}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Add slide button */}
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="text-caption-bold text-white">Ajouter une slide</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 border border-success-200">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
                <span className="text-caption-bold text-success-600">{PROJET_META.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div
          style={{
            flex: 1, display: 'flex', overflow: 'hidden',
            maxWidth: 1400, margin: '0 auto', width: '100%',
            padding: '16px', gap: 16,
          }}
        >

          {/* ── LEFT SIDEBAR — floating card ── */}
          <div
            style={{
              width: 272, flexShrink: 0,
              background: 'rgb(18,18,18)',
              border: '1px solid rgb(36,36,36)',
              borderRadius: 12,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {/* Progress header */}
            <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgb(36,36,36)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: 'rgb(120,120,120)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Sommaire
                </span>
                <span style={{ color: 'rgb(120,120,120)', fontSize: 12 }}>
                  {activeIndex + 1} / {SLIDES.length}
                </span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgb(36,36,36)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%', background: 'rgb(0,145,255)',
                    borderRadius: 2,
                    width: `${((activeIndex + 1) / SLIDES.length) * 100}%`,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            {/* Nav list — FLAT ORDER, no phase grouping */}
            <nav ref={navRef} style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {SLIDES.map((s, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={s.id}
                    ref={isActive ? activeItemRef : null}
                    onClick={() => goTo(idx)}
                    style={{
                      width: '100%', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 8, marginBottom: 2,
                      border: isActive ? '1px solid rgba(0,145,255,0.3)' : '1px solid transparent',
                      background: isActive ? 'rgba(0,145,255,0.08)' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgb(28,28,28)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Number badge */}
                    <span
                      style={{
                        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        background: isActive ? 'rgb(0,145,255)' : 'rgb(30,30,30)',
                        color: isActive ? '#fff' : 'rgb(120,120,120)',
                        transition: 'all .15s',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: 13, lineHeight: '18px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        color: isActive ? 'rgb(0,145,255)' : 'rgb(180,180,180)',
                        fontWeight: isActive ? 600 : 400,
                        transition: 'color .15s',
                      }}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ── RIGHT PANEL — floating card ── */}
          <div
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              background: 'rgb(18,18,18)',
              border: '1px solid rgb(36,36,36)',
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {/* Scrollable content area */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 32px 32px' }}>

                {/* Image with natural ratio */}
                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', marginBottom: 20, border: '1px solid rgb(36,36,36)' }}>
                  <img
                    src={image}
                    alt={slide.title}
                    style={{ width: '100%', display: 'block' /* natural ratio, no fixed height */ }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)' }} />

                  {/* Edit button overlay */}
                  <button
                    onClick={() => setEditOpen(true)}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px',
                      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8, cursor: 'pointer', transition: 'all .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,145,255,0.8)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                  >
                    <Pencil size={13} color="#fff" />
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Modifier</span>
                  </button>

                  {/* Phase badge + title at bottom */}
                  <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 text-caption-bold border ${phaseBadge(slide.phase)}`}
                    >
                      <Layers className="w-3 h-3" />
                      {slide.phase}
                    </div>
                    <h2 className="text-heading-1 text-white drop-shadow-md">{slide.title}</h2>
                  </div>
                </div>

                {/* Content card */}
                <div style={{ background: 'rgb(24,24,24)', border: '1px solid rgb(36,36,36)', borderRadius: 10, padding: '20px 24px' }}>
                  <SlideContent content={slide.content} />
                </div>

              </div>
            </div>

            {/* ── Bottom nav ── */}
            <div style={{ flexShrink: 0, borderTop: '1px solid rgb(36,36,36)', padding: '12px 24px' }}>
              <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>

                {/* Dot indicators */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      style={{
                        borderRadius: 9999, border: 'none', cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: 6,
                        width: i === activeIndex ? 20 : 6,
                        background: i === activeIndex ? 'rgb(0,145,255)' : 'rgb(48,48,48)',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={activeIndex === SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Overlays ── */}
        {editOpen && <EditPanel slide={slide} onClose={() => setEditOpen(false)} />}
        {addOpen && <AddSlidePanel onClose={() => setAddOpen(false)} insertAfterIndex={activeIndex} />}
      </div>
    </>
  );
}

export default ProjetPage;