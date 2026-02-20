import { useState, useCallback, useEffect } from 'react';
import GroupPreviewModal from './GroupPreviewModal';
import MemberPreviewModal from './MemberPreviewModal';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import dagre from 'dagre';
import { Plus, Users, Eye, EyeOff, UserPlus, X, Search, UserCheck, Link2, Check, ChevronDown, ChevronRight, ListTodo, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useOrganigram } from '../contexts/OrganigramContext';
import 'reactflow/dist/style.css';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface Member {
  name: string;
  role: string;
  tasks?: Task[];
}

interface OrgNodeData {
  label: string;
  members?: Member[];
  showMembers?: boolean;
  onAddMembers?: (nodeId: string) => void;
  isRelationNode?: boolean;
  showTasks?: boolean;
  expandedMembers?: Set<string>;
  onToggleMember?: (nodeId: string, memberName: string) => void;
  onPreviewGroup?: (nodeId: string) => void;
  onPreviewPlayer?: (nodeId: string, memberName: string) => void;
  onPreviewTask?: (nodeId: string, memberName: string, taskId: string) => void;
}

interface RelationNodeData {
  description: string;
  isRelationNode: boolean;
  onPreviewRelation?: (nodeId: string) => void;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeWidthWithTasks = 400;
const baseNodeHeight = 80;
const relationNodeWidth = 200;
const relationNodeHeight = 60;

const getNodeHeight = (showMembers: boolean, showTasks: boolean, members: Member[] = [], expandedMembers: Set<string> = new Set()) => {
  if (!showMembers || members.length === 0) return baseNodeHeight;
  
  let height = baseNodeHeight;
  
  members.forEach(member => {
    // Base member height
    height += 48;
    
    // If tasks are shown and member is expanded, add task heights
    if (showTasks && expandedMembers.has(member.name)) {
      const taskCount = member.tasks?.length || 0;
      height += (taskCount * 36) + 12; // Each task is 36px + 12px padding
    }
  });
  
  height += 48; // Add Members button
  
  return height;
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], spacingMultiplier: number = 4, showTasks: boolean = false) => {
  const newGraph = new dagre.graphlib.Graph();
  newGraph.setDefaultEdgeLabel(() => ({}));

  const orgNodes = nodes.filter(node => !node.data.isRelationNode);
  const relationNodes = nodes.filter(node => node.data.isRelationNode);

  const maxHeight = orgNodes.reduce((max, node) => {
    const height = getNodeHeight(
      node.data.showMembers || false,
      showTasks,
      node.data.members || [],
      node.data.expandedMembers || new Set()
    );
    return Math.max(max, height);
  }, baseNodeHeight);

  const dynamicRanksep = Math.max(150, maxHeight * spacingMultiplier);
  const currentNodeWidth = showTasks ? nodeWidthWithTasks : nodeWidth;
  
  newGraph.setGraph({ rankdir: 'TB', ranksep: dynamicRanksep, nodesep: 100 });

  orgNodes.forEach((node) => {
    const height = getNodeHeight(
      node.data.showMembers || false,
      showTasks,
      node.data.members || [],
      node.data.expandedMembers || new Set()
    );
    newGraph.setNode(node.id, { width: currentNodeWidth, height });
  });

  const orgEdges = edges.filter(edge => {
    const sourceIsOrg = orgNodes.some(n => n.id === edge.source);
    const targetIsOrg = orgNodes.some(n => n.id === edge.target);
    return sourceIsOrg && targetIsOrg && !edge.data?.isRelationEdge;
  });

  orgEdges.forEach((edge) => {
    newGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(newGraph);

  const layoutedOrgNodes = orgNodes.map((node) => {
    const nodeWithPosition = newGraph.node(node.id);
    const height = getNodeHeight(
      node.data.showMembers || false,
      showTasks,
      node.data.members || [],
      node.data.expandedMembers || new Set()
    );
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - currentNodeWidth / 2,
        y: nodeWithPosition.y - height / 2,
      },
      dagreY: nodeWithPosition.y,
      height: height,
    };
  });

  const rankGroups = new Map<number, typeof layoutedOrgNodes>();
  const tolerance = 10;

  layoutedOrgNodes.forEach((node) => {
    let foundGroup = false;
    for (const [rankY, group] of rankGroups.entries()) {
      if (Math.abs((node as any).dagreY - rankY) < tolerance) {
        group.push(node);
        foundGroup = true;
        break;
      }
    }
    if (!foundGroup) {
      rankGroups.set((node as any).dagreY, [node]);
    }
  });

  rankGroups.forEach((group) => {
    const minY = Math.min(...group.map(n => n.position.y));
    group.forEach(node => {
      node.position.y = minY;
    });
  });

  const finalOrgNodes = layoutedOrgNodes.map(({ dagreY, height, ...node }: any) => node);

  const layoutedRelationNodes = relationNodes.map(relNode => {
    const relEdges = edges.filter(e => 
      (e.source === relNode.id || e.target === relNode.id) && e.data?.isRelationEdge
    );
    
    if (relEdges.length === 2) {
      const node1Id = relEdges[0].source === relNode.id ? relEdges[0].target : relEdges[0].source;
      const node2Id = relEdges[1].source === relNode.id ? relEdges[1].target : relEdges[1].source;
      
      const node1 = finalOrgNodes.find(n => n.id === node1Id);
      const node2 = finalOrgNodes.find(n => n.id === node2Id);
      
      if (node1 && node2) {
        const midX = (node1.position.x + node2.position.x) / 2 + (currentNodeWidth / 2) - (relationNodeWidth / 2);
        const midY = (node1.position.y + node2.position.y) / 2 + (baseNodeHeight / 2) - (relationNodeHeight / 2);
        
        return {
          ...relNode,
          position: { x: midX, y: midY }
        };
      }
    }
    
    return relNode;
  });

  return { nodes: [...finalOrgNodes, ...layoutedRelationNodes], edges };
};

