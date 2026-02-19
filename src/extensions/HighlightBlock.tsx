import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const HighlightComponent = () => {
  return (
    <NodeViewWrapper className="highlight-block">
      <div className="highlight-content">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};

export const HighlightBlock = Node.create({
  name: 'highlightBlock',
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="highlight"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'highlight', class: 'highlight-block' }),
      ['div', { class: 'highlight-content' }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HighlightComponent);
  },

  addCommands() {
    return {
      setHighlightBlock: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [{ type: 'text', text: 'Important: Highlighted text goes here...' }],
        });
      },
    };
  },
});
