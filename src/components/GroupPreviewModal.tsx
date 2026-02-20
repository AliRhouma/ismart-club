import { useState } from 'react';
import {
  X, Crown, UserPlus, Trash2, Edit3, Check, ChevronRight,
  Trophy, Users, Clock, CheckCircle2, AlertCircle,
  ArrowRight, Search, FolderOpen, ListTodo, Layers, RefreshCw, Shield,
} from 'lucide-react';

const mockGroup = {
  name: "Engineering & Tech Division",
  description: "Core engineering team responsible for product development, infrastructure, and technical innovation across all platform layers.",
  badge: "Technology",
  createdAt: "Jan 12, 2026",
  totalTasks: 18,
  completedTasks: 7,
};

const mockManager = {
  name: "Bilel Mansour",
  role: "Owner & CEO",
  initials: "BM",
  joinedAt: "Jan 12, 2026",
};

const mockMembers = [
  { id: 'm1', name: "Jacer Khaled", role: "Senior Developer", initials: "JK", tasksCount: 3 },
  { id: 'm2', name: "Amira Benali", role: "Product Manager", initials: "AB", tasksCount: 3 },
  { id: 'm3', name: "Sami Trabelsi", role: "Technical Lead", initials: "ST", tasksCount: 2 },
  { id: 'm4', name: "Nour Jebali", role: "Backend Developer", initials: "NJ", tasksCount: 2 },
  { id: 'm5', name: "Youssef Gharbi", role: "DevOps Engineer", initials: "YG", tasksCount: 2 },
  { id: 'm6', name: "Karim Bouzid", role: "Frontend Developer", initials: "KB", tasksCount: 2 },
];

const availableToAdd = [
  { id: 'a1', name: "Leila Amor", role: "UX/UI Designer", initials: "LA" },
  { id: 'a2', name: "Fatma Sassi", role: "HR Manager", initials: "FS" },
  { id: 'a3', name: "Rania Meddeb", role: "Marketing Director", initials: "RM" },
  { id: 'a4', name: "Tarek Bellili", role: "Software Engineer", initials: "TB" },
];

const mockProjects = [
  {
    id: 'p1',
    name: "First Team Ops",
    description: "Medical, coaching and performance management",
    color: "#0091FF",
    progress: 62,
    tasksTotal: 10,
    tasksCompleted: 6,
    departments: ["Medical", "Coaching", "Performance"],
    assignee: "Bilel Mansour",
  },
  {
    id: 'p2',
    name: "Global Scouting",
    description: "European & Americas scouting operations",
    color: "#2EC8EE",
    progress: 33,
    tasksTotal: 6,
    tasksCompleted: 2,
    departments: ["Scouts", "Analytics"],
    assignee: "Sami Trabelsi",
  },
  {
    id: 'p3',
    name: "Platform Rebuild v2",
    description: "Full rewrite of the core platform infrastructure",
    color: "#46A758",
    progress: 45,
    tasksTotal: 14,
    tasksCompleted: 6,
    departments: ["Engineering", "DevOps"],
    assignee: "Jacer Khaled",
  },
];

const mockTasks = [
  { id: 't1', name: "Player Recovery Logs", project: "First Team Ops", status: 'completed' as const, priority: 'medium' as const, assignee: "Nour Jebali", dueDate: "Feb 5, 2026" },
  { id: 't2', name: "Injury Assessment Reports", project: "First Team Ops", status: 'in-progress' as const, priority: 'high' as const, assignee: "Jacer Khaled", dueDate: "Feb 12, 2026" },
  { id: 't3', name: "Tactical Sessions", project: "First Team Ops", status: 'in-progress' as const, priority: 'high' as const, assignee: "Amira Benali", dueDate: "Feb 8, 2026" },
  { id: 't4', name: "La Liga Target List", project: "Global Scouting", status: 'completed' as const, priority: 'low' as const, assignee: "Sami Trabelsi", dueDate: "Jan 28, 2026" },
  { id: 't5', name: "Serie A Youth Talents", project: "Global Scouting", status: 'todo' as const, priority: 'medium' as const, assignee: "Karim Bouzid", dueDate: "Feb 20, 2026" },
  { id: 't6', name: "CI/CD Pipeline Optimization", project: "Platform Rebuild", status: 'in-progress' as const, priority: 'high' as const, assignee: "Youssef Gharbi", dueDate: "Feb 7, 2026" },
];

