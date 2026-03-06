import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Calendar,
  ChevronRight,
  Trophy,
  Plus,
  X,
  ChevronDown,
  Users,
  FileText,
  Sparkles,
  ChevronLeft,
  Layers,
  CheckCircle2,
  ArrowRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Minus,
  ImageIcon,
  Upload,
  AlignLeft,
  Pencil,
  Trash2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface SeasonCard {
  id: string;
  title: string;
  year: string;
  description: string;
  status: 'active' | 'archived';
  category?: string;
}

const SEASONS: SeasonCard[] = [
  { id: '2024-2025', title: 'Saison 2024-2025', year: '2024-2025', description: 'Projet de jeu actif', status: 'active', category: 'Senior' },
  { id: '2023-2024', title: 'Saison 2023-2024', year: '2023-2024', description: 'Projet de jeu archivé', status: 'archived', category: 'Senior' },
];

const SEASON_OPTIONS = ['2025-2026', '2024-2025', '2023-2024', '2022-2023'];

const CATEGORIES = [
  { id: 'u8', label: 'U8', icon: '⚽', description: 'Moins de 8 ans' },
  { id: 'u10', label: 'U10', icon: '⚽', description: 'Moins de 10 ans' },
  { id: 'u12', label: 'U12', icon: '⚽', description: 'Moins de 12 ans' },
  { id: 'u14', label: 'U14', icon: '⚽', description: 'Moins de 14 ans' },
  { id: 'u16', label: 'U16', icon: '⚽', description: 'Moins de 16 ans' },
  { id: 'u18', label: 'U18', icon: '⚽', description: 'Moins de 18 ans' },
  { id: 'senior', label: 'Senior', icon: '🏆', description: 'Équipe première' },
  { id: 'feminin', label: 'Féminin', icon: '⭐', description: 'Équipe féminine' },
];

const PHASES = [
  { id: 'phase-de-jeu', label: 'Phase de jeu', dot: 'bg-brand-600', badge: 'bg-brand-50 border-brand-200 text-brand-600' },
  { id: 'conserver', label: 'Conserver - Progresser', dot: 'bg-success-600', badge: 'bg-success-50 border-success-200 text-success-600' },
  { id: 'desequilibrer', label: 'Déséquilibrer - Finir', dot: 'bg-warning-600', badge: 'bg-warning-50 border-warning-200 text-warning-600' },
];

const CATEGORY_COLORS: Record<string, string> = {
  u8: 'bg-purple-50 border-purple-200 text-purple-700',
  u10: 'bg-pink-50 border-pink-200 text-pink-700',
  u12: 'bg-orange-50 border-orange-200 text-orange-700',
  u14: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  u16: 'bg-green-50 border-green-200 text-green-700',
  u18: 'bg-teal-50 border-teal-200 text-teal-700',
  senior: 'bg-brand-50 border-brand-200 text-brand-700',
  feminin: 'bg-rose-50 border-rose-200 text-rose-700',
};

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Dropdown
// ─────────────────────────────────────────────────────────────────────────────

interface DropdownOption { id: string; label: string; icon?: string; dot?: string; }

