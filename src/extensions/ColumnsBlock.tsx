import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useRef, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const ColumnComponent = ({ node, updateAttributes, editor, getPos }: any) => {
  const { width } = node.attrs;
  const drag = useRef({
    startX: 0,
    startWidth: 0,
    nextPos: -1,
    nextWidth: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const pos = getPos();
    const $pos = editor.state.doc.resolve(pos);
    const parent = $pos.parent;
    const parentStart = $pos.start($pos.depth);

    let foundCurrent = false;
    let nextPos = -1;
    let nextWidth = 0;

    parent.forEach((child: any, offset: number) => {
      if (foundCurrent && nextPos === -1) {
        nextPos = parentStart + offset;
        nextWidth = child.attrs.width;
      }
      if (parentStart + offset === pos) foundCurrent = true;
    });

    drag.current = { startX: e.clientX, startWidth: width, nextPos, nextWidth };
    setIsDragging(true);

    const onMove = (ev: MouseEvent) => {
      const wrapper = (ev.target as HTMLElement)?.closest?.('.columns-wrapper');
      const container = wrapper || document.querySelector('.columns-wrapper');
      const containerWidth = (container as HTMLElement)?.offsetWidth ?? 700;
      const dx = ev.clientX - drag.current.startX;
      const delta = (dx / containerWidth) * 100;

      const newWidth = Math.max(10, Math.min(80, drag.current.startWidth + delta));
      updateAttributes({ width: newWidth });

      if (drag.current.nextPos !== -1) {
        const newNextWidth = Math.max(10, drag.current.nextWidth - delta);
        editor.view.dispatch(
          editor.state.tr.setNodeMarkup(drag.current.nextPos, undefined, {
            width: newNextWidth,
          })
        );
      }
    };

    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleDelete = () => {
    const pos = getPos();
    const $pos = editor.state.doc.resolve(pos);
    if ($pos.parent.childCount <= 1) return;
    editor.chain().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
  };

  const isLastChild = (() => {
    try {
      const pos = getPos();
      const $pos = editor.state.doc.resolve(pos);
      const parent = $pos.parent;
      const parentStart = $pos.start($pos.depth);
      let lastOffset = 0;
      parent.forEach((_: any, offset: number) => {
        lastOffset = offset;
      });
      return parentStart + lastOffset === pos;
    } catch {
      return false;
    }
  })();

  return (
    <NodeViewWrapper
      as="div"
      className="column-item"
      style={{
        width: `${Math.round(width * 10) / 10}%`,
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative',
        minWidth: '80px',
        borderRight: isLastChild ? 'none' : '1px solid #e5e7eb',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: isLastChild ? '6px' : '16px',
          zIndex: 20,
          opacity: 0,
          transition: 'opacity 0.15s',
        }}
        className="col-actions"
        contentEditable={false}
      >
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleDelete}
          title="Delete column"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            padding: 0,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            color: '#ef4444',
            cursor: 'pointer',
          }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div style={{ padding: '12px', minHeight: '80px' }}>
        <NodeViewContent as="div" />
      </div>

      {!isLastChild && (
        <div
          contentEditable={false}
          onMouseDown={handleResizeStart}
          title="Drag to resize"
          style={{
            position: 'absolute',
            right: '-8px',
            top: 0,
            width: '16px',
            height: '100%',
            cursor: 'col-resize',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            opacity: isDragging ? 1 : undefined,
          }}
          className="col-resize-handle"
        >
          <div
            style={{
              width: '4px',
              height: '32px',
              borderRadius: '2px',
              backgroundColor: isDragging ? '#3b82f6' : '#cbd5e1',
              transition: 'background-color 0.15s, height 0.15s',
            }}
            className="col-resize-bar"
          />
        </div>
      )}
    </NodeViewWrapper>
  );
};

const ColumnsComponent = ({ node, editor, getPos }: any) => {
  const addColumn = () => {
    const pos = getPos();
    const newCount = node.childCount + 1;
    const equalWidth = Math.floor(100 / newCount);
    const lastWidth = 100 - equalWidth * (newCount - 1);

    let tr = editor.state.tr;
    let i = 0;
    node.forEach((_: any, childOffset: number) => {
      const childPos = pos + 1 + childOffset;
      const w = i === node.childCount - 1 ? lastWidth : equalWidth;
      tr = tr.setNodeMarkup(childPos, undefined, { width: w });
      i++;
    });

    const insertPos = pos + node.nodeSize - 1;
    const newColumn = editor.schema.nodes.column.createAndFill(
      { width: equalWidth },
      editor.schema.nodes.paragraph.create()
    );
    if (newColumn) tr = tr.insert(insertPos, newColumn);

    editor.view.dispatch(tr);
  };

  return (
    <NodeViewWrapper as="div" className="columns-block" style={{
      margin: '1.5rem 0',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'visible',
      background: 'white',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
    }}>
      <div contentEditable={false} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        borderRadius: '6px 6px 0 0',
        userSelect: 'none',
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        }}>
          <GripVertical size={14} />
          Layout ({node.childCount} {node.childCount === 1 ? 'column' : 'columns'})
        </span>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={addColumn}
          title="Add column"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} />
          Add Column
        </button>
      </div>

      <NodeViewContent
        as="div"
        className="columns-wrapper"
        style={{
          display: 'flex',
          flexDirection: 'row' as const,
          alignItems: 'stretch',
          minHeight: '80px',
        }}
      />
    </NodeViewWrapper>
  );
};

export const Column = Node.create({
  name: 'column',
  content: 'block+',
  isolating: true,
  defining: true,

  addAttributes() {
    return {
      width: { default: 50 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnComponent);
  },
});

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'columns' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnsComponent);
  },

  addCommands() {
    return {
      setColumns:
        (count: number = 2) =>
        ({ commands }: any) => {
          const equalWidth = Math.floor(100 / count);
          const lastWidth = 100 - equalWidth * (count - 1);

          const columnNodes = Array.from({ length: count }, (_, i) => ({
            type: 'column',
            attrs: { width: i === count - 1 ? lastWidth : equalWidth },
            content: [{ type: 'paragraph' }],
          }));

          return commands.insertContent({
            type: 'columns',
            content: columnNodes,
          });
        },
    } as any;
  },
});
