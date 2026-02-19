import { Users, TrendingUp, CheckCircle, Search, Plus, Settings, MoreVertical, BookOpen, Tag, User, Building2, Globe } from 'lucide-react';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  ageRange: string;
  playerCount: number;
  activeQuestionnaires: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  purpose: string;
  builder: string;
  source: 'community' | 'club' | 'external' | 'research';
  usageCount: number;
  categories: string[];
  createdAt: string;
  questions: number;
  frequency: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Senior',
    ageRange: '20+',
    playerCount: 28,
    activeQuestionnaires: 5,
    color: 'from-brand-600 to-brand-500',
    icon: <Users className="w-8 h-8" />,
    description: 'Main squad players'
  },
  {
    id: 2,
    name: 'Junior',
    ageRange: '17-19',
    playerCount: 22,
    activeQuestionnaires: 3,
    color: 'from-success-600 to-success-500',
    icon: <TrendingUp className="w-8 h-8" />,
    description: 'Development players'
  },
  {
    id: 3,
    name: 'U20',
    ageRange: 'Under 20',
    playerCount: 18,
    activeQuestionnaires: 4,
    color: 'from-warning-600 to-warning-500',
    icon: <Users className="w-8 h-8" />,
    description: 'Youth elite group'
  },
  {
    id: 4,
    name: 'U18',
    ageRange: 'Under 18',
    playerCount: 25,
    activeQuestionnaires: 6,
    color: 'from-error-600 to-error-500',
    icon: <Users className="w-8 h-8" />,
    description: 'Young academy players'
  },
  {
    id: 5,
    name: 'U16',
    ageRange: 'Under 16',
    playerCount: 30,
    activeQuestionnaires: 2,
    color: 'from-cyan-600 to-cyan-500',
    icon: <Users className="w-8 h-8" />,
    description: 'Youth development'
  },
  {
    id: 6,
    name: 'U14',
    ageRange: 'Under 14',
    playerCount: 35,
    activeQuestionnaires: 1,
    color: 'from-purple-600 to-purple-500',
    icon: <Users className="w-8 h-8" />,
    description: 'Foundation level'
  },
];

const questionnaires: Questionnaire[] = [
  {
    id: 1,
    title: 'Hooper Index',
    description: 'Daily assessment of sleep quality, fatigue, muscle soreness, and stress levels.',
    purpose: 'Measures recovery status and monitors player readiness for training and competition.',
    builder: 'Performance Analytics Team',
    source: 'club',
    usageCount: 156,
    categories: ['Senior', 'Junior', 'U20', 'U18'],
    createdAt: '2024-01-15',
    questions: 4,
    frequency: 'Daily'
  },
  {
    id: 2,
    title: 'Injury Risk Assessment',
    description: 'Comprehensive evaluation of player injury risk factors and movement screening.',
    purpose: 'Identifies injury risks early and guides preventive training interventions.',
    builder: 'Medical Staff',
    source: 'club',
    usageCount: 89,
    categories: ['Senior', 'Junior', 'U20'],
    createdAt: '2024-02-20',
    questions: 12,
    frequency: 'Weekly'
  },
  {
    id: 3,
    title: 'Mental Health Screening',
    description: 'Psychological well-being assessment covering stress, anxiety, and motivation.',
    purpose: 'Monitors mental health and supports player wellness through psychological support.',
    builder: 'Sports Psychology Department',
    source: 'research',
    usageCount: 112,
    categories: ['Senior', 'Junior', 'U20', 'U18', 'U16'],
    createdAt: '2024-01-08',
    questions: 8,
    frequency: 'Bi-weekly'
  },
  {
    id: 4,
    title: 'Nutrition & Hydration',
    description: 'Dietary habits and hydration patterns questionnaire for optimal nutrition.',
    purpose: 'Ensures proper nutrition intake and hydration for peak performance.',
    builder: 'Nutrition Specialist',
    source: 'club',
    usageCount: 78,
    categories: ['Senior', 'Junior', 'U20', 'U18'],
    createdAt: '2024-02-01',
    questions: 10,
    frequency: 'Weekly'
  },
  {
    id: 5,
    title: 'Sleep Quality Analysis',
    description: 'Detailed assessment of sleep duration, quality, and disturbances.',
    purpose: 'Evaluates sleep patterns and provides recommendations for improved recovery.',
    builder: 'Recovery Specialist',
    source: 'external',
    usageCount: 134,
    categories: ['Senior', 'Junior', 'U20', 'U18', 'U16'],
    createdAt: '2023-12-10',
    questions: 6,
    frequency: 'Daily'
  },
  {
    id: 6,
    title: 'Training Load Perception',
    description: 'Player self-assessment of training intensity and perceived effort during sessions.',
    purpose: 'Monitors training load tolerance and helps balance intensity and recovery.',
    builder: 'Strength & Conditioning Coach',
    source: 'club',
    usageCount: 201,
    categories: ['Senior', 'Junior', 'U20', 'U18', 'U16', 'U14'],
    createdAt: '2024-01-20',
    questions: 5,
    frequency: 'Per Session'
  },
  {
    id: 7,
    title: 'Community Fitness Index',
    description: 'Crowdsourced fitness assessment created by the fitness coaching community.',
    purpose: 'Evaluates overall fitness levels using community-tested methodology.',
    builder: 'Fitness Community Forum',
    source: 'community',
    usageCount: 67,
    categories: ['U16', 'U14'],
    createdAt: '2024-02-15',
    questions: 7,
    frequency: 'Monthly'
  },
  {
    id: 8,
    title: 'Technical Skills Evaluation',
    description: 'Self-assessment of technical abilities in specific sports skills and techniques.',
    purpose: 'Tracks progression in technical development and identifies training focus areas.',
    builder: 'Coaching Staff',
    source: 'club',
    usageCount: 145,
    categories: ['Senior', 'Junior', 'U20', 'U18', 'U16'],
    createdAt: '2024-01-25',
    questions: 15,
    frequency: 'Monthly'
  },
  {
    id: 9,
    title: 'Motivation & Engagement',
    description: 'Assessment of player motivation levels, team cohesion, and engagement in training.',
    purpose: 'Measures motivation trends and supports team culture development.',
    builder: 'Sports Psychology Team',
    source: 'research',
    usageCount: 98,
    categories: ['Senior', 'Junior', 'U20', 'U18'],
    createdAt: '2024-02-03',
    questions: 9,
    frequency: 'Bi-weekly'
  },
  {
    id: 10,
    title: 'Equipment & Gear Feedback',
    description: 'Player feedback on equipment quality, comfort, and performance impact.',
    purpose: 'Gathers feedback to improve equipment selection and player satisfaction.',
    builder: 'Equipment Manager',
    source: 'club',
    usageCount: 52,
    categories: ['Senior', 'Junior', 'U20'],
    createdAt: '2024-02-10',
    questions: 8,
    frequency: 'Monthly'
  },
];

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'club':
      return <Building2 className="w-4 h-4" />;
    case 'community':
      return <Globe className="w-4 h-4" />;
    case 'research':
      return <BookOpen className="w-4 h-4" />;
    case 'external':
      return <Tag className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const getSourceLabel = (source: string) => {
  switch (source) {
    case 'club':
      return 'Club';
    case 'community':
      return 'Community';
    case 'research':
      return 'Research';
    case 'external':
      return 'External';
    default:
      return 'Unknown';
  }
};