function Dropdown({ value, options, onChange, placeholder }: {
  value: string;
  options: DropdownOption[];
  onChange: (id: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body flex items-center justify-between focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
      >
        <div className="flex items-center gap-2 min-w-0">
          {selected?.dot && <span className={`w-2 h-2 rounded-full shrink-0 ${selected.dot}`} />}
          {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
          <span className={`truncate ${selected ? 'text-default-font' : 'text-subtext-color'}`}>
            {selected ? selected.label : (placeholder ?? 'Sélectionner...')}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-subtext-color transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-50 border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className={`w-full px-3 py-2.5 text-left text-body flex items-center justify-between hover:bg-neutral-100 transition-colors gap-2 ${value === opt.id ? 'bg-brand-50' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {opt.dot && <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />}
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span className={`truncate ${value === opt.id ? 'text-brand-600 font-semibold' : 'text-default-font'}`}>{opt.label}</span>
              </div>
              {value === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rich Text Toolbar
// ─────────────────────────────────────────────────────────────────────────────

function RichTextToolbar() {
  const [active, setActive] = useState<string[]>([]);
  const toggle = (key: string) => setActive((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const btn = (key: string, icon: React.ReactNode, title: string) => (
    <button
      title={title}
      onClick={() => toggle(key)}
      className={`p-1.5 rounded transition-colors ${active.includes(key) ? 'bg-brand-100 text-brand-600' : 'text-subtext-color hover:bg-neutral-200 hover:text-default-font'}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-neutral-100 border-b border-neutral-200 flex-wrap">
      {btn('bold', <Bold className="w-3.5 h-3.5" />, 'Gras')}
      {btn('italic', <Italic className="w-3.5 h-3.5" />, 'Italique')}
      <div className="w-px h-4 bg-neutral-300 mx-1" />
      {btn('h2', <Heading2 className="w-3.5 h-3.5" />, 'Titre de section')}
      {btn('quote', <Quote className="w-3.5 h-3.5" />, 'Citation')}
      <div className="w-px h-4 bg-neutral-300 mx-1" />
      {btn('ul', <List className="w-3.5 h-3.5" />, 'Liste à puces')}
      {btn('ol', <ListOrdered className="w-3.5 h-3.5" />, 'Liste numérotée')}
      <div className="w-px h-4 bg-neutral-300 mx-1" />
      {btn('hr', <Minus className="w-3.5 h-3.5" />, 'Séparateur')}
      {btn('align', <AlignLeft className="w-3.5 h-3.5" />, 'Alignement')}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add Slide Modal
// ─────────────────────────────────────────────────────────────────────────────

interface AddSlideModalProps {
  onClose: () => void;
  onCreated: (title: string, phase: string) => void;
  slideNumber: number;
}

function AddSlideModal({ onClose, onCreated, slideNumber }: AddSlideModalProps) {
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('');

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg">
              <Plus className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h2 className="text-heading-3 text-default-font">Nouvelle Etape</h2>
              <p className="text-caption text-subtext-color">Etape #{slideNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-caption-bold text-subtext-color uppercase tracking-wider">Titre *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Généralités, Principes défensifs..."
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-subtext-color"
            />
          </div>

          {/* Phase — dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Phase
            </label>
            <Dropdown
              value={phase}
              options={PHASES.map((p) => ({ id: p.id, label: p.label, dot: p.dot }))}
              onChange={setPhase}
              placeholder="Sélectionner une phase..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
          <button
            onClick={() => onCreated(title || 'Sans titre', phase || 'phase-de-jeu')}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer l Etape
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Blank Projet Page (with live slide editor after creation)
// ─────────────────────────────────────────────────────────────────────────────

interface SlideItem { title: string; phase: string; }

interface BlankProjetPageProps {
  name: string;
  season: string;
  category: string;
  description: string;
  onBack: () => void;
}

function BlankProjetPage({ name, season, category, description, onBack }: BlankProjetPageProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const catLabel = CATEGORIES.find((c) => c.id === category)?.label ?? category;

  const handleCreated = (title: string, phase: string) => {
    const newSlides = [...slides, { title, phase }];
    setSlides(newSlides);
    setActiveIdx(newSlides.length - 1);
    setAddOpen(false);
  };

  const activeSlide = activeIdx !== null ? slides[activeIdx] : null;
  const activePhase = activeSlide ? PHASES.find((p) => p.id === activeSlide.phase) : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-default-background">

      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-8 py-4 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-brand-50 rounded-lg">
              <Target className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h1 className="text-heading-2 text-default-font">{name}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1.5 text-caption text-subtext-color">
                  <Calendar className="w-3.5 h-3.5" />
                  Saison {season}
                </span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className={`text-caption-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`}>
                  {catLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 hover:text-default-font transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une Etape
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-caption-bold text-brand-600">Nouveau projet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex gap-4 p-4 overflow-hidden max-w-[1400px] mx-auto w-full">

          {/* ── Left sidebar ── */}
          <div className="w-64 shrink-0 flex flex-col bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-neutral-200 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption-bold text-subtext-color uppercase tracking-wider">Sommaire</span>
                <span className="text-caption text-subtext-color">
                  {slides.length > 0 ? `${(activeIdx ?? 0) + 1} / ${slides.length}` : '0 / 0'}
                </span>
              </div>
              <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-300"
                  style={{ width: slides.length > 0 ? `${((activeIdx ?? 0) + 1) / slides.length * 100}%` : '0%' }}
                />
              </div>
            </div>

            {slides.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-3 min-h-0">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-subtext-color" />
                </div>
                <p className="text-caption text-subtext-color text-center leading-relaxed">
                  Aucune diapositive.<br />Commencez par en ajouter une.
                </p>
                <button
                  onClick={() => setAddOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold text-brand-600 bg-brand-50 border border-brand-200 hover:bg-brand-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter
                </button>
              </div>
            ) : (
              <nav className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
                {slides.map((s, idx) => {
                  const isActive = idx === activeIdx;
                  const ph = PHASES.find((p) => p.id === s.phase);
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 border transition-all duration-150 group ${isActive ? 'bg-brand-50 border-brand-200' : 'border-transparent hover:bg-neutral-100'}`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-caption-bold shrink-0 transition-colors ${isActive ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-subtext-color group-hover:bg-neutral-200'}`}>
                        {idx + 1}
                      </span>
                      <span className={`text-body text-xs leading-tight truncate transition-colors ${isActive ? 'font-semibold text-brand-600' : 'text-subtext-color group-hover:text-default-font'}`}>
                        {s.title}
                      </span>
                      {ph && <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${ph.dot} opacity-60`} />}
                    </button>
                  );
                })}
                <button
                  onClick={() => setAddOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-neutral-300 text-subtext-color hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-caption-bold">Ajouter</span>
                </button>
              </nav>
            )}
          </div>

          {/* ── Right panel ── */}
          <div className="flex-1 flex flex-col bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm min-w-0">

            {activeSlide ? (
              /* Slide editor */
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="max-w-3xl mx-auto px-6 pt-6 pb-8 flex flex-col gap-6">

                  {/* Slide header row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {activePhase && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption-bold border shrink-0 ${activePhase.badge}`}>
                          <Layers className="w-3 h-3" />
                          {activePhase.label}
                        </span>
                      )}
                      <h2 className="text-heading-1 text-default-font truncate">{activeSlide.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                        Modifier le titre
                      </button>
                      <button className="p-1.5 rounded-lg text-subtext-color hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* ── Section 1 : Image ── */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-brand-600" />
                      <span className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Image de couverture
                      </span>
                      <span className="ml-auto text-caption text-subtext-color">Optionnel</span>
                    </div>

                    {/* Upload zone */}
                    <div className="relative border-2 border-dashed border-neutral-300 rounded-xl overflow-hidden bg-neutral-100/40 hover:border-brand-400 hover:bg-brand-50/20 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 group-hover:border-brand-200 group-hover:bg-brand-50 flex items-center justify-center shadow-sm transition-colors">
                          <Upload className="w-6 h-6 text-subtext-color group-hover:text-brand-600 transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="text-body font-semibold text-default-font group-hover:text-brand-600 transition-colors">
                            Glissez une image ici
                          </p>
                          <p className="text-caption text-subtext-color mt-0.5">
                            ou <span className="text-brand-600 underline underline-offset-2 cursor-pointer">parcourez vos fichiers</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {['PNG', 'JPG', 'WEBP'].map((fmt) => (
                            <span key={fmt} className="px-2 py-0.5 rounded bg-neutral-200 text-caption text-subtext-color">{fmt}</span>
                          ))}
                          <span className="text-caption text-subtext-color">· max 5 Mo</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-3 text-caption text-subtext-color">16:9 recommandé</div>
                    </div>
                  </div>

                  {/* ── Section 2 : Content / Rich text ── */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-brand-600" />
                      <span className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Contenu de la diapositive
                      </span>
                    </div>

                    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 shadow-sm">
                      {/* Toolbar */}
                      <RichTextToolbar />

                      {/* Markdown hints */}
                      <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center gap-3 flex-wrap bg-neutral-50">
                        <span className="text-caption text-subtext-color">Raccourcis :</span>
                        {[
                          { code: '## Titre', desc: 'Section' },
                          { code: '- item', desc: 'Liste' },
                          { code: '**texte**', desc: 'Gras' },
                          { code: '« texte »', desc: 'Citation' },
                        ].map((h) => (
                          <span key={h.code} className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200">
                            <code className="text-caption font-mono text-brand-600">{h.code}</code>
                            <span className="text-caption text-subtext-color">→ {h.desc}</span>
                          </span>
                        ))}
                      </div>

                      {/* Editor area */}
                      <textarea
                        placeholder={`## Objectifs\n\nDécrivez les principes de jeu pour cette diapositive...\n\n- Premier point clé\n- Deuxième point clé\n\n**Remarque :** Texte en gras pour les points importants.\n\n« Citation ou note tactique »`}
                        rows={12}
                        className="w-full px-5 py-4 bg-transparent text-default-font font-mono text-sm leading-relaxed focus:outline-none resize-none placeholder:text-neutral-400"
                      />

                      {/* Editor footer */}
                      <div className="px-4 py-2 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between">
                        <span className="text-caption text-subtext-color">Format Markdown supporté</span>
                        <span className="text-caption text-subtext-color">0 caractères</span>
                      </div>
                    </div>
                  </div>

                  {/* Save bar */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-caption text-subtext-color italic">Modifications non enregistrées</p>
                    <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                      Enregistrer
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 min-h-0">
                <div className="flex flex-col items-center gap-6 max-w-md text-center">
                  <div className="w-full max-w-sm border-2 border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center gap-4 bg-neutral-100/50">
                    <div className="w-full h-24 rounded-lg bg-neutral-200/60 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-subtext-color">
                        <Target className="w-5 h-5" />
                        <span className="text-caption">Image de couverture</span>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <div className="h-4 rounded bg-neutral-200/80 w-3/4" />
                      <div className="h-3 rounded bg-neutral-200/60 w-full" />
                      <div className="h-3 rounded bg-neutral-200/60 w-5/6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-heading-2 text-default-font mb-2">Votre projet est vide</h3>
                    <p className="text-body text-subtext-color leading-relaxed">
                      {description || 'Ce projet de jeu ne contient pas encore de diapositives.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setAddOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Créer la première diapositive
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom nav */}
            <div className="shrink-0 bg-neutral-50 border-t border-neutral-200 px-6 py-3 rounded-b-xl">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <button
                  disabled={!activeSlide || activeIdx === 0}
                  onClick={() => setActiveIdx((i) => Math.max(0, (i ?? 1) - 1))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-150 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>
                <div className="flex items-center gap-1.5">
                  {slides.length === 0 ? (
                    <div className="w-2 h-2 rounded-full bg-neutral-200" />
                  ) : slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`rounded-full transition-all duration-200 ${i === activeIdx ? 'w-6 h-2 bg-brand-600' : 'w-2 h-2 bg-neutral-200 hover:bg-neutral-300'}`}
                    />
                  ))}
                </div>
                <button
                  disabled={!activeSlide || activeIdx === slides.length - 1}
                  onClick={() => setActiveIdx((i) => Math.min(slides.length - 1, (i ?? -1) + 1))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {addOpen && (
        <AddSlideModal
          onClose={() => setAddOpen(false)}
          onCreated={handleCreated}
          slideNumber={slides.length + 1}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Modal (with dropdown category + dropdown season)
// ─────────────────────────────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; season: string; category: string; description: string }) => void;
}

function CreateModal({ onClose, onCreate }: CreateModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [season, setSeason] = useState('2025-2026');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const canProceedStep1 = name.trim().length > 0 && category !== '';

  const steps = [
    { num: 1, label: 'Infos générales' },
    { num: 2, label: 'Description' },
    { num: 3, label: 'Confirmation' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-neutral-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-xl border border-brand-100">
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="text-heading-2 text-default-font">Créer un projet de jeu</h2>
                <p className="text-caption text-subtext-color mt-0.5">
                  {step === 1 && 'Définissez les informations générales'}
                  {step === 2 && 'Ajoutez une description (optionnel)'}
                  {step === 3 && 'Vérifiez avant de créer'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color hover:text-default-font transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Steps */}
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-caption-bold transition-all ${step > s.num ? 'bg-brand-600 text-white' : step === s.num ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-neutral-200 text-subtext-color'}`}>
                    {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className={`text-caption hidden sm:block ${step === s.num ? 'text-brand-600 font-semibold' : 'text-subtext-color'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-colors ${step > s.num ? 'bg-brand-300' : 'bg-neutral-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="px-6 py-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Nom du projet *
              </label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Projet de Jeu Ajim 2025-2026"
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-subtext-color"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Saison *
              </label>
              <Dropdown
                value={season}
                options={SEASON_OPTIONS.map((s) => ({ id: s, label: s }))}
                onChange={setSeason}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Catégorie *
              </label>
              <Dropdown
                value={category}
                options={CATEGORIES.map((c) => ({ id: c.id, label: `${c.label} — ${c.description}`, icon: c.icon }))}
                onChange={setCategory}
                placeholder="Sélectionner une catégorie..."
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Description du projet
                <span className="ml-1 text-caption text-subtext-color font-normal normal-case tracking-normal">(optionnel)</span>
              </label>
              <textarea
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez les objectifs généraux de ce projet de jeu..."
                rows={5}
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-subtext-color resize-none"
              />
              <span className="text-caption text-subtext-color text-right">{description.length} caractères</span>
            </div>
            <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg">
              <p className="text-caption text-subtext-color leading-relaxed">
                💡 La description apparaîtra sur la page d'accueil du projet. Modifiable à tout moment.
              </p>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="p-5 bg-neutral-100 border border-neutral-200 rounded-xl flex flex-col gap-3">
              <h3 className="text-caption-bold text-subtext-color uppercase tracking-wider">Récapitulatif</h3>
              <div className="flex items-center justify-between">
                <span className="text-caption text-subtext-color flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Nom</span>
                <span className="text-body font-semibold text-default-font">{name}</span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-caption text-subtext-color flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Saison</span>
                <span className="text-body text-default-font">{season}</span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-caption text-subtext-color flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Catégorie</span>
                <span className={`text-caption-bold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[category] ?? ''}`}>
                  {CATEGORIES.find((c) => c.id === category)?.icon} {CATEGORIES.find((c) => c.id === category)?.label}
                </span>
              </div>
              {description && (
                <>
                  <div className="h-px bg-neutral-200" />
                  <div className="flex flex-col gap-1">
                    <span className="text-caption text-subtext-color">Description</span>
                    <p className="text-body text-default-font leading-relaxed">{description}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-success-50 border border-success-200">
              <Sparkles className="w-4 h-4 text-success-600 shrink-0" />
              <p className="text-caption text-success-600">Un projet vierge sera créé. Vous pourrez y ajouter des diapositives immédiatement.</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          {step === 1 ? (
            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors">
              <X className="w-4 h-4" />
              Annuler
            </button>
          ) : (
            <button onClick={() => setStep((step - 1) as 1 | 2 | 3)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as 2 | 3)}
              disabled={step === 1 && !canProceedStep1}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onCreate({ name, season, category, description })}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Créer le projet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjetLandingPage
// ─────────────────────────────────────────────────────────────────────────────

export function ProjetLandingPage() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState<null | { name: string; season: string; category: string; description: string }>(null);

  const handleSeasonClick = (seasonId: string) => navigate(`/projet/${seasonId}`);
  const handleCreate = (data: { name: string; season: string; category: string; description: string }) => {
    setCreateOpen(false);
    setNewProject(data);
  };

  if (newProject) {
    return <BlankProjetPage {...newProject} onBack={() => setNewProject(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-5xl mx-auto px-8 py-12">

        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-brand-50 rounded-xl">
                  <Target className="w-6 h-6 text-brand-600" />
                </div>
                <h1 className="text-heading-1 text-default-font">Projet de Jeu</h1>
              </div>
              <p className="text-body text-subtext-color ml-14">Sélectionnez une saison pour consulter le projet de jeu</p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-body text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Créer un projet
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {SEASONS.map((season) => {
            const catColor = season.category ? CATEGORY_COLORS[season.category.toLowerCase()] : '';
            return (
              <button
                key={season.id}
                onClick={() => handleSeasonClick(season.id)}
                className="group relative bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-left transition-all duration-200 hover:shadow-lg hover:border-brand-300 hover:-translate-y-1"
              >
                {season.status === 'active' && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-50 border border-success-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                      <span className="text-caption-bold text-success-600">Actif</span>
                    </div>
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-brand-100 border border-brand-200 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:border-brand-600 transition-colors">
                  <Trophy className="w-7 h-7 text-brand-600 group-hover:text-white transition-colors" />
                </div>
                <div className="mb-6">
                  <h3 className="text-heading-2 text-default-font mb-2 group-hover:text-brand-600 transition-colors">{season.title}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-2 text-body text-subtext-color">
                      <Calendar className="w-4 h-4" />
                      {season.year}
                    </span>
                    {season.category && (
                      <span className={`text-caption-bold px-2 py-0.5 rounded-full border ${catColor}`}>{season.category}</span>
                    )}
                  </div>
                  <p className="text-body text-subtext-color">{season.description}</p>
                </div>
                <div className="flex items-center gap-2 text-body text-brand-600 font-medium">
                  <span>Consulter le projet</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
          <button
            onClick={() => setCreateOpen(true)}
            className="group border-2 border-dashed border-neutral-300 rounded-xl p-8 transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 flex flex-col items-center justify-center gap-3 min-h-[200px]"
          >
            <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-brand-100 group-hover:border-brand-200 transition-colors">
              <Plus className="w-7 h-7 text-subtext-color group-hover:text-brand-600 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-body font-semibold text-subtext-color group-hover:text-brand-600 transition-colors">Nouveau projet</p>
              <p className="text-caption text-subtext-color mt-0.5">Créer un projet pour une nouvelle saison</p>
            </div>
          </button>
        </div>

        <div className="mt-12 p-6 bg-brand-50 border border-brand-100 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-100 rounded-lg shrink-0">
              <Target className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="text-body font-semibold text-default-font mb-1">À propos du Projet de Jeu</h4>
              <p className="text-body text-subtext-color leading-relaxed">
                Le projet de jeu définit les principes, stratégies et comportements collectifs de l'équipe pour chaque saison.
              </p>
            </div>
          </div>
        </div>
      </div>

      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}