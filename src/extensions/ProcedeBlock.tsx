import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState, useCallback } from 'react';
import { Plus, Trash2, ImageIcon, X, Edit2, FileText, Download } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MATERIAL SVG ICON (embedded — same icon for every material item)
// ─────────────────────────────────────────────────────────────────────────────
const MaterialIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 11.22 8.71"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <defs>
      <style>{`.cls-1{fill:#010101;}.cls-2{fill:#fff;}.color{fill:#c40000;}`}</style>
    </defs>
    <path
      className="cls-1"
      d="M6.45-.94l3.81,5,.48.24a.88.88,0,0,1,.48.47l-.48.84-.59.48-.36.12-.48.35-1.55.48L5.37,7.3l-3.1-.36L1.19,6.46,1,6.23.24,5.75a2.27,2.27,0,0,1-.24-1,.52.52,0,0,1,.36-.47l.36-.24.59-.84L2.63,1.33,4.06-.58l.83-.83a.26.26,0,0,1,.24.24l.24.23.36-.12.48-.35.24.24v.23"
      transform="translate(0 1.41)"
    />
    <path
      className="cls-2"
      d="M1.19,4.2A1.2,1.2,0,0,1,2.27,4l2-.24H6.68l2,.24a3.38,3.38,0,0,1,1.08.24H1.19"
      transform="translate(0 1.41)"
    />
    <path
      className="color"
      d="M9.55,4.32h.12l.48.23.11.24-.59.84A5.16,5.16,0,0,1,8,6.35L5.25,6.7a9.29,9.29,0,0,1-3.58-.59A2.08,2.08,0,0,1,.48,4.79a.31.31,0,0,1,.28-.35h.43v.23l8.36-.35m.12,0c0,.35-.36.71-1.2.95a12.51,12.51,0,0,1-6,0c-.72-.24-1.2-.6-1.2-.95l3.58-5c0-.12.24,0,.24,0l.24.24c.12,0,.12-.12.24-.12L6-.82h.24L9.67,4.32"
      transform="translate(0 1.41)"
    />
    <path
      className="cls-2"
      d="M5.85-.46l3.46,5-.24.24L8.47,5l-.71.12H7.4L5.85-.46"
      transform="translate(0 1.41)"
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface MaterialItem {
  id: string;
  quantity: number;
}

interface Section {
  id: string;
  title: string;
  description: string;
}

