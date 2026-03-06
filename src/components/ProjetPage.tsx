import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Layers,
  CheckCircle2,
  Pencil,
  Plus,
  X,
  ChevronDown,
  Image as ImageIcon,
  Type,
  Save,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Minus,
  AlignLeft,
  Eye,
} from 'lucide-react';
import { SLIDES, PROJET_IMAGES, PROJET_META } from '../data/projetDeJeu';

// ─────────────────────────────────────────────────────────────────────────────
// SlideContent
// ─────────────────────────────────────────────────────────────────────────────

function renderInline(text: string) {
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

function renderLine(line: string, index: number) {
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

function SlideContent({ content }: { content: string[] }) {
  const lines = content.flatMap((item) => item.split('\n'));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase badge colors
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_COLORS: Record<string, { badge: string; dot: string }> = {
  'Phase de jeu': { badge: 'bg-brand-50 text-brand-600 border-brand-200', dot: 'bg-brand-600' },
  'Conserver - Progresser': { badge: 'bg-success-50 text-success-600 border-success-200', dot: 'bg-success-600' },
  'Déséquilibrer - Finir': { badge: 'bg-warning-50 text-warning-600 border-warning-200', dot: 'bg-warning-600' },
};

function getPhaseStyle(phase: string) {
  return PHASE_COLORS[phase] ?? { badge: 'bg-neutral-100 text-subtext-color border-neutral-300', dot: 'bg-neutral-400' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Rich Text Toolbar — shared component
// ─────────────────────────────────────────────────────────────────────────────

function RichTextToolbar() {
  const [active, setActive] = useState<string[]>([]);
  const toggle = (key: string) =>
    setActive((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const btn = (key: string, icon: React.ReactNode, title: string) => (
    <button
      key={key}
      title={title}
      onClick={() => toggle(key)}
      className={`p-1.5 rounded transition-colors ${
        active.includes(key)
          ? 'bg-brand-100 text-brand-600'
          : 'text-subtext-color hover:bg-neutral-200 hover:text-default-font'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-neutral-100 border-b border-neutral-200 flex-wrap">
      {btn('bold',   <Bold className="w-3.5 h-3.5" />,         'Gras')}
      {btn('italic', <Italic className="w-3.5 h-3.5" />,       'Italique')}
      <div className="w-px h-4 bg-neutral-300 mx-1" />
      {btn('h2',    <Heading2 className="w-3.5 h-3.5" />,      'Titre de section')}
      {btn('quote', <Quote className="w-3.5 h-3.5" />,         'Citation')}
      <div className="w-px h-4 bg-neutral-300 mx-1" />
      {btn('ul',    <List className="w-3.5 h-3.5" />,          'Liste à puces')}
      {btn('ol',    <ListOrdered className="w-3.5 h-3.5" />,   'Liste numérotée')}
      <div className="w-px h-4 bg-neutral-300 mx-1" />
      {btn('hr',    <Minus className="w-3.5 h-3.5" />,         'Séparateur')}
      {btn('align', <AlignLeft className="w-3.5 h-3.5" />,     'Alignement')}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rich Text Editor — full block (toolbar + hints + textarea + footer)
// ─────────────────────────────────────────────────────────────────────────────

function RichTextEditor({
  defaultValue,
  placeholder,
  rows = 10,
}: {
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}) {
  const [charCount, setCharCount] = useState(defaultValue?.length ?? 0);

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 shadow-sm">
      {/* Toolbar */}
      <RichTextToolbar />

      {/* Markdown shortcut hints */}
      <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50 flex items-center gap-2 flex-wrap">
        <span className="text-caption text-subtext-color shrink-0">Raccourcis :</span>
        {[
          { code: '## Titre',   desc: 'Section'  },
          { code: '- item',     desc: 'Liste'     },
          { code: '**texte**',  desc: 'Gras'      },
          { code: '« texte »',  desc: 'Citation'  },
        ].map((h) => (
          <span
            key={h.code}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-neutral-100 border border-neutral-200"
          >
            <code className="text-caption font-mono text-brand-600">{h.code}</code>
            <span className="text-caption text-subtext-color">→ {h.desc}</span>
          </span>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        defaultValue={defaultValue}
        onChange={(e) => setCharCount(e.target.value.length)}
        placeholder={
          placeholder ??
          `## Objectifs\n\n- Premier principe de jeu\n- Deuxième principe\n\n**Note :** Texte en gras pour les points clés.\n\n« Citation ou note tactique »`
        }
        rows={rows}
        className="w-full px-4 py-3 bg-transparent text-default-font font-mono text-xs leading-relaxed focus:outline-none resize-none placeholder:text-neutral-400"
      />

      {/* Footer */}
      <div className="px-4 py-2 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between">
        <span className="text-caption text-subtext-color flex items-center gap-1.5">
          <Eye className="w-3 h-3" />
          Format Markdown supporté
        </span>
        <span className="text-caption text-subtext-color">{charCount} caractères</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Edit Slide Drawer
// ─────────────────────────────────────────────────────────────────────────────

const PHASES_LIST = ['Phase de jeu', 'Conserver - Progresser', 'Déséquilibrer - Finir'];

function EditSlideDrawer({
  slide,
  onClose,
}: {
  slide: typeof SLIDES[0];
  onClose: () => void;
}) {
  const [title, setTitle] = useState(slide.title);
  const [phase, setPhase] = useState(slide.phase);
  const [phaseOpen, setPhaseOpen] = useState(false);

  // Flatten the slide's content blocks into a single markdown string
  // so the rich text editor shows them pre-populated.
  const defaultContent = slide.content.join('\n');

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[520px] z-50 flex flex-col bg-neutral-50 border-l border-neutral-200 shadow-2xl">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg">
              <Pencil className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h2 className="text-heading-3 text-default-font">Modifier la étape</h2>
              <p className="text-caption text-subtext-color">Slide #{slide.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color hover:text-default-font transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6 min-h-0">

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Titre
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Phase */}
          <div className="flex flex-col gap-2">
            <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Phase
            </label>
            <div className="relative">
              <button
                onClick={() => setPhaseOpen(!phaseOpen)}
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body flex items-center justify-between focus:outline-none focus:border-brand-400 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getPhaseStyle(phase).dot}`} />
                  <span>{phase}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-subtext-color transition-transform ${phaseOpen ? 'rotate-180' : ''}`} />
              </button>
              {phaseOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-50 border border-neutral-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {PHASES_LIST.map((p) => {
                    const s = getPhaseStyle(p);
                    return (
                      <button
                        key={p}
                        onClick={() => { setPhase(p); setPhaseOpen(false); }}
                        className={`w-full px-3 py-2.5 text-left text-body flex items-center gap-2.5 hover:bg-neutral-100 transition-colors ${phase === p ? 'bg-brand-50' : ''}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                        <span className={phase === p ? 'text-brand-600 font-semibold' : 'text-default-font'}>{p}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Image de couverture
            </label>
            <div className="relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 group cursor-pointer">
              <img
                src={PROJET_IMAGES[slide.id % PROJET_IMAGES.length]}
                alt="cover"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-neutral-900 text-caption-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Changer l'image
                </span>
              </div>
            </div>
          </div>

          {/* ── Contenu — Rich Text Editor ── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Contenu
              </label>
              <span className="text-caption text-subtext-color">{slide.content.length} bloc{slide.content.length > 1 ? 's' : ''}</span>
            </div>

            <RichTextEditor
              defaultValue={defaultContent}
              rows={14}
              placeholder={`## Section\n- Point clé\n- Autre point\n\nTexte libre...\n\n**Gras** pour les points importants\n\n« Citation tactique »`}
            />
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-6 py-4 border-t border-neutral-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add Slide Modal
// ─────────────────────────────────────────────────────────────────────────────

function AddSlideModal({ onClose, afterIndex }: { onClose: () => void; afterIndex: number }) {
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState(PHASES_LIST[0]);
  const [phaseOpen, setPhaseOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
              <span className="text-caption text-subtext-color">Étape {step} sur 2</span>
            </div>
            <h2 className="text-heading-2 text-default-font">
              {step === 1 ? 'Nouvelle étape' : 'Contenu de la étape'}
            </h2>
            <p className="text-caption text-subtext-color mt-0.5">
              {step === 1
                ? `Sera insérée après la slide #${afterIndex + 1}`
                : `Configurez le contenu pour « ${title || 'Sans titre'} »`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color transition-colors -mt-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-neutral-200">
          <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider">Titre *</label>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Stratégie de pressing haut"
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-subtext-color"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider">Phase</label>
              <div className="relative">
                <button
                  onClick={() => setPhaseOpen(!phaseOpen)}
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getPhaseStyle(phase).dot}`} />
                    {phase}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-subtext-color transition-transform ${phaseOpen ? 'rotate-180' : ''}`} />
                </button>
                {phaseOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-50 border border-neutral-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {PHASES_LIST.map((p) => {
                      const s = getPhaseStyle(p);
                      return (
                        <button
                          key={p}
                          onClick={() => { setPhase(p); setPhaseOpen(false); }}
                          className={`w-full px-3 py-2.5 text-left text-body flex items-center gap-2.5 hover:bg-neutral-100 transition-colors ${phase === p ? 'bg-brand-50' : ''}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                          <span className={phase === p ? 'text-brand-600 font-semibold' : 'text-default-font'}>{p}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider">Image (optionnel)</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all group">
                <div className="p-2 bg-neutral-100 group-hover:bg-brand-100 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5 text-subtext-color group-hover:text-brand-600 transition-colors" />
                </div>
                <span className="text-caption text-subtext-color group-hover:text-brand-600 transition-colors">Cliquer pour sélectionner une image</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — rich text */}
        {step === 2 && (
          <div className="px-6 py-5 flex flex-col gap-4">
            <RichTextEditor
              placeholder={'## Section\n- Point clé\n- Autre point\n\nTexte libre...'}
              rows={8}
            />
            <div className="flex items-center gap-2 p-3 rounded-lg bg-brand-50 border border-brand-200">
              <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
              <span className="text-caption text-brand-600">Vous pourrez modifier le contenu à tout moment via le bouton « Modifier ».</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          {step === 2 ? (
            <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors">
              <ChevronLeft className="w-4 h-4" />Retour
            </button>
          ) : (
            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors">
              <X className="w-4 h-4" />Annuler
            </button>
          )}
          {step === 1 ? (
            <button onClick={() => setStep(2)} disabled={!title.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Suivant<ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors">
              <Plus className="w-4 h-4" />Créer l'étape
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjetPage
// ─────────────────────────────────────────────────────────────────────────────

export function ProjetPage() {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const slide = SLIDES[activeIndex];
  const image = PROJET_IMAGES[activeIndex % PROJET_IMAGES.length];
  const phaseStyle = getPhaseStyle(slide.phase);

  const displaySeason = season === '2023-2024' ? '2023-2024' : '2024-2025';

  const goTo = useCallback((idx: number) => {
    if (idx >= 0 && idx < SLIDES.length) setActiveIndex(idx);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editOpen || addOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(activeIndex + 1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(activeIndex - 1); }
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
    <div className="flex-1 flex flex-col overflow-hidden bg-default-background">

      {/* ── Top header ── */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-8 py-4 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projet')}
              className="p-2 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              title="Retour aux saisons"
            >
              <ArrowLeft className="w-5 h-5 text-brand-600" />
            </button>
            <div>
              <h1 className="text-heading-2 text-default-font">{PROJET_META.name}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1.5 text-caption text-subtext-color">
                  <Calendar className="w-3.5 h-3.5" />
                  Saison {displaySeason}
                </span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="text-caption text-subtext-color">{PROJET_META.description}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 hover:text-default-font transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une étape
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 border border-success-200">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <span className="text-caption-bold text-success-600">{PROJET_META.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex gap-4 p-4 overflow-hidden max-w-[1400px] mx-auto w-full">

          {/* Sidebar */}
          <div className="w-64 shrink-0 flex flex-col bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-neutral-200 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption-bold text-subtext-color uppercase tracking-wider">Sommaire</span>
                <span className="text-caption text-subtext-color">{activeIndex + 1} / {SLIDES.length}</span>
              </div>
              <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-300"
                  style={{ width: `${((activeIndex + 1) / SLIDES.length) * 100}%` }}
                />
              </div>
            </div>

            <nav ref={navRef} className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
              {SLIDES.map((s, idx) => {
                const isActive = idx === activeIndex;
                const pStyle = getPhaseStyle(s.phase);
                return (
                  <button
                    key={s.id}
                    ref={isActive ? activeItemRef : null}
                    onClick={() => goTo(idx)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 border transition-all duration-150 group ${isActive ? 'bg-brand-50 border-brand-200' : 'border-transparent hover:bg-neutral-100'}`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-caption-bold shrink-0 transition-colors ${isActive ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-subtext-color group-hover:bg-neutral-200'}`}>
                      {idx + 1}
                    </span>
                    <span className={`text-body text-xs leading-tight truncate transition-colors ${isActive ? 'font-semibold text-brand-600' : 'text-subtext-color group-hover:text-default-font'}`}>
                      {s.title}
                    </span>
                    <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${pStyle.dot} opacity-60`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm min-w-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="max-w-3xl mx-auto px-6 pt-6 pb-4">

                {/* Image */}
                <div className="relative rounded-lg overflow-hidden mb-5 border border-neutral-200">
                  <img src={image} alt={slide.title} className="w-full block" style={{ objectFit: 'cover', display: 'block' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <button
                    onClick={() => setEditOpen(true)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-white text-caption-bold backdrop-blur-sm transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 text-caption-bold border ${phaseStyle.badge}`}>
                      <Layers className="w-3 h-3" />
                      {slide.phase}
                    </div>
                    <h2 className="text-heading-1 text-white drop-shadow-md">{slide.title}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                  <SlideContent content={slide.content} />
                </div>

              </div>
            </div>

            {/* Bottom nav */}
            <div className="shrink-0 bg-neutral-50 border-t border-neutral-200 px-6 py-3 rounded-b-xl">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <button
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />Précédent
                </button>
                <div className="flex items-center gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-200 ${i === activeIndex ? 'w-6 h-2 bg-brand-600' : 'w-2 h-2 bg-neutral-200 hover:bg-neutral-300'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={activeIndex === SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant<ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Overlays */}
      {editOpen && <EditSlideDrawer slide={slide} onClose={() => setEditOpen(false)} />}
      {addOpen  && <AddSlideModal   onClose={() => setAddOpen(false)}  afterIndex={activeIndex} />}
    </div>
  );
}