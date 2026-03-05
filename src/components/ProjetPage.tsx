import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { SLIDES, PROJET_IMAGES, PROJET_META } from '../data/projetDeJeu';

// ─────────────────────────────────────────────────────────────────────────────
// SlideContent — inline to guarantee text color is never overridden
// ─────────────────────────────────────────────────────────────────────────────

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong
            key={i}
            style={{ color: 'rgb(250, 250, 250)', fontWeight: 600 }}
          >
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
  // ## Heading
  if (line.startsWith('## ')) {
    return (
      <div key={index} style={{ marginTop: index === 0 ? 0 : 24, marginBottom: 8 }}>
        <h3
          style={{
            color: 'rgb(0, 145, 255)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {line.replace('## ', '')}
        </h3>
        <div style={{ height: 1, background: 'rgb(48, 48, 48)' }} />
      </div>
    );
  }

  // Bullet point
  if (line.startsWith('- ')) {
    return (
      <div
        key={index}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '3px 0' }}
      >
        <span
          style={{
            marginTop: 8,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgb(0, 145, 255)',
            flexShrink: 0,
          }}
        />
        <p style={{ color: 'rgb(250, 250, 250)', fontSize: 14, lineHeight: '22px', margin: 0 }}>
          {renderInline(line.replace(/^- /, ''))}
        </p>
      </div>
    );
  }

  // Blockquote
  if (line.startsWith('«')) {
    return (
      <div
        key={index}
        style={{
          margin: '12px 0',
          padding: '12px 16px',
          background: 'rgb(36, 36, 36)',
          border: '1px solid rgb(48, 48, 48)',
          borderLeft: '3px solid rgb(0, 145, 255)',
          borderRadius: 8,
        }}
      >
        <p
          style={{
            color: 'rgb(212, 212, 212)',
            fontSize: 14,
            lineHeight: '22px',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          {line}
        </p>
      </div>
    );
  }

  // Empty line
  if (line.trim() === '') {
    return <div key={index} style={{ height: 6 }} />;
  }

  // Regular paragraph
  return (
    <p key={index} style={{ color: 'rgb(250, 250, 250)', fontSize: 14, lineHeight: '22px', margin: '3px 0' }}>
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
// Phase config
// ─────────────────────────────────────────────────────────────────────────────

const PHASES = [...new Set(SLIDES.map((s) => s.phase))];

const PHASE_COLORS: Record<string, { badge: string; dot: string }> = {
  'Phase de jeu': {
    badge: 'bg-brand-50 text-brand-600 border-brand-200',
    dot: 'bg-brand-600',
  },
  'Conserver - Progresser': {
    badge: 'bg-success-50 text-success-600 border-success-200',
    dot: 'bg-success-600',
  },
  'Déséquilibrer - Finir': {
    badge: 'bg-warning-50 text-warning-600 border-warning-200',
    dot: 'bg-warning-600',
  },
};

function getPhaseStyle(phase: string) {
  return (
    PHASE_COLORS[phase] ?? {
      badge: 'bg-neutral-100 text-subtext-color border-neutral-300',
      dot: 'bg-neutral-400',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjetPage
// ─────────────────────────────────────────────────────────────────────────────

export function ProjetPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const slide = SLIDES[activeIndex];
  const image = PROJET_IMAGES[activeIndex % PROJET_IMAGES.length];
  const phaseStyle = getPhaseStyle(slide.phase);

  const goTo = useCallback((idx: number) => {
    if (idx >= 0 && idx < SLIDES.length) setActiveIndex(idx);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goTo(activeIndex + 1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, goTo]);

  // Auto-scroll active sidebar item into view
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
            <div className="p-2 bg-brand-50 rounded-lg">
              <Target className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h1 className="text-heading-2 text-default-font">{PROJET_META.name}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1.5 text-caption text-subtext-color">
                  <Calendar className="w-3.5 h-3.5" />
                  {PROJET_META.saison}
                </span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="text-caption text-subtext-color">{PROJET_META.description}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 border border-success-200">
            <CheckCircle2 className="w-4 h-4 text-success-600" />
            <span className="text-caption-bold text-success-600">{PROJET_META.status}</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex-1 flex overflow-hidden max-w-[1400px] mx-auto w-full">

        {/* ── Left sidebar ── */}
        <div className="w-72 shrink-0 bg-neutral-50 border-r border-neutral-200 flex flex-col">

          {/* Progress header */}
          <div className="px-4 py-3 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption-bold text-subtext-color uppercase tracking-wider">
                Sommaire
              </span>
              <span className="text-caption text-subtext-color">
                {activeIndex + 1} / {SLIDES.length}
              </span>
            </div>
            <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Nav list */}
          <nav ref={navRef} className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-3">
            {PHASES.map((phase) => {
              const pStyle = getPhaseStyle(phase);
              const phaseSlides = SLIDES.filter((s) => s.phase === phase);
              const hasActive = phaseSlides.some((s) => SLIDES.indexOf(s) === activeIndex);

              return (
                <div
                  key={phase}
                  className={`
                    rounded-xl border overflow-hidden transition-all duration-200
                    ${hasActive ? 'border-brand-200 shadow-sm' : 'border-neutral-200'}
                  `}
                >
                  {/* Section header */}
                  <div
                    className={`
                      flex items-center gap-2 px-3 py-2.5 border-b
                      ${hasActive
                        ? 'bg-brand-50 border-brand-200'
                        : 'bg-neutral-100 border-neutral-200'
                      }
                    `}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${pStyle.dot}`} />
                    <span className="text-caption-bold text-subtext-color uppercase tracking-wider leading-tight">
                      {phase}
                    </span>
                    <span className="ml-auto text-caption text-subtext-color bg-white border border-neutral-200 rounded-full px-1.5 py-0.5 leading-none">
                      {phaseSlides.length}
                    </span>
                  </div>

                  {/* Slide items */}
                  <div className="flex flex-col bg-white divide-y divide-neutral-100">
                    {phaseSlides.map((s) => {
                      const idx = SLIDES.indexOf(s);
                      const isActive = idx === activeIndex;

                      return (
                        <button
                          key={s.id}
                          ref={isActive ? activeItemRef : null}
                          onClick={() => goTo(idx)}
                          className={`
                            w-full text-left flex items-center gap-2.5
                            px-3 py-2.5 transition-all duration-150 group
                            ${isActive ? 'bg-brand-50' : 'hover:bg-neutral-50'}
                          `}
                        >
                          <span
                            className={`
                              w-6 h-6 rounded-md flex items-center justify-center
                              text-caption-bold shrink-0 transition-colors
                              ${isActive
                                ? 'bg-brand-600 text-white'
                                : 'bg-neutral-100 text-subtext-color group-hover:bg-neutral-200'
                              }
                            `}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className={`
                              text-body leading-tight truncate transition-colors
                              ${isActive
                                ? 'font-semibold text-brand-600'
                                : 'text-subtext-color group-hover:text-default-font'
                              }
                            `}
                          >
                            {s.title}
                          </span>
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── Right: slide content ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-6">

              {/* Image banner */}
              <div className="relative rounded-lg overflow-hidden mb-6 border border-neutral-200">
                <img
                  src={image}
                  alt={slide.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div
                    className={`
                      inline-flex items-center gap-1.5
                      px-2.5 py-1 rounded-full mb-2
                      text-caption-bold border
                      ${phaseStyle.badge}
                    `}
                  >
                    <Layers className="w-3 h-3" />
                    {slide.phase}
                  </div>
                  <h2 className="text-heading-1 text-white drop-shadow-md">
                    {slide.title}
                  </h2>
                </div>
              </div>

              {/* Content card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <SlideContent content={slide.content} />
              </div>

            </div>
          </div>

          {/* ── Bottom navigation bar ── */}
          <div className="shrink-0 bg-neutral-50 border-t border-neutral-200 px-6 py-3">
            <div className="max-w-3xl mx-auto flex items-center justify-between">

              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  text-body text-subtext-color
                  bg-neutral-100 border border-neutral-200
                  hover:bg-neutral-150
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`
                      rounded-full transition-all duration-200
                      ${i === activeIndex
                        ? 'w-6 h-2 bg-brand-600'
                        : 'w-2 h-2 bg-neutral-200 hover:bg-neutral-300'
                      }
                    `}
                  />
                ))}
              </div>

              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === SLIDES.length - 1}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  text-body text-white
                  bg-brand-600 hover:bg-brand-700
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}