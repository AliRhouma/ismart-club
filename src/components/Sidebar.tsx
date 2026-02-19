import { Calendar, ChevronDown, ChevronUp, User, FileText, List, ClipboardList, Flag, Bell, Layers, Network, GitBranch, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: Array<{ id: string; label: string; icon: React.ReactNode }>;
}

const navItems: NavItem[] = [
  { id: 'planification', label: 'Planification', icon: <Calendar className="w-4 h-4" /> },
  { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
  { id: 'resources', label: 'Resources', icon: <FolderOpen className="w-4 h-4" /> },
  {
    id: 'organigram-parent',
    label: 'Organigram',
    icon: <Network className="w-4 h-4" />,
    children: [
      { id: 'organigram', label: 'Organigram', icon: <Network className="w-4 h-4" /> },
    ],
  },
  {
    id: 'ressources-humaines',
    label: 'Ressources Humaines',
    children: [],
  },
  {
    id: 'pole-technique',
    label: 'Pôle Technique',
    children: [],
  },
  {
    id: 'analyse-suivi',
    label: 'Analyse et Suivi',
    children: [],
  },
  {
    id: 'communaute',
    label: 'Communauté',
    children: [],
  },
  {
    id: 'finances',
    label: 'Finances',
    children: [],
  },
  {
    id: 'staff',
    label: 'Staff',
    children: [
      { id: 'organigram-two', label: 'Organigram Two', icon: <GitBranch className="w-4 h-4" /> },
      { id: 'membres', label: 'Membres', icon: <User className="w-4 h-4" /> },
      { id: 'fiche-poste', label: 'fiche de Poste', icon: <FileText className="w-4 h-4" /> },
      { id: 'gestion-taches', label: 'Gestion des taches', icon: <List className="w-4 h-4" /> },
      { id: 'reglements', label: 'Reglements', icon: <ClipboardList className="w-4 h-4" /> },
      { id: 'planification-staff', label: 'Planification', icon: <Calendar className="w-4 h-4" /> },
      { id: 'projet-club', label: 'Projet du club', icon: <Flag className="w-4 h-4" /> },
      { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    ],
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['staff']);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const currentPage = location.pathname.substring(1);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNavigation = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleItem(id);
    } else {
      navigate(`/${id}`);
    }
  };

  return (
    <div className="w-64 bg-neutral-50 h-screen flex flex-col border-r border-neutral-200">
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-default-font rounded-full flex items-center justify-center">
            <span className="text-neutral-0 text-xs font-bold">iS</span>
          </div>
          <span className="text-default-font font-bold text-lg">iSMART-CLUB</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-neutral-100 rounded-md transition-colors">
            <Bell className="w-4 h-4 text-default-font" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-default-font" />
            </button>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => handleNavigation(item.id, !!item.children)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-subtext-color hover:bg-neutral-100 transition-colors ${
                currentPage === item.id ? 'bg-neutral-100' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-body">{item.label}</span>
              </div>
              {item.children && (
                <div>
                  {expandedItems.includes(item.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              )}
            </button>

            {item.children && expandedItems.includes(item.id) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => navigate(`/${child.id}`)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-subtext-color hover:bg-neutral-100 transition-colors ${
                      currentPage === child.id ? 'bg-neutral-100 text-brand-600' : ''
                    }`}
                  >
                    {child.icon}
                    <span className="text-body">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