interface ProcedeAttrs {
  titre: string;
  type: string;
  dimensionLong: number | string;
  dimensionLarg: number | string;
  phaseDeJeu: string;
  principeDeJeu: string;
  joueurs: number | string;
  gb: number | string;
  educateur: string;
  duree: number | string;
  seqCount: number | string;
  seqMin: number | string;
  recuperation: number | string;
  materiaux: MaterialItem[];
  imageSrc: string;
  sections: Section[];
  viewMode: 'edit' | 'document'; // ✅ NEW: View mode toggle
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — generate unique ID
// ─────────────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

// ─────────────────────────────────────────────────────────────────────────────
// FREE-TEXT DROPDOWN (input + datalist)
// ─────────────────────────────────────────────────────────────────────────────
const FreeSelect = ({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) => (
  <>
    <input
      list={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? '—'}
      className="ex-input ex-input--select"
    />
    <datalist id={id}>
      {options.map((o) => (
        <option key={o} value={o} />
      ))}
    </datalist>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT VIEW — Fiche de séance style
// ─────────────────────────────────────────────────────────────────────────────
const DocumentView = ({ attrs }: { attrs: ProcedeAttrs }) => {
  const materiaux: MaterialItem[] = Array.isArray(attrs.materiaux) ? attrs.materiaux : [];
  const sections: Section[] = Array.isArray(attrs.sections) ? attrs.sections : [];

  // Compute total duration for display
  const totalDuree = attrs.duree
    ? `${attrs.duree} min`
    : attrs.seqCount && attrs.seqMin
    ? `${Number(attrs.seqCount) * Number(attrs.seqMin)} min`
    : null;

  return (
    <div className="fd-doc">

      {/* ── HEADER ── */}
      <div className="fd-header">
        <div className="fd-header-top">
          {attrs.type && <span className="fd-type-badge">{attrs.type}</span>}
          {attrs.educateur && (
            <span className="fd-educateur">
              <span className="fd-educateur-label">Éducateur</span>
              <span className="fd-educateur-name">{attrs.educateur}</span>
            </span>
          )}
        </div>
        <h1 className="fd-title">{attrs.titre || 'Sans titre'}</h1>

        {/* ── META BAR ── */}
        <div className="fd-meta-bar">
          {attrs.phaseDeJeu && (
            <div className="fd-meta-item">
              <span className="fd-meta-label">Phase de jeu</span>
              <span className="fd-meta-value">{attrs.phaseDeJeu}</span>
            </div>
          )}
          {attrs.principeDeJeu && (
            <div className="fd-meta-item">
              <span className="fd-meta-label">Principe de jeu</span>
              <span className="fd-meta-value">{attrs.principeDeJeu}</span>
            </div>
          )}
          {(attrs.joueurs || attrs.gb) && (
            <div className="fd-meta-item fd-meta-item--sm">
              <span className="fd-meta-label">Joueurs</span>
              <span className="fd-meta-value">
                {attrs.joueurs || '—'}
                {attrs.gb ? ` + ${attrs.gb} GB` : ''}
              </span>
            </div>
          )}
          {(attrs.dimensionLong || attrs.dimensionLarg) && (
            <div className="fd-meta-item fd-meta-item--sm">
              <span className="fd-meta-label">Terrain</span>
              <span className="fd-meta-value">
                {attrs.dimensionLong || '?'}m × {attrs.dimensionLarg || '?'}m
              </span>
            </div>
          )}
          {totalDuree && (
            <div className="fd-meta-item fd-meta-item--sm">
              <span className="fd-meta-label">Durée</span>
              <span className="fd-meta-value">{totalDuree}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY: TERRAIN + ORGANISATION ── */}
      <div className="fd-body">

        {/* Left: terrain schema */}
        <div className="fd-terrain">
          {attrs.imageSrc ? (
            <img
              src={attrs.imageSrc}
              alt="Schéma du terrain"
              className="fd-terrain-img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="fd-terrain-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="1"/>
                <line x1="12" y1="3" x2="12" y2="21"/>
                <circle cx="12" cy="12" r="3"/>
                <line x1="3" y1="9" x2="6" y2="9"/>
                <line x1="3" y1="15" x2="6" y2="15"/>
                <line x1="18" y1="9" x2="21" y2="9"/>
                <line x1="18" y1="15" x2="21" y2="15"/>
              </svg>
              <span>Schéma du terrain</span>
            </div>
          )}
        </div>

        {/* Right: organisation panel */}
        <div className="fd-org">

          {/* Timing */}
          <div className="fd-org-block">
            <div className="fd-org-block-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Organisation
            </div>
            <div className="fd-org-rows">
              {attrs.duree && (
                <div className="fd-org-row">
                  <span className="fd-org-key">Durée totale</span>
                  <span className="fd-org-val">{attrs.duree} min</span>
                </div>
              )}
              {(attrs.seqCount || attrs.seqMin) && (
                <div className="fd-org-row">
                  <span className="fd-org-key">Séquences</span>
                  <span className="fd-org-val">
                    {attrs.seqCount || '?'} × {attrs.seqMin || '?'} min
                  </span>
                </div>
              )}
              {attrs.recuperation && (
                <div className="fd-org-row">
                  <span className="fd-org-key">Récupération</span>
                  <span className="fd-org-val">{attrs.recuperation} s</span>
                </div>
              )}
            </div>
          </div>

          {/* Materials */}
          {materiaux.length > 0 && (
            <div className="fd-org-block">
              <div className="fd-org-block-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" y1="12" x2="22" y2="12"/>
                </svg>
                Matériaux
              </div>
              <div className="fd-materials-grid">
                {materiaux.map((m) => (
                  <div key={m.id} className="fd-material-chip">
                    <MaterialIcon size={22} />
                    <span className="fd-material-qty">×{m.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTIONS: Objectif, Consignes, etc. ── */}
      {sections.length > 0 && (
        <div className="fd-sections">
          {sections.map((s, i) => (
            <div key={s.id} className="fd-section-block">
              <div className="fd-section-header">
                <span className="fd-section-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="fd-section-title">{s.title || 'Section'}</span>
              </div>
              <p className="fd-section-body">
                {s.description || <em style={{ color: '#9ca3af' }}>Aucune description.</em>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT VIEW (CURRENT DESIGN) COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const EditView = ({ 
  attrs, 
  updateAttributes 
}: { 
  attrs: ProcedeAttrs; 
  updateAttributes: (attrs: Partial<ProcedeAttrs>) => void 
}) => {
  const materiaux: MaterialItem[] = Array.isArray(attrs.materiaux) ? attrs.materiaux : [];
  const sections: Section[] = Array.isArray(attrs.sections) ? attrs.sections : [];

  const [editingImage, setEditingImage] = useState(!attrs.imageSrc);
  const [imgInput, setImgInput] = useState(attrs.imageSrc || '');

  const set = useCallback(
    (field: keyof ProcedeAttrs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      updateAttributes({ [field]: e.target.value }),
    [updateAttributes]
  );

  const addMaterial = () =>
    updateAttributes({ materiaux: [...materiaux, { id: uid(), quantity: 1 }] });

  const updateMaterialQty = (id: string, quantity: number) =>
    updateAttributes({ materiaux: materiaux.map((m) => (m.id === id ? { ...m, quantity } : m)) });

  const deleteMaterial = (id: string) =>
    updateAttributes({ materiaux: materiaux.filter((m) => m.id !== id) });

  const addSection = () =>
    updateAttributes({ sections: [...sections, { id: uid(), title: 'Objectif', description: '' }] });

  const updateSection = (id: string, field: 'title' | 'description', value: string) =>
    updateAttributes({ sections: sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)) });

  const deleteSection = (id: string) =>
    updateAttributes({ sections: sections.filter((s) => s.id !== id) });

  const applyImage = () => {
    updateAttributes({ imageSrc: imgInput.trim() });
    setEditingImage(false);
  };

  return (
    <>
      {/* IMPORT BUTTON */}
      <div className="ex-import-banner" style={{ marginBottom: '1.5rem' }}>
        <button className="ex-btn-import">
          <Download size={16} />
          Importer un procédé
        </button>
      </div>

      {/* HEADER GRID */}
      <div className="ex-header">
        {/* Row 1 */}
        <div className="ex-header-row">
          <div className="ex-field ex-field--grow2">
            <label className="ex-label">Titre</label>
            <input
              className="ex-input ex-input--title"
              value={attrs.titre}
              onChange={set('titre')}
              placeholder="Attaque en supériorité – par vague"
            />
          </div>

          <div className="ex-field ex-field--grow1">
            <label className="ex-label">Type</label>
            <FreeSelect
              id="ex-type"
              value={attrs.type}
              onChange={(v) => updateAttributes({ type: v })}
              options={['Situation', 'Exercice', 'Jeu réduit', 'Match', 'Circuit']}
              placeholder="Situation"
            />
          </div>

          <div className="ex-field ex-field--shrink">
            <label className="ex-label">Dimensions</label>
            <div className="ex-inline-group">
              <input
                className="ex-input ex-input--num"
                type="number"
                value={attrs.dimensionLong}
                onChange={set('dimensionLong')}
                placeholder="20"
              />
              <span className="ex-unit">Long</span>
              <input
                className="ex-input ex-input--num"
                type="number"
                value={attrs.dimensionLarg}
                onChange={set('dimensionLarg')}
                placeholder="20"
              />
              <span className="ex-unit">Larg</span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="ex-header-row">
          <div className="ex-field ex-field--grow1">
            <label className="ex-label">Phase De Jeu</label>
            <FreeSelect
              id="ex-phase"
              value={attrs.phaseDeJeu}
              onChange={(v) => updateAttributes({ phaseDeJeu: v })}
              options={[
                'Récupération du ballon',
                'Construction',
                'Finition',
                'Transition offensive',
                'Transition défensive',
                'Organisation défensive',
              ]}
            />
          </div>

          <div className="ex-field ex-field--grow1">
            <label className="ex-label">Principe De Jeu</label>
            <FreeSelect
              id="ex-principe"
              value={attrs.principeDeJeu}
              onChange={(v) => updateAttributes({ principeDeJeu: v })}
              options={[
                'Conservation du ballon',
                'Progression',
                'Prise de l\'intervalle',
                'Jeu dans le dos',
                'Pressing',
                'Couverture',
              ]}
            />
          </div>

          <div className="ex-field">
            <label className="ex-label">Joueurs</label>
            <input
              className="ex-input"
              type="number"
              value={attrs.joueurs}
              onChange={set('joueurs')}
              placeholder="12"
            />
          </div>

          <div className="ex-field">
            <label className="ex-label">GB</label>
            <input
              className="ex-input"
              type="number"
              value={attrs.gb}
              onChange={set('gb')}
              placeholder="2"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="ex-header-row">
          <div className="ex-field ex-field--grow1">
            <label className="ex-label">Éducateur</label>
            <input
              className="ex-input"
              value={attrs.educateur}
              onChange={set('educateur')}
              placeholder="Nom de l'éducateur"
            />
          </div>

          <div className="ex-field">
            <label className="ex-label">Durée (Min)</label>
            <input
              className="ex-input"
              type="number"
              value={attrs.duree}
              onChange={set('duree')}
              placeholder="min"
            />
          </div>

          <div className="ex-field">
            <label className="ex-label">Séquence</label>
            <div className="ex-inline-group">
              <input
                className="ex-input ex-input--num"
                type="number"
                value={attrs.seqCount}
                onChange={set('seqCount')}
                placeholder="X"
              />
              <span className="ex-unit">×</span>
              <input
                className="ex-input ex-input--num"
                type="number"
                value={attrs.seqMin}
                onChange={set('seqMin')}
                placeholder="Min"
              />
            </div>
          </div>

          <div className="ex-field">
            <label className="ex-label">Récupération (Secondes)</label>
            <input
              className="ex-input"
              type="number"
              value={attrs.recuperation}
              onChange={set('recuperation')}
              placeholder="sec"
            />
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="ex-body">
        {/* Materials */}
        <div className="ex-panel ex-panel--left">
          <p className="ex-panel-title">Matériaux</p>
          <div className="ex-materials-list">
            {materiaux.map((m) => (
              <div key={m.id} className="ex-material-row">
                <div className="ex-material-icon">
                  <MaterialIcon size={36} />
                </div>
                <input
                  className="ex-input ex-input--num ex-material-qty"
                  type="number"
                  min={1}
                  value={m.quantity}
                  onChange={(e) => updateMaterialQty(m.id, Number(e.target.value))}
                />
                <button
                  className="ex-icon-btn ex-icon-btn--danger"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => deleteMaterial(m.id)}
                  title="Supprimer"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button className="ex-btn-secondary ex-btn--full" onClick={addMaterial}>
            <Plus size={14} />
            Gérer
          </button>
        </div>

        {/* Image */}
        <div className="ex-panel ex-panel--center">
          {editingImage ? (
            <div className="ex-image-input-panel">
              <div className="ex-image-input-icon">
                <ImageIcon size={24} strokeWidth={1.5} />
              </div>
              <p className="ex-image-input-title">Ajouter une image du terrain</p>
              <input
                className="ex-input"
                type="url"
                value={imgInput}
                onChange={(e) => setImgInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyImage()}
                placeholder="https://…/terrain.png"
              />
              <div className="ex-image-input-actions">
                <button className="ex-btn-primary" onClick={applyImage}>
                  Insérer
                </button>
                {attrs.imageSrc && (
                  <button className="ex-btn-ghost" onClick={() => setEditingImage(false)}>
                    Annuler
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              className="ex-image-preview"
              onClick={() => setEditingImage(true)}
              title="Cliquer pour changer l'image"
            >
              <img
                src={attrs.imageSrc}
                alt="Terrain"
                className="ex-image-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = '0.25';
                }}
              />
              <div className="ex-image-overlay">
                <ImageIcon size={18} />
                <span>Changer l'image</span>
              </div>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="ex-panel ex-panel--right">
          <div className="ex-sections-list">
            {sections.map((s) => (
              <div key={s.id} className="ex-section">
                <div className="ex-section-header">
                  <input
                    className="ex-input ex-section-title-input"
                    value={s.title}
                    onChange={(e) => updateSection(s.id, 'title', e.target.value)}
                    placeholder="Objectif"
                  />
                  <button
                    className="ex-icon-btn ex-icon-btn--danger"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => deleteSection(s.id)}
                    title="Supprimer ce champ"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <textarea
                  className="ex-textarea"
                  value={s.description}
                  onChange={(e) => updateSection(s.id, 'description', e.target.value)}
                  placeholder="Décrivez l'objectif de l'exercice…"
                  rows={3}
                />
              </div>
            ))}
          </div>
          <button className="ex-btn-add-section" onClick={addSection}>
            <Plus size={15} />
            Ajouter un champ
          </button>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT WITH VIEW TOGGLE
// ─────────────────────────────────────────────────────────────────────────────
const ProcedeBlockComponent = ({ node, updateAttributes }: any) => {
  const attrs = node.attrs as ProcedeAttrs;
  const viewMode = attrs.viewMode || 'edit';

  return (
    <NodeViewWrapper as="div" className="ex-block">
      {/* VIEW MODE TOGGLE */}
      <div className="procede-view-toggle print:hidden">
        <button
          className={`procede-toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
          onClick={() => updateAttributes({ viewMode: 'edit' })}
          title="Mode édition"
        >
          <Edit2 size={16} />
          Édition
        </button>
        <button
          className={`procede-toggle-btn ${viewMode === 'document' ? 'active' : ''}`}
          onClick={() => updateAttributes({ viewMode: 'document' })}
          title="Mode document (PDF)"
        >
          <FileText size={16} />
          Document
        </button>
      </div>

      {/* RENDER APPROPRIATE VIEW */}
      {viewMode === 'document' ? (
        <DocumentView attrs={attrs} />
      ) : (
        <EditView attrs={attrs} updateAttributes={updateAttributes} />
      )}
    </NodeViewWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TIPTAP NODE
// ─────────────────────────────────────────────────────────────────────────────
export const ProcedeBlock = Node.create({
  name: 'procedeBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      titre:          { default: '' },
      type:           { default: '' },
      dimensionLong:  { default: '' },
      dimensionLarg:  { default: '' },
      phaseDeJeu:     { default: '' },
      principeDeJeu:  { default: '' },
      joueurs:        { default: '' },
      gb:             { default: '' },
      educateur:      { default: '' },
      duree:          { default: '' },
      seqCount:       { default: '' },
      seqMin:         { default: '' },
      recuperation:   { default: '' },
      materiaux:      { default: [] },
      imageSrc:       { default: '' },
      sections:       { default: [] },
      viewMode:       { default: 'edit' }, // ✅ NEW
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="procede-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'procede-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ProcedeBlockComponent);
  },

  addCommands() {
    return {
      setProcedeBlock:
        () =>
        ({ commands }: any) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              titre: '',
              type: '',
              dimensionLong: '',
              dimensionLarg: '',
              phaseDeJeu: '',
              principeDeJeu: '',
              joueurs: '',
              gb: '',
              educateur: '',
              duree: '',
              seqCount: '',
              seqMin: '',
              recuperation: '',
              materiaux: [],
              imageSrc: '',
              sections: [{ id: 'default', title: 'Objectif', description: '' }],
              viewMode: 'edit',
            },
          }),
    } as any;
  },
});