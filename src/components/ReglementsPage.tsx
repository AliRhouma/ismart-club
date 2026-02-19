import { useState } from 'react';
import { Search, Filter, Plus, FileText, Calendar, Users, AlertCircle, X, Save } from 'lucide-react';

interface Reglement {
  id: number;
  title: string;
  category: string;
  description: string;
  effectiveDate: string;
  lastModified: string;
  appliesTo: string[];
  status: 'Active' | 'Draft' | 'Archived';
  priority: 'High' | 'Medium' | 'Low';
}

const mockReglements: Reglement[] = [
  {
    id: 1,
    title: 'Code de Conduite des Joueurs',
    category: 'Discipline',
    description: 'Règles de comportement attendues de tous les joueurs du club, incluant la ponctualité, le respect des coéquipiers et du staff, et la représentation du club.',
    effectiveDate: '1 Jan 2026',
    lastModified: '15 Dec 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Académie'],
    status: 'Active',
    priority: 'High',
  },
  {
    id: 2,
    title: 'Règlement Intérieur du Personnel',
    category: 'Administratif',
    description: 'Conditions de travail, horaires, congés, et obligations du personnel administratif et technique du club.',
    effectiveDate: '1 Jan 2026',
    lastModified: '10 Dec 2025',
    appliesTo: ['Staff Technique', 'Staff Administratif', 'Staff Médical'],
    status: 'Active',
    priority: 'High',
  },
  {
    id: 3,
    title: 'Politique Anti-Dopage',
    category: 'Santé',
    description: 'Engagement du club contre le dopage, procédures de contrôle, et sanctions en cas de non-respect.',
    effectiveDate: '1 Sep 2025',
    lastModified: '5 Dec 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs'],
    status: 'Active',
    priority: 'High',
  },
  {
    id: 4,
    title: 'Utilisation des Installations',
    category: 'Infrastructures',
    description: 'Règles d\'accès et d\'utilisation des vestiaires, terrains d\'entraînement, salle de musculation et autres installations du club.',
    effectiveDate: '1 Aug 2025',
    lastModified: '3 Dec 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Académie', 'Staff Technique'],
    status: 'Active',
    priority: 'Medium',
  },
  {
    id: 5,
    title: 'Politique des Réseaux Sociaux',
    category: 'Communication',
    description: 'Directives sur l\'utilisation des réseaux sociaux par les joueurs et le personnel, protection de l\'image du club.',
    effectiveDate: '1 Jul 2025',
    lastModified: '1 Dec 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Staff Technique', 'Staff Administratif'],
    status: 'Active',
    priority: 'Medium',
  },
  {
    id: 6,
    title: 'Règles de Déplacement',
    category: 'Logistique',
    description: 'Procédures pour les déplacements lors des matchs à l\'extérieur, hébergement, et comportement en déplacement.',
    effectiveDate: '1 Jun 2025',
    lastModified: '28 Nov 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Staff Technique'],
    status: 'Active',
    priority: 'Medium',
  },
  {
    id: 7,
    title: 'Gestion des Blessures',
    category: 'Santé',
    description: 'Protocole de déclaration et de suivi des blessures, droits et devoirs des joueurs blessés.',
    effectiveDate: '1 May 2025',
    lastModified: '25 Nov 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Staff Médical'],
    status: 'Active',
    priority: 'High',
  },
  {
    id: 8,
    title: 'Charte des Parents (Académie)',
    category: 'Académie',
    description: 'Engagement des parents dans la formation des jeunes, comportement attendu lors des entraînements et matchs.',
    effectiveDate: '1 Sep 2025',
    lastModified: '20 Nov 2025',
    appliesTo: ['Académie'],
    status: 'Active',
    priority: 'Medium',
  },
  {
    id: 9,
    title: 'Politique de Confidentialité',
    category: 'Administratif',
    description: 'Protection des données personnelles, confidentialité des informations du club et des membres.',
    effectiveDate: '1 Apr 2025',
    lastModified: '18 Nov 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Académie', 'Staff Technique', 'Staff Administratif', 'Staff Médical'],
    status: 'Active',
    priority: 'High',
  },
  {
    id: 10,
    title: 'Sanctions Disciplinaires',
    category: 'Discipline',
    description: 'Échelle des sanctions en cas de manquement aux règlements, procédure d\'appel.',
    effectiveDate: '1 Jan 2026',
    lastModified: '15 Nov 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Staff Technique'],
    status: 'Active',
    priority: 'High',
  },
  {
    id: 11,
    title: 'Politique Environnementale',
    category: 'Développement Durable',
    description: 'Engagement du club pour la réduction de l\'empreinte écologique, tri des déchets, économies d\'énergie.',
    effectiveDate: '1 Mar 2025',
    lastModified: '12 Nov 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Académie', 'Staff Technique', 'Staff Administratif'],
    status: 'Draft',
    priority: 'Low',
  },
  {
    id: 12,
    title: 'Règlement des Transferts',
    category: 'Administratif',
    description: 'Procédures internes pour les transferts de joueurs, négociations, et conditions contractuelles.',
    effectiveDate: '1 Feb 2025',
    lastModified: '10 Nov 2025',
    appliesTo: ['Staff Administratif'],
    status: 'Active',
    priority: 'Medium',
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Discipline':
      return 'bg-error-50 text-error-600 border-error-200';
    case 'Administratif':
      return 'bg-brand-50 text-brand-600 border-brand-200';
    case 'Santé':
      return 'bg-success-50 text-success-600 border-success-200';
    case 'Infrastructures':
      return 'bg-neutral-200 text-default-font border-neutral-300';
    case 'Communication':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    case 'Logistique':
      return 'bg-special-colors-300 text-special-colors-400 border-special-colors-400';
    case 'Académie':
      return 'bg-brand-50 text-brand-600 border-brand-200';
    case 'Développement Durable':
      return 'bg-success-50 text-success-600 border-success-200';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'text-error-600';
    case 'Medium':
      return 'text-warning-600';
    case 'Low':
      return 'text-success-600';
    default:
      return 'text-subtext-color';
  }
};

