import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { CalloutBlock } from '../extensions/CalloutBlock';
import { HighlightBlock } from '../extensions/HighlightBlock';
import { ImageDescriptionBlock } from '../extensions/ImageDescriptionBlock';
import { TableBlock } from '../extensions/TableBlock';
import { Columns, Column } from '../extensions/ColumnsBlock'; // ✅ ADD THIS
import { EditorToolbar } from './EditorToolbar';
import { useEffect } from 'react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { BlockSlashMenu } from './BlockSlashMenu';
import { AlertCircle, Highlighter, Image, Table, Columns as ColumnsIcon } from 'lucide-react'; // ✅ ADD ColumnsIcon

interface DocumentEditorProps {
  content: any;
  onUpdate: (content: any) => void;
}

const SlashCommandExtension = Extension.create({
  name: 'slashCommands',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          const items = [
            {
              title: 'Callout Block',
              description: 'Add an informational callout box',
              icon: AlertCircle,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setCalloutBlock().run();
              },
            },
            {
              title: 'Highlight Block',
              description: 'Highlight important text',
              icon: Highlighter,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setHighlightBlock().run();
              },
            },
            {
              title: 'Image + Description',
              description: 'Add an image with title and description',
              icon: Image,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setImageDescriptionBlock().run();
              },
            },
            {
              title: 'Table',
              description: 'Insert a table with rows and columns',
              icon: Table,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setTableBlock().run();
              },
            },
            // ✅ ADD THESE THREE ITEMS ──────────────────────────────────────
            {
              title: '2 Columns',
              description: 'Split content into two side-by-side columns',
              icon: ColumnsIcon,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setColumns(2).run();
              },
            },
            {
              title: '3 Columns',
              description: 'Split content into three side-by-side columns',
              icon: ColumnsIcon,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setColumns(3).run();
              },
            },
            {
              title: '4 Columns',
              description: 'Split content into four side-by-side columns',
              icon: ColumnsIcon,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setColumns(4).run();
              },
            },
            // ─────────────────────────────────────────────────────────────
          ];

          return items.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: TippyInstance[] | null = null;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(BlockSlashMenu, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) return;

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },

            onUpdate(props: any) {
              component?.updateProps(props);
              if (!props.clientRect || !popup) return;
              popup[0].setProps({ getReferenceClientRect: props.clientRect });
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup?.[0].hide();
                return true;
              }
              return component?.ref?.onKeyDown(props);
            },

            onExit() {
              popup?.[0].destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});

export function DocumentEditor({ content, onUpdate }: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Start typing or press / for commands...',
      }),
      CalloutBlock,
      HighlightBlock,
      ImageDescriptionBlock,
      TableBlock,
      Column,    // ✅ ADD THIS — must come before Columns
      Columns,   // ✅ ADD THIS
      SlashCommandExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="w-full max-w-[21cm] mx-auto">
      <div className="sticky top-0 z-10 mb-8 print:hidden bg-gray-100 py-2">
        <EditorToolbar editor={editor} />
      </div>

      <div className="document-pages">
        <div className="document-page bg-white shadow-lg print:shadow-none">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
