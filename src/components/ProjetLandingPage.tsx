import { useNavigate } from 'react-router-dom';
import { Target, Calendar, ChevronRight, Trophy } from 'lucide-react';

interface SeasonCard {
  id: string;
  title: string;
  year: string;
  description: string;
  status: 'active' | 'archived';
}

const SEASONS: SeasonCard[] = [
  {
    id: '2024-2025',
    title: 'Saison 2024-2025',
    year: '2024-2025',
    description: 'Projet de jeu actif',
    status: 'active',
  },
  {
    id: '2023-2024',
    title: 'Saison 2023-2024',
    year: '2023-2024',
    description: 'Projet de jeu archivé',
    status: 'archived',
  },
];

export function ProjetLandingPage() {
  const navigate = useNavigate();

  const handleSeasonClick = (seasonId: string) => {
    navigate(`/projet/${seasonId}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
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

        {/* Season Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {SEASONS.map((season) => (
            <button
              key={season.id}
              onClick={() => handleSeasonClick(season.id)}
              className="group relative bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-left transition-all duration-200 hover:shadow-lg hover:border-brand-300 hover:-translate-y-1"
            >
              {/* Status Badge */}
              {season.status === 'active' && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-50 border border-success-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                    <span className="text-caption-bold text-success-600">Actif</span>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-brand-100 border border-brand-200 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:border-brand-600 transition-colors">
                <Trophy className="w-7 h-7 text-brand-600 group-hover:text-white transition-colors" />
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-heading-2 text-default-font mb-2 group-hover:text-brand-600 transition-colors">
                  {season.title}
                </h3>
                <div className="flex items-center gap-2 text-body text-subtext-color mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{season.year}</span>
                </div>
                <p className="text-body text-subtext-color">
                  {season.description}
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 text-body text-brand-600 font-medium">
                <span>Consulter le projet</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 p-6 bg-brand-50 border border-brand-100 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-100 rounded-lg shrink-0">
              <Target className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="text-body font-semibold text-default-font mb-1">
                À propos du Projet de Jeu
              </h4>
              <p className="text-body text-subtext-color leading-relaxed">
                Le projet de jeu définit les principes, stratégies et comportements collectifs de l'équipe pour chaque saison. Il couvre tous les aspects du jeu : défense, attaque, transitions, et situations spéciales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
