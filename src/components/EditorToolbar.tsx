import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Button = ({
    onClick,
    active,
    children,
    title
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        active
          ? 'bg-brand-600 text-white'
          : 'hover:bg-neutral-100 text-neutral-700'
      }`}
    >
      {children}
    </button>
  );

  const presetColors = [
    '#000000', '#374151', '#6b7280', '#9ca3af',
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  ];

  return (
    <div className="border-b border-neutral-border bg-neutral-50 px-4 py-2 flex items-center gap-1 flex-wrap">
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      >
        <Undo className="w-5 h-5" />
      </Button>
      
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className="w-5 h-5" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-2" />

      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline"
      >
        <UnderlineIcon className="w-5 h-5" />
      </Button>

      <div className="relative" ref={colorPickerRef}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Text Color"
          className="p-2 rounded-lg transition-all hover:bg-neutral-100 text-neutral-700 relative"
        >
          <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded"
            style={{ backgroundColor: currentColor }}
          />
        </button>

        {showColorPicker && (
          <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-neutral-300 rounded-lg shadow-lg p-3 w-60">
            <div className="mb-2 text-xs font-medium text-neutral-600 uppercase">Text Color</div>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className="w-9 h-9 rounded border-2 border-neutral-200 hover:border-brand-400 transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                className="w-10 h-10 rounded cursor-pointer border border-neutral-300"
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                placeholder="#000000"
                className="flex-1 px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowColorPicker(false);
              }}
              className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
            >
              Reset Color
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-neutral-300 mx-2" />

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-5 h-5" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-2" />

      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <ListOrdered className="w-5 h-5" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-2" />

      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeft className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenter className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRight className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        active={editor.isActive({ textAlign: 'justify' })}
        title="Justify"
      >
        <AlignJustify className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

      <div className="text-xs text-subtext-color font-medium">
        Type <span className="bg-neutral-100 px-1.5 py-0.5 rounded">/</span> for blocks
      </div>
    </div>
  );
}
