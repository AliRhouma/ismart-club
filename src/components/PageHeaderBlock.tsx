import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { Palette, Type, Image as ImageIcon, Check, X, Settings2 } from 'lucide-react';

interface PageHeaderAttrs {
  title: string;
  bandColor: string;
  gradientColor: string;
  textColor: string;
  logoUrl: string;
  logoPosition: 'left' | 'right';
  bandStyle: 'solid' | 'gradient';
}

const BAND_PRESETS = [
  { band: '#1a3a6b', gradient: '#0f2347', text: '#ffffff', label: 'Navy' },
  { band: '#1e3a5f', gradient: '#0d2137', text: '#ffffff', label: 'Deep Blue' },
  { band: '#b91c1c', gradient: '#7f1d1d', text: '#ffffff', label: 'Crimson' },
  { band: '#065f46', gradient: '#022c22', text: '#ffffff', label: 'Forest' },
  { band: '#6d28d9', gradient: '#4c1d95', text: '#ffffff', label: 'Violet' },
  { band: '#92400e', gradient: '#451a03', text: '#ffffff', label: 'Bronze' },
  { band: '#0f766e', gradient: '#042f2e', text: '#ffffff', label: 'Teal' },
  { band: '#1f2937', gradient: '#030712', text: '#ffffff', label: 'Charcoal' },
  { band: '#d97706', gradient: '#92400e', text: '#ffffff', label: 'Amber' },
  { band: '#0369a1', gradient: '#082f49', text: '#ffffff', label: 'Ocean' },
  { band: '#ffffff', gradient: '#f3f4f6', text: '#1a3a6b', label: 'White' },
  { band: '#f8fafc', gradient: '#e2e8f0', text: '#0f172a', label: 'Silver' },
];

