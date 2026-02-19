import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const CalloutComponent = () => {
  return (
    <NodeViewWrapper className="callout-block">
      <div className="callout-content">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};

export const CalloutBlock = Node.create({
  name: 'calloutBlock',
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'callout', class: 'callout-block' }),
      ['div', { class: 'callout-content' }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },

  addCommands() {
    return {
      setCalloutBlock: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [{ type: 'text', text: 'This is a callout block. Edit this text...' }],
        });
      },
    };
  },
});
