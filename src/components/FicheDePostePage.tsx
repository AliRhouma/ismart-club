import { useState } from 'react';
import { Search, Filter, Plus, Briefcase, Users, Clock, Award, TrendingUp, X, Save } from 'lucide-react';

interface FicheDePoste {
  id: number;
  title: string;
  department: string;
  status: 'Active' | 'Archived';
  missions: string[];
  skills: string[];
  reportsTo: string;
  workConditions: string;
  lastUpdated: string;
}

const mockFiches: FicheDePoste[] = [
  {
    id: 1,
    title: 'Entraineur Principal Senior',
    department: 'Technique',
    status: 'Active',
    missions: [
      'Planifier et diriger les séances d\'entraînement',
      'Développer la stratégie sportive de l\'équipe',
      'Superviser l\'équipe technique',
      'Participer aux recrutements de joueurs'
    ],
    skills: ['Diplôme BEES 2 ou équivalent', '10+ ans d\'expérience', 'Leadership', 'Tactique avancée'],
    reportsTo: 'Directeur Sportif',
    workConditions: 'Temps plein - Disponibilité soirs et week-ends',
    lastUpdated: '15 Dec 2025'
  },
  {
    id: 2,
    title: 'Préparateur Physique',
    department: 'Technique',
    status: 'Active',
    missions: [
      'Concevoir les programmes de préparation physique',
      'Superviser les séances de musculation',
      'Suivre l\'état physique des joueurs',
      'Prévenir et gérer les blessures'
    ],
    skills: ['BPJEPS ou STAPS', 'Connaissance physiologie sportive', 'Suivi individualisé', 'Analyse de données'],
    reportsTo: 'Entraineur Principal',
    workConditions: 'Temps plein - Flexibilité horaire requise',
    lastUpdated: '10 Dec 2025'
  },
  {
    id: 3,
    title: 'Responsable Communication',
    department: 'Marketing',
    status: 'Active',
    missions: [
      'Gérer la communication digitale du club',
      'Organiser les événements médiatiques',
      'Produire le contenu photo/vidéo',
      'Développer la présence sur les réseaux sociaux'
    ],
    skills: ['Bac+3 Communication', 'Maîtrise réseaux sociaux', 'Création de contenu', 'Relations presse'],
    reportsTo: 'Directeur Marketing',
    workConditions: 'Temps plein - Présence matchs obligatoire',
    lastUpdated: '8 Dec 2025'
  },
  {
    id: 4,
    title: 'Directeur Financier',
    department: 'Financière',
    status: 'Active',
    missions: [
      'Superviser la comptabilité du club',
      'Élaborer les budgets prévisionnels',
      'Gérer les relations bancaires',
      'Assurer le reporting financier'
    ],
    skills: ['Bac+5 Finance/Comptabilité', 'Expertise gestion sportive', 'Rigueur', 'Analyse financière'],
    reportsTo: 'Président du Club',
    workConditions: 'Temps plein - Horaires de bureau',
    lastUpdated: '5 Dec 2025'
  },
  {
    id: 5,
    title: 'Chargé de Recrutement',
    department: 'RH',
    status: 'Active',
    missions: [
      'Identifier les talents pour le club',
      'Négocier les contrats joueurs',
      'Maintenir le réseau de scouts',
      'Analyser le marché des transferts'
    ],
    skills: ['Connaissance du football', 'Réseau développé', 'Négociation', 'Veille stratégique'],
    reportsTo: 'Directeur Sportif',
    workConditions: 'Temps plein - Déplacements fréquents',
    lastUpdated: '3 Dec 2025'
  },
  {
    id: 6,
    title: 'Responsable Infrastructures',
    department: 'Technique',
    status: 'Active',
    missions: [
      'Entretenir les installations sportives',
      'Gérer la logistique des équipements',
      'Superviser l\'équipe maintenance',
      'Planifier les travaux d\'amélioration'
    ],
    skills: ['Gestion d\'installations', 'Connaissance pelouse sportive', 'Management d\'équipe', 'Budget'],
    reportsTo: 'Directeur Général',
    workConditions: 'Temps plein - Astreintes possibles',
    lastUpdated: '1 Dec 2025'
  },
  {
    id: 7,
    title: 'Kinésithérapeute Sportif',
    department: 'Technique',
    status: 'Active',
    missions: [
      'Assurer le suivi médical des joueurs',
      'Traiter les blessures sportives',
      'Élaborer les programmes de rééducation',
      'Participer à la prévention'
    ],
    skills: ['Diplôme Kiné DE', 'Spécialisation sport', 'Urgences sportives', 'Suivi personnalisé'],
    reportsTo: 'Médecin du Club',
    workConditions: 'Temps plein - Présence entraînements/matchs',
    lastUpdated: '28 Nov 2025'
  },
  {
    id: 8,
    title: 'Analyste Vidéo',
    department: 'Technique',
    status: 'Active',
    missions: [
      'Analyser les matchs de l\'équipe',
      'Étudier les adversaires',
      'Produire des rapports tactiques',
      'Assister le staff technique'
    ],
    skills: ['Connaissance tactique', 'Logiciels analyse vidéo', 'Synthèse', 'Disponibilité'],
    reportsTo: 'Entraineur Principal',
    workConditions: 'Temps plein - Horaires matchs',
    lastUpdated: '25 Nov 2025'
  },
  {
    id: 9,
    title: 'Responsable Billetterie',
    department: 'Marketing',
    status: 'Active',
    missions: [
      'Gérer la vente des billets',
      'Optimiser le remplissage du stade',
      'Développer les abonnements',
      'Superviser l\'accueil public'
    ],
    skills: ['Gestion commerciale', 'Relation client', 'Outils billetterie', 'Événementiel'],
    reportsTo: 'Directeur Marketing',
    workConditions: 'Temps plein - Jours de match obligatoires',
    lastUpdated: '20 Nov 2025'
  },
  {
    id: 10,
    title: 'Coordinateur Académie',
    department: 'Technique',
    status: 'Active',
    missions: [
      'Coordonner la formation des jeunes',
      'Superviser les éducateurs',
      'Gérer les inscriptions',
      'Organiser les tournois jeunes'
    ],
    skills: ['Diplôme éducateur', 'Expérience formation jeunes', 'Organisation', 'Pédagogie'],
    reportsTo: 'Directeur Sportif',
    workConditions: 'Temps plein - Mercredis et week-ends',
    lastUpdated: '18 Nov 2025'
  },
  {
    id: 11,
    title: 'Responsable Partenariats',
    department: 'Marketing',
    status: 'Active',
    missions: [
      'Développer le portefeuille sponsors',
      'Négocier les contrats de partenariat',
      'Assurer la satisfaction partenaires',
      'Créer des packages commerciaux'
    ],
    skills: ['Vente B2B', 'Négociation', 'Réseau entreprises', 'Présentation'],
    reportsTo: 'Directeur Marketing',
    workConditions: 'Temps plein - Prospection terrain',
    lastUpdated: '15 Nov 2025'
  },
  {
    id: 12,
    title: 'Gestionnaire Administratif',
    department: 'RH',
    status: 'Active',
    missions: [
      'Gérer les contrats du personnel',
      'Assurer le suivi administratif',
      'Traiter les dossiers licences',
      'Coordonner avec les instances'
    ],
    skills: ['Gestion administrative', 'Droit du travail', 'Réglementation sportive', 'Organisation'],
    reportsTo: 'Directeur RH',
    workConditions: 'Temps plein - Horaires de bureau',
    lastUpdated: '12 Nov 2025'
  }
];

