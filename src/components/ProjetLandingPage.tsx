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
  {
    id: '2024-2025',
    title: 'Saison 2024-2025',
    year: '2024-2025',
    description: 'Projet de jeu actif',
    status: 'active',
    category: 'Senior',
  },
  {
    id: '2023-2024',
    title: 'Saison 2023-2024',
    year: '2023-2024',
    description: 'Projet de jeu archivé',
    status: 'archived',
    category: 'Senior',
  },
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
// Create Modal
// ─────────────────────────────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; season: string; category: string; description: string }) => void;
}

function CreateModal({ onClose, onCreate }: CreateModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [season, setSeason] = useState('2025-2026');
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const canProceedStep1 = name.trim().length > 0 && category !== '';
  const canProceedStep2 = true; // description is optional

  const handleCreate = () => {
    onCreate({ name, season, category, description });
  };

  const steps = [
    { num: 1, label: 'Infos générales' },
    { num: 2, label: 'Description' },
    { num: 3, label: 'Confirmation' },
  ];

  return (
    <>
      {/* Backdrop */}
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
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color hover:text-default-font transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-0">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-caption-bold transition-all ${
                        step > s.num
                          ? 'bg-brand-600 text-white'
                          : step === s.num
                          ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                          : 'bg-neutral-200 text-subtext-color'
                      }`}
                    >
                      {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span className={`text-caption hidden sm:block ${step === s.num ? 'text-brand-600 font-semibold' : 'text-subtext-color'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-colors ${step > s.num ? 'bg-brand-300' : 'bg-neutral-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Step 1: General info ── */}
          {step === 1 && (
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Name */}
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

              {/* Season */}
              <div className="flex flex-col gap-2">
                <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Saison *
                </label>
                <div className="relative">
                  <button
                    onClick={() => setSeasonOpen(!seasonOpen)}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body flex items-center justify-between focus:outline-none transition-all"
                  >
                    <span>{season}</span>
                    <ChevronDown className={`w-4 h-4 text-subtext-color transition-transform ${seasonOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {seasonOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-50 border border-neutral-200 rounded-lg shadow-lg z-10 overflow-hidden">
                      {SEASON_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSeason(s); setSeasonOpen(false); }}
                          className={`w-full px-3 py-2.5 text-left text-body flex items-center justify-between hover:bg-neutral-100 transition-colors ${season === s ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-default-font'}`}
                        >
                          {s}
                          {season === s && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-caption-bold text-subtext-color uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Catégorie *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`
                        flex flex-col items-center gap-1 px-2 py-3 rounded-lg border text-center transition-all
                        ${category === cat.id
                          ? `${CATEGORY_COLORS[cat.id]} ring-2 ring-offset-1 ring-brand-300 font-semibold`
                          : 'bg-neutral-100 border-neutral-200 text-subtext-color hover:bg-neutral-150 hover:border-neutral-300'
                        }
                      `}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-caption-bold">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Description ── */}
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
                  placeholder="Décrivez les objectifs généraux de ce projet de jeu, le style de jeu souhaité, les priorités de la saison..."
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-subtext-color resize-none"
                />
                <span className="text-caption text-subtext-color text-right">{description.length} caractères</span>
              </div>

              <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg">
                <p className="text-caption text-subtext-color leading-relaxed">
                  💡 La description apparaîtra sur la page d'accueil du projet. Vous pourrez la modifier à tout moment depuis les paramètres du projet.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="p-5 bg-neutral-100 border border-neutral-200 rounded-xl flex flex-col gap-4">
                <h3 className="text-caption-bold text-subtext-color uppercase tracking-wider">Récapitulatif</h3>

                <div className="flex flex-col gap-3">
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
                    <span className={`text-caption-bold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[category]}`}>
                      {CATEGORIES.find((c) => c.id === category)?.label}
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
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-success-50 border border-success-200">
                <Sparkles className="w-4 h-4 text-success-600 shrink-0" />
                <p className="text-caption text-success-600">
                  Un projet de jeu vierge sera créé. Vous pourrez y ajouter des diapositives et du contenu immédiatement.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            {step === 1 ? (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            ) : (
              <button
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors"
              >
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
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Créer le projet
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Blank Projet Page
// ─────────────────────────────────────────────────────────────────────────────

interface BlankProjetPageProps {
  name: string;
  season: string;
  category: string;
  description: string;
  onBack: () => void;
}

function BlankProjetPage({ name, season, category, description, onBack }: BlankProjetPageProps) {
  const [addOpen, setAddOpen] = useState(false);
  const catLabel = CATEGORIES.find((c) => c.id === category)?.label ?? category;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-default-background">

      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-8 py-4 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color transition-colors"
            >
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
              Ajouter une diapositive
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-caption-bold text-brand-600">Nouveau projet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex gap-4 p-4 overflow-hidden max-w-[1400px] mx-auto w-full">

          {/* Left sidebar — empty state */}
          <div className="w-64 shrink-0 flex flex-col bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            {/* Progress */}
            <div className="px-4 py-3 border-b border-neutral-200 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption-bold text-subtext-color uppercase tracking-wider">Sommaire</span>
                <span className="text-caption text-subtext-color">0 / 0</span>
              </div>
              <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>

            {/* Empty nav */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-3 min-h-0">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <Layers className="w-5 h-5 text-subtext-color" />
              </div>
              <p className="text-caption text-subtext-color text-center leading-relaxed">
                Aucune diapositive.<br />
                Commencez par en ajouter une.
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold text-brand-600 bg-brand-50 border border-brand-200 hover:bg-brand-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Right panel — empty state */}
          <div className="flex-1 flex flex-col bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm min-w-0">
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 min-h-0">

              {/* Big empty state illustration */}
              <div className="flex flex-col items-center gap-6 max-w-md text-center">

                {/* Dashed preview card */}
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
                    <div className="h-3 rounded bg-neutral-200/60 w-4/6" />
                  </div>
                </div>

                <div>
                  <h3 className="text-heading-2 text-default-font mb-2">Votre projet est vide</h3>
                  {description ? (
                    <p className="text-body text-subtext-color leading-relaxed mb-1">{description}</p>
                  ) : (
                    <p className="text-body text-subtext-color leading-relaxed">
                      Ce projet de jeu ne contient pas encore de diapositives. Commencez par créer votre première diapositive pour définir vos principes de jeu.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setAddOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Créer la première diapositive
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <p className="text-caption text-subtext-color">
                  Ou importez un projet existant
                </p>
              </div>
            </div>

            {/* Bottom nav — disabled */}
            <div className="shrink-0 bg-neutral-50 border-t border-neutral-200 px-6 py-3 rounded-b-xl">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <button disabled className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 opacity-30 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-neutral-200" />
                </div>
                <button disabled className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-white bg-brand-600 opacity-30 cursor-not-allowed">
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Add slide modal (reuse simple version) */}
      {addOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setAddOpen(false)}
        >
          <div
            className="bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 rounded-lg">
                  <Plus className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-heading-3 text-default-font">Nouvelle diapositive</h2>
                  <p className="text-caption text-subtext-color">Première diapositive du projet</p>
                </div>
              </div>
              <button onClick={() => setAddOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-subtext-color transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-caption-bold text-subtext-color uppercase tracking-wider">Titre *</label>
                <input
                  autoFocus
                  placeholder="Ex: Généralités, Principes défensifs..."
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-default-font text-body focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-subtext-color"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-caption-bold text-subtext-color uppercase tracking-wider">Phase</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Phase de jeu', 'Conserver - Progresser', 'Déséquilibrer - Finir'].map((p) => (
                    <button key={p} className="px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-100 text-caption text-subtext-color hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 transition-all text-center leading-tight">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
              <button onClick={() => setAddOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-subtext-color bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors">
                <X className="w-4 h-4" />
                Annuler
              </button>
              <button onClick={() => setAddOpen(false)} className="flex items-center gap-2 px-5 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors">
                <Plus className="w-4 h-4" />
                Créer la diapositive
              </button>
            </div>
          </div>
        </div>
      )}
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

  const handleSeasonClick = (seasonId: string) => {
    navigate(`/projet/${seasonId}`);
  };

  const handleCreate = (data: { name: string; season: string; category: string; description: string }) => {
    setCreateOpen(false);
    setNewProject(data);
  };

  // Show blank projet page after creation
  if (newProject) {
    return (
      <BlankProjetPage
        {...newProject}
        onBack={() => setNewProject(null)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-brand-50 rounded-xl">
                  <Target className="w-6 h-6 text-brand-600" />
                </div>
                <h1 className="text-heading-1 text-default-font">Projet de Jeu</h1>
              </div>
              <p className="text-body text-subtext-color ml-14">
                Sélectionnez une saison pour consulter le projet de jeu
              </p>
            </div>

            {/* Create button */}
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-body text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Créer un projet
            </button>
          </div>
        </div>

        {/* Season Cards Grid */}
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
                  <h3 className="text-heading-2 text-default-font mb-2 group-hover:text-brand-600 transition-colors">
                    {season.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-2 text-body text-subtext-color">
                      <Calendar className="w-4 h-4" />
                      {season.year}
                    </span>
                    {season.category && (
                      <span className={`text-caption-bold px-2 py-0.5 rounded-full border ${catColor}`}>
                        {season.category}
                      </span>
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

          {/* "Create new" card hint */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group border-2 border-dashed border-neutral-300 rounded-xl p-8 text-left transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 flex flex-col items-center justify-center gap-3 min-h-[200px]"
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

        {/* Bottom Info */}
        <div className="mt-12 p-6 bg-brand-50 border border-brand-100 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-100 rounded-lg shrink-0">
              <Target className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="text-body font-semibold text-default-font mb-1">À propos du Projet de Jeu</h4>
              <p className="text-body text-subtext-color leading-relaxed">
                Le projet de jeu définit les principes, stratégies et comportements collectifs de l'équipe pour chaque saison. Il couvre tous les aspects du jeu : défense, attaque, transitions, et situations spéciales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <CreateModal
          onClose={() => setCreateOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}