function OrgChartNode({ data, id, selected }: NodeProps<OrgNodeData>) {
  const [name, setName] = useState(data.label || '');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const nodeHeight = getNodeHeight(
    data.showMembers || false,
    data.showTasks || false,
    data.members || [],
    data.expandedMembers || new Set()
  );
  const currentNodeWidth = data.showTasks ? nodeWidthWithTasks : nodeWidth;

  return (
    <div
      className={`bg-neutral-50 rounded-lg shadow-md border-2 transition-all duration-200 hover:scale-105 ${
        selected ? 'border-brand-600 shadow-lg' : 'border-neutral-200'
      }`}
      style={{ width: currentNodeWidth, minHeight: nodeHeight }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-brand-600" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-brand-600" id="bottom" />
      <Handle type="source" position={Position.Left} className="w-3 h-3 bg-purple-600" id="left" />
      <Handle type="target" position={Position.Right} className="w-3 h-3 bg-purple-600" id="right" />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-caption-bold flex-shrink-0">
            {getInitials(name) || '?'}
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name / Title"
            className="flex-1 bg-transparent border-none outline-none text-body-bold text-default-font placeholder:text-subtext-color"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (data.onPreviewGroup) {
                data.onPreviewGroup(id);
              }
            }}
            className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors"
            title="Preview group"
          >
            <Eye className="w-4 h-4 text-brand-600" />
          </button>
        </div>

        {data.showMembers && (
          <>
            {data.members && data.members.length > 0 && (
              <div className="mt-3 pt-3 border-t border-neutral-200 space-y-2">
                {data.members.map((member, idx) => (
                  <div key={idx} className="space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (data.onToggleMember) {
                          data.onToggleMember(id, member.name);
                        }
                      }}
                      className="w-full flex items-center gap-2 text-caption hover:bg-neutral-100 rounded p-1 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-600 text-xs font-bold">
                          {getInitials(member.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-default-font font-medium truncate">{member.name}</div>
                        <div className="text-subtext-color text-xs truncate">{member.role}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (data.onPreviewPlayer) {
                            data.onPreviewPlayer(id, member.name);
                          }
                        }}
                        className="p-1 hover:bg-brand-100 rounded transition-colors flex-shrink-0"
                        title="Preview player"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-600" />
                      </button>
                      {data.showTasks && member.tasks && member.tasks.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-brand-600 font-medium">{member.tasks.length}</span>
                          {data.expandedMembers?.has(member.name) ? (
                            <ChevronDown className="w-4 h-4 text-subtext-color" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-subtext-color" />
                          )}
                        </div>
                      )}
                    </button>

                    {data.showTasks && data.expandedMembers?.has(member.name) && member.tasks && (
                      <div className="ml-8 space-y-1 mt-1">
                        {member.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-neutral-100 border border-neutral-300 rounded p-2 text-xs hover:shadow-sm transition-shadow group/task"
                          >
                            <div className="flex items-start gap-2 mb-1">
                              <div className={`mt-0.5 ${getStatusColor(task.status)}`}>
                                {getStatusIcon(task.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-default-font font-medium truncate">{task.title}</div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (data.onPreviewTask) {
                                    data.onPreviewTask(id, member.name, task.id);
                                  }
                                }}
                                className="p-1 hover:bg-brand-100 rounded transition-colors opacity-0 group-hover/task:opacity-100"
                                title="Preview task"
                              >
                                <Eye className="w-3 h-3 text-brand-600" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 ml-5">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-subtext-color">{task.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (data.onAddMembers) {
                  data.onAddMembers(id);
                }
              }}
              className="w-full mt-3 pt-3 border-t border-neutral-200 flex items-center justify-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-caption-bold hover:bg-brand-100 transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              Add Members
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function RelationNode({ data, selected, id }: NodeProps<RelationNodeData>) {
  const [description, setDescription] = useState(data.description || '');

  return (
    <div
      className={`bg-purple-50 rounded-lg shadow-md border-2 transition-all duration-200 group/relation ${
        selected ? 'border-purple-600 shadow-lg' : 'border-purple-300'
      }`}
      style={{ width: relationNodeWidth, height: relationNodeHeight }}
    >
      <Handle type="source" position={Position.Left} className="w-3 h-3 bg-purple-600" id="left" />
      <Handle type="target" position={Position.Right} className="w-3 h-3 bg-purple-600" id="right" />

      <div className="p-3 h-full flex items-center justify-center gap-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Relation description..."
          className="flex-1 bg-transparent border-none outline-none text-center text-caption-bold text-purple-700 placeholder:text-purple-400"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (data.onPreviewRelation) {
              data.onPreviewRelation(id);
            }
          }}
          className="p-1 hover:bg-purple-200 rounded transition-colors opacity-0 group-hover/relation:opacity-100 flex-shrink-0"
          title="Preview relation"
        >
          <Eye className="w-3.5 h-3.5 text-purple-700" />
        </button>
      </div>
    </div>
  );
}

const nodeTypes = {
  orgNode: OrgChartNode,
  relationNode: RelationNode,
};

// Sample tasks for different members
const sampleTasks: Record<string, Task[]> = {
  'Bilel Mansour': [
    { id: 't1', title: 'Review Q1 Financial Reports', status: 'in-progress', priority: 'high', dueDate: '2026-02-15' },
    { id: 't2', title: 'Strategic Planning Meeting', status: 'pending', priority: 'high', dueDate: '2026-02-20' },
    { id: 't3', title: 'Board Presentation Prep', status: 'completed', priority: 'medium', dueDate: '2026-01-25' },
  ],
  'Jacer Khaled': [
    { id: 't4', title: 'Code Review - Authentication Module', status: 'in-progress', priority: 'high', dueDate: '2026-02-05' },
    { id: 't5', title: 'Optimize Database Queries', status: 'pending', priority: 'medium', dueDate: '2026-02-10' },
    { id: 't6', title: 'Mentor Junior Developers', status: 'in-progress', priority: 'low', dueDate: '2026-02-28' },
  ],
  'Amira Benali': [
    { id: 't7', title: 'Product Roadmap Q2 Planning', status: 'in-progress', priority: 'high', dueDate: '2026-02-12' },
    { id: 't8', title: 'User Research Analysis', status: 'completed', priority: 'medium', dueDate: '2026-01-28' },
    { id: 't9', title: 'Feature Prioritization Workshop', status: 'pending', priority: 'high', dueDate: '2026-02-08' },
  ],
  'Sami Trabelsi': [
    { id: 't10', title: 'Architecture Documentation', status: 'in-progress', priority: 'medium', dueDate: '2026-02-15' },
    { id: 't11', title: 'Tech Stack Evaluation', status: 'pending', priority: 'high', dueDate: '2026-02-18' },
  ],
  'Nour Jebali': [
    { id: 't12', title: 'API Development - User Service', status: 'in-progress', priority: 'high', dueDate: '2026-02-06' },
    { id: 't13', title: 'Unit Tests Implementation', status: 'pending', priority: 'medium', dueDate: '2026-02-09' },
  ],
  'Youssef Gharbi': [
    { id: 't14', title: 'CI/CD Pipeline Optimization', status: 'in-progress', priority: 'high', dueDate: '2026-02-07' },
    { id: 't15', title: 'Infrastructure Monitoring Setup', status: 'completed', priority: 'medium', dueDate: '2026-01-30' },
  ],
  'Leila Amor': [
    { id: 't16', title: 'Mobile App UI Redesign', status: 'in-progress', priority: 'high', dueDate: '2026-02-14' },
    { id: 't17', title: 'Design System Documentation', status: 'pending', priority: 'medium', dueDate: '2026-02-20' },
  ],
  'Karim Bouzid': [
    { id: 't18', title: 'Dashboard Component Development', status: 'in-progress', priority: 'high', dueDate: '2026-02-08' },
    { id: 't19', title: 'Performance Optimization', status: 'pending', priority: 'medium', dueDate: '2026-02-12' },
  ],
  'Fatma Sassi': [
    { id: 't20', title: 'Recruitment Strategy Review', status: 'in-progress', priority: 'high', dueDate: '2026-02-10' },
    { id: 't21', title: 'Employee Engagement Survey', status: 'pending', priority: 'medium', dueDate: '2026-02-25' },
  ],
  'Mohamed Ali': [
    { id: 't22', title: 'Interview Coordination', status: 'in-progress', priority: 'high', dueDate: '2026-02-05' },
    { id: 't23', title: 'Candidate Database Update', status: 'completed', priority: 'low', dueDate: '2026-01-29' },
  ],
};

const allAvailableMembers: Member[] = [
  { name: 'Bilel Mansour', role: 'Owner & CEO', tasks: sampleTasks['Bilel Mansour'] || [] },
  { name: 'Jacer Khaled', role: 'Senior Developer', tasks: sampleTasks['Jacer Khaled'] || [] },
  { name: 'Amira Benali', role: 'Product Manager', tasks: sampleTasks['Amira Benali'] || [] },
  { name: 'Sami Trabelsi', role: 'Technical Lead', tasks: sampleTasks['Sami Trabelsi'] || [] },
  { name: 'Nour Jebali', role: 'Backend Developer', tasks: sampleTasks['Nour Jebali'] || [] },
  { name: 'Youssef Gharbi', role: 'DevOps Engineer', tasks: sampleTasks['Youssef Gharbi'] || [] },
  { name: 'Leila Amor', role: 'UX/UI Designer', tasks: sampleTasks['Leila Amor'] || [] },
  { name: 'Karim Bouzid', role: 'Frontend Developer', tasks: sampleTasks['Karim Bouzid'] || [] },
  { name: 'Fatma Sassi', role: 'HR Manager', tasks: sampleTasks['Fatma Sassi'] || [] },
  { name: 'Mohamed Ali', role: 'Recruiter', tasks: sampleTasks['Mohamed Ali'] || [] },
  { name: 'Rania Meddeb', role: 'Marketing Director', tasks: [] },
  { name: 'Hamza Dridi', role: 'Content Creator', tasks: [] },
  { name: 'Sarah Zouari', role: 'Social Media Manager', tasks: [] },
  { name: 'Wael Tounsi', role: 'Finance Manager', tasks: [] },
  { name: 'Ines Fakhfakh', role: 'Accountant', tasks: [] },
  { name: 'Mehdi Chahed', role: 'Sales Manager', tasks: [] },
  { name: 'Asma Rebai', role: 'Account Executive', tasks: [] },
  { name: 'Tarek Bellili', role: 'Software Engineer', tasks: [] },
  { name: 'Salma Karoui', role: 'Data Analyst', tasks: [] },
  { name: 'Omar Hafsi', role: 'Support Specialist', tasks: [] },
  { name: 'Nesrine Bouaziz', role: 'Designer', tasks: [] },
  { name: 'Khalil Jemli', role: 'Project Manager', tasks: [] },
  { name: 'Marwa Cherif', role: 'Business Analyst', tasks: [] },
  { name: 'Aymen Sellami', role: 'DevOps Lead', tasks: [] },
];

export default function OrganigramTwoPage() {
  const { nodes: contextNodes, edges: contextEdges, updateOrganigram } = useOrganigram();
  const [nodes, setNodes, onNodesChange] = useNodesState(contextNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(contextEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [spacingMultiplier, setSpacingMultiplier] = useState(4);
  const [showTaskAssignModal, setShowTaskAssignModal] = useState(false);
  const [taskAssignment, setTaskAssignment] = useState<{
    sourceNode: string;
    sourceMember: string;
    task: Task | null;
  } | null>(null);

  const [isCreatingRelation, setIsCreatingRelation] = useState(false);
  const [relationSelectionStep, setRelationSelectionStep] = useState<number>(0);
  const [selectedNodesForRelation, setSelectedNodesForRelation] = useState<string[]>([]);
  const [showRelations, setShowRelations] = useState(true);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRelationModal, setShowRelationModal] = useState(false);

  useEffect(() => {
    updateOrganigram(nodes, edges);
  }, [nodes, edges, updateOrganigram]);

  const handlePreviewGroup = useCallback((nodeId: string) => {
    setShowGroupModal(true);
  }, []);

  const handlePreviewPlayer = useCallback((nodeId: string, memberName: string) => {
    setShowPlayerModal(true);
  }, []);

  const handlePreviewTask = useCallback((nodeId: string, memberName: string, taskId: string) => {
    setShowTaskModal(true);
  }, []);

  const handlePreviewRelation = useCallback((nodeId: string) => {
    setShowRelationModal(true);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleToggleMember = useCallback((nodeId: string, memberName: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const expandedMembers = new Set(node.data.expandedMembers || new Set());
          if (expandedMembers.has(memberName)) {
            expandedMembers.delete(memberName);
          } else {
            expandedMembers.add(memberName);
          }
          return {
            ...node,
            data: {
              ...node.data,
              expandedMembers,
            },
          };
        }
        return node;
      })
    );

    setTimeout(() => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            currentNodes,
            currentEdges,
            spacingMultiplier,
            showTasks
          );
          return layoutedEdges;
        });
        const { nodes: layoutedNodes } = getLayoutedElements(currentNodes, edges, spacingMultiplier, showTasks);
        return layoutedNodes;
      });
    }, 0);
  }, [setNodes, setEdges, edges, spacingMultiplier, showTasks]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (isCreatingRelation && !node.data.isRelationNode) {
      if (selectedNodesForRelation.includes(node.id)) {
        setSelectedNodesForRelation(prev => prev.filter(id => id !== node.id));
        if (selectedNodesForRelation.length === 2 && selectedNodesForRelation[1] === node.id) {
          setRelationSelectionStep(1);
        } else if (selectedNodesForRelation.length === 1) {
          setRelationSelectionStep(0);
        }
      } else if (selectedNodesForRelation.length < 2) {
        setSelectedNodesForRelation(prev => [...prev, node.id]);
        setRelationSelectionStep(prev => prev + 1);
        
        if (selectedNodesForRelation.length === 1) {
          createRelation(selectedNodesForRelation[0], node.id);
        }
      }
    } else {
      setSelectedNode(node.id);
    }
  }, [isCreatingRelation, selectedNodesForRelation]);

  const createRelation = useCallback((node1Id: string, node2Id: string) => {
    const relationNodeId = `relation-${Date.now()}`;
    
    const node1 = nodes.find(n => n.id === node1Id);
    const node2 = nodes.find(n => n.id === node2Id);
    
    if (!node1 || !node2) return;
    
    const currentNodeWidth = showTasks ? nodeWidthWithTasks : nodeWidth;
    const midX = (node1.position.x + node2.position.x) / 2 + (currentNodeWidth / 2) - (relationNodeWidth / 2);
    const midY = (node1.position.y + node2.position.y) / 2 + (baseNodeHeight / 2) - (relationNodeHeight / 2);
    
    const newRelationNode: Node = {
      id: relationNodeId,
      type: 'relationNode',
      data: {
        description: '',
        isRelationNode: true,
        onPreviewRelation: handlePreviewRelation,
      },
      position: { x: midX, y: midY },
    };

    const leftNode = node1.position.x < node2.position.x ? node1 : node2;
    const rightNode = node1.position.x < node2.position.x ? node2 : node1;

    const edge1: Edge = {
      id: `relation-edge-${Date.now()}-1`,
      source: leftNode.id,
      target: relationNodeId,
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#9333ea', strokeWidth: 2 },
      data: { isRelationEdge: true },
    };

    const edge2: Edge = {
      id: `relation-edge-${Date.now()}-2`,
      source: relationNodeId,
      target: rightNode.id,
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#9333ea', strokeWidth: 2 },
      data: { isRelationEdge: true },
    };

    setNodes((nds) => [...nds, newRelationNode]);
    setEdges((eds) => [...eds, edge1, edge2]);
    
    setIsCreatingRelation(false);
    setSelectedNodesForRelation([]);
    setRelationSelectionStep(0);
  }, [nodes, setNodes, setEdges, showTasks]);

  const handleStartRelationCreation = useCallback(() => {
    setIsCreatingRelation(true);
    setSelectedNodesForRelation([]);
    setRelationSelectionStep(0);
    setSelectedNode(null);
  }, []);

  const handleCancelRelationCreation = useCallback(() => {
    setIsCreatingRelation(false);
    setSelectedNodesForRelation([]);
    setRelationSelectionStep(0);
  }, []);

  const toggleShowRelations = useCallback(() => {
    setShowRelations(prev => !prev);
  }, []);

  const handleAddMembersClick = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNodeId(nodeId);
      setSelectedMembers(node.data.members || []);
      setShowMemberModal(true);
      setSearchQuery('');
    }
  }, [nodes]);

  const toggleShowMembers = useCallback(() => {
    setShowMembers((prev) => {
      const newValue = !prev;
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            showMembers: newValue,
            onAddMembers: handleAddMembersClick,
            onToggleMember: handleToggleMember,
            onPreviewGroup: handlePreviewGroup,
            onPreviewPlayer: handlePreviewPlayer,
            onPreviewTask: handlePreviewTask,
            showTasks: showTasks,
          },
        }))
      );

      setTimeout(() => {
        setNodes((currentNodes) => {
          setEdges((currentEdges) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
              currentNodes,
              currentEdges,
              spacingMultiplier,
              showTasks
            );
            return layoutedEdges;
          });
          const { nodes: layoutedNodes } = getLayoutedElements(currentNodes, edges, spacingMultiplier, showTasks);
          return layoutedNodes;
        });
      }, 0);

      return newValue;
    });
  }, [setNodes, setEdges, edges, handleAddMembersClick, handleToggleMember, handlePreviewGroup, handlePreviewPlayer, handlePreviewTask, spacingMultiplier, showTasks]);

  const toggleShowTasks = useCallback(() => {
    setShowTasks((prev) => {
      const newValue = !prev;
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            showTasks: newValue,
            onToggleMember: handleToggleMember,
            onPreviewGroup: handlePreviewGroup,
            onPreviewPlayer: handlePreviewPlayer,
            onPreviewTask: handlePreviewTask,
          },
        }))
      );

      setTimeout(() => {
        setNodes((currentNodes) => {
          setEdges((currentEdges) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
              currentNodes,
              currentEdges,
              spacingMultiplier,
              newValue
            );
            return layoutedEdges;
          });
          const { nodes: layoutedNodes } = getLayoutedElements(currentNodes, edges, spacingMultiplier, newValue);
          return layoutedNodes;
        });
      }, 0);

      return newValue;
    });
  }, [setNodes, setEdges, edges, handleToggleMember, handlePreviewGroup, handlePreviewPlayer, handlePreviewTask, spacingMultiplier]);

  const applyLayout = useCallback((nodesToLayout: Node[], edgesToLayout: Edge[]) => {
    if (nodesToLayout.length === 0) return;

    const { nodes: layoutedNodes } = getLayoutedElements(
      nodesToLayout,
      edgesToLayout,
      spacingMultiplier,
      showTasks
    );

    setNodes(layoutedNodes);
  }, [setNodes, spacingMultiplier, showTasks]);

  const handleAddRoot = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'orgNode',
      data: {
        label: '',
        members: [],
        showMembers: showMembers,
        showTasks: showTasks,
        onAddMembers: handleAddMembersClick,
        onToggleMember: handleToggleMember,
        onPreviewGroup: handlePreviewGroup,
        onPreviewPlayer: handlePreviewPlayer,
        onPreviewTask: handlePreviewTask,
        isRelationNode: false,
        expandedMembers: new Set(),
      },
      position: { x: 250, y: 50 },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode.id);

    setTimeout(() => {
      setNodes((currentNodes) => {
        applyLayout(currentNodes, edges);
        return currentNodes;
      });
    }, 0);
  }, [setNodes, edges, applyLayout, showMembers, showTasks, handleAddMembersClick, handleToggleMember, handlePreviewGroup, handlePreviewPlayer, handlePreviewTask]);

  const handleAddChild = useCallback(() => {
    if (!selectedNode) {
      alert('Please select a parent node first');
      return;
    }

    const parentNode = nodes.find(n => n.id === selectedNode);
    if (parentNode?.data.isRelationNode) {
      alert('Cannot add child to a relation node');
      return;
    }

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'orgNode',
      data: {
        label: '',
        members: [],
        showMembers: showMembers,
        showTasks: showTasks,
        onAddMembers: handleAddMembersClick,
        onToggleMember: handleToggleMember,
        onPreviewGroup: handlePreviewGroup,
        onPreviewPlayer: handlePreviewPlayer,
        onPreviewTask: handlePreviewTask,
        isRelationNode: false,
        expandedMembers: new Set(),
      },
      position: { x: 250, y: 200 },
    };

    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: selectedNode,
      target: newNode.id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#0091FF', strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setSelectedNode(newNode.id);

    setTimeout(() => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          applyLayout(currentNodes, currentEdges);
          return currentEdges;
        });
        return currentNodes;
      });
    }, 0);
  }, [selectedNode, nodes, setNodes, setEdges, edges, applyLayout, showMembers, showTasks, handleAddMembersClick, handleToggleMember, handlePreviewGroup, handlePreviewPlayer, handlePreviewTask]);

  const handleToggleMemberInModal = (member: Member) => {
    setSelectedMembers((current) => {
      const exists = current.some(m => m.name === member.name);
      if (exists) {
        return current.filter(m => m.name !== member.name);
      } else {
        return [...current, member];
      }
    });
  };

  const handleSaveMembers = () => {
    if (editingNodeId) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === editingNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                members: selectedMembers,
              },
            };
          }
          return node;
        })
      );

      setTimeout(() => {
        setNodes((currentNodes) => {
          setEdges((currentEdges) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
              currentNodes,
              currentEdges,
              spacingMultiplier,
              showTasks
            );
            return layoutedEdges;
          });
          const { nodes: layoutedNodes } = getLayoutedElements(currentNodes, edges, spacingMultiplier, showTasks);
          return layoutedNodes;
        });
      }, 0);
    }

    setShowMemberModal(false);
    setEditingNodeId(null);
    setSelectedMembers([]);
    setSearchQuery('');
  };

  const handleCloseMemberModal = () => {
    setShowMemberModal(false);
    setEditingNodeId(null);
    setSelectedMembers([]);
    setSearchQuery('');
  };

  const handleSpacingChange = useCallback((newMultiplier: number) => {
    setSpacingMultiplier(newMultiplier);

    setTimeout(() => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            currentNodes,
            currentEdges,
            newMultiplier,
            showTasks
          );
          return layoutedEdges;
        });
        const { nodes: layoutedNodes } = getLayoutedElements(currentNodes, edges, newMultiplier, showTasks);
        return layoutedNodes;
      });
    }, 0);
  }, [setNodes, setEdges, edges, showTasks]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const filteredMembers = allAvailableMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalNodes = nodes.filter(n => !n.data.isRelationNode).length;
  const totalConnections = edges.filter(e => !e.data?.isRelationEdge).length;
  const totalMembers = nodes.reduce((sum, node) => sum + (node.data.members?.length || 0), 0);
  const totalRelations = nodes.filter(n => n.data.isRelationNode).length;
  const totalTasks = nodes.reduce((sum, node) => {
    return sum + (node.data.members?.reduce((mSum, member) => mSum + (member.tasks?.length || 0), 0) || 0);
  }, 0);

  const getNodeName = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node?.data.label || 'Unnamed Node';
  };

  const visibleNodes = showRelations ? nodes : nodes.filter(n => !n.data.isRelationNode);
  const visibleEdges = showRelations ? edges : edges.filter(e => !e.data?.isRelationEdge);

  // Get all members with tasks from all nodes for task assignment
  const getAllMembersWithTasks = () => {
    const membersMap = new Map<string, { nodeId: string; nodeName: string; member: Member }>();
    
    nodes.filter(n => !n.data.isRelationNode).forEach(node => {
      node.data.members?.forEach(member => {
        if (member.tasks && member.tasks.length > 0) {
          const key = `${node.id}-${member.name}`;
          membersMap.set(key, {
            nodeId: node.id,
            nodeName: node.data.label || 'Unnamed Node',
            member: member
          });
        }
      });
    });
    
    return Array.from(membersMap.values());
  };

  const handleTaskAssignment = (targetNodeId: string, targetMemberName: string) => {
    if (!taskAssignment) return;

    setNodes((nds) =>
      nds.map((node) => {
        // Remove task from source member
        if (node.id === taskAssignment.sourceNode) {
          return {
            ...node,
            data: {
              ...node.data,
              members: node.data.members?.map(m => 
                m.name === taskAssignment.sourceMember
                  ? { ...m, tasks: m.tasks?.filter(t => t.id !== taskAssignment.task?.id) }
                  : m
              ),
            },
          };
        }
        
        // Add task to target member
        if (node.id === targetNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              members: node.data.members?.map(m =>
                m.name === targetMemberName && taskAssignment.task
                  ? { ...m, tasks: [...(m.tasks || []), taskAssignment.task] }
                  : m
              ),
            },
          };
        }
        
        return node;
      })
    );

    setShowTaskAssignModal(false);
    setTaskAssignment(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="bg-neutral-50 border-b border-neutral-200 p-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-heading-1 text-default-font mb-2">Organigram Builder</h1>
          <p className="text-body text-subtext-color mb-6">
            Build your organizational structure with drag-and-drop, custom relations, and task management
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleAddRoot}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Root Node
              </button>

              <button
                onClick={handleAddChild}
                className="flex items-center gap-2 px-4 py-2 bg-green-button text-white rounded-lg text-body hover:opacity-90 transition-opacity"
                disabled={!selectedNode}
              >
                <Plus className="w-4 h-4" />
                Add Child Node
              </button>

              <button
                onClick={() => applyLayout(nodes, edges)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-200 text-default-font rounded-lg text-body hover:bg-neutral-150 transition-colors"
              >
                Auto Layout
              </button>

              <div className="h-8 w-px bg-neutral-200"></div>

              {!isCreatingRelation ? (
                <button
                  onClick={handleStartRelationCreation}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-body hover:bg-purple-700 transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  Create Relation
                </button>
              ) : (
                <button
                  onClick={handleCancelRelationCreation}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-body hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel Relation
                </button>
              )}

              <button
                onClick={toggleShowRelations}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body transition-colors ${
                  showRelations
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-neutral-100 border border-neutral-200 text-default-font hover:bg-neutral-150'
                }`}
              >
                {showRelations ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Relations
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Relations
                  </>
                )}
              </button>

              <div className="h-8 w-px bg-neutral-200"></div>

              <div className="flex items-center gap-3">
                <label className="text-body text-default-font font-medium">Vertical Spacing:</label>
                <input
                  type="range"
                  min="0.2"
                  max="4"
                  step="0.1"
                  value={spacingMultiplier}
                  onChange={(e) => handleSpacingChange(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <span className="text-body-bold text-brand-600 w-12 text-center">{spacingMultiplier.toFixed(1)}x</span>
              </div>

              <button
                onClick={toggleShowMembers}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body transition-colors ${
                  showMembers
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-neutral-100 border border-neutral-200 text-default-font hover:bg-neutral-150'
                }`}
              >
                {showMembers ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Members
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Members
                  </>
                )}
              </button>

              <button
                onClick={toggleShowTasks}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body transition-colors ${
                  showTasks
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-neutral-100 border border-neutral-200 text-default-font hover:bg-neutral-150'
                }`}
              >
                {showTasks ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Tasks
                  </>
                ) : (
                  <>
                    <ListTodo className="w-4 h-4" />
                    Show Tasks
                  </>
                )}
              </button>

              {showTasks && (
                <button
                  onClick={() => setShowTaskAssignModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-body hover:bg-amber-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Assign Task
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <div className="text-caption text-subtext-color">Nodes</div>
                  <div className="text-body-bold text-default-font">{totalNodes}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-success-50 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-success-600 rounded-full"></div>
                </div>
                <div>
                  <div className="text-caption text-subtext-color">Connections</div>
                  <div className="text-body-bold text-default-font">{totalConnections}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-caption text-subtext-color">Relations</div>
                  <div className="text-body-bold text-default-font">{totalRelations}</div>
                </div>
              </div>

              {showMembers && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-warning-50 rounded-full flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-warning-600" />
                  </div>
                  <div>
                    <div className="text-caption text-subtext-color">Members</div>
                    <div className="text-body-bold text-default-font">{totalMembers}</div>
                  </div>
                </div>
              )}

              {showTasks && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                    <ListTodo className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-caption text-subtext-color">Tasks</div>
                    <div className="text-body-bold text-default-font">{totalTasks}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isCreatingRelation && (
            <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <h3 className="text-body-bold text-purple-900">Creating Relation</h3>
                  <p className="text-caption text-purple-700">
                    {relationSelectionStep === 0 && 'Step 1: Select the first node'}
                    {relationSelectionStep === 1 && `Step 2: Select the second node (First: ${getNodeName(selectedNodesForRelation[0])})`}
                  </p>
                </div>
                {selectedNodesForRelation.length > 0 && (
                  <div className="flex items-center gap-2">
                    {selectedNodesForRelation.map((nodeId, index) => (
                      <div key={nodeId} className="flex items-center gap-2 bg-purple-100 border border-purple-300 rounded-full px-3 py-1.5">
                        <Check className="w-4 h-4 text-purple-600" />
                        <span className="text-caption-bold text-purple-700">{getNodeName(nodeId)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-default-background relative">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-neutral-200">
                <Users className="w-10 h-10 text-subtext-color opacity-50" />
              </div>
              <h3 className="text-heading-3 text-default-font mb-2">No Nodes Yet</h3>
              <p className="text-body text-subtext-color mb-6">
                Start building your organizational chart by adding your first node
              </p>
              <button
                onClick={handleAddRoot}
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add First Node
              </button>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={visibleNodes.map(node => ({
              ...node,
              className: isCreatingRelation && selectedNodesForRelation.includes(node.id) && !node.data.isRelationNode
                ? 'ring-4 ring-purple-400 ring-offset-2'
                : ''
            }))}
            edges={visibleEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#525252" />
            <Controls className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden" />
          </ReactFlow>
        )}
      </div>

      {/* Member Selection Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-neutral-50 border-b border-neutral-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading-2 text-default-font">Add Members to Node</h2>
                <p className="text-body text-subtext-color mt-1">
                  Select members to add to this organizational unit
                </p>
              </div>
              <button
                onClick={handleCloseMemberModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-subtext-color" />
              </button>
            </div>

            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-2">
                <Search className="w-4 h-4 text-subtext-color" />
                <input
                  type="text"
                  placeholder="Search members by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-body text-default-font placeholder:text-subtext-color flex-1"
                />
              </div>

              {selectedMembers.length > 0 && (
                <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-lg">
                  <div className="text-caption-bold text-brand-600 mb-2">
                    Selected: {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.name}
                        className="flex items-center gap-2 bg-neutral-50 border border-brand-200 rounded-full px-3 py-1.5 text-caption-bold text-brand-600"
                      >
                        <UserCheck className="w-3 h-3" />
                        {member.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMembers.map((member) => {
                  const isSelected = selectedMembers.some(m => m.name === member.name);
                  return (
                    <button
                      key={member.name}
                      onClick={() => handleToggleMemberInModal(member)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-brand-50 border-brand-600 shadow-sm'
                          : 'bg-neutral-100 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-caption-bold flex-shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-neutral-200 text-default-font'
                      }`}>
                        {isSelected ? (
                          <UserCheck className="w-5 h-5" />
                        ) : (
                          getInitials(member.name)
                        )}
                      </div> 
                      <div className="flex-1 min-w-0">
                        <div className={`text-body-bold truncate ${
                          isSelected ? 'text-brand-600' : 'text-default-font'
                        }`}>
                          {member.name}
                        </div>
                        <div className="text-caption text-subtext-color truncate">{member.role}</div>
                        {member.tasks && member.tasks.length > 0 && (
                          <div className="text-xs text-emerald-600 font-medium mt-1">
                            {member.tasks.length} task{member.tasks.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </button>
                  ); 
                })}
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-subtext-color mx-auto mb-4 opacity-50" />
                  <p className="text-body text-subtext-color">No members found matching your search.</p>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-200 p-6 flex gap-3">
              <button
                onClick={handleCloseMemberModal}
                className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMembers}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Save Members ({selectedMembers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Assignment Modal */}
      {showTaskAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-neutral-50 border-b border-neutral-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading-2 text-default-font">Assign Task to Member</h2>
                <p className="text-body text-subtext-color mt-1">
                  Select a task from a member and assign it to another member
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTaskAssignModal(false);
                  setTaskAssignment(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-subtext-color" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!taskAssignment ? (
                <div>
                  <h3 className="text-body-bold text-default-font mb-4">Step 1: Select a task to assign</h3>
                  <div className="space-y-4">
                    {getAllMembersWithTasks().map(({ nodeId, nodeName, member }) => (
                      <div key={`${nodeId}-${member.name}`} className="bg-white border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                            <span className="text-brand-600 text-caption-bold">
                              {getInitials(member.name)}
                            </span>
                          </div>
                          <div>
                            <div className="text-body-bold text-default-font">{member.name}</div>
                            <div className="text-caption text-subtext-color">{member.role} • {nodeName}</div>
                          </div>
                        </div>
                        <div className="space-y-2 ml-13">
                          {member.tasks?.map((task) => (
                            <button
                              key={task.id}
                              onClick={() => setTaskAssignment({
                                sourceNode: nodeId,
                                sourceMember: member.name,
                                task: task
                              })}
                              className="w-full text-left bg-neutral-50 border border-neutral-200 rounded-lg p-3 hover:border-brand-600 hover:bg-brand-50 transition-all"
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <div className={`mt-0.5 ${task.status === 'completed' ? 'text-green-600' : task.status === 'in-progress' ? 'text-blue-600' : 'text-amber-600'}`}>
                                  {task.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : task.status === 'in-progress' ? <Clock className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className="text-body text-default-font font-medium">{task.title}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                      {task.priority}
                                    </span>
                                    <span className="text-xs text-subtext-color">{task.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {getAllMembersWithTasks().length === 0 && (
                      <div className="text-center py-12">
                        <ListTodo className="w-12 h-12 text-subtext-color mx-auto mb-4 opacity-50" />
                        <p className="text-body text-subtext-color">No tasks available to assign.</p>
                        <p className="text-caption text-subtext-color mt-1">Add members with tasks first.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5 text-amber-600" />
                      <div className="flex-1">
                        <h3 className="text-body-bold text-amber-900">Selected Task</h3>
                        <p className="text-caption text-amber-700">{taskAssignment.task?.title}</p>
                        <p className="text-caption text-amber-600 mt-1">From: {taskAssignment.sourceMember}</p>
                      </div>
                      <button
                        onClick={() => setTaskAssignment(null)}
                        className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-caption-bold text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        Change Task
                      </button>
                    </div>
                  </div>

                  <h3 className="text-body-bold text-default-font mb-4">Step 2: Select target member</h3>
                  <div className="space-y-4">
                    {nodes.filter(n => !n.data.isRelationNode).map(node => (
                      <div key={node.id}>
                        {node.data.members && node.data.members.length > 0 && (
                          <div className="bg-white border border-neutral-200 rounded-lg p-4">
                            <h4 className="text-body-bold text-default-font mb-3">{node.data.label || 'Unnamed Node'}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {node.data.members.map((member) => {
                                const isSourceMember = node.id === taskAssignment.sourceNode && member.name === taskAssignment.sourceMember;
                                return (
                                  <button
                                    key={member.name}
                                    onClick={() => !isSourceMember && handleTaskAssignment(node.id, member.name)}
                                    disabled={isSourceMember}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                                      isSourceMember
                                        ? 'bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed'
                                        : 'bg-neutral-50 border-neutral-200 hover:border-brand-600 hover:bg-brand-50'
                                    }`}
                                  >
                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                                      <span className="text-brand-600 text-caption-bold">
                                        {getInitials(member.name)}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-body text-default-font font-medium truncate">{member.name}</div>
                                      <div className="text-caption text-subtext-color truncate">{member.role}</div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-200 p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowTaskAssignModal(false);
                  setTaskAssignment(null);
                }}
                className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Preview Modal */}
      <GroupPreviewModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
      />

      {/* Member Preview Modal */}
      <MemberPreviewModal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
      />

      {/* Task Preview Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-heading-2 text-default-font">Task Preview</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-subtext-color" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-body text-default-font">this is the task modal</p>
            </div>
            <div className="border-t border-neutral-200 p-6 flex justify-end">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Relation Preview Modal */}
      {showRelationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-heading-2 text-default-font">Relation Preview</h2>
              <button
                onClick={() => setShowRelationModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-subtext-color" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-body text-default-font">this is the relation modal</p>
            </div>
            <div className="border-t border-neutral-200 p-6 flex justify-end">
              <button
                onClick={() => setShowRelationModal(false)}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}