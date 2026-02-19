import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { Image, FileText } from 'lucide-react';

interface ImageDescriptionAttributes {
  imageUrl: string;
  title: string;
  description: string;
}

const ImageDescriptionComponent = ({ node, updateAttributes }: any) => {
  const { imageUrl, title, description } = node.attrs as ImageDescriptionAttributes;
  const [isEditing, setIsEditing] = useState(!imageUrl);

  return (
    <NodeViewWrapper className="image-description-block">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => updateAttributes({ imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-border text-default-font rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              placeholder="Enter a title..."
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-border text-default-font rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => updateAttributes({ description: e.target.value })}
              placeholder="Enter a description..."
              rows={3}
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-border text-default-font rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="image-description-grid" onClick={() => setIsEditing(true)}>
          <div>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="image-description-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <div className="image-description-img flex items-center justify-center">
                <Image className="w-12 h-12 text-neutral-400" />
              </div>
            )}
          </div>
          <div className="image-description-content">
            <h4>{title || 'Untitled'}</h4>
            <p>{description || 'No description provided.'}</p>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export const ImageDescriptionBlock = Node.create({
  name: 'imageDescriptionBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      imageUrl: {
        default: '',
      },
      title: {
        default: '',
      },
      description: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-description"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'image-description' }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageDescriptionComponent);
  },

  addCommands() {
    return {
      setImageDescriptionBlock: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            imageUrl: '',
            title: '',
            description: '',
          },
        });
      },
    };
  },
});