const mockSubtaskGroups = [
  {
    taskName: "Player Recovery Logs",
    subtasks: [
      { id: 'st1', name: "Daily vitals monitoring", completed: true, assignee: "Nour Jebali" },
      { id: 'st2', name: "Recovery session notes", completed: false, assignee: "Jacer Khaled" },
      { id: 'st3', name: "Equipment sanitization log", completed: true, assignee: "Amira Benali" },
    ],
  },
  {
    taskName: "Tactical Sessions",
    subtasks: [
      { id: 'st4', name: "Video analysis preparation", completed: false, assignee: "Sami Trabelsi" },
      { id: 'st5', name: "Set piece rehearsal schedule", completed: true, assignee: "Karim Bouzid" },
      { id: 'st6', name: "Defensive shape drills", completed: false, assignee: "Youssef Gharbi" },
    ],
  },
  {
    taskName: "CI/CD Pipeline Optimization",
    subtasks: [
      { id: 'st7', name: "Docker container optimisation", completed: true, assignee: "Youssef Gharbi" },
      { id: 'st8', name: "GitHub Actions workflow update", completed: false, assignee: "Jacer Khaled" },
    ],
  },
];

type TabType = 'projects' | 'tasks' | 'subtasks';
type ReassignType = 'project' | 'task' | 'subtask';

interface ReassignState {
  id: string;
  type: ReassignType;
  name: string;
}

interface GroupPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMBER = '#f59e0b';
const AMBER_BG = 'rgba(245,158,11,0.08)';
const AMBER_BORDER = 'rgba(245,158,11,0.25)';

function Avatar({ initials, color = '#0091FF', size = 9 }: { initials: string; color?: string; size?: number }) {
  const px = size * 4;
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0"
      style={{ width: px, height: px, background: color, fontSize: px * 0.35 }}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: 'completed' | 'in-progress' | 'todo' }) {
  const map = {
    completed: { label: 'Completed', bg: 'rgba(70,167,88,0.12)', color: '#46A758', border: 'rgba(70,167,88,0.25)', Icon: CheckCircle2 },
    'in-progress': { label: 'In Progress', bg: 'rgba(0,145,255,0.1)', color: '#0091FF', border: 'rgba(0,145,255,0.2)', Icon: Clock },
    todo: { label: 'To Do', bg: 'rgba(163,163,163,0.1)', color: '#A3A3A3', border: 'rgba(163,163,163,0.2)', Icon: AlertCircle },
  };
  const { label, bg, color, border, Icon } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const map = {
    high: { label: 'High', bg: 'rgba(229,72,77,0.1)', color: '#E5484D', border: 'rgba(229,72,77,0.2)' },
    medium: { label: 'Medium', bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    low: { label: 'Low', bg: 'rgba(70,167,88,0.1)', color: '#46A758', border: 'rgba(70,167,88,0.2)' },
  };
  const { label, bg, color, border } = map[priority];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      {label}
    </span>
  );
}

