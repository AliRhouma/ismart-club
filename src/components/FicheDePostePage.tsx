import { useState } from 'react';
import { Search, Plus, FileText, X, ChevronDown } from 'lucide-react';

interface FicheDePoste {
  id: number;
  title: string;
  poste: string;
}

const mockFiches: FicheDePoste[] = [
  { id: 1, title: 'Fiche de Poste - Entraîneur Principal', poste: 'Entraîneur Principal' },
  { id: 2, title: 'Fiche de Poste - Préparateur Physique', poste: 'Préparateur Physique' },
  { id: 3, title: 'Fiche de Poste - Responsable Communication', poste: 'Responsable Communication' },
  { id: 4, title: 'Fiche de Poste - Directeur Financier', poste: 'Trésorier' },
  { id: 5, title: 'Fiche de Poste - Chargé de Recrutement', poste: 'Chargé de Recrutement' },
  { id: 6, title: 'Fiche de Poste - Responsable Infrastructures', poste: 'Responsable Infrastructures' },
  { id: 7, title: 'Fiche de Poste - Kinésithérapeute', poste: 'Kinésithérapeute Sportif' },
  { id: 8, title: 'Fiche de Poste - Analyste Vidéo', poste: 'Analyste Vidéo' },
  { id: 9, title: 'Fiche de Poste - Responsable Billetterie', poste: 'Responsable Billetterie' },
  { id: 10, title: 'Fiche de Poste - Secrétaire Général', poste: 'Secrétaire Général' },
  { id: 11, title: 'Fiche de Poste - Responsable Partenariats', poste: 'Responsable Partenariats' },
  { id: 12, title: 'Fiche de Poste - Directeur Général', poste: 'Directeur Général (CEO)' },
];

const POSTES = [
  'Directeur Général (CEO)',
  'Secrétaire Général',
  'Trésorier',
  'Directeur Sportif',
  'Entraîneur Principal',
  'Entraîneur Adjoint',
  'Préparateur Physique',
  'Kinésithérapeute Sportif',
  'Analyste Vidéo',
  'Responsable Communication',
  'Responsable Marketing',
  'Responsable Partenariats',
  'Responsable Billetterie',
  'Directeur Financier',
  'Chargé de Recrutement',
  'Responsable Infrastructures',
  'Coordinateur Académie',
  'Gestionnaire Administratif',
  'Médecin du Club',
];

export function FicheDePostePage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = mockFiches.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.poste.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-1">Fiches de Poste</h1>
          <p className="text-body text-subtext-color">
            Manage and edit job description documents for all club positions
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 w-72">
            <Search className="w-4 h-4 text-subtext-color flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fiches de poste..."
              className="bg-transparent border-none outline-none text-body text-default-font placeholder:text-subtext-color w-full"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Fiche
          </button>
        </div>

        {/* Count */}
        <p className="text-caption text-subtext-color mb-4">
          {filtered.length} document{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((fiche) => (
            <div
              key={fiche.id}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-neutral-50 transition-all cursor-pointer"
            >
              {/* Document icon */}
              <div className="relative w-16 h-20 flex-shrink-0">
                {/* Paper body */}
                <div className="absolute inset-0 bg-white border border-neutral-200 rounded-md shadow-sm group-hover:shadow-md group-hover:border-brand-300 transition-all" />
                {/* Folded corner */}
                <div className="absolute top-0 right-0 w-4 h-4 overflow-hidden">
                  <div className="absolute top-0 right-0 w-0 h-0
                    border-l-[16px] border-l-neutral-100
                    border-b-[16px] border-b-transparent
                    group-hover:border-l-brand-50 transition-colors"
                  />
                  <div className="absolute top-0 right-0 w-0 h-0
                    border-l-[16px] border-l-neutral-300
                    border-b-[16px] border-b-transparent
                    group-hover:border-l-brand-200 transition-colors
                    opacity-60"
                    style={{ transform: 'translate(0.5px, 0)' }}
                  />
                </div>
                {/* Lines decoration */}
                <div className="absolute top-6 left-3 right-5 space-y-1.5">
                  <div className="h-0.5 bg-neutral-100 rounded group-hover:bg-brand-100 transition-colors" />
                  <div className="h-0.5 bg-neutral-100 rounded group-hover:bg-brand-100 transition-colors" />
                  <div className="h-0.5 bg-neutral-100 rounded w-3/4 group-hover:bg-brand-100 transition-colors" />
                </div>
                {/* File icon */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <FileText className="w-4 h-4 text-brand-300 group-hover:text-brand-500 transition-colors" />
                </div>
              </div>

              {/* Text */}
              <div className="text-center">
                <p className="text-caption-bold text-default-font leading-tight line-clamp-2 group-hover:text-brand-700 transition-colors">
                  {fiche.title}
                </p>
                <p className="text-caption text-subtext-color mt-1 line-clamp-1">
                  {fiche.poste}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-body text-subtext-color">No fiches found matching your search.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
              <div>
                <h2 className="text-heading-3 text-default-font">New Fiche de Poste</h2>
                <p className="text-caption text-subtext-color mt-0.5">Create a new job description document</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-subtext-color" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Title field */}
              <div>
                <label className="block text-caption-bold text-default-font mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fiche de Poste - Trésorier"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 transition-colors"
                />
              </div>

              {/* Poste dropdown */}
              <div>
                <label className="block text-caption-bold text-default-font mb-2">
                  Poste Concerné
                </label>
                <div className="relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600 transition-colors pr-10 cursor-pointer"
                  >
                    <option value="" disabled>Select a position...</option>
                    {POSTES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-subtext-color absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}