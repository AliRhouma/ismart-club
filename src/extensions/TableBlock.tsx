import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TableBlockAttributes {
  rows: number;
  cols: number;
  data: string[][];
}

// ─── Helper: Create a blank 2D array ───────────────────────────────────────
function createEmptyData(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
}

// ─── Helper: Ensure data grid matches rows/cols dimensions ─────────────────
function normalizeData(data: string[][], rows: number, cols: number): string[][] {
  const normalized = createEmptyData(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      normalized[r][c] = data?.[r]?.[c] ?? '';
    }
  }
  return normalized;
}

// ─── React Component ───────────────────────────────────────────────────────
const TableBlockComponent = ({ node, updateAttributes }: any) => {
  const attrs = node.attrs as TableBlockAttributes;

  // Start in edit mode when first inserted (no data yet)
  const [isEditing, setIsEditing] = useState(attrs.data.length === 0);

  // Always work with a normalized grid
  const data = normalizeData(attrs.data, attrs.rows, attrs.cols);

  // ── Cell change ──────────────────────────────────────────────────────────
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = data.map((row, r) =>
      row.map((cell, c) => (r === rowIndex && c === colIndex ? value : cell))
    );
    updateAttributes({ data: newData });
  };

  // ── Add Row ──────────────────────────────────────────────────────────────
  const addRow = () => {
    const newData = [...data, Array(attrs.cols).fill('')];
    updateAttributes({ rows: attrs.rows + 1, data: newData });
  };

  // ── Add Column ───────────────────────────────────────────────────────────
  const addColumn = () => {
    const newData = data.map((row) => [...row, '']);
    updateAttributes({ cols: attrs.cols + 1, data: newData });
  };

  // ── Delete Row ───────────────────────────────────────────────────────────
  const deleteRow = (rowIndex: number) => {
    if (attrs.rows <= 1) return; // Enforce minimum 1 row
    const newData = data.filter((_, r) => r !== rowIndex);
    updateAttributes({ rows: attrs.rows - 1, data: newData });
  };

  // ── Delete Column ────────────────────────────────────────────────────────
  const deleteColumn = (colIndex: number) => {
    if (attrs.cols <= 1) return; // Enforce minimum 1 col
    const newData = data.map((row) => row.filter((_, c) => c !== colIndex));
    updateAttributes({ cols: attrs.cols - 1, data: newData });
  };

  // ── Done (exit edit mode) ────────────────────────────────────────────────
  const handleDone = () => {
    // Persist normalized data before leaving edit mode
    updateAttributes({ data });
    setIsEditing(false);
  };

  return (
    <NodeViewWrapper className="table-block">
      <div className="table-block-container">

        {/* ── EDIT MODE CONTROLS ────────────────────────────────────────── */}
        {isEditing && (
          <div className="table-controls">
            <button
              className="table-control-btn"
              onClick={addRow}
              title="Add row"
            >
              <Plus size={14} />
              Add Row
            </button>
            <button
              className="table-control-btn"
              onClick={addColumn}
              title="Add column"
            >
              <Plus size={14} />
              Add Column
            </button>
            <button
              className="table-control-btn table-control-done"
              onClick={handleDone}
              title="Save and exit edit mode"
            >
              Done
            </button>
          </div>
        )}

        {/* ── TABLE ─────────────────────────────────────────────────────── */}
        <div
          className="table-wrapper"
          onClick={!isEditing ? () => setIsEditing(true) : undefined}
          title={!isEditing ? 'Click to edit table' : undefined}
        >
          <table className="custom-table">
            <tbody>
              {/* Delete-column header row (edit mode only) */}
              {isEditing && (
                <tr>
                  {data[0]?.map((_, colIndex) => (
                    <td key={colIndex} className="table-action-cell">
                      <button
                        className="table-delete-btn"
                        onClick={() => deleteColumn(colIndex)}
                        disabled={attrs.cols <= 1}
                        title={`Delete column ${colIndex + 1}`}
                        aria-label={`Delete column ${colIndex + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  ))}
                  {/* Spacer for the row-delete column */}
                  <td className="table-action-cell" />
                </tr>
              )}

              {/* Data rows */}
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="custom-table-cell">
                      {isEditing ? (
                        <input
                          className="table-cell-input"
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(rowIndex, colIndex, e.target.value)
                          }
                          placeholder="—"
                          aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                        />
                      ) : (
                        <span>{cell || '—'}</span>
                      )}
                    </td>
                  ))}

                  {/* Delete-row button (edit mode only) */}
                  {isEditing && (
                    <td className="table-action-cell">
                      <button
                        className="table-delete-btn"
                        onClick={() => deleteRow(rowIndex)}
                        disabled={attrs.rows <= 1}
                        title={`Delete row ${rowIndex + 1}`}
                        aria-label={`Delete row ${rowIndex + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </NodeViewWrapper>
  );
};

// ─── TipTap Node Definition ────────────────────────────────────────────────
export const TableBlock = Node.create({
  name: 'tableBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      rows: { default: 3 },
      cols: { default: 3 },
      data: { default: [] }, // Empty triggers edit mode on first insert
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="table-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'table-block' }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableBlockComponent);
  },

  addCommands() {
    return {
      setTableBlock:
        (options?: { rows?: number; cols?: number }) =>
        ({ commands }) => {
          const rows = options?.rows ?? 3;
          const cols = options?.cols ?? 3;
          return commands.insertContent({
            type: this.name,
            attrs: { rows, cols, data: [] }, // Empty data → starts in edit mode
          });
        },
    } as any;
  },
});
