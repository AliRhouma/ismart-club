import { useState } from 'react';
import { Plus, X, Save, Network } from 'lucide-react';

interface OrgNode {
  id: string;
  name: string;
  children: OrgNode[];
  level: number;
}

export function OrganigramPage() {
  const [nodes, setNodes] = useState<OrgNode[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [parentNodeId, setParentNodeId] = useState<string | null>(null);
  const [parentLevel, setParentLevel] = useState(0);

  const generateId = () => {
    return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddRootNode = () => {
    setParentNodeId(null);
    setParentLevel(0);
    setNewNodeName('');
    setShowModal(true);
  };

  const handleAddChildNode = (parentId: string, level: number) => {
    setParentNodeId(parentId);
    setParentLevel(level);
    setNewNodeName('');
    setShowModal(true);
  };

  const handleSaveNode = () => {
    if (!newNodeName.trim()) return;

    const newNode: OrgNode = {
      id: generateId(),
      name: newNodeName.trim(),
      children: [],
      level: parentLevel + 1,
    };

    if (parentNodeId === null) {
      setNodes([...nodes, { ...newNode, level: 1 }]);
    } else {
      const addChildToNode = (nodeList: OrgNode[]): OrgNode[] => {
        return nodeList.map((node) => {
          if (node.id === parentNodeId) {
            return {
              ...node,
              children: [...node.children, newNode],
            };
          } else if (node.children.length > 0) {
            return {
              ...node,
              children: addChildToNode(node.children),
            };
          }
          return node;
        });
      };
      setNodes(addChildToNode(nodes));
    }

    setShowModal(false);
    setNewNodeName('');
    setParentNodeId(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    const deleteFromNodes = (nodeList: OrgNode[]): OrgNode[] => {
      return nodeList
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: deleteFromNodes(node.children),
        }));
    };
    setNodes(deleteFromNodes(nodes));
  };

  const renderNode = (node: OrgNode) => {
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className="relative">
          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-4 min-w-[200px] relative group hover:border-brand-600 transition-all">
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-brand-600 rounded-full border-2 border-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute -top-3 -right-3 w-6 h-6 bg-brand-600 rounded-full border-2 border-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-brand-600 rounded-full border-2 border-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-brand-600 rounded-full border-2 border-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-body-bold text-default-font">{node.name}</div>
                <div className="text-caption text-subtext-color mt-1">Level {node.level}</div>
              </div>
              <button
                onClick={() => handleDeleteNode(node.id)}
                className="p-1 hover:bg-error-50 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4 text-error-600" />
              </button>
            </div>

            <button
              onClick={() => handleAddChildNode(node.id, node.level)}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-caption-bold hover:bg-brand-100 transition-colors mt-2 opacity-0 group-hover:opacity-100"
            >
              <Plus className="w-3 h-3" />
              Add Child
            </button>
          </div>
        </div>

        {node.children.length > 0 && (
          <div className="flex flex-col items-center mt-8">
            <div className="w-0.5 h-8 bg-neutral-300"></div>

            <div className="flex gap-12 relative">
              {node.children.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-neutral-300" style={{ top: '0px' }}></div>
              )}

              {node.children.map((child, index) => (
                <div key={child.id} className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-neutral-300"></div>
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const countNodes = (nodeList: OrgNode[]): number => {
    return nodeList.reduce((count, node) => {
      return count + 1 + countNodes(node.children);
    }, 0);
  };

  const getMaxLevel = (nodeList: OrgNode[]): number => {
    if (nodeList.length === 0) return 0;
    return Math.max(
      ...nodeList.map((node) => {
        const childMaxLevel = node.children.length > 0 ? getMaxLevel(node.children) : 0;
        return Math.max(node.level, childMaxLevel);
      })
    );
  };

  const totalNodes = countNodes(nodes);
  const maxLevel = getMaxLevel(nodes);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-2">Organigram</h1>
          <p className="text-body text-subtext-color">
            Create and visualize your organizational structure
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2">
              <span className="text-caption text-subtext-color">Total Nodes: </span>
              <span className="text-body-bold text-brand-600">{totalNodes}</span>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2">
              <span className="text-caption text-subtext-color">Max Level: </span>
              <span className="text-body-bold text-brand-600">{maxLevel}</span>
            </div>
          </div>

          <button
            onClick={handleAddRootNode}
            className="flex items-center gap-2 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Root Node
          </button>
        </div>

        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-lg">
            <Network className="w-16 h-16 text-subtext-color opacity-50 mb-4" />
            <h3 className="text-heading-3 text-default-font mb-2">No Organigram Yet</h3>
            <p className="text-body text-subtext-color mb-6">
              Start building your organizational structure by adding your first node
            </p>
            <button
              onClick={handleAddRootNode}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Node
            </button>
          </div>
        ) : (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-12 overflow-x-auto">
            <div className="flex gap-16 justify-center min-w-max">
              {nodes.map((node) => renderNode(node))}
            </div>
          </div>
        )}

        {nodes.length > 0 && (
          <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-lg p-6">
            <h3 className="text-heading-3 text-default-font mb-4">Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-600 rounded-full border-2 border-neutral-50"></div>
                <span className="text-body text-subtext-color">Connection Points (hover to see)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-neutral-300"></div>
                <span className="text-body text-subtext-color">Hierarchical Connection</span>
              </div>
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-brand-600" />
                <span className="text-body text-subtext-color">Add Child Node</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-error-600" />
                <span className="text-body text-subtext-color">Delete Node</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-heading-2 text-default-font">
                {parentNodeId === null ? 'Add Root Node' : 'Add Child Node'}
              </h2>
              <p className="text-body text-subtext-color mt-1">
                {parentNodeId === null
                  ? 'Create a new root-level node'
                  : `Create a child node at level ${parentLevel + 1}`}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-caption-bold text-default-font mb-2">
                Node Name
              </label>
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveNode();
                  }
                }}
                placeholder="e.g., CEO, General Director, Communications..."
                className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                autoFocus
              />

              <div className="mt-4 bg-brand-50 border border-brand-200 rounded-lg p-3">
                <div className="text-caption-bold text-brand-600 mb-1">Examples:</div>
                <div className="flex flex-wrap gap-2">
                  {['CEO', 'General Director', 'Communications Directorate', 'Events & Operations', 'Infrastructure'].map(
                    (example) => (
                      <button
                        key={example}
                        onClick={() => setNewNodeName(example)}
                        className="px-2 py-1 bg-white border border-brand-200 rounded text-caption text-brand-600 hover:bg-brand-100 transition-colors"
                      >
                        {example}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-neutral-200">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewNodeName('');
                }}
                className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNode}
                disabled={!newNodeName.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
