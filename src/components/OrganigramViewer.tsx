import { useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import dagre from 'dagre';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ListTodo,
  User,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
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
  isRelationNode?: boolean;
  showTasks?: boolean;
  expandedMembers?: Set<string>;
  onMemberClick?: (member: Member, nodeName: string) => void;
  onToggleMember?: (memberName: string) => void;
}

interface RelationNodeData {
  description: string;
  isRelationNode: boolean;
}

const nodeWidth = 250;
const nodeWidthWithTasks = 400;
const baseNodeHeight = 80;
const relationNodeWidth = 200;
const relationNodeHeight = 60;

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'text-green-600';
    case 'in-progress': return 'text-blue-600';
    case 'pending': return 'text-amber-600';
    default: return 'text-gray-600';
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-50 border-green-200';
    case 'in-progress': return 'bg-blue-50 border-blue-200';
    case 'pending': return 'bg-amber-50 border-amber-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'in-progress': return <Clock className="w-3.5 h-3.5" />;
    case 'pending': return <AlertCircle className="w-3.5 h-3.5" />;
    default: return null;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-amber-100 text-amber-700';
    case 'low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getNodeHeight(showTasks: boolean, members: Member[] = [], expandedMembers: Set<string> = new Set()) {
  if (members.length === 0) return baseNodeHeight;

  let height = baseNodeHeight + (members.length * 44) + 16;

  if (showTasks) {
    members.forEach(member => {
      if (expandedMembers.has(member.name)) {
        const taskCount = member.tasks?.length || 0;
        height += (taskCount * 36) + 12;
      }
    });
  }

  return height;
}

function getLayoutedElements(nodes: Node[], edges: Edge[], showTasks: boolean = false) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  const orgNodes = nodes.filter(node => !node.data.isRelationNode);
  const relationNodes = nodes.filter(node => node.data.isRelationNode);

  const currentNodeWidth = showTasks ? nodeWidthWithTasks : nodeWidth;

  const maxHeight = orgNodes.reduce((max, node) => {
    const height = getNodeHeight(
      showTasks,
      node.data.members || [],
      node.data.expandedMembers || new Set()
    );
    return Math.max(max, height);
  }, baseNodeHeight);

  const dynamicRanksep = Math.max(150, maxHeight * 4);
  g.setGraph({ rankdir: 'TB', ranksep: dynamicRanksep, nodesep: 100 });

  orgNodes.forEach((node) => {
    const height = getNodeHeight(
      showTasks,
      node.data.members || [],
      node.data.expandedMembers || new Set()
    );
    g.setNode(node.id, { width: currentNodeWidth, height });
  });

  const orgEdges = edges.filter(edge => {
    const sourceIsOrg = orgNodes.some(n => n.id === edge.source);
    const targetIsOrg = orgNodes.some(n => n.id === edge.target);
    return sourceIsOrg && targetIsOrg && !edge.data?.isRelationEdge;
  });

  orgEdges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedOrgNodes = orgNodes.map((node) => {
    const pos = g.node(node.id);
    const height = getNodeHeight(
      showTasks,
      node.data.members || [],
      node.data.expandedMembers || new Set()
    );
    return {
      ...node,
      position: {
        x: pos.x - currentNodeWidth / 2,
        y: pos.y - height / 2,
      },
      _dagreY: pos.y,
    };
  });

  const rankGroups = new Map<number, typeof layoutedOrgNodes>();
  const tolerance = 10;
  layoutedOrgNodes.forEach((node) => {
    let found = false;
    for (const [rankY, group] of rankGroups.entries()) {
      if (Math.abs((node as any)._dagreY - rankY) < tolerance) {
        group.push(node);
        found = true;
        break;
      }
    }
    if (!found) {
      rankGroups.set((node as any)._dagreY, [node]);
    }
  });

  rankGroups.forEach((group) => {
    const minY = Math.min(...group.map(n => n.position.y));
    group.forEach(node => { node.position.y = minY; });
  });

  const finalOrgNodes: Node[] = layoutedOrgNodes.map(({ _dagreY, ...node }: any) => node);

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
        return { ...relNode, position: { x: midX, y: midY } };
      }
    }
    return relNode;
  });

  return { nodes: [...finalOrgNodes, ...layoutedRelationNodes], edges };
}