const getDepartmentColor = (department: string) => {
  switch (department) {
    case 'Technique':
      return 'bg-brand-50 text-brand-600 border-brand-200';
    case 'Marketing':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    case 'Financière':
      return 'bg-success-50 text-success-600 border-success-200';
    case 'RH':
      return 'bg-error-50 text-error-600 border-error-200';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

const getDepartmentIcon = (department: string) => {
  switch (department) {
    case 'Technique':
      return <TrendingUp className="w-4 h-4" />;
    case 'Marketing':
      return <Users className="w-4 h-4" />;
    case 'Financière':
      return <Award className="w-4 h-4" />;
    case 'RH':
      return <Briefcase className="w-4 h-4" />;
    default:
      return <Briefcase className="w-4 h-4" />;
  }
};

export function FicheDePostePage() {
  const [selectedFiche, setSelectedFiche] = useState<FicheDePoste | null>(null);
  const [editData, setEditData] = useState<FicheDePoste | null>(null);

  const handleViewDetails = (fiche: FicheDePoste) => {
    setSelectedFiche(fiche);
    setEditData({ ...fiche });
  };

  const handleCloseModal = () => {
    setSelectedFiche(null);
    setEditData(null);
  };

  const handleInputChange = (field: keyof FicheDePoste, value: any) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleArrayInputChange = (field: 'missions' | 'skills', index: number, value: string) => {
    if (editData) {
      const newArray = [...editData[field]];
      newArray[index] = value;
      setEditData({ ...editData, [field]: newArray });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-2">Fiches de Poste</h1>
          <p className="text-body text-subtext-color">
            Formal job descriptions for all positions within the club
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-subtext-color" />
              <input
                type="text"
                placeholder="Search job descriptions..."
                className="bg-transparent border-none outline-none text-body text-default-font placeholder:text-subtext-color w-64"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-100 transition-colors">
              <Filter className="w-4 h-4" />
              Filter by Department
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Create New Fiche
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFiches.map((fiche) => (
            <div
              key={fiche.id}
              className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 hover:border-brand-600 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-heading-3 text-default-font mb-2">{fiche.title}</h3>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption-bold border ${getDepartmentColor(fiche.department)}`}>
                    {getDepartmentIcon(fiche.department)}
                    {fiche.department}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-caption-bold ${
                  fiche.status === 'Active'
                    ? 'bg-success-600 text-white'
                    : 'bg-neutral-300 text-subtext-color'
                }`}>
                  {fiche.status}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-caption-bold text-default-font block mb-2">Missions principales</span>
                  <ul className="space-y-1 ml-6">
                    {fiche.missions.slice(0, 3).map((mission, idx) => (
                      <li key={idx} className="text-caption text-subtext-color list-disc">
                        {mission}
                      </li>
                    ))}
                    {fiche.missions.length > 3 && (
                      <li className="text-caption text-brand-600">
                        +{fiche.missions.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <span className="text-caption-bold text-default-font block mb-2">Compétences requises</span>
                  <ul className="space-y-1 ml-6">
                    {fiche.missions.slice(0, 3).map((mission, idx) => (
                      <li key={idx} className="text-caption text-subtext-color list-disc">
                        {mission}
                      </li>
                    ))}
                    {fiche.missions.length > 3 && (
                      <li className="text-caption text-brand-600">
                        +{fiche.missions.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-subtext-color" />
                    <span className="text-caption text-subtext-color">
                      Reports to: <span className="text-default-font font-medium">{fiche.reportsTo}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-subtext-color" />
                    <span className="text-caption text-subtext-color">{fiche.workConditions}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-caption text-subtext-color">
                    Updated: {fiche.lastUpdated}
                  </span>
                  <button
                    onClick={() => handleViewDetails(fiche)}
                    className="text-caption-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-heading-1 text-brand-600 mb-1">{mockFiches.length}</div>
              <div className="text-body text-subtext-color">Total Positions</div>
            </div>
            <div className="text-center">
              <div className="text-heading-1 text-success-600 mb-1">
                {mockFiches.filter(f => f.status === 'Active').length}
              </div>
              <div className="text-body text-subtext-color">Active Roles</div>
            </div>
            <div className="text-center">
              <div className="text-heading-1 text-warning-600 mb-1">4</div>
              <div className="text-body text-subtext-color">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-heading-1 text-default-font mb-1">2</div>
              <div className="text-body text-subtext-color">Open Positions</div>
            </div>
          </div>
        </div>
      </div>

      {selectedFiche && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-neutral-50 border-b border-neutral-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading-2 text-default-font">{editData.title}</h2>
                <p className="text-body text-subtext-color mt-1">Edit job description details</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-subtext-color" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Job Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Department</label>
                  <input
                    type="text"
                    value={editData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Reports To</label>
                  <input
                    type="text"
                    value={editData.reportsTo}
                    onChange={(e) => handleInputChange('reportsTo', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  >
                    <option className="bg-neutral-100 text-default-font">Active</option>
                    <option className="bg-neutral-100 text-default-font">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-2">Work Conditions</label>
                <textarea
                  value={editData.workConditions}
                  onChange={(e) => handleInputChange('workConditions', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600 min-h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-3">Main Missions</label>
                <div className="space-y-2">
                  {editData.missions.map((mission, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={mission}
                      onChange={(e) => handleArrayInputChange('missions', idx, e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                      placeholder={`Mission ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-3">Required Skills</label>
                <div className="space-y-2">
                  {editData.skills.map((skill, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayInputChange('skills', idx, e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                      placeholder={`Skill ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
