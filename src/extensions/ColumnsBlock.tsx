import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useRef, useCallback } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// COLUMN NODE VIEW
// Renders one column: content area + delete button + right-side resize handle
// ─────────────────────────────────────────────────────────────────────────────
const ColumnComponent = ({ node, updateAttributes, editor, getPos }: any) => {
  const { width } = node.attrs;

  // Drag state stored in a ref to avoid stale closures in event listeners
  const drag = useRef({
    startX: 0,
    startWidth: 0,
    nextPos: -1,
    nextWidth: 0,
  });

  // ── Resize drag ────────────────────────────────────────────────────────────
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const pos = getPos();
    const $pos = editor.state.doc.resolve(pos);
    const parent = $pos.parent;
    const parentStart = $pos.start($pos.depth); // start of parent's content

    // Find the immediately following sibling column
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

    const onMove = (e: MouseEvent) => {
      // Use the flex container's width as the reference for percentage calculation
      const container = document.querySelector('.columns-flex') as HTMLElement;
      const containerWidth = container?.offsetWidth ?? 700;
      const dx = e.clientX - drag.current.startX;
      const delta = (dx / containerWidth) * 100;

      // Clamp this column between 10% and 80%
      const newWidth = Math.max(10, Math.min(80, drag.current.startWidth + delta));
      updateAttributes({ width: newWidth });

      // Mirror-adjust the next sibling column so total stays ~100%
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
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ── Delete this column ─────────────────────────────────────────────────────
  const handleDelete = () => {
    const pos = getPos();
    const $pos = editor.state.doc.resolve(pos);
    // Prevent deleting the last remaining column
    if ($pos.parent.childCount <= 1) return;
    editor.chain().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
  };

  return (
    // NodeViewWrapper becomes a flex child of the parent .columns-flex container
    <NodeViewWrapper
      as="div"
      className="column-node"
      style={{ width: `${Math.round(width * 10) / 10}%` }}
    >
      {/* Delete button – contentEditable=false keeps TipTap from focusing it */}
      <div className="column-actions" contentEditable={false}>
        <button
          className="column-delete-btn"
          onMouseDown={(e) => e.preventDefault()} // Prevent editor blur
          onClick={handleDelete}
          title="Delete column"
          aria-label="Delete column"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Column editable content */}
      <div className="column-content">
        <NodeViewContent as="div" />
      </div>

      {/* Resize handle – absolutely positioned on the right edge */}
      <div
        className="column-resize-handle"
        contentEditable={false}
        onMouseDown={handleResizeStart}
        title="Drag to resize"
        aria-label="Drag to resize column"
      >
        <GripVertical size={14} />
      </div>
    </NodeViewWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COLUMNS CONTAINER NODE VIEW
// Renders the flex wrapper + "Add Column" toolbar
// ─────────────────────────────────────────────────────────────────────────────
const ColumnsComponent = ({ node, editor, getPos }: any) => {
  const addColumn = useCallback(() => {
    const pos = getPos();
    const newCount = node.childCount + 1;

    // Distribute widths evenly, giving remainder to the last column
    const equalWidth = Math.floor(100 / newCount);
    const lastWidth = 100 - equalWidth * (newCount - 1);

    // Build a single transaction: equalize existing columns + insert new one
    let tr = editor.state.tr;
    let i = 0;
    node.forEach((_: any, childOffset: number) => {
      const childPos = pos + 1 + childOffset;
      const w = i === node.childCount - 1 ? lastWidth : equalWidth;
      tr = tr.setNodeMarkup(childPos, undefined, { width: w });
      i++;
    });

    // Insert new column just before the closing token of the columns node
    const insertPos = pos + node.nodeSize - 1;
    const newColumn = editor.schema.nodes.column.createAndFill(
      { width: equalWidth },
      editor.schema.nodes.paragraph.create()
    );
    if (newColumn) tr = tr.insert(insertPos, newColumn);

    editor.view.dispatch(tr);
  }, [editor, getPos, node]);

  return (
    <NodeViewWrapper as="div" className="columns-block">
      {/* Non-editable toolbar */}
      <div className="columns-toolbar" contentEditable={false}>
        <span className="columns-label">
          <GripVertical size={14} />
          Layout ({node.childCount} {node.childCount === 1 ? 'column' : 'columns'})
        </span>
        <button
          className="columns-add-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addColumn}
          title="Add column"
          aria-label="Add column"
        >
          <Plus size={14} />
          Add Column
        </button>
      </div>

      {/* NodeViewContent becomes the flex container – column NodeViews render inside it */}
      <NodeViewContent as="div" className="columns-flex" />
    </NodeViewWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COLUMN NODE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
export const Column = Node.create({
  name: 'column',
  content: 'block+',    // Accepts any block content (paragraphs, custom blocks, etc.)
  isolating: true,      // Tab key stays within the column
  defining: true,       // Prevents Backspace from deleting the column wrapper

  addAttributes() {
    return {
      width: { default: 50 }, // Width as percentage (0–100)
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

// ─────────────────────────────────────────────────────────────────────────────
// COLUMNS NODE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+', // Must contain one or more column nodes

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
      /**
       * setColumns(count) — inserts a column layout with `count` equal-width columns.
       * Usage: editor.chain().focus().setColumns(2).run()
       */
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
