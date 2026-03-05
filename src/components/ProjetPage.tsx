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

const PHASE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Phase de jeu': { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  'Conserver - Progresser': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Déséquilibrer - Finir': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

function getPhaseStyle(phase: string) {
  return PHASE_COLORS[phase] ?? { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
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
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Top header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{PROJET_META.name}</h1>
              <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {PROJET_META.saison}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{PROJET_META.description}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">{PROJET_META.status}</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden max-w-[1400px] mx-auto w-full">
        {/* Left sidebar - slide navigation */}
        <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Sommaire
              </span>
              <span className="text-xs font-medium text-gray-400">
                {activeIndex + 1} / {SLIDES.length}
              </span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
          </div>

          <nav ref={navRef} className="flex-1 overflow-y-auto py-2 px-2">
            {PHASES.map((phase) => {
              const pStyle = getPhaseStyle(phase);
              const phaseSlides = SLIDES.filter((s) => s.phase === phase);
              return (
                <div key={phase} className="mb-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${pStyle.dot}`} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {phase}
                    </span>
                  </div>
                  {phaseSlides.map((s) => {
                    const idx = SLIDES.indexOf(s);
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={s.id}
                        ref={isActive ? activeItemRef : null}
                        onClick={() => goTo(idx)}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 transition-all duration-150 group ${
                          isActive
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span
                          className={`text-[13px] leading-tight truncate transition-colors ${
                            isActive
                              ? 'font-semibold text-blue-700'
                              : 'text-gray-600 group-hover:text-gray-900'
                          }`}
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

        {/* Right side - slide content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-6">
              {/* Image banner */}
              <div className="relative rounded-xl overflow-hidden mb-6 shadow-sm">
                <img
                  src={image}
                  alt={slide.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${phaseStyle.bg} ${phaseStyle.text}`}
                  >
                    <Layers className="w-3 h-3" />
                    {slide.phase}
                  </div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">
                    {slide.title}
                  </h2>
                </div>
              </div>

              {/* Content body */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <SlideContent content={slide.content} />
              </div>
            </div>
          </div>

          {/* Bottom navigation bar */}
          <div className="shrink-0 bg-white border-t border-gray-200 px-6 py-3">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i} 
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === activeIndex
                        ? 'w-6 h-2 bg-blue-600'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === SLIDES.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
