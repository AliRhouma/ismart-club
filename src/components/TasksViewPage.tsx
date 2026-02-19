import { useState, useMemo, useEffect } from 'react';
import {
  Grid3x3,
  Folder,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Users,
  Activity,
  ClipboardList,
  CheckCircle2,
  Circle,
  Filter,
  UserCheck,
  UserX,
  List,
  X,
  Building2,
  Plus,
  Edit3,
  Calendar,
  Clock,
  MoreVertical,
  Paperclip,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Code,
  Megaphone,
  Wrench,
  GraduationCap,
  Flag,
  LayoutList,
  PlayCircle,
  PauseCircle,
  Loader,
  Search,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';
import { useOrganigram } from '../contexts/OrganigramContext';
import { OrganigramViewer } from './OrganigramViewer';
import { AddProjectModal } from './AddProjectModal';
import { ProjectDetailModal } from './ProjectDetailModal';
import { AddTaskModal } from './AddTaskModal';

// ─────────────────────────────────────────────────────
// Org Members Data (departments + members for picker)
// ─────────────────────────────────────────────────────
const orgMembersData = [
  {
    id: 'dept-medical',
    name: 'Medical Department',
    icon: Activity,
    color: 'error-600',
    members: [
      { id: 'm1', name: 'Dr. Ana Martinez', role: 'Head Physician', initials: 'AM', color: 'error-600' },
      { id: 'm2', name: 'Dr. James Chen', role: 'Sports Doctor', initials: 'JC', color: 'error-600' },
      { id: 'm3', name: 'Sofia Rodriguez', role: 'Senior Nurse', initials: 'SR', color: 'error-600' },
      { id: 'm4', name: 'Leo Thompson', role: 'Physiotherapist', initials: 'LT', color: 'error-600' },
      { id: 'm5', name: 'Nutrition Team', role: 'Nutrition Department', initials: 'NT', color: 'error-600' },
    ]
  },
  {
    id: 'dept-coaching',
    name: 'Coaching Staff',
    icon: Trophy,
    color: 'brand-600',
    members: [
      { id: 'm6', name: 'Head Coach', role: 'Head Coach', initials: 'HC', color: 'brand-600' },
      { id: 'm7', name: 'Assistant Coach', role: 'Assistant Coach', initials: 'AC', color: 'brand-600' },
      { id: 'm8', name: 'Fitness Coach', role: 'Fitness & Conditioning', initials: 'FC', color: 'brand-600' },
      { id: 'm9', name: 'Marco Bianchi', role: 'Video Analyst', initials: 'MB', color: 'brand-600' },
    ]
  },
  {
    id: 'dept-performance',
    name: 'Performance Team',
    icon: TrendingUp,
    color: 'success-700',
    members: [
      { id: 'm10', name: 'Dr. Lena Park', role: 'Sports Scientist', initials: 'LP', color: 'success-700' },
      { id: 'm11', name: 'Marcus White', role: 'Data Analyst', initials: 'MW', color: 'success-700' },
      { id: 'm12', name: 'Ryan Johnson', role: 'Strength Coach', initials: 'RJ', color: 'success-700' },
    ]
  },
  {
    id: 'dept-eu-scouts',
    name: 'European Scouts',
    icon: Flag,
    color: 'warning-800',
    members: [
      { id: 'm13', name: 'Spain Scout', role: 'La Liga & Iberian Peninsula', initials: 'SS', color: 'warning-800' },
      { id: 'm14', name: 'Germany Scout', role: 'Bundesliga', initials: 'GS', color: 'warning-800' },
      { id: 'm15', name: 'Paul Dubois', role: 'Ligue 1 Scout', initials: 'PD', color: 'warning-800' },
      { id: 'm16', name: 'Italy Scout', role: 'Serie A', initials: 'IS', color: 'warning-800' },
    ]
  },
  {
    id: 'dept-am-scouts',
    name: 'Americas Scouts',
    icon: Flag,
    color: 'special-colors-200',
    members: [
      { id: 'm17', name: 'Brazil Scout', role: 'Brazilian League', initials: 'BS', color: 'special-colors-200' },
      { id: 'm18', name: 'MLS Scout', role: 'Major League Soccer', initials: 'MS', color: 'special-colors-200' },
      { id: 'm19', name: 'Carlos Gomez', role: 'Argentina & Chile', initials: 'CG', color: 'special-colors-200' },
    ]
  },
  {
    id: 'dept-analytics',
    name: 'Analytics Team',
    icon: TrendingUp,
    color: 'brand-500',
    members: [
      { id: 'm20', name: 'Taylor Reid', role: 'Head of Analytics', initials: 'TR', color: 'brand-500' },
      { id: 'm21', name: 'Data Scientist White', role: 'ML Engineer', initials: 'DW', color: 'brand-500' },
      { id: 'm22', name: 'Alex Novak', role: 'Performance Analyst', initials: 'AN', color: 'brand-500' },
    ]
  },
];

// ─────────────────────────────────────────────────────
// Projects Data (with subtasks added to tasks)
// ─────────────────────────────────────────────────────
const projectsData = {
  'first-team': {
    id: 'first-team',
    name: 'First Team Ops',
    icon: Trophy,
    color: 'brand-600',
    departments: ['Medical Department', 'Coaching Staff', 'Performance Team'],
    subProjects: {
      'medical': {
        id: 'medical',
        name: 'Medical & Rehab',
        icon: Activity,
        assignedTo: 'Medical Department',
        tasks: [
          {
            id: 'task-1',
            name: 'Player Recovery Logs',
            completed: true,
            assignedTo: 'Dr. Ana Martinez',
            subtasks: [
              { id: 'st-1-1', name: 'Compile weekly recovery data', completed: true, assignee: 'Dr. Ana Martinez' },
              { id: 'st-1-2', name: 'Update player status dashboard', completed: true, assignee: 'Leo Thompson' },
              { id: 'st-1-3', name: 'Send report to coaching staff', completed: true, assignee: 'Dr. Ana Martinez' },
            ]
          },
          {
            id: 'task-2',
            name: 'Nutrition Plans',
            completed: true,
            assignedTo: 'Nutrition Team',
            subtasks: [
              { id: 'st-2-1', name: 'Individual player assessments', completed: true, assignee: 'Nutrition Team' },
              { id: 'st-2-2', name: 'Matchday meal planning', completed: true, assignee: 'Nutrition Team' },
            ]
          },
          {
            id: 'task-3',
            name: 'Injury Assessment Reports',
            completed: false,
            assignedTo: 'Dr. Ana Martinez',
            subtasks: [
              { id: 'st-3-1', name: 'Review MRI scans for 3 players', completed: true, assignee: 'Dr. James Chen' },
              { id: 'st-3-2', name: 'Update rehab timelines', completed: false, assignee: 'Leo Thompson' },
              { id: 'st-3-3', name: 'Consult with Performance Team', completed: false, assignee: null },
              { id: 'st-3-4', name: 'Submit final report', completed: false, assignee: null },
            ]
          },
          {
            id: 'task-10',
            name: 'Update Medical Equipment Inventory',
            completed: false,
            assignedTo: null,
            subtasks: [
              { id: 'st-10-1', name: 'Audit current equipment stock', completed: false, assignee: null },
              { id: 'st-10-2', name: 'Order missing supplies', completed: false, assignee: null },
            ]
          }
        ]
      },
      'training': {
        id: 'training',
        name: 'Training Drills',
        icon: Users,
        assignedTo: 'Coaching Staff',
        tasks: [
          {
            id: 'task-4',
            name: 'Weekly Training Schedule',
            completed: true,
            assignedTo: 'Head Coach',
            subtasks: [
              { id: 'st-4-1', name: 'Plan Monday session', completed: true, assignee: 'Head Coach' },
              { id: 'st-4-2', name: 'Plan tactical sessions', completed: true, assignee: 'Assistant Coach' },
              { id: 'st-4-3', name: 'Coordinate with Medical clearances', completed: true, assignee: 'Head Coach' },
            ]
          },
          {
            id: 'task-5',
            name: 'Tactical Sessions',
            completed: false,
            assignedTo: 'Assistant Coach',
            subtasks: [
              { id: 'st-5-1', name: 'Prepare defensive shape drills', completed: true, assignee: 'Assistant Coach' },
              { id: 'st-5-2', name: 'Set-piece routines', completed: false, assignee: 'Assistant Coach' },
              { id: 'st-5-3', name: 'Video analysis review', completed: false, assignee: 'Marco Bianchi' },
            ]
          },
          {
            id: 'task-6',
            name: 'Fitness Assessments',
            completed: false,
            assignedTo: 'Fitness Coach',
            subtasks: [
              { id: 'st-6-1', name: 'VO2 max testing', completed: false, assignee: 'Fitness Coach' },
              { id: 'st-6-2', name: 'Speed & agility metrics', completed: false, assignee: 'Fitness Coach' },
              { id: 'st-6-3', name: 'Share data with Analytics Team', completed: false, assignee: null },
            ]
          },
          {
            id: 'task-11',
            name: 'Design New Warm-up Routine',
            completed: false,
            assignedTo: null,
            subtasks: [
              { id: 'st-11-1', name: 'Research modern warm-up methods', completed: false, assignee: null },
              { id: 'st-11-2', name: 'Create drill sequence', completed: false, assignee: null },
            ]
          },
          {
            id: 'task-12',
            name: 'Review Video Analysis Software',
            completed: false,
            assignedTo: null,
            subtasks: [
              { id: 'st-12-1', name: 'Evaluate 3 software options', completed: false, assignee: null },
              { id: 'st-12-2', name: 'Present findings to Head Coach', completed: false, assignee: null },
            ]
          }
        ]
      }
    }
  },
  'scouting': {
    id: 'scouting',
    name: 'Global Scouting',
    icon: Users,
    color: 'warning-800',
    departments: ['European Scouts', 'Americas Scouts', 'Analytics Team'],
    subProjects: {
      'europe': {
        id: 'europe',
        name: 'European Scouting',
        icon: ClipboardList,
        assignedTo: 'European Scouts',
        tasks: [
          {
            id: 'task-7',
            name: 'La Liga Target List',
            completed: true,
            assignedTo: 'Spain Scout',
            subtasks: [
              { id: 'st-7-1', name: 'Identify top 10 targets', completed: true, assignee: 'Spain Scout' },
              { id: 'st-7-2', name: 'Compile scouting reports', completed: true, assignee: 'Spain Scout' },
              { id: 'st-7-3', name: 'Valuation analysis', completed: true, assignee: 'Taylor Reid' },
            ]
          },
          {
            id: 'task-8',
            name: 'Bundesliga Prospects',
            completed: false,
            assignedTo: 'Germany Scout',
            subtasks: [
              { id: 'st-8-1', name: 'U23 player screening', completed: true, assignee: 'Germany Scout' },
              { id: 'st-8-2', name: 'Live match attendance', completed: false, assignee: 'Germany Scout' },
              { id: 'st-8-3', name: 'Statistical deep-dive', completed: false, assignee: null },
            ]
          },
          {
            id: 'task-13',
            name: 'Serie A Youth Talents',
            completed: false,
            assignedTo: null,
            subtasks: [
              { id: 'st-13-1', name: 'Primavera league analysis', completed: false, assignee: null },
              { id: 'st-13-2', name: 'Contact agent network', completed: false, assignee: null },
            ]
          }
        ]
      },
      'americas': {
        id: 'americas',
        name: 'Americas Scouting',
        icon: ClipboardList,
        assignedTo: 'Americas Scouts',
        tasks: [
          {
            id: 'task-14',
            name: 'MLS Rising Stars',
            completed: false,
            assignedTo: null,
            subtasks: [
              { id: 'st-14-1', name: 'Q1 match reports', completed: false, assignee: null },
              { id: 'st-14-2', name: 'Identify transfer targets', completed: false, assignee: null },
            ]
          },
          {
            id: 'task-15',
            name: 'Brazilian League Analysis',
            completed: false,
            assignedTo: null,
            subtasks: [
              { id: 'st-15-1', name: 'Série A player database update', completed: false, assignee: 'Brazil Scout' },
              { id: 'st-15-2', name: 'Video compilation — top 5 targets', completed: false, assignee: null },
              { id: 'st-15-3', name: 'Cost analysis report', completed: false, assignee: null },
            ]
          }
        ]
      }
    }
  }
};

// ─────────────────────────────────────────────────────
// Task Edit Modal
// ─────────────────────────────────────────────────────
interface SubTask {
  id: string;
  name: string;
  completed: boolean;
  assignee: string | null;
}

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  subProjectName: string;
  onSave: (updatedTask: any) => void;
}

