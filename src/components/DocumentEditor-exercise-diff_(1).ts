// ── ADD to imports ────────────────────────────────────────────────────────
import { ExerciseBlock } from '../extensions/ExerciseBlock';       // ✅ ADD
import { ..., ClipboardList } from 'lucide-react';                // ✅ ADD ClipboardList

// ── ADD to slash command items array ─────────────────────────────────────
{
  title: 'Exercise',
  description: 'Insert a multi-question exercise with screen & document views',
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

// ── ADD to useEditor extensions array ────────────────────────────────────
ExerciseBlock,   // ✅ ADD (after ImageDescriptionBlock / TableBlock)