const getSourceColor = (source: string) => {
  switch (source) {
    case 'club':
      return 'bg-brand-50 text-brand-600 border-brand-200';
    case 'community':
      return 'bg-success-50 text-success-600 border-success-200';
    case 'research':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    case 'external':
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

export function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'library'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.ageRange.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuestionnaires = questionnaires.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = sourceFilter.length === 0 || sourceFilter.includes(q.source);

    return matchesSearch && matchesFilter;
  });

  const totalPlayers = categories.reduce((sum, cat) => sum + cat.playerCount, 0);
  const totalQuestionnairesActive = categories.reduce((sum, cat) => sum + cat.activeQuestionnaires, 0);

  const handleSourceFilter = (source: string) => {
    setSourceFilter(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-2">Player Management</h1>
          <p className="text-body text-subtext-color">
            Manage player categories and questionnaire library
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-body transition-colors ${
              activeTab === 'categories'
                ? 'bg-brand-600 text-white'
                : 'text-subtext-color hover:text-default-font'
            }`}
          >
            <Users className="w-4 h-4" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-body transition-colors ${
              activeTab === 'library'
                ? 'bg-brand-600 text-white'
                : 'text-subtext-color hover:text-default-font'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Questionnaire Library
          </button>
        </div>

        {activeTab === 'categories' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-caption-bold text-subtext-color">Total Categories</div>
                  <Settings className="w-4 h-4 text-subtext-color" />
                </div>
                <div className="text-heading-1 text-default-font">{categories.length}</div>
                <div className="text-caption text-subtext-color mt-2">Active groups</div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-caption-bold text-subtext-color">Total Players</div>
                  <Users className="w-4 h-4 text-brand-600" />
                </div>
                <div className="text-heading-1 text-brand-600">{totalPlayers}</div>
                <div className="text-caption text-subtext-color mt-2">Across all categories</div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-caption-bold text-subtext-color">Active Assessments</div>
                  <CheckCircle className="w-4 h-4 text-success-600" />
                </div>
                <div className="text-heading-1 text-success-600">{totalQuestionnairesActive}</div>
                <div className="text-caption text-subtext-color mt-2">Running questionnaires</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'categories' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 flex-1">
                  <Search className="w-4 h-4 text-subtext-color" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-body text-default-font placeholder:text-subtext-color w-full"
                  />
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                New Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              <div className={`bg-gradient-to-br ${category.color} h-20 flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {category.icon}
                </div>
              </div>

              <div className="p-6 relative">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-heading-2 text-default-font group-hover:text-brand-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-caption text-subtext-color">{category.ageRange}</p>
                  </div>
                  <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-subtext-color" />
                  </button>
                </div>

                <p className="text-body text-subtext-color mb-4">{category.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-600" />
                      <span className="text-caption text-subtext-color">Players</span>
                    </div>
                    <span className="text-heading-3 text-default-font font-bold">{category.playerCount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-600" />
                      <span className="text-caption text-subtext-color">Active Assessments</span>
                    </div>
                    <span className="text-heading-3 text-success-600 font-bold">{category.activeQuestionnaires}</span>
                  </div>

                  <div className="pt-2 mt-3 border-t border-neutral-200">
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <div className="text-caption text-subtext-color mb-1">Coverage</div>
                        <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-600 to-brand-500 transition-all duration-500"
                            style={{ width: `${(category.activeQuestionnaires / 7) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-caption-bold hover:bg-brand-100 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-subtext-color mx-auto mb-4 opacity-50" />
                <p className="text-body text-subtext-color">No categories found matching your search.</p>
              </div>
            )}

            <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-lg p-6">
              <h3 className="text-heading-3 text-default-font mb-4">Category Distribution</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-4">
                    <div className="w-24 text-body-bold text-default-font">{category.name}</div>
                    <div className="flex-1 h-8 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                        style={{ width: `${(category.playerCount / totalPlayers) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-caption-bold text-subtext-color">
                      {((category.playerCount / totalPlayers) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-subtext-color" />
                <input
                  type="text"
                  placeholder="Search questionnaires..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-body text-default-font placeholder:text-subtext-color w-full"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                Create Questionnaire
              </button>
            </div>

            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-caption-bold text-subtext-color">Filter by source:</span>
              {['club', 'community', 'research', 'external'].map((source) => (
                <button
                  key={source}
                  onClick={() => handleSourceFilter(source)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-caption-bold border transition-colors ${
                    sourceFilter.includes(source)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-neutral-50 text-subtext-color border-neutral-200 hover:border-brand-600'
                  }`}
                >
                  {getSourceIcon(source)}
                  {getSourceLabel(source)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredQuestionnaires.map((questionnaire) => (
                <div
                  key={questionnaire.id}
                  className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-heading-3 text-default-font group-hover:text-brand-600 transition-colors mb-1">
                        {questionnaire.title}
                      </h3>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption-bold border ${getSourceColor(questionnaire.source)}`}>
                        {getSourceIcon(questionnaire.source)}
                        {getSourceLabel(questionnaire.source)}
                      </div>
                    </div>
                  </div>

                  <p className="text-body text-subtext-color mb-3">
                    {questionnaire.description}
                  </p>

                  <div className="bg-neutral-100 rounded-lg p-3 mb-3 border border-neutral-200">
                    <div className="text-caption-bold text-default-font mb-1">Purpose</div>
                    <p className="text-body text-subtext-color">{questionnaire.purpose}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-subtext-color">Created by</span>
                      <span className="text-body-bold text-default-font">{questionnaire.builder}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-subtext-color">Questions</span>
                      <span className="text-body-bold text-default-font">{questionnaire.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-subtext-color">Frequency</span>
                      <span className="text-body-bold text-default-font">{questionnaire.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-subtext-color">Used by</span>
                      <span className="text-body-bold text-brand-600">{questionnaire.usageCount} players</span>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {questionnaire.categories.slice(0, 3).map((cat) => (
                      <span key={cat} className="px-2 py-1 bg-brand-50 text-brand-600 rounded text-caption-bold border border-brand-200">
                        {cat}
                      </span>
                    ))}
                    {questionnaire.categories.length > 3 && (
                      <span className="px-2 py-1 bg-neutral-100 text-subtext-color rounded text-caption-bold border border-neutral-300">
                        +{questionnaire.categories.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-neutral-200">
                    <button className="flex-1 px-3 py-2 bg-neutral-100 text-default-font rounded-lg text-body hover:bg-neutral-150 transition-colors">
                      Preview
                    </button>
                    <button className="flex-1 px-3 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors">
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredQuestionnaires.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-subtext-color mx-auto mb-4 opacity-50" />
                <p className="text-body text-subtext-color">No questionnaires found matching your filters.</p>
              </div>
            )}

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
              <h3 className="text-heading-3 text-default-font mb-4">Library Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-heading-1 text-brand-600">{questionnaires.length}</div>
                  <div className="text-caption text-subtext-color">Total Questionnaires</div>
                </div>
                <div className="text-center">
                  <div className="text-heading-1 text-success-600">
                    {questionnaires.filter(q => q.source === 'club').length}
                  </div>
                  <div className="text-caption text-subtext-color">Club Created</div>
                </div>
                <div className="text-center">
                  <div className="text-heading-1 text-warning-600">
                    {questionnaires.filter(q => q.source === 'research').length}
                  </div>
                  <div className="text-caption text-subtext-color">Research Based</div>
                </div>
                <div className="text-center">
                  <div className="text-heading-1 text-brand-500">
                    {questionnaires.reduce((sum, q) => sum + q.usageCount, 0)}
                  </div>
                  <div className="text-caption text-subtext-color">Total Usage</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