function ReassignOverlay({
  reassigning,
  onCancel,
  onConfirm,
}: {
  reassigning: ReassignState | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [target, setTarget] = useState<string | null>(null);

  if (!reassigning) return null;

  const handleSelectTarget = (name: string) => {
    setTarget(name);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setTarget(null);
  };

  const handleConfirm = () => {
    setStep(1);
    setTarget(null);
    onConfirm();
  };

  const handleCancel = () => {
    setStep(1);
    setTarget(null);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
      <div
        className="bg-neutral-50 rounded-lg w-full max-w-sm border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="text-heading-3 text-default-font">
              {step === 1 ? `Reassign ${reassigning.type}` : 'Confirm Reassignment'}
            </div>
            <div className="text-caption text-subtext-color mt-0.5 truncate max-w-[220px]">{reassigning.name}</div>
          </div>
          <button onClick={handleCancel} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-subtext-color" />
          </button>
        </div>

        {step === 1 ? (
          <div className="p-4">
            <div className="text-caption text-subtext-color mb-3">Select a new assignee:</div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {mockMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleSelectTarget(member.name)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-neutral-200 hover:border-brand-600 bg-neutral-100 hover:bg-brand-50 transition-all text-left group"
                >
                  <Avatar initials={member.initials} size={8} />
                  <div className="flex-1 min-w-0">
                    <div className="text-body text-default-font font-medium truncate">{member.name}</div>
                    <div className="text-caption text-subtext-color">{member.role}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-subtext-color opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-brand-600" />
                <span className="text-caption-bold text-brand-600 uppercase tracking-wide">Summary</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-caption text-subtext-color w-20 flex-shrink-0">Item</span>
                  <span className="text-caption text-default-font">{reassigning.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-caption text-subtext-color w-20 flex-shrink-0">New assignee</span>
                  <span className="text-caption text-default-font font-medium">{target}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBack}
                className="flex-1 py-2 rounded-lg text-body text-default-font bg-neutral-100 border border-neutral-200 hover:bg-neutral-150 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-body text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GroupPreviewModal({ isOpen, onClose }: GroupPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [showAddMemberPopover, setShowAddMemberPopover] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState('');
  const [editingManager, setEditingManager] = useState(false);
  const [selectedNewManager, setSelectedNewManager] = useState<string | null>(null);
  const [reassigning, setReassigning] = useState<ReassignState | null>(null);

  if (!isOpen) return null;

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const completionPercent = Math.round((mockGroup.completedTasks / mockGroup.totalTasks) * 100);
  const totalSubtasks = mockSubtaskGroups.reduce((s, g) => s + g.subtasks.length, 0);

  const filteredAddMembers = availableToAdd.filter(m =>
    m.name.toLowerCase().includes(addMemberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(addMemberSearch.toLowerCase())
  );

  const handleStartReassign = (id: string, type: ReassignType, name: string) => {
    setReassigning({ id, type, name });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div
          className="bg-neutral-50 rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
        >

          {/* HEADER */}
          <div className="relative flex-shrink-0 bg-neutral-100 border-b border-neutral-200 px-6 py-5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-150 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-subtext-color" />
            </button>

            <div className="flex items-start gap-5 pr-12">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0091FF 0%, #005FC2 100%)' }}
              >
                ET
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1.5">
                  <h2 className="text-heading-2 text-default-font">{mockGroup.name}</h2>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-caption-bold"
                    style={{ background: 'rgba(0,145,255,0.12)', color: '#0091FF', border: '1px solid rgba(0,145,255,0.25)' }}
                  >
                    {mockGroup.badge}
                  </span>
                </div>
                <p className="text-body text-subtext-color mb-4 leading-relaxed">{mockGroup.description}</p>

                <div className="flex items-center gap-5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-subtext-color" />
                    <span className="text-caption text-subtext-color">{mockMembers.length + 1} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-subtext-color" />
                    <span className="text-caption text-subtext-color">{mockProjects.length} projects</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-subtext-color" />
                    <span className="text-caption text-subtext-color">{mockGroup.totalTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-neutral-150 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${completionPercent}%`, background: '#46A758' }}
                      />
                    </div>
                    <span className="text-caption font-medium" style={{ color: '#46A758' }}>{completionPercent}%</span>
                  </div>
                  <span className="text-caption text-subtext-color">Created {mockGroup.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto min-h-0">

            {/* MANAGER SPOTLIGHT */}
            <div className="mx-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4" style={{ color: AMBER }} />
                <h3 className="text-heading-3 text-default-font">Group Manager</h3>
              </div>

              <div
                className="rounded-lg border border-neutral-200 overflow-hidden"
                style={{ borderLeftWidth: 3, borderLeftColor: AMBER }}
              >
                <div className="bg-neutral-100 px-5 py-4">
                  {!editingManager ? (
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: AMBER }}
                        >
                          BM
                        </div>
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: AMBER }}
                        >
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-body-bold text-default-font">{mockManager.name}</span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: AMBER_BG, color: AMBER, border: `1px solid ${AMBER_BORDER}` }}
                          >
                            Group Manager
                          </span>
                        </div>
                        <div className="text-caption text-subtext-color">{mockManager.role}</div>
                        <div className="text-caption text-subtext-color">Member since {mockManager.joinedAt}</div>
                      </div>

                      <button
                        onClick={() => { setEditingManager(true); setSelectedNewManager(null); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-caption-bold transition-all hover:opacity-80 flex-shrink-0"
                        style={{ background: AMBER_BG, color: AMBER, border: `1px solid ${AMBER_BORDER}` }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Manager
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" style={{ color: AMBER }} />
                          <span className="text-body-bold text-default-font">Promote a member to Manager</span>
                        </div>
                        <button
                          onClick={() => { setEditingManager(false); setSelectedNewManager(null); }}
                          className="text-caption text-subtext-color hover:text-default-font transition-colors"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {mockMembers.map(member => (
                          <button
                            key={member.id}
                            onClick={() => setSelectedNewManager(member.name)}
                            className="flex items-center gap-3 p-3 rounded-lg border transition-all text-left"
                            style={
                              selectedNewManager === member.name
                                ? { borderColor: AMBER, background: 'rgba(245,158,11,0.07)' }
                                : { borderColor: 'rgb(37,37,37)', background: 'rgb(19,19,19)' }
                            }
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-caption-bold flex-shrink-0"
                              style={{ background: selectedNewManager === member.name ? AMBER : '#0091FF' }}
                            >
                              {member.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-body text-default-font truncate">{member.name}</div>
                              <div className="text-caption text-subtext-color truncate">{member.role}</div>
                            </div>
                            {selectedNewManager === member.name && (
                              <Check className="w-4 h-4 flex-shrink-0" style={{ color: AMBER }} />
                            )}
                          </button>
                        ))}
                      </div>

                      {selectedNewManager ? (
                        <button
                          onClick={() => { setEditingManager(false); setSelectedNewManager(null); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-body-bold text-white transition-all hover:opacity-90"
                          style={{ background: AMBER }}
                        >
                          <Crown className="w-4 h-4" />
                          Promote {selectedNewManager} to Manager
                        </button>
                      ) : (
                        <div className="text-center text-caption text-subtext-color py-1">
                          Select a member above to promote
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MEMBERS */}
            <div className="mx-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-subtext-color" />
                <h3 className="text-heading-3 text-default-font">Members</h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-caption text-subtext-color">
                  {mockMembers.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {mockMembers.map(member => (
                  <div key={member.id}>
                    {deletingMemberId === member.id ? (
                      <div
                        className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all"
                        style={{ borderColor: '#E5484D', background: 'rgba(229,72,77,0.06)' }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-caption-bold flex-shrink-0"
                          style={{ background: '#E5484D' }}
                        >
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-body text-default-font font-medium">{member.name}</div>
                          <div className="text-caption" style={{ color: '#E5484D' }}>Remove from group?</div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => setDeletingMemberId(null)}
                            className="px-2.5 py-1 rounded text-caption-bold bg-neutral-100 text-default-font hover:bg-neutral-150 transition-colors border border-neutral-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setDeletingMemberId(null)}
                            className="px-2.5 py-1 rounded text-caption-bold text-white transition-colors"
                            style={{ background: '#E5484D' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-100 hover:border-neutral-300 transition-all group">
                        <Avatar initials={member.initials} size={9} />
                        <div className="flex-1 min-w-0">
                          <div className="text-body text-default-font font-medium truncate">{member.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-caption text-subtext-color truncate">{member.role}</span>
                            <span
                              className="px-1.5 py-0.5 rounded text-xs flex-shrink-0"
                              style={{ background: 'rgba(0,145,255,0.08)', color: '#0091FF' }}
                            >
                              {member.tasksCount} tasks
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setDeletingMemberId(member.id)}
                          className="p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          style={{ color: '#E5484D' }}
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Member */}
              <div className="relative">
                <button
                  onClick={() => { setShowAddMemberPopover(!showAddMemberPopover); setAddMemberSearch(''); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-neutral-300 text-caption-bold text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all"
                  style={showAddMemberPopover ? { borderColor: '#0091FF', color: '#0091FF', background: 'rgba(0,145,255,0.05)' } : {}}
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>

                {showAddMemberPopover && (
                  <div
                    className="absolute bottom-full mb-2 left-0 right-0 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden z-10"
                    style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.4)' }}
                  >
                    <div className="p-3 border-b border-neutral-200">
                      <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2">
                        <Search className="w-3.5 h-3.5 text-subtext-color flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Search members..."
                          value={addMemberSearch}
                          onChange={e => setAddMemberSearch(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-caption text-default-font placeholder:text-subtext-color"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-44 overflow-y-auto p-2 space-y-1">
                      {filteredAddMembers.length > 0
                        ? filteredAddMembers.map(m => (
                            <button
                              key={m.id}
                              onClick={() => setShowAddMemberPopover(false)}
                              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-600 transition-all text-left"
                            >
                              <Avatar initials={m.initials} color="#46A758" size={8} />
                              <div className="flex-1 min-w-0">
                                <div className="text-body text-default-font font-medium truncate">{m.name}</div>
                                <div className="text-caption text-subtext-color">{m.role}</div>
                              </div>
                              <UserPlus className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                            </button>
                          ))
                        : (
                          <div className="text-center py-5 text-caption text-subtext-color">No members found</div>
                        )
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TABS: Projects / Tasks / Subtasks */}
            <div className="mx-6 mt-6 mb-6">
              <div className="flex items-center p-1 bg-neutral-100 border border-neutral-200 rounded-lg mb-4 gap-1">
                {(['projects', 'tasks', 'subtasks'] as TabType[]).map(tab => {
                  const count = tab === 'projects' ? mockProjects.length : tab === 'tasks' ? mockTasks.length : totalSubtasks;
                  const icons = {
                    projects: <FolderOpen className="w-3.5 h-3.5" />,
                    tasks: <ListTodo className="w-3.5 h-3.5" />,
                    subtasks: <Layers className="w-3.5 h-3.5" />,
                  };
                  const active = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-caption-bold transition-all"
                      style={
                        active
                          ? { background: 'rgb(24,24,24)', color: 'rgb(250,250,250)', border: '1px solid rgb(37,37,37)' }
                          : { color: 'rgb(163,163,163)' }
                      }
                    >
                      {icons[tab]}
                      <span className="capitalize">{tab}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-xs"
                        style={
                          active
                            ? { background: '#0091FF', color: 'white' }
                            : { background: 'rgb(48,48,48)', color: 'rgb(163,163,163)' }
                        }
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {mockProjects.map(proj => (
                    <div
                      key={proj.id}
                      className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: proj.color + '18', border: `1px solid ${proj.color}33` }}
                        >
                          <Trophy className="w-5 h-5" style={{ color: proj.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div className="min-w-0">
                              <div className="text-body-bold text-default-font">{proj.name}</div>
                              <div className="text-caption text-subtext-color mt-0.5">{proj.description}</div>
                            </div>
                            <button
                              onClick={() => handleStartReassign(proj.id, 'project', proj.name)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Reassign
                            </button>
                          </div>

                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-caption text-subtext-color">Progress</span>
                                <span className="text-caption font-semibold" style={{ color: proj.color }}>{proj.progress}%</span>
                              </div>
                              <div className="w-full bg-neutral-150 rounded-full h-1.5">
                                <div
                                  className="h-1.5 rounded-full transition-all"
                                  style={{ width: `${proj.progress}%`, background: proj.color }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-caption text-subtext-color flex-shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#46A758' }} />
                              {proj.tasksCompleted}/{proj.tasksTotal} tasks
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            {proj.departments.map(dept => (
                              <span key={dept} className="px-2 py-0.5 rounded bg-neutral-150 text-caption text-subtext-color">{dept}</span>
                            ))}
                            <div className="flex items-center gap-1.5 ml-auto">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                style={{ background: '#0091FF', fontSize: 9, fontWeight: 700 }}
                              >
                                {getInitials(proj.assignee)}
                              </div>
                              <span className="text-caption text-subtext-color">{proj.assignee}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div className="space-y-2">
                  {mockTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-neutral-100 border border-neutral-200 rounded-lg p-3.5 hover:border-neutral-300 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {task.status === 'completed'
                            ? <CheckCircle2 className="w-4 h-4" style={{ color: '#46A758' }} />
                            : task.status === 'in-progress'
                            ? <Clock className="w-4 h-4" style={{ color: '#0091FF' }} />
                            : <AlertCircle className="w-4 h-4 text-subtext-color" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-body text-default-font font-medium">{task.name}</div>
                              <div className="text-caption text-subtext-color mt-0.5">{task.project}</div>
                            </div>
                            <button
                              onClick={() => handleStartReassign(task.id, 'task', task.name)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Reassign
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                            <div className="flex items-center gap-1.5 ml-auto">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                style={{ background: '#0091FF', fontSize: 9, fontWeight: 700 }}
                              >
                                {getInitials(task.assignee)}
                              </div>
                              <span className="text-caption text-subtext-color">{task.assignee}</span>
                              <span className="text-caption text-subtext-color">·</span>
                              <span className="text-caption text-subtext-color">{task.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtasks Tab */}
              {activeTab === 'subtasks' && (
                <div className="space-y-5">
                  {mockSubtaskGroups.map(group => (
                    <div key={group.taskName}>
                      <div className="flex items-center gap-2 mb-2 px-0.5">
                        <Layers className="w-3.5 h-3.5 text-subtext-color flex-shrink-0" />
                        <span className="text-caption-bold text-subtext-color uppercase tracking-wide whitespace-nowrap">{group.taskName}</span>
                        <div className="flex-1 h-px bg-neutral-200 ml-1" />
                        <span className="text-caption text-subtext-color ml-1 flex-shrink-0">
                          {group.subtasks.filter(s => s.completed).length}/{group.subtasks.length}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {group.subtasks.map(subtask => (
                          <div
                            key={subtask.id}
                            className="bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2.5 hover:border-neutral-300 transition-all group flex items-center gap-3"
                          >
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors"
                              style={
                                subtask.completed
                                  ? { background: '#46A758', borderColor: '#46A758' }
                                  : { background: 'transparent', borderColor: 'rgb(82,82,82)' }
                              }
                            >
                              {subtask.completed && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`flex-1 text-body min-w-0 ${subtask.completed ? 'line-through text-subtext-color' : 'text-default-font'}`}>
                              {subtask.name}
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                  style={{ background: '#0091FF', fontSize: 9, fontWeight: 700 }}
                                >
                                  {getInitials(subtask.assignee)}
                                </div>
                                <span className="text-caption text-subtext-color whitespace-nowrap">{subtask.assignee}</span>
                              </div>
                              <button
                                onClick={() => handleStartReassign(subtask.id, 'subtask', subtask.name)}
                                className="flex items-center gap-1 px-2 py-1 rounded text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Reassign
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex-shrink-0 border-t border-neutral-200 px-6 py-4 bg-neutral-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-subtext-color" />
              <span className="text-caption text-subtext-color">Preview mode — changes require confirmation</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ReassignOverlay
        reassigning={reassigning}
        onCancel={() => setReassigning(null)}
        onConfirm={() => setReassigning(null)}
      />
    </>
  );
}
