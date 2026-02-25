import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { CalloutBlock } from '../extensions/CalloutBlock';
import { HighlightBlock } from '../extensions/HighlightBlock';
import { ImageDescriptionBlock } from '../extensions/ImageDescriptionBlock';
import { TableBlock } from '../extensions/TableBlock';
import { Columns, Column } from '../extensions/ColumnsBlock';
import { ImageBlock } from '../extensions/ImageBlock';
import { ExerciseBlock } from '../extensions/ExerciseBlock';
import { ProcedeBlock } from '../extensions/ProcedeBlock';
import { ReglementBlock } from '../extensions/ReglementBlock';
import { FicheDePosteBlock } from '../extensions/FicheDePosteBlock';
import { OrganigrammeBlock } from '../extensions/organigramme.extension';
import { PageHeaderBlock } from './PageHeaderBlock';
import { EditorToolbar } from './EditorToolbar';
import { useEffect } from 'react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { BlockSlashMenu } from './BlockSlashMenu';
import { AlertCircle, Highlighter, Image, ImagePlus, Table, Columns as ColumnsIcon, LayoutTemplate, ClipboardList, BookOpen, Scale, Briefcase, Network } from 'lucide-react';

interface DocumentEditorProps {
  content: any;
  onUpdate: (content: any) => void;
  padding?: number; // padding in cm
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
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setCalloutBlock()
                  .run();
              },
            },
            {
              title: 'Highlight Block',
              description: 'Highlight important text',
              icon: Highlighter,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHighlightBlock()
                  .run();
              },
            },
            {
              title: 'Image',
              description: 'Insert a resizable image with alignment controls',
              icon: ImagePlus,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setImageBlock()
                  .run();
              },
            },
            {
              title: 'Image + Description',
              description: 'Add an image with title and description',
              icon: Image,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setImageDescriptionBlock()
                  .run();
              },
            },
            {
              title: 'Page Header',
              description: 'Insert a logo + title header banner for your page',
              icon: LayoutTemplate,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setPageHeaderBlock()
                  .run();
              },
            },
            {
              title: 'Exercice',
              description: 'Fiche d\'exercice complète (terrain, matériaux, objectifs)',
              icon: ClipboardList,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setExerciseBlock()
                  .run();
              },
            },
            {
              title: 'Procédé',
              description: 'Fiche de procédé tactique (terrain, organisation, sections)',
              icon: BookOpen,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setProcedeBlock()
                  .run();
              },
            },
            {
              title: 'Reglement',
              description: 'Inserer un reglement du club dans le document',
              icon: Scale,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setReglementBlock()
                  .run();
              },
            },
            {
              title: 'Fiche de Poste',
              description: 'Inserer une fiche de poste du club',
              icon: Briefcase,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setFicheDePosteBlock()
                  .run();
              },
            },
            {
              title: 'Organigramme',
              description: 'Inserer un organigramme hierarchique',
              icon: Network,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setOrganigrammeBlock()
                  .run();
              },
            },
            {
              title: 'Table',
              description: 'Insert a table with rows and columns',
              icon: Table,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setTableBlock()
                  .run();
              },
            },
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

              if (!props.clientRect) {
                return;
              }

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

              if (!props.clientRect || !popup) {
                return;
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
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

export function DocumentEditor({ content, onUpdate, padding = 2.54 }: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      TextStyle,
      Color,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing or press / for commands...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      CalloutBlock,
      HighlightBlock,
      ImageDescriptionBlock,
      ImageBlock,
      ExerciseBlock,
      ProcedeBlock,
      ReglementBlock,
      FicheDePosteBlock,
      OrganigrammeBlock,
      PageHeaderBlock,
      TableBlock,
      Column,
      Columns,
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

  if (!editor) {
    return null;
  }

  const paddingValue = `${padding}cm`;

  return (
    <div className="w-full max-w-[21cm] mx-auto">
      {/* Toolbar - Sticky on scroll, hidden on print */}
      <div className="sticky top-0 z-10 mb-8 print:hidden bg-gray-100 py-2">
        <EditorToolbar editor={editor} />
      </div>

      {/* Document Pages Container */}
      <div className="document-pages">
        {/* A4 Page Sheet */}
        <div className="document-page bg-white shadow-lg print:shadow-none" style={{ padding: paddingValue }}>
          <EditorContent editor={editor} />
        </div>

        {/*
          Note: For true multi-page support, you would need to:
          1. Measure content height as user types
          2. When content exceeds page height, create new page
          3. Split content between pages
          4. This requires complex DOM measurement and content splitting logic

          For now, this provides A4 appearance with overflow to next page when printing
        */}
      </div>
    </div>
  );
}