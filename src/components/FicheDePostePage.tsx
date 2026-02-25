import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, X, ChevronDown } from 'lucide-react';

interface FicheDePoste {
  id: number;
  title: string;
  poste: string;
}

const mockFiches: FicheDePoste[] = [
  { id: 1,  title: 'Fiche de Poste - Entraîneur Principal',        poste: 'Entraîneur Principal' },
  { id: 2,  title: 'Fiche de Poste - Préparateur Physique',        poste: 'Préparateur Physique' },
  { id: 3,  title: 'Fiche de Poste - Responsable Communication',   poste: 'Responsable Communication' },
  { id: 4,  title: 'Fiche de Poste - Directeur Financier',         poste: 'Trésorier' },
  { id: 5,  title: 'Fiche de Poste - Chargé de Recrutement',       poste: 'Chargé de Recrutement' },
  { id: 6,  title: 'Fiche de Poste - Responsable Infrastructures', poste: 'Responsable Infrastructures' },
  { id: 7,  title: 'Fiche de Poste - Kinésithérapeute',            poste: 'Kinésithérapeute Sportif' },
  { id: 8,  title: 'Fiche de Poste - Analyste Vidéo',              poste: 'Analyste Vidéo' },
  { id: 9,  title: 'Fiche de Poste - Responsable Billetterie',     poste: 'Responsable Billetterie' },
  { id: 10, title: 'Fiche de Poste - Secrétaire Général',          poste: 'Secrétaire Général' },
  { id: 11, title: 'Fiche de Poste - Responsable Partenariats',    poste: 'Responsable Partenariats' },
  { id: 12, title: 'Fiche de Poste - Directeur Général',           poste: 'Directeur Général (CEO)' },
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', poste: '' });

  const filtered = mockFiches.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.poste.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateDocument = () => {
    navigate('/fiche-de-poste/create', { state: { title: formData.title, poste: formData.poste } });
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-screen" style={{ backgroundColor: '#131313' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-1">Fiches de Poste</h1>
          <p className="text-body text-subtext-color">
            Manage and edit job description documents for all club positions
          </p>
        </div>

        {/* ── Toolbar ── */}
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

        {/* ── Count ── */}
        <p className="text-caption text-subtext-color mb-5">
          {filtered.length} document{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {filtered.map((fiche) => (
            <DocumentCard key={fiche.id} fiche={fiche} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-10 h-10 mb-3" style={{ color: '#333' }} />
            <p className="text-body text-subtext-color">No fiches found matching your search.</p>
          </div>
        )}
      </div>

      {/* ══ Add Modal ══ */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div
            className="w-full max-w-md rounded-xl"
            style={{ backgroundColor: '#181818', border: '1px solid #252525', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid #252525' }}
            >
              <div>
                <h2 className="text-heading-3 text-default-font">New Fiche de Poste</h2>
                <p className="text-caption text-subtext-color mt-0.5">
                  Create a new job description document
                </p>
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

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-caption-bold text-default-font mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Fiche de Poste - Trésorier"
                  className="w-full px-3 py-2.5 rounded-lg text-body text-default-font placeholder:text-subtext-color outline-none transition-colors"
                  style={{ backgroundColor: '#131313', border: '1px solid #2d2d2d' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0091ff')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = '#2d2d2d')}
                />
              </div>

              {/* Poste */}
              <div>
                <label className="block text-caption-bold text-default-font mb-2">
                  Poste Concerné
                </label>
                <div className="relative">
                  <select
                    value={formData.poste}
                    onChange={(e) => {
                      setFormData({ ...formData, poste: e.target.value });
                      e.currentTarget.style.color = '#fafafa';
                    }}
                    className="w-full appearance-none px-3 py-2.5 rounded-lg text-body outline-none transition-colors pr-10 cursor-pointer"
                    style={{
                      backgroundColor: '#131313',
                      border: '1px solid #2d2d2d',
                      color: formData.poste ? '#fafafa' : '#737373',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0091ff')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#2d2d2d')}
                  >
                    <option value="" disabled style={{ backgroundColor: '#181818', color: '#737373' }}>
                      Select a position...
                    </option>
                    {POSTES.map((p) => (
                      <option key={p} value={p} style={{ backgroundColor: '#181818', color: '#fafafa' }}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-subtext-color absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
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
                onClick={handleCreateDocument}
                disabled={!formData.title.trim() || !formData.poste}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-body text-white transition-opacity"
                style={{
                  backgroundColor: (!formData.title.trim() || !formData.poste) ? '#0091ff44' : '#0091ff',
                  cursor: (!formData.title.trim() || !formData.poste) ? 'not-allowed' : 'pointer',
                  opacity: (!formData.title.trim() || !formData.poste) ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (formData.title.trim() && formData.poste) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.title.trim() && formData.poste) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
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

/* ── Document card ── */
function DocumentCard({ fiche }: { fiche: FicheDePoste }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
      style={{ backgroundColor: hovered ? '#181818' : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Paper */}
      <div className="relative w-16 h-20 flex-shrink-0">
        {/* Body */}
        <div
          className="absolute inset-0 rounded-md transition-all duration-200"
          style={{
            backgroundColor: '#1c1c1c',
            border: hovered ? '1px solid #0091ff44' : '1px solid #2a2a2a',
            boxShadow: hovered
              ? '0 4px 16px rgba(0,145,255,0.12)'
              : '0 2px 6px rgba(0,0,0,0.5)',
          }}
        />

        {/* Folded corner */}
        <div
          className="absolute top-0 right-0 w-0 h-0"
          style={{
            borderLeft: '13px solid #131313',
            borderBottom: '13px solid transparent',
          }}
        />
        <div
          className="absolute top-0 right-0 w-0 h-0 opacity-30"
          style={{
            borderLeft: '13px solid #555',
            borderBottom: '13px solid transparent',
          }}
        />

        {/* Decorative lines */}
        <div className="absolute top-5 left-3 right-4 space-y-[5px]">
          {[1, 0.7, 0.5, 0.35].map((opacity, i) => (
            <div
              key={i}
              className="h-px rounded"
              style={{
                backgroundColor: hovered ? `rgba(0,145,255,${opacity * 0.35})` : `rgba(255,255,255,${opacity * 0.07})`,
                width: i === 2 ? '75%' : i === 3 ? '50%' : '100%',
              }}
            /> 
          ))}
        </div>

        {/* Icon */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <FileText
            className="w-4 h-4 transition-colors duration-200"
            style={{ color: hovered ? '#0091ff' : '#3a3a3a' }}
          />
        </div>
      </div>

      {/* Text */}
      <div className="text-center">
        <p
          className="text-caption-bold leading-tight line-clamp-2 transition-colors duration-200"
          style={{ color: hovered ? '#0091ff' : '#fafafa' }}
        >
          {fiche.title}
        </p>
        <p className="text-caption text-subtext-color mt-1 line-clamp-1">
          {fiche.poste}
        </p>
      </div>
    </div>
  );
}