function TaskEditModal({ isOpen, onClose, task, subProjectName, onSave }: TaskEditModalProps) {
  const [taskName, setTaskName] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [taskAssignee, setTaskAssignee] = useState<string | null>(null);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskValue, setEditingSubtaskValue] = useState('');

  // Member picker state
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [assigningFor, setAssigningFor] = useState<'task' | string | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});
  const [memberSearch, setMemberSearch] = useState('');

  // Reset state when task changes
  useEffect(() => {
    if (task) {
      setTaskName(task.name || '');
      setTaskCompleted(task.completed || false);
      setTaskAssignee(task.assignedTo || null);
      setSubtasks(task.subtasks ? task.subtasks.map((st: any) => ({ ...st })) : []);
      setShowMemberPicker(false);
      setAssigningFor(null);
      setNewSubtaskName('');
      setEditingSubtaskId(null);
      setMemberSearch('');
      // Default all depts expanded
      const allExpanded: Record<string, boolean> = {};
      orgMembersData.forEach(d => { allExpanded[d.id] = true; });
      setExpandedDepts(allExpanded);
    }
  }, [task?.id]);

  const openMemberPicker = (forTarget: 'task' | string) => {
    setAssigningFor(forTarget);
    setShowMemberPicker(true);
    setMemberSearch('');
  };

  const selectMember = (memberName: string) => {
    if (assigningFor === 'task') {
      setTaskAssignee(memberName);
    } else {
      setSubtasks(prev =>
        prev.map(st => st.id === assigningFor ? { ...st, assignee: memberName } : st)
      );
    }
    setShowMemberPicker(false);
    setAssigningFor(null);
  };

  const removeAssignment = () => {
    if (assigningFor === 'task') {
      setTaskAssignee(null);
    } else {
      setSubtasks(prev =>
        prev.map(st => st.id === assigningFor ? { ...st, assignee: null } : st)
      );
    }
    setShowMemberPicker(false);
    setAssigningFor(null);
  };

  const addSubtask = () => {
    if (!newSubtaskName.trim()) return;
    setSubtasks(prev => [
      ...prev,
      { id: `new-${Date.now()}`, name: newSubtaskName.trim(), completed: false, assignee: null }
    ]);
    setNewSubtaskName('');
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(st => st.id !== id));
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const startEditSubtask = (st: SubTask) => {
    setEditingSubtaskId(st.id);
    setEditingSubtaskValue(st.name);
  };

  const commitSubtaskEdit = (id: string) => {
    if (editingSubtaskValue.trim()) {
      setSubtasks(prev => prev.map(st => st.id === id ? { ...st, name: editingSubtaskValue.trim() } : st));
    }
    setEditingSubtaskId(null);
  };

  const handleSave = () => {
    onSave({ ...task, name: taskName, completed: taskCompleted, assignedTo: taskAssignee, subtasks });
    onClose();
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const unassignedSubtasks = subtasks.filter(s => !s.assignee).length;

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
      <div
        className="bg-neutral-50 border border-neutral-border rounded-xl shadow-overlay w-full max-w-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-neutral-border flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-subtext-color bg-neutral-100 px-2.5 py-1 rounded-md">
                {subProjectName}
              </span>
              {!taskCompleted ? (
                <span className="text-xs font-medium text-brand-600 bg-brand-50 border border-brand-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Zap size={11} /> In Progress
                </span>
              ) : (
                <span className="text-xs font-medium text-success-700 bg-success-50 border border-success-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 size={11} /> Completed
                </span>
              )}
              {unassignedSubtasks > 0 && !showMemberPicker && (
                <span className="text-xs font-medium text-warning-800 bg-warning-50 border border-warning-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <AlertCircle size={11} /> {unassignedSubtasks} unassigned
                </span>
              )}
            </div>
            <h2 className="text-heading-2 text-default-font">
              {showMemberPicker ? (
                <span className="flex items-center gap-2">
                  <span className="text-subtext-color font-normal">Assign Member</span>
                </span>
              ) : 'Edit Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-subtext-color hover:text-default-font ml-4 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(82,82,82) rgb(24,24,24)' }}>

          {/* ══════════════ MEMBER PICKER PANEL ══════════════ */}
          {showMemberPicker ? (
            <div className="p-6">

              {/* Back button */}
              <button
                onClick={() => { setShowMemberPicker(false); setAssigningFor(null); }}
                className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-5 transition-colors group"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-body-bold">Back to Task</span>
              </button>

              {/* Context banner */}
              <div className="bg-neutral-100 border border-neutral-border rounded-lg px-4 py-3 mb-5">
                <p className="text-caption text-subtext-color mb-0.5">Assigning</p>
                <p className="text-body-bold text-default-font">
                  {assigningFor === 'task'
                    ? `Task: ${taskName}`
                    : `Subtask: ${subtasks.find(s => s.id === assigningFor)?.name}`}
                </p>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-color" />
                <input
                  autoFocus
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search by name or role..."
                  className="w-full bg-neutral-100 border border-neutral-border text-default-font text-body pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                />
                {memberSearch && (
                  <button onClick={() => setMemberSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext-color hover:text-default-font">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Remove assignment option */}
              <button
                onClick={removeAssignment}
                className="w-full flex items-center gap-3 p-3 mb-4 rounded-lg border border-dashed border-neutral-300 hover:border-warning-800 hover:bg-neutral-100 text-subtext-color hover:text-warning-800 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center group-hover:bg-warning-50 transition-colors">
                  <UserX size={15} />
                </div>
                <div className="text-left">
                  <p className="text-body-bold">Remove Assignment</p>
                  <p className="text-caption opacity-70">Leave this item unassigned</p>
                </div>
              </button>

              {/* Department list */}
              <div className="space-y-2">
                {orgMembersData.map(dept => {
                  const filteredMembers = memberSearch
                    ? dept.members.filter(m =>
                        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                        m.role.toLowerCase().includes(memberSearch.toLowerCase())
                      )
                    : dept.members;

                  if (memberSearch && filteredMembers.length === 0) return null;

                  const DeptIcon = dept.icon;
                  const isExpanded = expandedDepts[dept.id] !== false;

                  const currentAssignee = assigningFor === 'task'
                    ? taskAssignee
                    : subtasks.find(st => st.id === assigningFor)?.assignee;

                  return (
                    <div key={dept.id} className="border border-neutral-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedDepts(prev => ({ ...prev, [dept.id]: !isExpanded }))}
                        className="w-full flex items-center justify-between p-3 bg-neutral-100 hover:bg-neutral-150 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <DeptIcon size={15} className={`text-${dept.color}`} />
                          <span className="text-body-bold text-default-font">{dept.name}</span>
                          <span className="text-caption text-subtext-color bg-neutral-200 px-1.5 py-0.5 rounded">
                            {filteredMembers.length}
                          </span>
                        </div>
                        {isExpanded
                          ? <ChevronDown size={15} className="text-subtext-color" />
                          : <ChevronRight size={15} className="text-subtext-color" />
                        }
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-neutral-border">
                          {filteredMembers.map(member => {
                            const isSelected = currentAssignee === member.name;
                            return (
                              <button
                                key={member.id}
                                onClick={() => selectMember(member.name)}
                                className={`w-full flex items-center gap-3 p-3 transition-all ${
                                  isSelected
                                    ? 'bg-brand-50 border-l-2 border-brand-600'
                                    : 'hover:bg-neutral-100 border-l-2 border-transparent'
                                }`}
                              >
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-caption-bold text-neutral-0 flex-shrink-0"
                                  style={{ backgroundColor: isSelected ? 'rgb(0, 145, 255)' : undefined }}
                                >
                                  {!isSelected && (
                                    <div className={`w-9 h-9 rounded-full bg-${member.color} bg-opacity-80 flex items-center justify-center text-caption-bold text-neutral-0`}>
                                      {member.initials}
                                    </div>
                                  )}
                                  {isSelected && member.initials}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className={`text-body-bold ${isSelected ? 'text-brand-600' : 'text-default-font'}`}>
                                    {member.name}
                                  </p>
                                  <p className="text-caption text-subtext-color">{member.role}</p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 size={16} className="text-brand-600 flex-shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          ) : (
          /* ══════════════ MAIN TASK FORM ══════════════ */
            <div className="p-6 space-y-6">

              {/* Task Name */}
              <div>
                <label className="text-caption-bold text-subtext-color uppercase tracking-wider block mb-2">
                  Task Name
                </label>
                <input
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  className="w-full bg-neutral-100 border border-neutral-border text-default-font text-body-bold px-4 py-3 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-neutral-0 transition-all placeholder-neutral-400"
                  placeholder="Task name..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-caption-bold text-subtext-color uppercase tracking-wider block mb-2">
                  Status
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTaskCompleted(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                      !taskCompleted
                        ? 'border-brand-600 bg-brand-50 text-brand-600'
                        : 'border-neutral-border text-subtext-color hover:border-neutral-400 hover:text-default-font'
                    }`}
                  >
                    <Zap size={15} />
                    <span className="text-body-bold">In Progress</span>
                  </button>
                  <button
                    onClick={() => setTaskCompleted(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                      taskCompleted
                        ? 'border-success-700 bg-success-50 text-success-700'
                        : 'border-neutral-border text-subtext-color hover:border-neutral-400 hover:text-default-font'
                    }`}
                  >
                    <CheckCircle2 size={15} />
                    <span className="text-body-bold">Completed</span>
                  </button>
                </div>
              </div>

              {/* Task Assignee */}
              <div>
                <label className="text-caption-bold text-subtext-color uppercase tracking-wider block mb-2">
                  Task Assignee
                </label>
                <div className="flex items-center justify-between bg-neutral-100 border border-neutral-border rounded-lg px-4 py-3 hover:border-neutral-400 transition-colors">
                  {taskAssignee ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-neutral-0 text-caption-bold flex-shrink-0">
                        {taskAssignee.charAt(0)}
                      </div>
                      <div>
                        <p className="text-body-bold text-default-font">{taskAssignee}</p>
                        <p className="text-caption text-subtext-color">
                          {orgMembersData.flatMap(d => d.members).find(m => m.name === taskAssignee)?.role || 'Staff Member'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-warning-800">
                      <AlertCircle size={16} />
                      <span className="text-body">Unassigned</span>
                    </div>
                  )}
                  <button
                    onClick={() => openMemberPicker('task')}
                    className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-body-bold transition-colors ml-4 flex-shrink-0"
                  >
                    {taskAssignee ? 'Reassign' : 'Assign'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-caption-bold text-subtext-color uppercase tracking-wider">
                    Subtasks
                  </label>
                  {totalCount > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-caption text-subtext-color">{completedCount}/{totalCount}</span>
                      <div className="w-24 bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-caption-bold text-brand-600">{progressPct}%</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  {subtasks.map(subtask => (
                    <div
                      key={subtask.id}
                      className={`rounded-lg border transition-colors ${
                        !subtask.assignee
                          ? 'border-warning-800 border-opacity-40 bg-neutral-100'
                          : 'border-neutral-border bg-neutral-100 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 p-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleSubtask(subtask.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {subtask.completed
                            ? <CheckCircle2 size={16} className="text-success-700" />
                            : <Circle size={16} className="text-neutral-400 hover:text-brand-600 transition-colors" />
                          }
                        </button>

                        {/* Name + Assignee */}
                        <div className="flex-1 min-w-0">
                          {editingSubtaskId === subtask.id ? (
                            <input
                              autoFocus
                              value={editingSubtaskValue}
                              onChange={e => setEditingSubtaskValue(e.target.value)}
                              onBlur={() => commitSubtaskEdit(subtask.id)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') commitSubtaskEdit(subtask.id);
                                if (e.key === 'Escape') setEditingSubtaskId(null);
                              }}
                              className="w-full bg-neutral-200 text-default-font text-body px-2.5 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-600 border border-brand-600"
                            />
                          ) : (
                            <div
                              className={`text-body cursor-text ${subtask.completed ? 'line-through text-subtext-color' : 'text-default-font'}`}
                              onDoubleClick={() => startEditSubtask(subtask)}
                              title="Double-click to edit"
                            >
                              {subtask.name}
                            </div>
                          )}

                          {/* Subtask assignee row */}
                          <div className="flex items-center justify-between mt-1.5 gap-2">
                            <div className="flex items-center gap-1.5">
                              {subtask.assignee ? (
                                <>
                                  <div className="w-5 h-5 rounded-full bg-brand-400 flex items-center justify-center text-neutral-0 text-xs font-bold flex-shrink-0">
                                    {subtask.assignee.charAt(0)}
                                  </div>
                                  <span className="text-caption text-subtext-color truncate">
                                    {subtask.assignee}
                                  </span>
                                </>
                              ) : (
                                <span className="text-caption text-warning-800 flex items-center gap-1">
                                  <AlertCircle size={11} />
                                  Unassigned
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => openMemberPicker(subtask.id)}
                              className="text-caption text-brand-600 hover:text-brand-700 transition-colors flex-shrink-0 flex items-center gap-0.5"
                            >
                              {subtask.assignee ? 'Reassign' : 'Assign'}
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
                          <button
                            onClick={() => startEditSubtask(subtask)}
                            className="p-1.5 hover:bg-neutral-200 rounded transition-colors"
                            title="Edit name"
                          >
                            <Edit3 size={13} className="text-neutral-400 hover:text-default-font" />
                          </button>
                          <button
                            onClick={() => deleteSubtask(subtask.id)}
                            className="p-1.5 hover:bg-error-100 rounded transition-colors"
                            title="Delete subtask"
                          >
                            <Trash2 size={13} className="text-neutral-400 hover:text-error-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {subtasks.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-neutral-300 rounded-lg">
                      <p className="text-caption text-subtext-color">No subtasks yet — add one below</p>
                    </div>
                  )}
                </div>

                {/* Add Subtask Row */}
                <div className="flex gap-2">
                  <input
                    value={newSubtaskName}
                    onChange={e => setNewSubtaskName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSubtask()}
                    placeholder="New subtask name... (press Enter)"
                    className="flex-1 bg-neutral-100 border border-dashed border-neutral-300 text-default-font text-body px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-600 focus:border-solid transition-all placeholder-neutral-400"
                  />
                  <button
                    onClick={addSubtask}
                    disabled={!newSubtaskName.trim()}
                    className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-0 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={16} />
                    <span className="text-body-bold">Add</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!showMemberPicker && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-border bg-neutral-50 flex-shrink-0">
            <div className="text-caption text-subtext-color">
              {unassignedSubtasks > 0
                ? <span className="flex items-center gap-1.5 text-warning-800"><AlertCircle size={13} /> {unassignedSubtasks} subtask{unassignedSubtasks > 1 ? 's' : ''} unassigned</span>
                : <span className="flex items-center gap-1.5 text-success-700"><CheckCircle2 size={13} /> All assigned</span>
              }
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-subtext-color hover:text-default-font hover:bg-neutral-100 rounded-lg transition-colors text-body-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-neutral-0 rounded-lg transition-colors text-body-bold"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────────────────
const calculateProgress = (tasks: any[]) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
};

const filterTasks = (
  tasks: any[],
  filter: 'all' | 'assigned' | 'unassigned',
  specificAssignee: string | null
) => {
  let filtered = tasks;
  if (filter === 'assigned') filtered = filtered.filter(t => t.assignedTo !== null);
  else if (filter === 'unassigned') filtered = filtered.filter(t => t.assignedTo === null);
  if (specificAssignee) filtered = filtered.filter(t => t.assignedTo === specificAssignee);
  return filtered;
};

// ─────────────────────────────────────────────────────
// Card / Kanban data (unchanged from original)
// ─────────────────────────────────────────────────────
const cardProjectsData = [
  {
    id: 'proj-1', title: 'Website Redesign', description: 'Complete overhaul of club website with modern design',
    icon: Code, color: 'brand-600', status: 'in-progress', priority: 'high', progress: 65,
    dueDate: '2026-03-15', team: ['Sarah Johnson', 'Mike Chen', 'Emma Davis'],
    tasks: [
      { id: 't1', title: 'Homepage Design', status: 'completed', assignee: 'Sarah Johnson', subtasks: [{ id: 'st1', title: 'Create wireframes', completed: true }, { id: 'st2', title: 'Design hero section', completed: true }, { id: 'st3', title: 'Mobile responsive layout', completed: true }] },
      { id: 't2', title: 'Player Profiles Section', status: 'in-progress', assignee: 'Mike Chen', subtasks: [{ id: 'st4', title: 'Database schema', completed: true }, { id: 'st5', title: 'Profile card component', completed: true }, { id: 'st6', title: 'Stats integration', completed: false }] },
      { id: 't3', title: 'News & Media Hub', status: 'todo', assignee: null, subtasks: [{ id: 'st7', title: 'Content management setup', completed: false }, { id: 'st8', title: 'Video player integration', completed: false }] },
      { id: 't4', title: 'Ticket Booking System', status: 'in-progress', assignee: 'Emma Davis', subtasks: [{ id: 'st9', title: 'Payment gateway integration', completed: true }, { id: 'st10', title: 'Seat selection UI', completed: false }] }
    ],
    attachments: 12, comments: 24
  },
  {
    id: 'proj-2', title: 'Marketing Campaign Q1', description: 'Season ticket renewal and new sponsor announcements',
    icon: Megaphone, color: 'warning-800', status: 'in-progress', priority: 'urgent', progress: 45,
    dueDate: '2026-02-28', team: ['Alex Rivera', 'Lisa Park', 'Tom Bradley'],
    tasks: [
      { id: 't5', title: 'Social Media Strategy', status: 'in-progress', assignee: 'Lisa Park', subtasks: [{ id: 'st11', title: 'Content calendar', completed: true }, { id: 'st12', title: 'Video teasers production', completed: false }, { id: 'st13', title: 'Influencer partnerships', completed: false }] },
      { id: 't6', title: 'Email Campaign', status: 'completed', assignee: 'Alex Rivera', subtasks: [{ id: 'st14', title: 'Template design', completed: true }, { id: 'st15', title: 'Segment audience', completed: true }, { id: 'st16', title: 'A/B testing', completed: true }] },
      { id: 't7', title: 'Billboard Advertising', status: 'todo', assignee: 'Tom Bradley', subtasks: [{ id: 'st17', title: 'Location scouting', completed: false }, { id: 'st18', title: 'Design concepts', completed: false }] }
    ],
    attachments: 8, comments: 31
  },
  {
    id: 'proj-3', title: 'Mobile App Development', description: 'Native iOS and Android app for fans',
    icon: Target, color: 'success-700', status: 'planning', priority: 'medium', progress: 20,
    dueDate: '2026-06-01', team: ['Dev Team Alpha', 'UX Designers'],
    tasks: [
      { id: 't8', title: 'Feature Requirements', status: 'in-progress', assignee: 'Product Manager', subtasks: [{ id: 'st19', title: 'User research', completed: true }, { id: 'st20', title: 'Competitor analysis', completed: false }, { id: 'st21', title: 'Feature prioritization', completed: false }] },
      { id: 't9', title: 'UI/UX Design', status: 'todo', assignee: null, subtasks: [{ id: 'st22', title: 'Design system', completed: false }, { id: 'st23', title: 'Prototypes', completed: false }] },
      { id: 't10', title: 'Backend Architecture', status: 'todo', assignee: null, subtasks: [{ id: 'st24', title: 'API design', completed: false }, { id: 'st25', title: 'Database schema', completed: false }] }
    ],
    attachments: 5, comments: 12
  },
  {
    id: 'proj-4', title: 'Stadium Renovation', description: 'West stand upgrade and VIP facilities',
    icon: Wrench, color: 'error-600', status: 'in-progress', priority: 'high', progress: 78,
    dueDate: '2026-04-20', team: ['Construction Team', 'Architecture Firm'],
    tasks: [
      { id: 't11', title: 'Safety Inspections', status: 'completed', assignee: 'Safety Officer', subtasks: [{ id: 'st26', title: 'Structural assessment', completed: true }, { id: 'st27', title: 'Electrical systems check', completed: true }, { id: 'st28', title: 'Fire safety audit', completed: true }] },
      { id: 't12', title: 'VIP Lounge Construction', status: 'in-progress', assignee: 'Lead Contractor', subtasks: [{ id: 'st29', title: 'Foundation work', completed: true }, { id: 'st30', title: 'Interior design', completed: false }] },
      { id: 't13', title: 'Seating Installation', status: 'in-progress', assignee: 'Installation Team', subtasks: [{ id: 'st31', title: 'Old seats removal', completed: true }, { id: 'st32', title: 'New seats fitting', completed: false }] }
    ],
    attachments: 23, comments: 45
  },
  {
    id: 'proj-5', title: 'Youth Academy Program', description: 'Expand U-16 and U-18 training programs',
    icon: GraduationCap, color: 'special-colors-800', status: 'planning', priority: 'medium', progress: 15,
    dueDate: '2026-08-01', team: ['Youth Coaches', 'Academy Director'],
    tasks: [
      { id: 't14', title: 'Curriculum Development', status: 'in-progress', assignee: 'Academy Director', subtasks: [{ id: 'st33', title: 'Training modules', completed: true }, { id: 'st34', title: 'Assessment criteria', completed: false }] },
      { id: 't15', title: 'Coach Recruitment', status: 'todo', assignee: null, subtasks: [{ id: 'st35', title: 'Job postings', completed: false }, { id: 'st36', title: 'Interview scheduling', completed: false }] },
      { id: 't16', title: 'Facility Upgrades', status: 'todo', assignee: null, subtasks: [{ id: 'st37', title: 'Equipment procurement', completed: false }, { id: 'st38', title: 'Field maintenance', completed: false }] }
    ],
    attachments: 7, comments: 18
  },
  {
    id: 'proj-6', title: 'Analytics Dashboard', description: 'Real-time performance tracking system',
    icon: TrendingUp, color: 'brand-500', status: 'in-progress', priority: 'high', progress: 55,
    dueDate: '2026-03-10', team: ['Data Team', 'Engineering'],
    tasks: [
      { id: 't17', title: 'Data Pipeline Setup', status: 'completed', assignee: 'Data Engineer', subtasks: [{ id: 'st39', title: 'ETL processes', completed: true }, { id: 'st40', title: 'Data warehouse', completed: true }] },
      { id: 't18', title: 'Visualization Components', status: 'in-progress', assignee: 'Frontend Dev', subtasks: [{ id: 'st41', title: 'Chart library integration', completed: true }, { id: 'st42', title: 'Custom dashboards', completed: false }] },
      { id: 't19', title: 'Machine Learning Models', status: 'in-progress', assignee: 'ML Engineer', subtasks: [{ id: 'st43', title: 'Training algorithms', completed: false }, { id: 'st44', title: 'Prediction accuracy testing', completed: false }] }
    ],
    attachments: 15, comments: 27
  }
];

const kanbanTasksData = [
  { id: 'kt1', title: 'News & Media Hub', description: 'Build comprehensive content management system', project: 'Website Redesign', projectColor: 'brand-600', status: 'not-started', priority: 'medium', assignee: null, dueDate: '2026-03-20', subtasks: 5, completedSubtasks: 0, attachments: 3, comments: 2 },
  { id: 'kt2', title: 'Billboard Advertising', description: 'Design and place billboards across city', project: 'Marketing Campaign Q1', projectColor: 'warning-800', status: 'not-started', priority: 'low', assignee: 'Tom Bradley', dueDate: '2026-03-05', subtasks: 4, completedSubtasks: 0, attachments: 2, comments: 1 },
  { id: 'kt3', title: 'UI/UX Design', description: 'Create complete design system', project: 'Mobile App Development', projectColor: 'success-700', status: 'not-started', priority: 'high', assignee: null, dueDate: '2026-04-15', subtasks: 8, completedSubtasks: 0, attachments: 0, comments: 0 },
  { id: 'kt4', title: 'Coach Recruitment', description: 'Hire qualified youth coaches', project: 'Youth Academy Program', projectColor: 'special-colors-800', status: 'not-started', priority: 'medium', assignee: null, dueDate: '2026-06-01', subtasks: 6, completedSubtasks: 0, attachments: 1, comments: 4 },
  { id: 'kt5', title: 'Player Profiles Section', description: 'Dynamic player database with stats', project: 'Website Redesign', projectColor: 'brand-600', status: 'in-progress', priority: 'high', assignee: 'Mike Chen', dueDate: '2026-03-10', subtasks: 6, completedSubtasks: 4, attachments: 8, comments: 12 },
  { id: 'kt6', title: 'Ticket Booking System', description: 'Integrated payment and seat selection', project: 'Website Redesign', projectColor: 'brand-600', status: 'in-progress', priority: 'urgent', assignee: 'Emma Davis', dueDate: '2026-02-28', subtasks: 7, completedSubtasks: 3, attachments: 5, comments: 18 },
  { id: 'kt7', title: 'Social Media Strategy', description: 'Multi-channel content campaign', project: 'Marketing Campaign Q1', projectColor: 'warning-800', status: 'in-progress', priority: 'high', assignee: 'Lisa Park', dueDate: '2026-02-25', subtasks: 9, completedSubtasks: 5, attachments: 12, comments: 24 },
  { id: 'kt8', title: 'VIP Lounge Construction', description: 'Premium hospitality area', project: 'Stadium Renovation', projectColor: 'error-600', status: 'in-progress', priority: 'high', assignee: 'Lead Contractor', dueDate: '2026-04-10', subtasks: 12, completedSubtasks: 8, attachments: 23, comments: 31 },
  { id: 'kt9', title: 'Visualization Components', description: 'Interactive charts and graphs', project: 'Analytics Dashboard', projectColor: 'brand-500', status: 'in-progress', priority: 'medium', assignee: 'Frontend Dev', dueDate: '2026-03-08', subtasks: 5, completedSubtasks: 2, attachments: 7, comments: 9 },
  { id: 'kt10', title: 'Backend Architecture', description: 'API and database setup', project: 'Mobile App Development', projectColor: 'success-700', status: 'on-hold', priority: 'medium', assignee: null, dueDate: '2026-05-01', subtasks: 10, completedSubtasks: 2, attachments: 4, comments: 6 },
  { id: 'kt11', title: 'Facility Upgrades', description: 'Equipment and field improvements', project: 'Youth Academy Program', projectColor: 'special-colors-800', status: 'on-hold', priority: 'low', assignee: null, dueDate: '2026-07-15', subtasks: 8, completedSubtasks: 0, attachments: 2, comments: 3 },
  { id: 'kt12', title: 'Feature Requirements', description: 'Complete product specification', project: 'Mobile App Development', projectColor: 'success-700', status: 'in-review', priority: 'high', assignee: 'Product Manager', dueDate: '2026-03-18', subtasks: 6, completedSubtasks: 5, attachments: 9, comments: 15 },
  { id: 'kt13', title: 'Curriculum Development', description: 'Training program structure', project: 'Youth Academy Program', projectColor: 'special-colors-800', status: 'in-review', priority: 'medium', assignee: 'Academy Director', dueDate: '2026-06-10', subtasks: 7, completedSubtasks: 6, attachments: 11, comments: 8 },
  { id: 'kt14', title: 'Seating Installation', description: 'New premium seating areas', project: 'Stadium Renovation', projectColor: 'error-600', status: 'in-review', priority: 'high', assignee: 'Installation Team', dueDate: '2026-04-15', subtasks: 5, completedSubtasks: 4, attachments: 6, comments: 10 },
  { id: 'kt15', title: 'Homepage Design', description: 'Hero section and landing page', project: 'Website Redesign', projectColor: 'brand-600', status: 'completed', priority: 'high', assignee: 'Sarah Johnson', dueDate: '2026-02-15', subtasks: 8, completedSubtasks: 8, attachments: 14, comments: 22 },
  { id: 'kt16', title: 'Email Campaign', description: 'Season ticket renewal emails', project: 'Marketing Campaign Q1', projectColor: 'warning-800', status: 'completed', priority: 'urgent', assignee: 'Alex Rivera', dueDate: '2026-02-10', subtasks: 5, completedSubtasks: 5, attachments: 7, comments: 16 },
  { id: 'kt17', title: 'Safety Inspections', description: 'Complete safety audit', project: 'Stadium Renovation', projectColor: 'error-600', status: 'completed', priority: 'urgent', assignee: 'Safety Officer', dueDate: '2026-02-05', subtasks: 12, completedSubtasks: 12, attachments: 19, comments: 28 },
  { id: 'kt18', title: 'Data Pipeline Setup', description: 'ETL and data warehouse', project: 'Analytics Dashboard', projectColor: 'brand-500', status: 'completed', priority: 'high', assignee: 'Data Engineer', dueDate: '2026-02-20', subtasks: 6, completedSubtasks: 6, attachments: 8, comments: 11 }
];

// ─────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────
export function TasksViewPage() {
  const { nodes, edges } = useOrganigram();

  // View state
  const [activeView, setActiveView] = useState<'group' | 'project' | 'tasks'>('group');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'planning' | 'completed'>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectDetailModalOpen, setIsProjectDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Task Edit Modal state
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingTaskSubProject, setEditingTaskSubProject] = useState('');

  // Local mutable copy of projects (so edits persist in session)
  const [localProjectsData, setLocalProjectsData] = useState(projectsData);

  // Expand/collapse state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'first-team': true, 'medical': true, 'training': false, 'scouting': false, 'europe': false, 'americas': false
  });
  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  // All unique assignees
  const allAssignees = useMemo(() => {
    const assignees = new Set<string>();
    Object.values(localProjectsData).forEach((project: any) => {
      Object.values(project.subProjects || {}).forEach((subProject: any) => {
        if (subProject.assignedTo) assignees.add(subProject.assignedTo);
        (subProject.tasks || []).forEach((task: any) => {
          if (task.assignedTo) assignees.add(task.assignedTo);
        });
      });
    });
    return Array.from(assignees).sort();
  }, [localProjectsData]);

  const countUnassigned = () => {
    let count = 0;
    Object.values(localProjectsData).forEach((project: any) => {
      Object.values(project.subProjects || {}).forEach((subProject: any) => {
        count += (subProject.tasks || []).filter((t: any) => t.assignedTo === null).length;
      });
    });
    return count;
  };

  // Open edit modal
  const openEditTask = (task: any, subProjectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setEditingTaskSubProject(subProjectName);
    setIsEditTaskModalOpen(true);
  };

  // Save edited task back to local data
  const handleSaveTask = (updatedTask: any) => {
    setLocalProjectsData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      Object.values(next).forEach((project: any) => {
        Object.values(project.subProjects || {}).forEach((subProject: any) => {
          const idx = (subProject.tasks || []).findIndex((t: any) => t.id === updatedTask.id);
          if (idx !== -1) subProject.tasks[idx] = updatedTask;
        });
      });
      return next;
    });
  };

  // ── UI helpers ──
  const ProgressBar = ({ percentage, color = 'brand-600' }: { percentage: number; color?: string }) => (
    <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
      <div className={`bg-${color} h-full transition-all duration-300 rounded-full`} style={{ width: `${percentage}%` }} />
    </div>
  );

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'in-progress': { bg: 'bg-brand-500', text: 'In Progress', icon: Zap },
      'planning': { bg: 'bg-warning-700', text: 'Planning', icon: Clock },
      'completed': { bg: 'bg-success-700', text: 'Completed', icon: CheckCircle2 },
      'todo': { bg: 'bg-neutral-400', text: 'To Do', icon: Circle }
    };
    const badge = badges[status] || badges['todo'];
    const Icon = badge.icon;
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${badge.bg} text-neutral-0 text-xs font-medium`}>
        <Icon size={12} />{badge.text}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges: any = {
      'urgent': { bg: 'bg-error-600', text: 'Urgent' },
      'high': { bg: 'bg-warning-600', text: 'High' },
      'medium': { bg: 'bg-brand-700', text: 'Medium' },
      'low': { bg: 'bg-neutral-500', text: 'Low' }
    };
    const badge = badges[priority] || badges['medium'];
    return <div className={`px-2.5 py-1 rounded-md ${badge.bg} text-neutral-0 text-xs font-medium`}>{badge.text}</div>;
  };

  const filteredProjects = cardProjectsData.filter(p => statusFilter === 'all' || p.status === statusFilter);

  const kanbanColumns = [
    { id: 'not-started', title: 'Not Started', icon: Circle, color: 'neutral-500', bgColor: 'bg-neutral-100' },
    { id: 'in-progress', title: 'In Progress', icon: PlayCircle, color: 'brand-600', bgColor: 'bg-brand-50' },
    { id: 'on-hold', title: 'On Hold', icon: PauseCircle, color: 'warning-700', bgColor: 'bg-warning-50' },
    { id: 'in-review', title: 'In Review', icon: Loader, color: 'special-colors-200', bgColor: 'bg-special-colors-100' },
    { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'success-700', bgColor: 'bg-success-50' }
  ];

  const filteredKanbanTasks = kanbanTasksData.filter(task => {
    if (!taskSearchQuery) return true;
    const q = taskSearchQuery.toLowerCase();
    return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q) ||
      task.project.toLowerCase().includes(q) || (task.assignee && task.assignee.toLowerCase().includes(q));
  });

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    kanbanColumns.forEach(col => { grouped[col.id] = filteredKanbanTasks.filter(t => t.status === col.id); });
    return grouped;
  }, [filteredKanbanTasks]);

  // ─────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto bg-default-background min-h-screen font-sans">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgb(24,24,24); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgb(82,82,82); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgb(115,115,115); }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgb(82,82,82) rgb(24,24,24); }
      `}</style>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-heading-1 text-default-font mb-3">Club Operations</h1>
          <p className="text-body text-subtext-color">Staff Workspace & Task Management</p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-neutral-100 p-1.5 rounded-xl gap-1">
            {[
              { id: 'group', icon: Grid3x3, label: 'Group View' },
              { id: 'project', icon: Folder, label: 'Project View' },
              { id: 'tasks', icon: LayoutList, label: 'Tasks View' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveView(id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeView === id
                    ? 'bg-brand-600 text-neutral-0 shadow-md'
                    : 'text-subtext-color hover:text-default-font hover:bg-neutral-150'
                }`}
              >
                <Icon size={20} />
                <span className="font-body-bold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════
            GROUP VIEW
        ════════════════════════════════════ */}
        {activeView === 'group' && (
          <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">

            {/* Left column: hierarchy */}
            <div className="w-full md:w-1/3 bg-neutral-50 border border-neutral-border rounded-lg overflow-hidden flex flex-col max-h-[800px]">

              {/* Filters header */}
              <div className="p-4 border-b border-neutral-border bg-neutral-100">
                <h3 className="text-caption-bold text-brand-600 uppercase tracking-wider mb-3 px-2">Project Hierarchy</h3>

                <div className="flex gap-1 bg-neutral-200 p-1 rounded-lg mb-3">
                  {[
                    { id: 'all', icon: List, label: 'All' },
                    { id: 'assigned', icon: UserCheck, label: 'Assigned' },
                    { id: 'unassigned', icon: UserX, label: 'Unassigned' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setAssignmentFilter(id as any)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all relative ${
                        assignmentFilter === id
                          ? 'bg-neutral-100 text-brand-600 shadow-sm'
                          : 'text-subtext-color hover:text-brand-600'
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                      {id === 'unassigned' && countUnassigned() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-warning-800 text-neutral-0 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                          {countUnassigned()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <select
                    value={selectedAssignee || ''}
                    onChange={e => setSelectedAssignee(e.target.value || null)}
                    className="w-full bg-neutral-200 text-default-font text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-brand-600 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Filter by assignee...</option>
                    {allAssignees.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {selectedAssignee && (
                    <button onClick={() => setSelectedAssignee(null)} className="absolute right-2 top-1/2 -translate-y-1/2 text-subtext-color hover:text-default-font">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {selectedAssignee && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-subtext-color">Showing:</span>
                    <span className="bg-brand-600 text-neutral-0 px-2 py-1 rounded-md font-medium">{selectedAssignee}</span>
                  </div>
                )}

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors font-body-bold mt-4"
                >
                  <Plus size={20} />
                  Add New Project
                </button>
              </div>

              {/* Scrollable tree */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3">
                  {Object.values(localProjectsData).map((project: any) => {
                    const ProjectIcon = project.icon;
                    const subProjects = Object.values(project.subProjects || {});
                    const allTasks = subProjects.flatMap((sp: any) => sp.tasks || []);
                    const filteredAllTasks = filterTasks(allTasks, assignmentFilter, selectedAssignee);
                    const projectProgress = calculateProgress(filteredAllTasks);
                    if (filteredAllTasks.length === 0) return null;

                    return (
                      <div key={project.id} className="border-b border-neutral-border pb-3 last:border-b-0">
                        {/* Project row */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggle(project.id)}
                            className="flex-1 flex items-center gap-2 p-2 hover:bg-neutral-100 rounded text-default-font transition-colors"
                          >
                            {expanded[project.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <ProjectIcon size={18} className={`text-${project.color}`} />
                            <span className="font-body-bold flex-1 text-left">{project.name}</span>
                          </button>
                          <button
                            onClick={() => { setSelectedProject(project); setIsProjectDetailModalOpen(true); }}
                            className="p-2 hover:bg-neutral-100 rounded text-subtext-color hover:text-brand-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                        </div>

                        {/* Departments */}
                        {project.departments?.length > 0 && (
                          <div className="ml-9 mt-1 mb-2">
                            <div className="flex items-start gap-2">
                              <Building2 size={12} className="text-subtext-color mt-0.5 flex-shrink-0" />
                              <div className="flex flex-wrap gap-1">
                                {project.departments.map((dept: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-neutral-200 text-subtext-color px-2 py-0.5 rounded-md">{dept}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Project progress */}
                        {filteredAllTasks.length > 0 && (
                          <div className="ml-9 mt-2 mb-2 pr-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-subtext-color">
                                {filteredAllTasks.filter(t => t.completed).length}/{filteredAllTasks.length} tasks
                              </span>
                              <span className="text-xs font-semibold text-brand-600">{projectProgress}%</span>
                            </div>
                            <ProgressBar percentage={projectProgress} />
                          </div>
                        )}

                        {/* Sub-projects */}
                        {expanded[project.id] && (
                          <div className="ml-6 mt-2 border-l-2 border-neutral-border space-y-2">
                            {subProjects.map((subProject: any) => {
                              const SubIcon = subProject.icon;
                              const filteredTasks = filterTasks(subProject.tasks, assignmentFilter, selectedAssignee);
                              const subProgress = calculateProgress(filteredTasks);
                              if (filteredTasks.length === 0) return null;

                              return (
                                <div key={subProject.id} className="pl-4">
                                  <button
                                    onClick={() => toggle(subProject.id)}
                                    className="w-full flex items-center gap-2 p-1.5 hover:bg-neutral-100 rounded text-subtext-color text-sm transition-colors"
                                  >
                                    {expanded[subProject.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    <SubIcon size={14} />
                                    <span className="flex-1 text-left">{subProject.name}</span>
                                  </button>

                                  <div className="ml-7 mt-1">
                                    <span className="text-xs text-subtext-color">👥 {subProject.assignedTo}</span>
                                  </div>

                                  {filteredTasks.length > 0 && (
                                    <div className="ml-7 mt-2 pr-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-subtext-color">
                                          {filteredTasks.filter((t: any) => t.completed).length}/{filteredTasks.length} done
                                        </span>
                                        <span className="text-xs font-semibold text-brand-600">{subProgress}%</span>
                                      </div>
                                      <ProgressBar percentage={subProgress} />
                                    </div>
                                  )}

                                  {/* Task items */}
                                  {expanded[subProject.id] && filteredTasks && (
                                    <div className="ml-7 mt-2 space-y-1.5">
                                      {filteredTasks.map((task: any) => {
                                        const unassignedSubs = (task.subtasks || []).filter((s: any) => !s.assignee).length;
                                        const totalSubs = (task.subtasks || []).length;

                                        return (
                                          <div
                                            key={task.id}
                                            className={`group flex items-start gap-2 p-2 rounded-lg transition-all cursor-pointer ${
                                              task.completed ? 'opacity-60' : ''
                                            } ${!task.assignedTo ? 'border-l-2 border-warning-800 bg-warning-50 bg-opacity-5' : 'hover:bg-neutral-100'}`}
                                          >
                                            {/* Status icon */}
                                            {task.completed
                                              ? <CheckCircle2 size={14} className="text-success-700 mt-0.5 flex-shrink-0" />
                                              : <Circle size={14} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                                            }

                                            {/* Task info */}
                                            <div className="flex-1 min-w-0">
                                              <div className={`text-xs ${task.completed ? 'line-through text-subtext-color' : 'text-default-font'}`}>
                                                {task.name}
                                              </div>
                                              <div className="text-xs text-subtext-color mt-0.5 flex items-center gap-2 flex-wrap">
                                                {task.assignedTo
                                                  ? <span>👤 {task.assignedTo}</span>
                                                  : <span className="text-warning-800 font-medium flex items-center gap-0.5"><AlertCircle size={10} /> Unassigned</span>
                                                }
                                                {totalSubs > 0 && (
                                                  <span className="text-subtext-color opacity-70">
                                                    {(task.subtasks || []).filter((s: any) => s.completed).length}/{totalSubs} sub
                                                  </span>
                                                )}
                                                {unassignedSubs > 0 && (
                                                  <span className="text-warning-800 opacity-80 flex items-center gap-0.5">
                                                    <AlertCircle size={9} /> {unassignedSubs}
                                                  </span>
                                                )}
                                              </div>
                                            </div>

                                            {/* Edit button — visible on hover */}
                                            <button
                                              onClick={(e) => openEditTask(task, subProject.name, e)}
                                              className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 hover:bg-brand-50 hover:border hover:border-brand-600 rounded-md transition-all"
                                              title="Edit task"
                                            >
                                              <Edit3 size={12} className="text-brand-600" />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Empty state */}
                  {Object.values(localProjectsData).every((project: any) => {
                    const subProjects = Object.values(project.subProjects || {});
                    const allTasks = subProjects.flatMap((sp: any) => sp.tasks || []);
                    return filterTasks(allTasks, assignmentFilter, selectedAssignee).length === 0;
                  }) && (
                    <div className="text-center py-8 text-subtext-color">
                      <UserX size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No {assignmentFilter !== 'all' && assignmentFilter} tasks found
                        {selectedAssignee && ` for ${selectedAssignee}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column: organigram */}
            <div className="flex-1 bg-neutral-100 border border-neutral-border rounded-lg overflow-hidden">
              <OrganigramViewer nodes={nodes} edges={edges} showMembers={true} />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            PROJECT VIEW
        ════════════════════════════════════ */}
        {activeView === 'project' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-neutral-50 border border-neutral-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-subtext-color" />
                <div className="flex gap-2">
                  {(['all', 'in-progress', 'planning'] as const).map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f ? 'bg-brand-600 text-neutral-0' : 'bg-neutral-100 text-subtext-color hover:text-default-font'}`}>
                      {f === 'all' ? 'All Projects' : f === 'in-progress' ? 'In Progress' : 'Planning'}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-neutral-0 rounded-lg transition-colors font-body-bold">
                <Plus size={18} />New Project
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map(project => {
                const ProjectIcon = project.icon;
                const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
                return (
                  <div key={project.id} className="bg-neutral-50 border border-neutral-border rounded-lg overflow-hidden hover:border-brand-600 transition-all duration-200 hover:shadow-lg">
                    <div className="p-5 border-b border-neutral-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg bg-${project.color} bg-opacity-20`}>
                            <ProjectIcon size={24} className={`text-${project.color}`} />
                          </div>
                          <div>
                            <h3 className="text-heading-3 text-default-font mb-1">{project.title}</h3>
                            <p className="text-caption text-subtext-color">{project.description}</p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><MoreVertical size={18} className="text-subtext-color" /></button>
                      </div>
                      <div className="flex items-center gap-2 mb-4">{getStatusBadge(project.status)}{getPriorityBadge(project.priority)}</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-caption text-subtext-color">{completedTasks} of {project.tasks.length} tasks completed</span>
                          <span className="text-caption-bold text-brand-600">{project.progress}%</span>
                        </div>
                        <ProgressBar percentage={project.progress} color={project.color} />
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-caption text-subtext-color">
                        <div className="flex items-center gap-1.5"><Calendar size={14} /><span>Due {project.dueDate}</span></div>
                        <div className="flex items-center gap-1.5"><Paperclip size={14} /><span>{project.attachments}</span></div>
                        <div className="flex items-center gap-1.5"><MessageSquare size={14} /><span>{project.comments}</span></div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Users size={14} className="text-subtext-color" />
                        <div className="flex flex-wrap gap-1.5">
                          {project.team.map((member, idx) => (
                            <span key={idx} className="text-xs bg-neutral-200 text-default-font px-2 py-1 rounded-md">{member}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {project.tasks.map(task => {
                        const comp = task.subtasks.filter(st => st.completed).length;
                        const tot = task.subtasks.length;
                        const pct = Math.round((comp / tot) * 100);
                        return (
                          <div key={task.id} className="bg-neutral-100 rounded-lg p-3 hover:bg-neutral-150 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-start gap-2 flex-1">
                                {task.status === 'completed' ? <CheckCircle2 size={16} className="text-success-700 mt-0.5 flex-shrink-0" />
                                  : task.status === 'in-progress' ? <Zap size={16} className="text-brand-600 mt-0.5 flex-shrink-0" />
                                  : <Circle size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />}
                                <div className="flex-1">
                                  <div className={`text-body-bold ${task.status === 'completed' ? 'line-through text-subtext-color' : 'text-default-font'}`}>{task.title}</div>
                                  {task.assignee
                                    ? <div className="text-caption text-subtext-color mt-1">👤 {task.assignee}</div>
                                    : <div className="text-caption text-warning-800 mt-1 flex items-center gap-1"><AlertCircle size={12} />Unassigned</div>
                                  }
                                </div>
                              </div>
                              <span className="text-caption text-subtext-color">{comp}/{tot}</span>
                            </div>
                            {tot > 0 && (
                              <div className="ml-6">
                                <div className="w-full bg-neutral-200 rounded-full h-1 overflow-hidden">
                                  <div className="bg-brand-600 h-full transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            )}
                            <div className="ml-6 mt-2 space-y-1.5">
                              {task.subtasks.slice(0, 2).map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2 text-caption">
                                  {subtask.completed ? <CheckCircle2 size={12} className="text-success-700 flex-shrink-0" /> : <Circle size={12} className="text-neutral-400 flex-shrink-0" />}
                                  <span className={subtask.completed ? 'line-through text-subtext-color' : 'text-default-font'}>{subtask.title}</span>
                                </div>
                              ))}
                              {task.subtasks.length > 2 && (
                                <button className="text-caption text-brand-600 hover:text-brand-700 ml-5">+{task.subtasks.length - 2} more</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16 bg-neutral-50 border border-neutral-border rounded-lg">
                <Folder size={48} className="mx-auto mb-4 text-subtext-color opacity-50" />
                <h3 className="text-heading-3 text-default-font mb-2">No projects found</h3>
                <p className="text-body text-subtext-color mb-6">No projects match the current filter</p>
                <button onClick={() => setStatusFilter('all')} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-neutral-0 rounded-lg transition-colors font-body-bold">View All Projects</button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            TASKS / KANBAN VIEW
        ════════════════════════════════════ */}
        {activeView === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-neutral-50 border border-neutral-border rounded-lg p-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={taskSearchQuery}
                  onChange={e => setTaskSearchQuery(e.target.value)}
                  className="flex-1 bg-neutral-100 text-default-font text-body px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-brand-600 transition-colors"
                />
                {taskSearchQuery && (
                  <button onClick={() => setTaskSearchQuery('')} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <X size={18} className="text-subtext-color" />
                  </button>
                )}
              </div>
              <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-neutral-0 rounded-lg transition-colors font-body-bold">
                <Plus size={18} />New Task
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {kanbanColumns.map(column => {
                const ColumnIcon = column.icon;
                const columnTasks = tasksByStatus[column.id] || [];
                return (
                  <div key={column.id} className="flex-shrink-0 w-80 bg-neutral-50 border border-neutral-border rounded-lg overflow-hidden">
                    <div className={`${column.bgColor} border-b border-neutral-border p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ColumnIcon size={18} className={`text-${column.color}`} />
                          <h3 className="text-body-bold text-default-font">{column.title}</h3>
                        </div>
                        <span className="text-caption-bold text-subtext-color bg-neutral-100 px-2 py-1 rounded-md">{columnTasks.length}</span>
                      </div>
                    </div>

                    <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                      {columnTasks.map(task => {
                        const pct = Math.round((task.completedSubtasks / task.subtasks) * 100);
                        return (
                          <div key={task.id} className="bg-neutral-100 rounded-lg p-4 hover:bg-neutral-150 transition-all cursor-grab active:cursor-grabbing hover:shadow-md border border-transparent hover:border-brand-600">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-body-bold text-default-font flex-1 pr-2">{task.title}</h4>
                              <button className="p-1 hover:bg-neutral-200 rounded transition-colors"><MoreVertical size={16} className="text-subtext-color" /></button>
                            </div>
                            <p className="text-caption text-subtext-color mb-3 line-clamp-2">{task.description}</p>
                            <div className="mb-3">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-${task.projectColor} bg-opacity-20 text-${task.projectColor}`}>
                                <Folder size={12} />{task.project}
                              </span>
                            </div>
                            <div className="mb-3">{getPriorityBadge(task.priority)}</div>
                            {task.subtasks > 0 && (
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-caption text-subtext-color">Progress</span>
                                  <span className="text-caption-bold text-brand-600">{task.completedSubtasks}/{task.subtasks}</span>
                                </div>
                                <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-brand-600 h-full transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            )}
                            <div className="mb-3">
                              {task.assignee
                                ? <div className="flex items-center gap-2 text-caption text-default-font">
                                    <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-neutral-0 text-xs font-bold">{task.assignee.charAt(0)}</div>
                                    <span>{task.assignee}</span>
                                  </div>
                                : <div className="flex items-center gap-2 text-caption text-warning-800"><AlertCircle size={14} /><span className="font-medium">Unassigned</span></div>
                              }
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-border">
                              <div className="flex items-center gap-3 text-caption text-subtext-color">
                                <div className="flex items-center gap-1"><Calendar size={12} /><span>{task.dueDate}</span></div>
                                {task.attachments > 0 && <div className="flex items-center gap-1"><Paperclip size={12} /><span>{task.attachments}</span></div>}
                              </div>
                              {task.comments > 0 && <div className="flex items-center gap-1 text-caption text-subtext-color"><MessageSquare size={12} /><span>{task.comments}</span></div>}
                            </div>
                          </div>
                        );
                      })}

                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-subtext-color">
                          <ColumnIcon size={32} className="mx-auto mb-2 opacity-30" />
                          <p className="text-caption">No tasks</p>
                        </div>
                      )}

                      <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 rounded-lg text-subtext-color hover:text-brand-600 hover:border-brand-600 transition-colors">
                        <Plus size={16} /><span className="text-caption-bold">Add Task</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredKanbanTasks.length === 0 && taskSearchQuery && (
              <div className="text-center py-16 bg-neutral-50 border border-neutral-border rounded-lg">
                <AlertCircle size={48} className="mx-auto mb-4 text-subtext-color opacity-50" />
                <h3 className="text-heading-3 text-default-font mb-2">No tasks found</h3>
                <p className="text-body text-subtext-color mb-6">No tasks match "{taskSearchQuery}"</p>
                <button onClick={() => setTaskSearchQuery('')} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-neutral-0 rounded-lg transition-colors font-body-bold">Clear Search</button>
              </div>
            )}
          </div> 
        )}
      </div>

      {/* ─── Modals ─── */}
      <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <ProjectDetailModal isOpen={isProjectDetailModalOpen} onClose={() => setIsProjectDetailModalOpen(false)} project={selectedProject} />

      {/* Task Edit Modal */}
      <TaskEditModal
        isOpen={isEditTaskModalOpen}
        onClose={() => { setIsEditTaskModalOpen(false); setEditingTask(null); }}
        task={editingTask}
        subProjectName={editingTaskSubProject}
        onSave={handleSaveTask}
      />
    </div>
  );
}