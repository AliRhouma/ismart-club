import { Search, Filter, Plus, Users, Crown, Shield, Star, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Member {
  id: number;
  name: string;
  email: string;
  poste: string;
  phone: string;
  status: string;
  hierarchyLevel: 'leader' | 'sub-leader' | 'group-leader' | 'member';
  reportsTo?: string;
}

interface EditingState {
  memberId: number | null;
  newHierarchyLevel: string | null;
  newReportsTo: string | null;
  newRole: string | null;
  newFicheDePoste: string | null;
}

const mockMembers: Member[] = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@club.com', poste: 'Financière', phone: '+33 6 12 34 56 78', status: 'Active', hierarchyLevel: 'leader' },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@club.com', poste: 'Technique', phone: '+33 6 23 45 67 89', status: 'Active', hierarchyLevel: 'sub-leader', reportsTo: 'Jean Dupont' },
  { id: 3, name: 'Pierre Bernard', email: 'pierre.bernard@club.com', poste: 'RH', phone: '+33 6 34 56 78 90', status: 'Active', hierarchyLevel: 'sub-leader', reportsTo: 'Jean Dupont' },
  { id: 4, name: 'Sophie Dubois', email: 'sophie.dubois@club.com', poste: 'Marketing', phone: '+33 6 45 67 89 01', status: 'Active', hierarchyLevel: 'group-leader', reportsTo: 'Marie Martin' },
  { id: 5, name: 'Luc Petit', email: 'luc.petit@club.com', poste: 'Technique', phone: '+33 6 56 78 90 12', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Sophie Dubois' },
  { id: 6, name: 'Anne Moreau', email: 'anne.moreau@club.com', poste: 'Financière', phone: '+33 6 67 89 01 23', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Jean Dupont' },
  { id: 7, name: 'Thomas Leroy', email: 'thomas.leroy@club.com', poste: 'Technique', phone: '+33 6 78 90 12 34', status: 'Inactive', hierarchyLevel: 'member', reportsTo: 'Pierre Bernard' },
  { id: 8, name: 'Julie Simon', email: 'julie.simon@club.com', poste: 'RH', phone: '+33 6 89 01 23 45', status: 'Active', hierarchyLevel: 'group-leader', reportsTo: 'Pierre Bernard' },
  { id: 9, name: 'Marc Laurent', email: 'marc.laurent@club.com', poste: 'Marketing', phone: '+33 6 90 12 34 56', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Sophie Dubois' },
  { id: 10, name: 'Emma Lefebvre', email: 'emma.lefebvre@club.com', poste: 'Technique', phone: '+33 6 01 23 45 67', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Marie Martin' },
  { id: 11, name: 'Nicolas Roux', email: 'nicolas.roux@club.com', poste: 'Financière', phone: '+33 6 12 34 56 89', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Jean Dupont' },
  { id: 12, name: 'Camille David', email: 'camille.david@club.com', poste: 'RH', phone: '+33 6 23 45 67 90', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Julie Simon' },
  { id: 13, name: 'Antoine Bertrand', email: 'antoine.bertrand@club.com', poste: 'Technique', phone: '+33 6 34 56 78 01', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Marie Martin' },
  { id: 14, name: 'Lea Fontaine', email: 'lea.fontaine@club.com', poste: 'Marketing', phone: '+33 6 45 67 89 12', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Sophie Dubois' },
  { id: 15, name: 'Hugo Girard', email: 'hugo.girard@club.com', poste: 'Financière', phone: '+33 6 56 78 90 23', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Jean Dupont' },
  { id: 16, name: 'Chloe Blanc', email: 'chloe.blanc@club.com', poste: 'Technique', phone: '+33 6 67 89 01 34', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Luc Petit' },
  { id: 17, name: 'Louis Garnier', email: 'louis.garnier@club.com', poste: 'RH', phone: '+33 6 78 90 12 45', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Pierre Bernard' },
  { id: 18, name: 'Manon Fabre', email: 'manon.fabre@club.com', poste: 'Marketing', phone: '+33 6 89 01 23 56', status: 'Inactive', hierarchyLevel: 'member', reportsTo: 'Marc Laurent' },
  { id: 19, name: 'Alexandre Rousseau', email: 'alexandre.rousseau@club.com', poste: 'Technique', phone: '+33 6 90 12 34 67', status: 'Active', hierarchyLevel: 'group-leader', reportsTo: 'Marie Martin' },
  { id: 20, name: 'Clara Vincent', email: 'clara.vincent@club.com', poste: 'Financière', phone: '+33 6 01 23 45 78', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Jean Dupont' },
  { id: 21, name: 'Maxime Morel', email: 'maxime.morel@club.com', poste: 'RH', phone: '+33 6 12 34 56 90', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Julie Simon' },
  { id: 22, name: 'Sarah Lambert', email: 'sarah.lambert@club.com', poste: 'Technique', phone: '+33 6 23 45 67 01', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Alexandre Rousseau' },
  { id: 23, name: 'Lucas Bonnet', email: 'lucas.bonnet@club.com', poste: 'Marketing', phone: '+33 6 34 56 78 12', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Sophie Dubois' },
  { id: 24, name: 'Oceane Dupuis', email: 'oceane.dupuis@club.com', poste: 'Financière', phone: '+33 6 45 67 89 23', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Nicolas Roux' },
  { id: 25, name: 'Gabriel Chevalier', email: 'gabriel.chevalier@club.com', poste: 'Technique', phone: '+33 6 56 78 90 34', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Marie Martin' },
  { id: 26, name: 'Lucie Marchand', email: 'lucie.marchand@club.com', poste: 'RH', phone: '+33 6 67 89 01 45', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Pierre Bernard' },
  { id: 27, name: 'Nathan Giraud', email: 'nathan.giraud@club.com', poste: 'Marketing', phone: '+33 6 78 90 12 56', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Sophie Dubois' },
  { id: 28, name: 'Jade Leclerc', email: 'jade.leclerc@club.com', poste: 'Technique', phone: '+33 6 89 01 23 67', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Alexandre Rousseau' },
  { id: 29, name: 'Arthur Vidal', email: 'arthur.vidal@club.com', poste: 'Financière', phone: '+33 6 90 12 34 78', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Jean Dupont' },
  { id: 30, name: 'Zoe Perrin', email: 'zoe.perrin@club.com', poste: 'RH', phone: '+33 6 01 23 45 89', status: 'Inactive', hierarchyLevel: 'member', reportsTo: 'Julie Simon' },
  { id: 31, name: 'Tom Renard', email: 'tom.renard@club.com', poste: 'Technique', phone: '+33 6 12 34 56 01', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Marie Martin' },
  { id: 32, name: 'Lola Barbier', email: 'lola.barbier@club.com', poste: 'Marketing', phone: '+33 6 23 45 67 12', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Marc Laurent' },
  { id: 33, name: 'Paul Arnaud', email: 'paul.arnaud@club.com', poste: 'Financière', phone: '+33 6 34 56 78 23', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Jean Dupont' },
  { id: 34, name: 'Elise Gauthier', email: 'elise.gauthier@club.com', poste: 'Technique', phone: '+33 6 45 67 89 34', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Luc Petit' },
  { id: 35, name: 'Theo Olivier', email: 'theo.olivier@club.com', poste: 'RH', phone: '+33 6 56 78 90 45', status: 'Active', hierarchyLevel: 'member', reportsTo: 'Pierre Bernard' },
];

const mockRoles = [
  'Entraineur',
  'Préparateur Physique',
  'Analyste Vidéo',
  'Kinésithérapeute',
  'Manager Technique',
  'Responsable Communication',
  'Directeur Financier',
  'Chargé de Recrutement',
  'Coordinateur Académie',
  'Responsable Infrastructures',
];

const mockFichesDePoste = [
  'Entraineur Principal Senior',
  'Préparateur Physique',
  'Responsable Communication',
  'Directeur Financier',
  'Chargé de Recrutement',
  'Responsable Infrastructures',
  'Kinésithérapeute Sportif',
  'Analyste Vidéo',
  'Responsable Billetterie',
  'Coordinateur Académie',
  'Responsable Partenariats',
  'Gestionnaire Administratif',
];

const getHierarchyIcon = (level: string) => {
  switch (level) {
    case 'leader':
      return <Crown className="w-4 h-4 text-warning-400" />;
    case 'sub-leader':
      return <Shield className="w-4 h-4 text-brand-600" />;
    case 'group-leader':
      return <Star className="w-4 h-4 text-success-600" />;
    default:
      return <Users className="w-4 h-4 text-subtext-color" />;
  }
};

const getHierarchyLabel = (level: string) => {
  switch (level) {
    case 'leader':
      return 'Leader';
    case 'sub-leader':
      return 'Sub-Leader';
    case 'group-leader':
      return 'Group Leader';
    default:
      return 'Member';
  }
};

export function MembersPage() {
  const [selectedView, setSelectedView] = useState<'table' | 'hierarchy' | 'grid'>('table');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [editingState, setEditingState] = useState<EditingState>({
    memberId: null,
    newHierarchyLevel: null,
    newReportsTo: null,
    newRole: null,
    newFicheDePoste: null,
  });
  const [expandedLeaders, setExpandedLeaders] = useState<number[]>([]);
  const [expandedSubLeaders, setExpandedSubLeaders] = useState<number[]>([]);
  const [expandedGroupLeaders, setExpandedGroupLeaders] = useState<number[]>([]);

  const toggleLeader = (id: number) => {
    setExpandedLeaders(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSubLeader = (id: number) => {
    setExpandedSubLeaders(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleGroupLeader = (id: number) => {
    setExpandedGroupLeaders(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleEditRole = (member: Member) => {
    setEditingState({
      memberId: member.id,
      newHierarchyLevel: member.hierarchyLevel,
      newReportsTo: member.reportsTo || '',
      newRole: '',
      newFicheDePoste: '',
    });
  };

  const handleReassign = (member: Member) => {
    setEditingState({
      memberId: member.id,
      newHierarchyLevel: member.hierarchyLevel,
      newReportsTo: member.reportsTo || '',
      newRole: '',
      newFicheDePoste: '',
    });
  };

  const handleSaveChanges = () => {
    if (editingState.memberId) {
      setMembers(members.map(m => {
        if (m.id === editingState.memberId) {
          return {
            ...m,
            hierarchyLevel: (editingState.newHierarchyLevel as any) || m.hierarchyLevel,
            reportsTo: editingState.newReportsTo || undefined,
          };
        }
        return m;
      }));
      setEditingState({
        memberId: null,
        newHierarchyLevel: null,
        newReportsTo: null,
        newRole: null,
        newFicheDePoste: null,
      });
    }
  };

  const handleCloseModal = () => {
    setEditingState({
      memberId: null,
      newHierarchyLevel: null,
      newReportsTo: null,
      newRole: null,
      newFicheDePoste: null,
    });
  };

  const getEligibleSupervisors = (excludeId: number, hierarchyLevel: string) => {
    const hierarchyMap: Record<string, string[]> = {
      'sub-leader': ['leader'],
      'group-leader': ['leader', 'sub-leader'],
      'member': ['leader', 'sub-leader', 'group-leader'],
    };

    const allowedLevels = hierarchyMap[hierarchyLevel] || [];
    return members.filter(m =>
      m.id !== excludeId && allowedLevels.includes(m.hierarchyLevel)
    );
  };

  const editingMember = editingState.memberId
    ? members.find(m => m.id === editingState.memberId)
    : null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-2">Staff Members</h1>
          <p className="text-body text-subtext-color">Manage your team and organizational hierarchy</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('table')}
                className={`px-4 py-2 rounded-md text-body transition-colors ${
                  selectedView === 'table'
                    ? 'bg-brand-600 text-white'
                    : 'text-subtext-color hover:text-default-font'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setSelectedView('hierarchy')}
                className={`px-4 py-2 rounded-md text-body transition-colors ${
                  selectedView === 'hierarchy'
                    ? 'bg-brand-600 text-white'
                    : 'text-subtext-color hover:text-default-font'
                }`}
              >
                Hierarchy View
              </button>
              <button
                onClick={() => setSelectedView('grid')}
                className={`px-4 py-2 rounded-md text-body transition-colors ${
                  selectedView === 'grid'
                    ? 'bg-brand-600 text-white'
                    : 'text-subtext-color hover:text-default-font'
                }`}
              >
                Grid View
              </button>
            </div>

            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-subtext-color" />
              <input
                type="text"
                placeholder="Search members..."
                className="bg-transparent border-none outline-none text-body text-default-font placeholder:text-subtext-color w-64"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-100 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        {selectedView === 'table' ? (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Name</th>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Email</th>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Poste</th>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Phone</th>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Hierarchy</th>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Reports To</th>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Status</th>
                    <th className="px-6 py-3 text-left text-caption-bold text-default-font">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMembers.map((member, index) => (
                    <tr
                      key={member.id}
                      className={`border-b border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer ${
                        index % 2 === 0 ? 'bg-neutral-50' : 'bg-neutral-0'
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="px-6 py-4 text-body text-default-font">{member.name}</td>
                      <td className="px-6 py-4 text-body text-subtext-color">{member.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-caption">
                          {member.poste}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-body text-subtext-color">{member.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getHierarchyIcon(member.hierarchyLevel)}
                          <span className="text-body text-default-font">
                            {getHierarchyLabel(member.hierarchyLevel)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body text-subtext-color">
                        {member.reportsTo || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-caption ${
                            member.status === 'Active'
                              ? 'bg-success-50 text-success-600'
                              : 'bg-neutral-200 text-subtext-color'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditRole(member)}
                          className="text-brand-600 hover:text-brand-700 text-body"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedView === 'grid' ? (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 overflow-x-auto">
            <div className="mb-6">
              <h2 className="text-heading-2 text-default-font mb-2">Grid View - Organization Tree</h2>
              <p className="text-body text-subtext-color">
                Visual tree structure showing all hierarchical relationships. Click on cards to reorganize.
              </p>
            </div>

            <div className="min-w-max pb-8">
              {mockMembers
                .filter((m) => m.hierarchyLevel === 'leader')
                .map((leader) => (
                  <div key={leader.id} className="mb-12">
                    <div className="flex flex-col items-center mb-6">
                      <div
                        className="bg-gradient-to-br from-warning-400 to-warning-300 border-2 border-warning-500 rounded-lg p-5 shadow-lg hover:shadow-xl transition-all cursor-move w-72 relative"
                        onClick={() => handleEditRole(leader)}
                      >
                        <div className="absolute -top-2 -right-2 bg-warning-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-caption-bold shadow-md">
                          1
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-white" />
                            <span className="text-caption-bold text-white uppercase tracking-wide">Leader</span>
                          </div>
                          <button className="text-white hover:text-neutral-100 text-body-bold">⋮</button>
                        </div>
                        <h3 className="text-heading-3 text-white mb-1">{leader.name}</h3>
                        <p className="text-body text-neutral-50 mb-3">{leader.poste}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-caption-bold ${
                            leader.status === 'Active'
                              ? 'bg-success-600 text-white'
                              : 'bg-neutral-300 text-neutral-700'
                          }`}>
                            {leader.status}
                          </span>
                          <span className="text-caption text-white opacity-75">Click to edit</span>
                        </div>
                      </div>
                    </div>

                    {mockMembers.filter((m) => m.hierarchyLevel === 'sub-leader' && m.reportsTo === leader.name).length > 0 && (
                      <>
                        <div className="flex justify-center mb-6">
                          <div className="w-0.5 h-12 bg-gradient-to-b from-neutral-400 to-neutral-300"></div>
                        </div>

                        <div className="relative flex justify-center items-start gap-12">
                          <div
                            className="absolute top-0 h-0.5 bg-neutral-300"
                            style={{
                              left: '15%',
                              right: '15%',
                              top: '0px'
                            }}
                          ></div>

                          {mockMembers
                            .filter((m) => m.hierarchyLevel === 'sub-leader' && m.reportsTo === leader.name)
                            .map((subLeader, idx) => (
                              <div key={subLeader.id} className="flex flex-col items-center">
                                <div className="w-0.5 h-8 bg-neutral-300 mb-4"></div>

                                <div
                                  className="bg-gradient-to-br from-brand-600 to-brand-500 border-2 border-brand-700 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all cursor-move w-64 mb-8 relative"
                                  onClick={() => handleEditRole(subLeader)}
                                >
                                  <div className="absolute -top-2 -right-2 bg-brand-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-caption-bold shadow-md">
                                    2
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Shield className="w-4 h-4 text-white" />
                                      <span className="text-caption-bold text-white uppercase tracking-wide">Sub-Leader</span>
                                    </div>
                                    <button className="text-white hover:text-neutral-200 text-body-bold">⋮</button>
                                  </div>
                                  <h3 className="text-body-bold text-white mb-1">{subLeader.name}</h3>
                                  <p className="text-caption text-brand-100 mb-2">{subLeader.poste}</p>
                                  <div className="text-caption text-white opacity-75">Reports to {leader.name}</div>
                                </div>

                                {(mockMembers.filter((m) => (m.hierarchyLevel === 'group-leader' || m.hierarchyLevel === 'member') && m.reportsTo === subLeader.name).length > 0) && (
                                  <>
                                    <div className="w-0.5 h-8 bg-neutral-300 mb-4"></div>

                                    <div className="flex gap-6">
                                      {mockMembers
                                        .filter((m) => m.hierarchyLevel === 'group-leader' && m.reportsTo === subLeader.name)
                                        .map((groupLeader) => (
                                          <div key={groupLeader.id} className="flex flex-col items-center">
                                            <div
                                              className="bg-gradient-to-br from-success-600 to-success-500 border-2 border-success-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-all cursor-move w-52 mb-6 relative"
                                              onClick={() => handleEditRole(groupLeader)}
                                            >
                                              <div className="absolute -top-2 -right-2 bg-success-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-caption-bold shadow-md">
                                                3
                                              </div>
                                              <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                  <Star className="w-4 h-4 text-white" />
                                                  <span className="text-caption-bold text-white uppercase">Group Lead</span>
                                                </div>
                                                <button className="text-white hover:text-neutral-200">⋮</button>
                                              </div>
                                              <h3 className="text-body text-white mb-1">{groupLeader.name}</h3>
                                              <p className="text-caption text-success-100">{groupLeader.poste}</p>
                                            </div>

                                            {mockMembers.filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === groupLeader.name).length > 0 && (
                                              <>
                                                <div className="w-0.5 h-6 bg-neutral-300 mb-3"></div>

                                                <div className="flex flex-col gap-2 max-w-52">
                                                  {mockMembers
                                                    .filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === groupLeader.name)
                                                    .slice(0, 3)
                                                    .map((member) => (
                                                      <div
                                                        key={member.id}
                                                        className="bg-white border-2 border-neutral-300 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-brand-600 transition-all cursor-move"
                                                        onClick={() => handleEditRole(member)}
                                                      >
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <Users className="w-3 h-3 text-subtext-color" />
                                                          <span className="text-caption text-subtext-color">Member</span>
                                                        </div>
                                                        <h4 className="text-caption-bold text-default-font">{member.name}</h4>
                                                        <p className="text-caption text-subtext-color truncate">{member.poste}</p>
                                                      </div>
                                                    ))}
                                                  {mockMembers.filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === groupLeader.name).length > 3 && (
                                                    <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-lg p-2 text-center">
                                                      <span className="text-caption text-subtext-color">
                                                        +{mockMembers.filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === groupLeader.name).length - 3} more
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        ))}

                                      {mockMembers
                                        .filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === subLeader.name)
                                        .slice(0, 2)
                                        .map((member) => (
                                          <div
                                            key={member.id}
                                            className="bg-white border-2 border-neutral-300 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-brand-600 transition-all cursor-move w-44 h-fit"
                                            onClick={() => handleEditRole(member)}
                                          >
                                            <div className="flex items-center gap-2 mb-1">
                                              <Users className="w-3 h-3 text-subtext-color" />
                                              <span className="text-caption text-subtext-color">Member</span>
                                            </div>
                                            <h4 className="text-caption-bold text-default-font">{member.name}</h4>
                                            <p className="text-caption text-subtext-color truncate">{member.poste}</p>
                                          </div>
                                        ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                        </div>
                      </>
                    )}

                    {mockMembers.filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === leader.name).length > 0 && (
                      <>
                        <div className="flex justify-center my-6">
                          <div className="w-0.5 h-12 bg-gradient-to-b from-neutral-400 to-neutral-300"></div>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
                          {mockMembers
                            .filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === leader.name)
                            .map((member) => (
                              <div
                                key={member.id}
                                className="bg-white border-2 border-neutral-300 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-brand-600 transition-all cursor-move w-44"
                                onClick={() => handleEditRole(member)}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Users className="w-3 h-3 text-subtext-color" />
                                  <span className="text-caption text-subtext-color">Member</span>
                                </div>
                                <h4 className="text-caption-bold text-default-font">{member.name}</h4>
                                <p className="text-caption text-subtext-color truncate">{member.poste}</p>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>

            <div className="mt-8 p-5 bg-brand-50 border-2 border-brand-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-brand-600 text-heading-3 mt-0.5">💡</div>
                <div>
                  <h3 className="text-body-bold text-default-font mb-2">How to reorganize the tree:</h3>
                  <ul className="text-body text-subtext-color space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 font-bold">•</span>
                      <span>Click on any card to open the reorganization modal and change hierarchy level or reporting structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 font-bold">•</span>
                      <span>Visual connecting lines automatically update to reflect new relationships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 font-bold">•</span>
                      <span>Color coding: <span className="font-bold text-warning-500">Yellow (Leaders)</span>, <span className="font-bold text-brand-600">Blue (Sub-Leaders)</span>, <span className="font-bold text-success-600">Green (Group Leaders)</span>, <span className="font-bold text-neutral-700">White (Members)</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 font-bold">•</span>
                      <span>Numbers indicate hierarchy depth: 1 (Top), 2 (Middle Management), 3 (Team Leads), 4 (Individual Contributors)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-heading-2 text-default-font mb-2">Organizational Hierarchy</h2>
              <p className="text-body text-subtext-color">
                View and manage reporting structure using dropdown lists
              </p>
            </div>

            <div className="space-y-3">
              {members
                .filter((m) => m.hierarchyLevel === 'leader')
                .map((leader) => {
                  const isLeaderExpanded = expandedLeaders.includes(leader.id);
                  const subLeaders = members.filter((m) => m.hierarchyLevel === 'sub-leader' && m.reportsTo === leader.name);
                  const directMembers = members.filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === leader.name);

                  return (
                    <div key={leader.id} className="border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                      <button
                        onClick={() => toggleLeader(leader.id)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getHierarchyIcon('leader')}
                          <div className="text-left">
                            <div className="text-body-bold text-default-font">{leader.name}</div>
                            <div className="text-caption text-subtext-color">
                              {leader.poste} - {getHierarchyLabel(leader.hierarchyLevel)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-caption text-subtext-color">
                            {subLeaders.length + directMembers.length} reports
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditRole(leader);
                            }}
                            className="px-3 py-1 border border-brand-600 text-brand-600 rounded-md text-caption hover:bg-brand-50 transition-colors"
                          >
                            Edit
                          </button>
                          {isLeaderExpanded ? (
                            <ChevronUp className="w-5 h-5 text-subtext-color" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-subtext-color" />
                          )}
                        </div>
                      </button>

                      {isLeaderExpanded && (
                        <div className="border-t border-neutral-200 bg-neutral-50 p-4">
                          <div className="space-y-2">
                            {subLeaders.map((subLeader) => {
                              const isSubLeaderExpanded = expandedSubLeaders.includes(subLeader.id);
                              const groupLeaders = members.filter((m) => m.hierarchyLevel === 'group-leader' && m.reportsTo === subLeader.name);
                              const directMembers = members.filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === subLeader.name);

                              return (
                                <div key={subLeader.id} className="border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                                  <button
                                    onClick={() => toggleSubLeader(subLeader.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      {getHierarchyIcon('sub-leader')}
                                      <div className="text-left">
                                        <div className="text-body-bold text-default-font">{subLeader.name}</div>
                                        <div className="text-caption text-subtext-color">
                                          {subLeader.poste} - {getHierarchyLabel(subLeader.hierarchyLevel)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-caption text-subtext-color">
                                        {groupLeaders.length + directMembers.length} reports
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditRole(subLeader);
                                        }}
                                        className="px-3 py-1 border border-brand-600 text-brand-600 rounded-md text-caption hover:bg-brand-50 transition-colors"
                                      >
                                        Edit
                                      </button>
                                      {isSubLeaderExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-subtext-color" />
                                      ) : (
                                        <ChevronDown className="w-5 h-5 text-subtext-color" />
                                      )}
                                    </div>
                                  </button>

                                  {isSubLeaderExpanded && (
                                    <div className="border-t border-neutral-200 bg-neutral-100 p-3">
                                      <div className="space-y-2">
                                        {groupLeaders.map((groupLeader) => {
                                          const isGroupLeaderExpanded = expandedGroupLeaders.includes(groupLeader.id);
                                          const groupMembers = members.filter((m) => m.hierarchyLevel === 'member' && m.reportsTo === groupLeader.name);

                                          return (
                                            <div key={groupLeader.id} className="border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                                              <button
                                                onClick={() => toggleGroupLeader(groupLeader.id)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors"
                                              >
                                                <div className="flex items-center gap-3 flex-1">
                                                  {getHierarchyIcon('group-leader')}
                                                  <div className="text-left">
                                                    <div className="text-body text-default-font">{groupLeader.name}</div>
                                                    <div className="text-caption text-subtext-color">
                                                      {groupLeader.poste} - {getHierarchyLabel(groupLeader.hierarchyLevel)}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                  <span className="text-caption text-subtext-color">
                                                    {groupMembers.length} members
                                                  </span>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleEditRole(groupLeader);
                                                    }}
                                                    className="px-3 py-1 border border-brand-600 text-brand-600 rounded-md text-caption hover:bg-brand-50 transition-colors"
                                                  >
                                                    Edit
                                                  </button>
                                                  {isGroupLeaderExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-subtext-color" />
                                                  ) : (
                                                    <ChevronDown className="w-5 h-5 text-subtext-color" />
                                                  )}
                                                </div>
                                              </button>

                                              {isGroupLeaderExpanded && (
                                                <div className="border-t border-neutral-200 bg-neutral-50 p-3">
                                                  <div className="space-y-1">
                                                    {groupMembers.map((member) => (
                                                      <div key={member.id} className="flex items-center gap-2 p-2 rounded bg-neutral-100 border border-neutral-200 hover:border-brand-600 transition-colors">
                                                        {getHierarchyIcon('member')}
                                                        <div className="flex-1">
                                                          <div className="text-body text-default-font">{member.name}</div>
                                                          <div className="text-caption text-subtext-color">{member.poste}</div>
                                                        </div>
                                                        <button
                                                          onClick={() => handleReassign(member)}
                                                          className="px-2 py-1 text-brand-600 text-caption hover:underline"
                                                        >
                                                          Reassign
                                                        </button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}

                                        {directMembers.map((member) => (
                                          <div key={member.id} className="flex items-center gap-2 p-2 rounded bg-neutral-100 border border-neutral-200 hover:border-brand-600 transition-colors">
                                            {getHierarchyIcon('member')}
                                            <div className="flex-1">
                                              <div className="text-body text-default-font">{member.name}</div>
                                              <div className="text-caption text-subtext-color">{member.poste}</div>
                                            </div>
                                            <button
                                              onClick={() => handleReassign(member)}
                                              className="px-2 py-1 text-brand-600 text-caption hover:underline"
                                            >
                                              Reassign
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {directMembers.map((member) => (
                              <div key={member.id} className="flex items-center gap-2 p-2 rounded bg-neutral-100 border border-neutral-200 hover:border-brand-600 transition-colors">
                                {getHierarchyIcon('member')}
                                <div className="flex-1">
                                  <div className="text-body text-default-font">{member.name}</div>
                                  <div className="text-caption text-subtext-color">{member.poste}</div>
                                </div>
                                <button
                                  onClick={() => handleReassign(member)}
                                  className="px-2 py-1 text-brand-600 text-caption hover:underline"
                                >
                                  Reassign
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {editingState.memberId && editingMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-50 rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-heading-2 text-default-font">
                  Change Hierarchy for {editingMember.name}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-subtext-color" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-body-bold text-default-font mb-2">
                    Hierarchy Level
                  </label>
                  <select
                    value={editingState.newHierarchyLevel || ''}
                    onChange={(e) =>
                      setEditingState({
                        ...editingState,
                        newHierarchyLevel: e.target.value,
                        newReportsTo: e.target.value === 'leader' ? undefined : editingState.newReportsTo,
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md text-body text-default-font bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    <option className="bg-neutral-100 text-default-font" value="leader">Leader</option>
                    <option className="bg-neutral-100 text-default-font" value="sub-leader">Sub-Leader</option>
                    <option className="bg-neutral-100 text-default-font" value="group-leader">Group Leader</option>
                    <option className="bg-neutral-100 text-default-font" value="member">Member</option>
                  </select>
                </div>

                {editingState.newHierarchyLevel !== 'leader' && (
                  <div>
                    <label className="block text-body-bold text-default-font mb-2">
                      Reports To
                    </label>
                    <select
                      value={editingState.newReportsTo || ''}
                      onChange={(e) =>
                        setEditingState({
                          ...editingState,
                          newReportsTo: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md text-body text-default-font bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
                    >
                      <option className="bg-neutral-100 text-default-font" value="">Select supervisor...</option>
                      {getEligibleSupervisors(editingMember.id, editingState.newHierarchyLevel || editingMember.hierarchyLevel).map((member) => (
                        <option key={member.id} className="bg-neutral-100 text-default-font" value={member.name}>
                          {member.name} ({getHierarchyLabel(member.hierarchyLevel)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-body-bold text-default-font mb-2">
                    Role
                  </label>
                  <select
                    value={editingState.newRole || ''}
                    onChange={(e) =>
                      setEditingState({
                        ...editingState,
                        newRole: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md text-body text-default-font bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    <option className="bg-neutral-100 text-default-font" value="">Select role...</option>
                    {mockRoles.map((role) => (
                      <option key={role} className="bg-neutral-100 text-default-font" value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-body-bold text-default-font mb-2">
                    Fiche de Poste
                  </label>
                  <select
                    value={editingState.newFicheDePoste || ''}
                    onChange={(e) =>
                      setEditingState({
                        ...editingState,
                        newFicheDePoste: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md text-body text-default-font bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    <option className="bg-neutral-100 text-default-font" value="">Select fiche de poste...</option>
                    {mockFichesDePoste.map((fiche) => (
                      <option key={fiche} className="bg-neutral-100 text-default-font" value={fiche}>
                        {fiche}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded p-3">
                  <div className="text-caption text-subtext-color mb-1">Current Status</div>
                  <div className="text-body text-default-font">
                    {editingMember.name} is a <span className="font-bold text-brand-600">{getHierarchyLabel(editingMember.hierarchyLevel)}</span>
                    {editingMember.reportsTo && (
                      <> reporting to <span className="font-bold">{editingMember.reportsTo}</span></>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-neutral-200 text-default-font rounded-lg text-body hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="flex-1 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
