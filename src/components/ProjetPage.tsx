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
import { SlideContent } from './SlideContent';

const PHASES = [...new Set(SLIDES.map((s) => s.phase))];

const PHASE_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  'Phase de jeu': {
    bg: 'rgba(0,145,255,0.08)',
    text: '#0091FF',
    dot: '#0091FF',
    border: 'rgba(0,145,255,0.2)',
  },
  'Conserver - Progresser': {
    bg: 'rgba(70,167,88,0.08)',
    text: '#46A758',
    dot: '#46A758',
    border: 'rgba(70,167,88,0.2)',
  },
  'Déséquilibrer - Finir': {
    bg: 'rgba(234,140,0,0.08)',
    text: '#EA8C00',
    dot: '#EA8C00',
    border: 'rgba(234,140,0,0.2)',
  },
};

function getPhaseStyle(phase: string) {
  return (
    PHASE_COLORS[phase] ?? {
      bg: 'rgba(115,115,115,0.08)',
      text: '#737373',
      dot: '#737373',
      border: 'rgba(115,115,115,0.2)',
    }
  );
}

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

  useEffect(() => {
    if (activeItemRef.current && navRef.current) {
      const container = navRef.current;
      const item = activeItemRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <div
      style={{ background: '#131313', color: '#fafafa', fontFamily: "'Rubik', sans-serif" }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* ── Top header ── */}
      <div
        style={{ background: '#181818', borderBottom: '1px solid #222' }}
        className="px-8 py-4 shrink-0"
      >
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          {/* Left: icon + title */}
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(0,145,255,0.12)',
                border: '1px solid rgba(0,145,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target size={18} color="#0091FF" />
            </div>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 600, color: '#fafafa', lineHeight: 1.3 }}>
                {PROJET_META.name}
              </h1>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}
              >
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#525252' }}
                >
                  <Calendar size={12} color="#525252" />
                  {PROJET_META.saison}
                </span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#333' }} />
                <span style={{ fontSize: 12, color: '#525252' }}>{PROJET_META.description}</span>
              </div>
            </div>
          </div>

          {/* Right: status badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(70,167,88,0.1)',
              border: '1px solid rgba(70,167,88,0.25)',
            }}
          >
            <CheckCircle2 size={14} color="#46A758" />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#46A758' }}>
              {PROJET_META.status}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex overflow-hidden max-w-[1400px] mx-auto w-full">

        {/* ── Left sidebar ── */}
        <div
          style={{ background: '#181818', borderRight: '1px solid #222', width: 272 }}
          className="shrink-0 flex flex-col"
        >
          {/* Progress header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#525252' }}>
                Sommaire
              </span>
              <span style={{ fontSize: 11, color: '#525252', fontWeight: 500 }}>
                {activeIndex + 1} / {SLIDES.length}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 3, borderRadius: 2, background: '#222', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 2,
                  background: '#0091FF',
                  width: `${((activeIndex + 1) / SLIDES.length) * 100}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Nav list */}
          <nav ref={navRef} style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {PHASES.map((phase) => {
              const pStyle = getPhaseStyle(phase);
              const phaseSlides = SLIDES.filter((s) => s.phase === phase);
              return (
                <div key={phase} style={{ marginBottom: 16 }}>
                  {/* Phase label */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '4px 10px 6px',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: pStyle.dot,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: pStyle.text,
                        opacity: 0.75,
                      }}
                    >
                      {phase}
                    </span>
                  </div>

                  {/* Slides */}
                  {phaseSlides.map((s) => {
                    const idx = SLIDES.indexOf(s);
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={s.id}
                        ref={isActive ? activeItemRef : undefined}
                        onClick={() => goTo(idx)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          padding: '7px 10px',
                          borderRadius: 7,
                          marginBottom: 1,
                          cursor: 'pointer',
                          background: isActive ? 'rgba(0,145,255,0.08)' : 'transparent',
                          border: `1px solid ${isActive ? 'rgba(0,145,255,0.2)' : 'transparent'}`,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          }
                        }}
                      >
                        {/* Number badge */}
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                            background: isActive ? '#0091FF' : '#1e1e1e',
                            color: isActive ? '#fff' : '#525252',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {idx + 1}
                        </span>
                        {/* Title */}
                        <span
                          style={{
                            fontSize: 12.5,
                            lineHeight: 1.35,
                            color: isActive ? '#fafafa' : '#737373',
                            fontWeight: isActive ? 500 : 400,
                            transition: 'color 0.15s ease',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
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
              <div
                style={{
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 20,
                  border: '1px solid #222',
                }}
              >
                <img
                  src={image}
                  alt={slide.title}
                  style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                  }}
                />
                {/* Bottom labels */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 20,
                    right: 20,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '3px 10px',
                      borderRadius: 20,
                      background: phaseStyle.bg,
                      border: `1px solid ${phaseStyle.border}`,
                      marginBottom: 6,
                    }}
                  >
                    <Layers size={11} color={phaseStyle.text} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: phaseStyle.text, letterSpacing: '0.05em' }}>
                      {slide.phase}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#fafafa',
                      letterSpacing: '-0.01em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    {slide.title}
                  </h2>
                </div>
              </div>

              {/* Content card */}
              <div
                style={{
                  background: '#181818',
                  borderRadius: 12,
                  border: '1px solid #222',
                  padding: '24px',
                }}
              >
                <SlideContent content={slide.content} />
              </div>
            </div>
          </div>

          {/* ── Bottom nav ── */}
          <div
            style={{
              background: '#181818',
              borderTop: '1px solid #222',
              padding: '12px 24px',
              flexShrink: 0,
            }}
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: activeIndex === 0 ? 0.25 : 1,
                  background: 'transparent',
                  border: '1px solid #282828',
                  color: '#737373',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (activeIndex !== 0)
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,145,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <ChevronLeft size={15} />
                Précédent
              </button>

              {/* Dot indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      height: 6,
                      width: i === activeIndex ? 20 : 6,
                      borderRadius: 3,
                      background: i === activeIndex ? '#0091FF' : '#282828',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === SLIDES.length - 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: activeIndex === SLIDES.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: activeIndex === SLIDES.length - 1 ? 0.25 : 1,
                  background: 'transparent',
                  border: '1px solid #282828',
                  color: '#737373',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (activeIndex !== SLIDES.length - 1)
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,145,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                Suivant
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}