function OrgChartNode({ data }: NodeProps<OrgNodeData>) {
  const currentNodeWidth = data.showTasks ? nodeWidthWithTasks : nodeWidth;

  return (
    <div
      className="bg-neutral-50 rounded-lg shadow-md border-2 border-neutral-200"
      style={{ width: currentNodeWidth, minHeight: baseNodeHeight }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-brand-600" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-brand-600" id="bottom" />
      <Handle type="source" position={Position.Left} className="w-3 h-3 bg-purple-600" id="left" />
      <Handle type="target" position={Position.Right} className="w-3 h-3 bg-purple-600" id="right" />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-caption-bold flex-shrink-0">
            {getInitials(data.label) || '?'}
          </div>
          <div className="flex-1 text-body-bold text-default-font">
            {data.label || 'Unnamed'}
          </div>
        </div>

        {data.members && data.members.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-200 space-y-1.5">
            {data.members.map((member, idx) => {
              const taskCount = member.tasks?.length || 0;
              const isExpanded = data.expandedMembers?.has(member.name) || false;

              return (
                <div key={idx} className="space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (data.showTasks && taskCount > 0 && data.onToggleMember) {
                        data.onToggleMember(member.name);
                      } else if (data.onMemberClick) {
                        data.onMemberClick(member, data.label);
                      }
                    }}
                    className="w-full flex items-center gap-2 text-caption hover:bg-brand-50 rounded p-1.5 transition-colors group/member"
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
                    {data.showTasks && taskCount > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-brand-600 font-medium">{taskCount}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-subtext-color" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-subtext-color" />
                        )}
                      </div>
                    )}
                    {!data.showTasks && taskCount > 0 && (
                      <div className="flex items-center gap-1 bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full text-xs font-semibold group-hover/member:bg-brand-200 transition-colors">
                        <ListTodo className="w-3 h-3" />
                        {taskCount}
                      </div>
                    )}
                  </button>

                  {data.showTasks && isExpanded && member.tasks && (
                    <div className="ml-8 space-y-1 mt-1">
                      {member.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-neutral-100 border border-neutral-300 rounded p-2 text-xs hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <div className={`mt-0.5 ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-default-font font-medium truncate">{task.title}</div>
                            </div>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function RelationNode({ data }: NodeProps<RelationNodeData>) {
  return (
    <div
      className="bg-purple-50 rounded-lg shadow-md border-2 border-purple-300"
      style={{ width: relationNodeWidth, height: relationNodeHeight }}
    >
      <Handle type="source" position={Position.Left} className="w-3 h-3 bg-purple-600" id="left" />
      <Handle type="target" position={Position.Right} className="w-3 h-3 bg-purple-600" id="right" />
      <div className="p-3 h-full flex items-center justify-center">
        <div className="text-center text-caption-bold text-purple-700">
          {data.description || 'Relation'}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  orgNode: OrgChartNode,
  relationNode: RelationNode,
};

interface MemberTasksModalProps {
  member: Member;
  nodeName: string;
  onClose: () => void;
}

function MemberTasksModal({ member, nodeName, onClose }: MemberTasksModalProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTasks = (member.tasks || []).filter(t =>
    filterStatus === 'all' ? true : t.status === filterStatus
  );

  const completedCount = (member.tasks || []).filter(t => t.status === 'completed').length;
  const totalCount = (member.tasks || []).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-50 rounded-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center text-white text-lg font-bold">
                {getInitials(member.name)}
              </div>
              <div>
                <h2 className="text-heading-3 text-default-font">{member.name}</h2>
                <p className="text-body text-subtext-color">{member.role}</p>
                <p className="text-caption text-brand-600 mt-0.5">{nodeName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-subtext-color" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-caption text-subtext-color">Progress</span>
                <span className="text-caption-bold text-brand-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-heading-3 text-default-font">{completedCount}/{totalCount}</div>
              <div className="text-caption text-subtext-color">tasks done</div>
            </div>
          </div>

          <div className="flex gap-1 bg-neutral-200 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'completed', label: 'Done' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filterStatus === f.key
                    ? 'bg-neutral-50 text-brand-600 shadow-sm'
                    : 'text-subtext-color hover:text-default-font'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="w-10 h-10 text-subtext-color mx-auto mb-3 opacity-40" />
              <p className="text-body text-subtext-color">
                {totalCount === 0 ? 'No tasks assigned' : 'No tasks match this filter'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-sm ${getStatusBg(task.status)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-body text-default-font font-medium">{task.title}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-caption text-subtext-color flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                      <span className={`text-caption font-medium capitalize ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-neutral-200 border border-neutral-300 rounded-lg text-body text-default-font hover:bg-neutral-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface OrganigramViewerProps {
  nodes: Node[];
  edges: Edge[];
  showMembers?: boolean;
}

export function OrganigramViewer({ nodes, edges }: OrganigramViewerProps) {
  const [selectedMember, setSelectedMember] = useState<{ member: Member; nodeName: string } | null>(null);
  const [showTasks, setShowTasks] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState<Map<string, Set<string>>>(new Map());

  const handleMemberClick = (member: Member, nodeName: string) => {
    setSelectedMember({ member, nodeName });
  };

  const handleToggleMember = (nodeId: string, memberName: string) => {
    setExpandedMembers(prev => {
      const newMap = new Map(prev);
      const nodeExpanded = newMap.get(nodeId) || new Set();
      const newSet = new Set(nodeExpanded);

      if (newSet.has(memberName)) {
        newSet.delete(memberName);
      } else {
        newSet.add(memberName);
      }

      newMap.set(nodeId, newSet);
      return newMap;
    });
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (nodes.length === 0) return { nodes: [], edges: [] };

    const preparedNodes = nodes.map(node => {
      if (node.data.isRelationNode) return node;
      return {
        ...node,
        data: {
          ...node.data,
          showMembers: true,
          showTasks,
          expandedMembers: expandedMembers.get(node.id) || new Set(),
          onMemberClick: handleMemberClick,
          onToggleMember: (memberName: string) => handleToggleMember(node.id, memberName),
        },
      };
    });

    return getLayoutedElements(preparedNodes, edges, showTasks);
  }, [nodes, edges, showTasks, expandedMembers]);

  const displayNodes = layoutedNodes.map(node => {
    if (node.data.isRelationNode) return node;
    return {
      ...node,
      data: {
        ...node.data,
        showMembers: true,
        showTasks,
        expandedMembers: expandedMembers.get(node.id) || new Set(),
        onMemberClick: handleMemberClick,
        onToggleMember: (memberName: string) => handleToggleMember(node.id, memberName),
      },
    };
  });

  return (
    <div className="w-full h-full relative">
      {nodes.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <User className="w-12 h-12 text-subtext-color mx-auto mb-3 opacity-40" />
            <div className="text-heading-3 text-subtext-color mb-2">No Organigram Data</div>
            <p className="text-body text-subtext-color">
              Build your organigram in the Organigram Builder first
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setShowTasks(!showTasks)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body transition-colors shadow-md ${
                showTasks
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-neutral-50 border border-neutral-200 text-default-font hover:bg-neutral-100'
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
          </div>

          <ReactFlow
            nodes={displayNodes}
            edges={layoutedEdges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={true}
            zoomOnScroll={true}
            fitView
            attributionPosition="bottom-left"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#525252" />
            <Controls className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden" />
          </ReactFlow>
        </>
      )}

      {selectedMember && (
        <MemberTasksModal
          member={selectedMember.member}
          nodeName={selectedMember.nodeName}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
