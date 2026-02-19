import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Undo,
  Redo
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
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

      <div className="flex-1" />

      <div className="text-xs text-subtext-color font-medium">
        Type <span className="bg-neutral-100 px-1.5 py-0.5 rounded">/</span> for blocks
      </div>
    </div>
  );
}
