import { useState } from 'react';
import { Search, Plus, FileText, X, ChevronDown } from 'lucide-react';

interface FicheDePoste {
  id: number;
  title: string;
  poste: string;
  accent: string;
}

const ACCENTS = [
  '#0091ff',
  '#46a758',
  '#68ddfd',
  '#e54d2e',
  '#f76b15',
  '#8e4ec6',
  '#0091ff',
  '#46a758',
  '#68ddfd',
  '#e54d2e',
  '#f76b15',
  '#8e4ec6',
];

const mockFiches: FicheDePoste[] = [
  { id: 1,  title: 'Entraîneur Principal',        poste: 'Entraîneur Principal',        accent: ACCENTS[0]  },
  { id: 2,  title: 'Préparateur Physique',         poste: 'Préparateur Physique',         accent: ACCENTS[1]  },
  { id: 3,  title: 'Responsable Communication',    poste: 'Responsable Communication',    accent: ACCENTS[2]  },
  { id: 4,  title: 'Directeur Financier',          poste: 'Trésorier',                    accent: ACCENTS[3]  },
  { id: 5,  title: 'Chargé de Recrutement',        poste: 'Chargé de Recrutement',        accent: ACCENTS[4]  },
  { id: 6,  title: 'Responsable Infrastructures',  poste: 'Responsable Infrastructures',  accent: ACCENTS[5]  },
  { id: 7,  title: 'Kinésithérapeute',             poste: 'Kinésithérapeute Sportif',     accent: ACCENTS[6]  },
  { id: 8,  title: 'Analyste Vidéo',               poste: 'Analyste Vidéo',               accent: ACCENTS[7]  },
  { id: 9,  title: 'Responsable Billetterie',      poste: 'Responsable Billetterie',      accent: ACCENTS[8]  },
  { id: 10, title: 'Secrétaire Général',           poste: 'Secrétaire Général',           accent: ACCENTS[9]  },
  { id: 11, title: 'Responsable Partenariats',     poste: 'Responsable Partenariats',     accent: ACCENTS[10] },
  { id: 12, title: 'Directeur Général',            poste: 'Directeur Général (CEO)',      accent: ACCENTS[11] },
];

const POSTES = [
  'Directeur Général (CEO)', 'Secrétaire Général', 'Trésorier',
  'Directeur Sportif', 'Entraîneur Principal', 'Entraîneur Adjoint',
  'Préparateur Physique', 'Kinésithérapeute Sportif', 'Analyste Vidéo',
  'Responsable Communication', 'Responsable Marketing', 'Responsable Partenariats',
  'Responsable Billetterie', 'Directeur Financier', 'Chargé de Recrutement',
  'Responsable Infrastructures', 'Coordinateur Académie', 'Gestionnaire Administratif',
  'Médecin du Club',
];

/* initials from poste title */
function getInitials(str: string) {
  return str
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function hex2rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function DocumentCard({ fiche }: { fiche: FicheDePoste }) {
  const [hovered, setHovered] = useState(false);
  const initials = getInitials(fiche.poste);

  return (
    <div
      className="relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 select-none"
      style={{
        backgroundColor: '#181818',
        border: hovered ? `1px solid ${fiche.accent}` : '1px solid #242424',
        boxShadow: hovered ? `0 8px 32px ${hex2rgba(fiche.accent, 0.18)}` : '0 2px 8px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top color band */}
      <div
        className="h-1 w-full transition-all duration-200"
        style={{ backgroundColor: hovered ? fiche.accent : '#242424' }}
      />

      <div className="p-4">
        {/* Avatar circle with initials */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-200"
          style={{
            backgroundColor: hovered ? hex2rgba(fiche.accent, 0.15) : '#222',
            border: `1.5px solid ${hovered ? fiche.accent : '#2e2e2e'}`,
          }}
        >
          <span
            className="text-caption-bold font-bold tracking-wider transition-colors duration-200"
            style={{ color: hovered ? fiche.accent : '#555', fontSize: '11px' }}
          >
            {initials}
          </span>
        </div>

        {/* Title */}
        <p
          className="text-body-bold leading-snug mb-1 transition-colors duration-200"
          style={{ color: hovered ? '#fafafa' : '#d4d4d4' }}
        >
          {fiche.title}
        </p>

        {/* Poste badge */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className="text-caption px-2 py-0.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: hovered ? hex2rgba(fiche.accent, 0.12) : '#222',
              color: hovered ? fiche.accent : '#737373',
              border: `1px solid ${hovered ? hex2rgba(fiche.accent, 0.3) : '#2e2e2e'}`,
            }}
          >
            {fiche.poste}
          </span>

          <FileText
            className="w-3.5 h-3.5 transition-colors duration-200 flex-shrink-0"
            style={{ color: hovered ? fiche.accent : '#333' }}
          />
        </div>
      </div>
    </div>
  );
}

export function FicheDePostePage() {
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = mockFiches.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.poste.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto min-h-screen" style={{ backgroundColor: '#131313' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-1">Fiches de Poste</h1>
          <p className="text-body text-subtext-color">
            Manage and edit job description documents for all club positions
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2 w-72"
            style={{ backgroundColor: '#181818', border: '1px solid #252525' }}
          >
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-body text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#0091ff' }}
          >
            <Plus className="w-4 h-4" />
            New Fiche
          </button>
        </div>

        <p className="text-caption text-subtext-color mb-5">
          {filtered.length} document{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filtered.map((fiche) => (
            <DocumentCard key={fiche.id} fiche={fiche} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-10 h-10 mb-3" style={{ color: '#333' }} />
            <p className="text-body text-subtext-color">No fiches found.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div
            className="w-full max-w-md rounded-xl"
            style={{
              backgroundColor: '#181818',
              border: '1px solid #252525',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #252525' }}>
              <div>
                <h2 className="text-heading-3 text-default-font">New Fiche de Poste</h2>
                <p className="text-caption text-subtext-color mt-0.5">Create a new job description document</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: '#737373' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#242424')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-caption-bold text-default-font mb-2">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fiche de Poste - Trésorier"
                  className="w-full px-3 py-2.5 rounded-lg text-body text-default-font placeholder:text-subtext-color outline-none transition-colors"
                  style={{ backgroundColor: '#131313', border: '1px solid #2d2d2d' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0091ff')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = '#2d2d2d')}
                />
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-2">Poste Concerné</label>
                <div className="relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none px-3 py-2.5 rounded-lg text-body outline-none pr-10 cursor-pointer"
                    style={{ backgroundColor: '#131313', border: '1px solid #2d2d2d', color: '#737373' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0091ff')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#2d2d2d')}
                    onChange={(e) => (e.currentTarget.style.color = '#fafafa')}
                  >
                    <option value="" disabled style={{ backgroundColor: '#181818', color: '#737373' }}>Select a position...</option>
                    {POSTES.map((p) => (
                      <option key={p} value={p} style={{ backgroundColor: '#181818', color: '#fafafa' }}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-subtext-color absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-body text-default-font transition-colors"
                style={{ backgroundColor: '#222', border: '1px solid #2d2d2d' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#222')}
              >
                Cancel
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-body text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0091ff' }}
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