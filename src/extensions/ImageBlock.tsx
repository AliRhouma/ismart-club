import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useRef, useState, useCallback } from 'react';
import { ImageIcon, UploadCloud, Maximize2, Lock, Unlock } from 'lucide-react';

interface ImageBlockAttrs {
  src: string;
  alt: string;
  width: number;
  naturalW: number;
  naturalH: number;
  lockRatio: boolean;
  align: 'left' | 'center' | 'right';
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function formatDim(px: number) {
  return Math.round(px);
}

const ImageBlockComponent = ({ node, updateAttributes, selected }: any) => {
  const attrs = node.attrs as ImageBlockAttrs;
  const { src, alt, width, naturalW, naturalH, lockRatio, align } = attrs;

  const ratio = naturalW > 0 && naturalH > 0 ? naturalH / naturalW : 9 / 16;
  const height = width * ratio;

  const [isEditingSrc, setIsEditingSrc] = useState(!src);
  const [srcInput, setSrcInput] = useState(src || '');
  const [altInput, setAltInput] = useState(alt || '');
  const [showDimensions, setShowDimensions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const drag = useRef({ startX: 0, startY: 0, startWidth: 0, handle: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (!naturalW || !naturalH) {
        const nW = img.naturalWidth;
        const nH = img.naturalHeight;
        const container = containerRef.current?.parentElement;
        const maxW = container ? container.offsetWidth - 48 : 600;
        const initW = clamp(nW, 80, maxW);
        updateAttributes({ naturalW: nW, naturalH: nH, width: initW });
      }
    },
    [naturalW, naturalH, updateAttributes]
  );

  const startResize = useCallback(
    (e: React.MouseEvent, handle: string) => {
      e.preventDefault();
      e.stopPropagation();

      drag.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: width,
        handle,
      };
      setIsDragging(true);

      const onMove = (ev: MouseEvent) => {
        const { startX, startY, startWidth, handle } = drag.current;

        let dx = 0;
        if (handle === 'e')  dx =  (ev.clientX - startX);
        if (handle === 'w')  dx = -(ev.clientX - startX);
        if (handle === 'se') dx =  (ev.clientX - startX);
        if (handle === 'sw') dx = -(ev.clientX - startX);
        if (handle === 's')  dx =  (ev.clientY - startY) / ratio;
        if (handle === 'n')  dx = -(ev.clientY - startY) / ratio;

        const container = containerRef.current?.parentElement;
        const maxW = container ? container.offsetWidth - 48 : 900;

        const newWidth = clamp(startWidth + dx, 80, maxW);
        updateAttributes({ width: newWidth });
      };

      const onUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [width, ratio, updateAttributes]
  );

  const applyUrl = () => {
    const trimmed = srcInput.trim();
    if (!trimmed) return;
    updateAttributes({ src: trimmed, alt: altInput, naturalW: 0, naturalH: 0 });
    setIsEditingSrc(false);
  };

  const alignClass =
    align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto';

  if (isEditingSrc) {
    return (
      <NodeViewWrapper as="div" className="image-block-wrapper">
        <div className="image-block-upload-panel">
          <div className="image-block-upload-icon">
            <UploadCloud size={28} strokeWidth={1.5} />
          </div>
          <p className="image-block-upload-title">Insert image URL</p>

          <div className="image-block-field">
            <label>Image URL</label>
            <input
              type="url"
              value={srcInput}
              onChange={(e) => setSrcInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
              placeholder="https://example.com/photo.jpg"
              autoFocus
            />
          </div>
          <div className="image-block-field">
            <label>Alt text</label>
            <input
              type="text"
              value={altInput}
              onChange={(e) => setAltInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
              placeholder="Describe the image…"
            />
          </div>
          <div className="image-block-upload-actions">
            <button className="image-block-btn-primary" onClick={applyUrl}>
              Insert Image
            </button>
            {src && (
              <button
                className="image-block-btn-ghost"
                onClick={() => setIsEditingSrc(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      as="div"
      className="image-block-wrapper"
      ref={containerRef}
    >
      <div
        className={`image-block-positioner ${alignClass}`}
        style={{ width: `${formatDim(width)}px` }}
        onMouseEnter={() => setShowDimensions(true)}
        onMouseLeave={() => !isDragging && setShowDimensions(false)}
      >
        {(showDimensions || isDragging) && (
          <div className="image-block-dim-badge">
            {formatDim(width)} × {formatDim(height)} px
            {naturalW > 0 && (
              <span className="image-block-dim-ratio">
                &nbsp;({naturalW}×{naturalH} native)
              </span>
            )}
          </div>
        )}

        {(selected || showDimensions) && (
          <div className="image-block-toolbar" contentEditable={false}>
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                className={`image-block-toolbar-btn ${align === a ? 'active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => updateAttributes({ align: a })}
                title={`Align ${a}`}
              >
                {a === 'left' ? '⬅' : a === 'center' ? '↔' : '➡'}
              </button>
            ))}
            <div className="image-block-toolbar-divider" />
            <button
              className={`image-block-toolbar-btn ${lockRatio ? 'active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => updateAttributes({ lockRatio: !lockRatio })}
              title={lockRatio ? 'Ratio locked' : 'Ratio unlocked'}
            >
              {lockRatio ? <Lock size={13} /> : <Unlock size={13} />}
            </button>
            <div className="image-block-toolbar-divider" />
            <button
              className="image-block-toolbar-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsEditingSrc(true)}
              title="Change image"
            >
              <ImageIcon size={13} />
            </button>
            {naturalW > 0 && (
              <button
                className="image-block-toolbar-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => updateAttributes({ width: naturalW })}
                title="Reset to native size"
              >
                <Maximize2 size={13} />
              </button>
            )}
          </div>
        )}

        <div
          className={`image-block-frame ${selected ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : ''}`}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: `${formatDim(height)}px`,
              display: 'block',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
            }}
          />

          {(selected || showDimensions) && (
            <div className="image-block-handles" contentEditable={false}>
              {(['n', 's', 'e', 'w'] as const).map((h) => (
                <div
                  key={h}
                  className={`image-block-handle image-block-handle-${h}`}
                  onMouseDown={(e) => startResize(e, h)}
                />
              ))}
              {(['nw', 'ne', 'sw', 'se'] as const).map((h) => (
                <div
                  key={h}
                  className={`image-block-handle image-block-handle-${h}`}
                  onMouseDown={(e) => startResize(e, h === 'nw' || h === 'sw' ? 'w' : 'e')}
                />
              ))}
            </div>
          )}
        </div>

        {alt && (
          <p className="image-block-caption">{alt}</p>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const ImageBlock = Node.create({
  name: 'imageBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src:       { default: '' },
      alt:       { default: '' },
      width:     { default: 400 },
      naturalW:  { default: 0 },
      naturalH:  { default: 0 },
      lockRatio: { default: true },
      align:     { default: 'left' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="image-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-block' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockComponent);
  },

  addCommands() {
    return {
      setImageBlock:
        (attrs?: Partial<ImageBlockAttrs>) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: 'imageBlock',
            attrs: { src: '', alt: '', width: 400, naturalW: 0, naturalH: 0, lockRatio: true, align: 'left', ...attrs },
          });
        },
    } as any;
  },
});
