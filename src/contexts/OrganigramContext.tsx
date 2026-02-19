import { createContext, useContext, useState, ReactNode } from 'react';
import { Node, Edge } from 'reactflow';

interface OrganigramContextType {
  nodes: Node[];
  edges: Edge[];
  updateOrganigram: (nodes: Node[], edges: Edge[]) => void;
}

const OrganigramContext = createContext<OrganigramContextType | undefined>(undefined);

export function OrganigramProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const updateOrganigram = (newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <OrganigramContext.Provider value={{ nodes, edges, updateOrganigram }}>
      {children}
    </OrganigramContext.Provider>
  );
}

export function useOrganigram() {
  const context = useContext(OrganigramContext);
  if (context === undefined) {
    throw new Error('useOrganigram must be used within an OrganigramProvider');
  }
  return context;
}