export function ReglementsPage() {
  const [selectedReglement, setSelectedReglement] = useState<Reglement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editData, setEditData] = useState<Reglement | null>(null);

  const handleViewDetails = (reglement: Reglement) => {
    setSelectedReglement(reglement);
    setEditData({ ...reglement });
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    const newReglement: Reglement = {
      id: 0,
      title: '',
      category: 'Administratif',
      description: '',
      effectiveDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastModified: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      appliesTo: [],
      status: 'Draft',
      priority: 'Medium',
    };
    setSelectedReglement(newReglement);
    setEditData(newReglement);
    setIsCreating(true);
  };

  const handleCloseModal = () => {
    setSelectedReglement(null);
    setEditData(null);
    setIsCreating(false);
  };

  const handleInputChange = (field: keyof Reglement, value: any) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const activeReglements = mockReglements.filter(r => r.status === 'Active').length;
  const draftReglements = mockReglements.filter(r => r.status === 'Draft').length;
  const categories = new Set(mockReglements.map(r => r.category)).size;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-2">Règlements du Club</h1>
          <p className="text-body text-subtext-color">
            Internal rules and regulations governing all club members and operations
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-subtext-color" />
              <input
                type="text"
                placeholder="Search regulations..."
                className="bg-transparent border-none outline-none text-body text-default-font placeholder:text-subtext-color w-64"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-100 transition-colors">
              <Filter className="w-4 h-4" />
              Filter by Category
            </button>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create New Règlement
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReglements.map((reglement) => (
            <div
              key={reglement.id}
              className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 hover:border-brand-600 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleViewDetails(reglement)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-heading-3 text-default-font mb-2">{reglement.title}</h3>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption-bold border ${getCategoryColor(reglement.category)}`}>
                    {reglement.category}
                  </div>
                </div>
              </div>

              <p className="text-body text-subtext-color mb-4 line-clamp-3">
                {reglement.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-caption">
                  <span className="text-subtext-color">Status:</span>
                  <span className={`px-2 py-1 rounded text-caption-bold ${
                    reglement.status === 'Active'
                      ? 'bg-success-600 text-white'
                      : reglement.status === 'Draft'
                      ? 'bg-warning-600 text-white'
                      : 'bg-neutral-300 text-subtext-color'
                  }`}>
                    {reglement.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-caption">
                  <span className="text-subtext-color">Priority:</span>
                  <span className={`font-medium ${getPriorityColor(reglement.priority)}`}>
                    {reglement.priority}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-subtext-color" />
                    <span className="text-caption text-subtext-color">
                      Effective: <span className="text-default-font font-medium">{reglement.effectiveDate}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-subtext-color" />
                    <span className="text-caption text-subtext-color">
                      {reglement.appliesTo.length} group{reglement.appliesTo.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-caption text-subtext-color">
                    Modified: {reglement.lastModified}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-heading-1 text-brand-600 mb-1">{mockReglements.length}</div>
              <div className="text-body text-subtext-color">Total Règlements</div>
            </div>
            <div className="text-center">
              <div className="text-heading-1 text-success-600 mb-1">{activeReglements}</div>
              <div className="text-body text-subtext-color">Active</div>
            </div>
            <div className="text-center">
              <div className="text-heading-1 text-warning-600 mb-1">{draftReglements}</div>
              <div className="text-body text-subtext-color">Drafts</div>
            </div>
            <div className="text-center">
              <div className="text-heading-1 text-default-font mb-1">{categories}</div>
              <div className="text-body text-subtext-color">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {selectedReglement && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-neutral-50 border-b border-neutral-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading-2 text-default-font">
                  {isCreating ? 'Create New Règlement' : editData.title}
                </h2>
                <p className="text-body text-subtext-color mt-1">
                  {isCreating ? 'Add a new club regulation' : 'Edit regulation details'}
                </p>
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
                <div className="md:col-span-2">
                  <label className="block text-caption-bold text-default-font mb-2">Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                    placeholder="Enter regulation title..."
                  />
                </div>

                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  >
                    <option className="bg-neutral-100 text-default-font">Discipline</option>
                    <option className="bg-neutral-100 text-default-font">Administratif</option>
                    <option className="bg-neutral-100 text-default-font">Santé</option>
                    <option className="bg-neutral-100 text-default-font">Infrastructures</option>
                    <option className="bg-neutral-100 text-default-font">Communication</option>
                    <option className="bg-neutral-100 text-default-font">Logistique</option>
                    <option className="bg-neutral-100 text-default-font">Académie</option>
                    <option className="bg-neutral-100 text-default-font">Développement Durable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  >
                    <option className="bg-neutral-100 text-default-font">Active</option>
                    <option className="bg-neutral-100 text-default-font">Draft</option>
                    <option className="bg-neutral-100 text-default-font">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Priority</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  >
                    <option className="bg-neutral-100 text-default-font">High</option>
                    <option className="bg-neutral-100 text-default-font">Medium</option>
                    <option className="bg-neutral-100 text-default-font">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Effective Date</label>
                  <input
                    type="text"
                    value={editData.effectiveDate}
                    onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                    placeholder="1 Jan 2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-2">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600 min-h-32 resize-none"
                  placeholder="Detailed description of the regulation..."
                />
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-3">Applies To</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Joueurs Senior', 'Joueurs Espoirs', 'Académie', 'Staff Technique', 'Staff Administratif', 'Staff Médical'].map((group) => (
                    <label key={group} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editData.appliesTo.includes(group)}
                        onChange={(e) => {
                          const newAppliesTo = e.target.checked
                            ? [...editData.appliesTo, group]
                            : editData.appliesTo.filter(g => g !== group);
                          handleInputChange('appliesTo', newAppliesTo);
                        }}
                        className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-600"
                      />
                      <span className="text-body text-default-font">{group}</span>
                    </label>
                  ))}
                </div>
              </div>

              {!isCreating && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-body-bold text-warning-600 mb-1">Important Notice</div>
                    <div className="text-caption text-subtext-color">
                      Any changes to active regulations should be communicated to all affected members. Consider the effective date carefully.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors">
                  <Save className="w-4 h-4" />
                  {isCreating ? 'Create Règlement' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