const PageHeaderComponent = ({ node, updateAttributes }: any) => {
  const attrs = node.attrs as PageHeaderAttrs;
  const [isEditing, setIsEditing] = useState(!attrs.title && !attrs.logoUrl);
  const [panel, setPanel] = useState<'color' | 'text' | 'logo' | null>('text');

  const [titleInput, setTitleInput]       = useState(attrs.title);
  const [bandColor, setBandColor]         = useState(attrs.bandColor);
  const [gradientColor, setGradientColor] = useState(attrs.gradientColor);
  const [textColor, setTextColor]         = useState(attrs.textColor);
  const [logoUrl, setLogoUrl]             = useState(attrs.logoUrl);
  const [logoPosition, setLogoPosition]   = useState<'left' | 'right'>(attrs.logoPosition);
  const [bandStyle, setBandStyle]         = useState<'solid' | 'gradient'>(attrs.bandStyle);

  const applyPreset = (p: typeof BAND_PRESETS[0]) => {
    setBandColor(p.band);
    setGradientColor(p.gradient);
    setTextColor(p.text);
  };

  const handleSave = () => {
    updateAttributes({ title: titleInput, bandColor, gradientColor, textColor, logoUrl, logoPosition, bandStyle });
    setIsEditing(false);
    setPanel(null);
  };

  const handleCancel = () => {
    setTitleInput(attrs.title);
    setBandColor(attrs.bandColor);
    setGradientColor(attrs.gradientColor);
    setTextColor(attrs.textColor);
    setLogoUrl(attrs.logoUrl);
    setLogoPosition(attrs.logoPosition);
    setBandStyle(attrs.bandStyle);
    setIsEditing(false);
    setPanel(null);
  };

  const bandBg =
    bandStyle === 'gradient'
      ? `linear-gradient(135deg, ${bandColor} 0%, ${gradientColor} 100%)`
      : bandColor;

  const LogoSlot = ({ side }: { side: 'left' | 'right' }) => {
    if (logoPosition !== side) return null;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '108px',
          minHeight: '88px',
          background: 'white',
          borderRight: side === 'left' ? `3px solid ${bandColor}` : undefined,
          borderLeft:  side === 'right' ? `3px solid ${bandColor}` : undefined,
          flexShrink: 0,
          padding: '10px',
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            style={{ maxWidth: '84px', maxHeight: '68px', objectFit: 'contain' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
          />
        ) : (
          <div className="page-header-logo-placeholder">
            <ImageIcon size={26} />
          </div>
        )}
      </div>
    );
  };

  const Preview = () => (
    <div className="page-header-preview-shell">
      <LogoSlot side="left" />
      <div style={{ flex: 1, background: bandBg, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '88px', padding: '14px 32px' }}>
        <span className="page-header-title-text" style={{ color: textColor, textShadow: textColor === '#ffffff' ? '0 1px 5px rgba(0,0,0,0.3)' : 'none' }}>
          {titleInput || 'Your title here'}
        </span>
      </div>
      <LogoSlot side="right" />
    </div>
  );

  if (!isEditing) {
    return (
      <NodeViewWrapper as="div" className="page-header-block">
        <div className="page-header-view-wrap">
          <Preview />
          <button
            className="page-header-edit-btn"
            contentEditable={false}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setIsEditing(true); setPanel('text'); }}
            title="Edit header"
          >
            <Settings2 size={13} />
            Edit Header
          </button>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper as="div" className="page-header-block">
      <div className="page-header-editor" contentEditable={false}>

        {/* Live preview */}
        <Preview />

        {/* Tab strip */}
        <div className="page-header-tabs">
          {[
            { key: 'text',  icon: <Type size={13} />,      label: 'Title' },
            { key: 'color', icon: <Palette size={13} />,   label: 'Colors' },
            { key: 'logo',  icon: <ImageIcon size={13} />, label: 'Logo' },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              className={`page-header-tab ${panel === key ? 'active' : ''}`}
              onClick={() => setPanel(panel === key ? null : key as any)}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Panel: Title */}
        {panel === 'text' && (
          <div className="page-header-panel">
            <label className="page-header-label">Title text</label>
            <input
              className="page-header-input"
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g. Projet associatif"
              autoFocus
            />
          </div>
        )}

        {/* Panel: Colors */}
        {panel === 'color' && (
          <div className="page-header-panel">
            <label className="page-header-label">Quick presets</label>
            <div className="page-header-presets">
              {BAND_PRESETS.map((p) => (
                <button
                  key={p.label}
                  className={`page-header-preset-swatch ${bandColor === p.band ? 'selected' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${p.band}, ${p.gradient})` }}
                  onClick={() => applyPreset(p)}
                  title={p.label}
                >
                  {bandColor === p.band && <Check size={11} color={p.text} />}
                </button>
              ))}
            </div>

            <label className="page-header-label" style={{ marginTop: '14px' }}>Band style</label>
            <div className="page-header-toggle-row">
              {(['solid', 'gradient'] as const).map((s) => (
                <button key={s} className={`page-header-toggle ${bandStyle === s ? 'active' : ''}`} onClick={() => setBandStyle(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="page-header-color-row">
              <div className="page-header-color-group">
                <label className="page-header-label">{bandStyle === 'gradient' ? 'Color 1' : 'Band color'}</label>
                <div className="page-header-color-pick">
                  <input type="color" value={bandColor} onChange={(e) => setBandColor(e.target.value)} />
                  <span>{bandColor}</span>
                </div>
              </div>
              {bandStyle === 'gradient' && (
                <div className="page-header-color-group">
                  <label className="page-header-label">Color 2</label>
                  <div className="page-header-color-pick">
                    <input type="color" value={gradientColor} onChange={(e) => setGradientColor(e.target.value)} />
                    <span>{gradientColor}</span>
                  </div>
                </div>
              )}
              <div className="page-header-color-group">
                <label className="page-header-label">Text color</label>
                <div className="page-header-color-pick">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                  <span>{textColor}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel: Logo */}
        {panel === 'logo' && (
          <div className="page-header-panel">
            <label className="page-header-label">Logo image URL</label>
            <input
              className="page-header-input"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <label className="page-header-label" style={{ marginTop: '14px' }}>Logo position</label>
            <div className="page-header-toggle-row">
              {(['left', 'right'] as const).map((pos) => (
                <button key={pos} className={`page-header-toggle ${logoPosition === pos ? 'active' : ''}`} onClick={() => setLogoPosition(pos)}>
                  {pos === 'left' ? '← Left' : 'Right →'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="page-header-actions">
          <button className="page-header-btn-save" onClick={handleSave}>
            <Check size={13} /> Save Header
          </button>
          <button className="page-header-btn-cancel" onClick={handleCancel}>
            <X size={13} /> Cancel
          </button>
        </div>

      </div>
    </NodeViewWrapper>
  );
};

export const PageHeaderBlock = Node.create({
  name: 'pageHeaderBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title:         { default: '' },
      bandColor:     { default: '#1a3a6b' },
      gradientColor: { default: '#0f2347' },
      textColor:     { default: '#ffffff' },
      logoUrl:       { default: '' },
      logoPosition:  { default: 'left' },
      bandStyle:     { default: 'gradient' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="page-header-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'page-header-block' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageHeaderComponent);
  },

  addCommands() {
    return {
      setPageHeaderBlock: () => ({ commands }: any) =>
        commands.insertContent({
          type: this.name,
          attrs: { title: '', bandColor: '#1a3a6b', gradientColor: '#0f2347', textColor: '#ffffff', logoUrl: '', logoPosition: 'left', bandStyle: 'gradient' },
        }),
    } as any;
  },
});
