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

// Mirror the same pattern as getStatusColor / getPriorityColor in MeetingsPage
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
    // Same root bg as every other page
    <div className="flex-1 flex flex-col overflow-hidden bg-default-background">

      {/* ── Top header ──────────────────────────────────────────────────────────
          Same surface as meeting cards: bg-neutral-50 border-b border-neutral-200
      ─────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-8 py-4 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">

          {/* Left: icon + title */}
          <div className="flex items-center gap-4">
            {/* Icon container — same as Calendar/Clock/MapPin icon wrappers in MeetingsPage */}
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

          {/* Right: status badge — same as Completed badge in MeetingsPage */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 border border-success-200">
            <CheckCircle2 className="w-4 h-4 text-success-600" />
            <span className="text-caption-bold text-success-600">{PROJET_META.status}</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden max-w-[1400px] mx-auto w-full">

        {/* ── Left sidebar ────────────────────────────────────────────────────
            bg-neutral-50 border-r border-neutral-200 — same as MeetingsPage sidebar
        ──────────────────────────────────────────────────────────────────────── */}
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
            {/* Progress bar — brand-600 fill on neutral-200 track */}
            <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Nav list */}
          <nav ref={navRef} className="flex-1 overflow-y-auto py-2 px-2">
            {PHASES.map((phase) => {
              const pStyle = getPhaseStyle(phase);
              const phaseSlides = SLIDES.filter((s) => s.phase === phase);

              return (
                <div key={phase} className="mb-3">
                  {/* Phase group label */}
                  <div className="flex items-center gap-2 px-3 py-1.5 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${pStyle.dot}`} />
                    <span className="text-caption-bold text-subtext-color uppercase tracking-wider">
                      {phase}
                    </span>
                  </div>

                  {/* Slide buttons */}
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
                          px-3 py-2 rounded-lg mb-0.5 border
                          transition-all duration-150 group
                          ${isActive
                            ? 'bg-brand-50 border-brand-200'
                            : 'border-transparent hover:bg-neutral-100'
                          }
                        `}
                      >
                        {/* Number badge — same shape as task priority/status badges */}
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

                        {/* Title */}
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
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── Right: slide content ─────────────────────────────────────────── */}
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
                {/* Dark gradient — same as meeting card hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Overlaid labels */}
                <div className="absolute bottom-4 left-5 right-5">
                  {/* Phase badge — same rounded-full caption-bold border pattern as status badges */}
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

              {/* Content card — same as discussion/idea cards in MeetingsPage */}
              <div className="bg-neutral-400 border border-neutral-200 rounded-lg p-6">
                <SlideContent content={slide.content} />
              </div>

            </div>
          </div>

          {/* ── Bottom navigation bar ──────────────────────────────────────────
              bg-neutral-50 border-t border-neutral-200 — same as filter/search bar
          ────────────────────────────────────────────────────────────────────── */}
          <div className="shrink-0 bg-neutral-50 border-t border-neutral-200 px-6 py-3">
            <div className="max-w-3xl mx-auto flex items-center justify-between">

              {/* Prev — ghost button, same as Cancel / secondary actions */}
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

              {/* Dot indicators */}
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

              {/* Next — primary button, same as "New Meeting" */}
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