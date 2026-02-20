import { useState } from 'react';
import {
  X, Shield, Mail, Phone, MapPin, Calendar, Award, Briefcase,
  CheckCircle2, Clock, AlertCircle, Layers, ListTodo, FolderOpen,
  FileText, BookOpen, Edit3, Download, ExternalLink, ChevronRight,
  Star, TrendingUp, Target, RefreshCw, Check, ArrowRight, Users,
  Zap, MessageSquare, BarChart2, User,
} from 'lucide-react';

const mockMember = {
  name: "Jacer Khaled",
  initials: "JK",
  title: "Senior Developer",
  department: "Engineering & Tech Division",
  email: "jacer.khaled@club.tn",
  phone: "+216 55 234 789",
  location: "Tunis, Tunisia",
  joinedAt: "March 4, 2024",
  contractType: "Full-time CDI",
  status: "active" as const,
  avatarColor: "#0091FF",
};

const mockRoles = [
  {
    id: 'r1',
    name: "Technical Lead",
    category: "Leadership",
    icon: "star",
    description: "Oversees technical decisions, architecture reviews and engineering standards across the division.",
    since: "Jan 2025",
    color: "#f59e0b",
  },
  {
    id: 'r2',
    name: "Senior Developer",
    category: "Engineering",
    icon: "zap",
    description: "Core development role responsible for platform features, code reviews and junior mentoring.",
    since: "Mar 2024",
    color: "#0091FF",
  },
  {
    id: 'r3',
    name: "Performance Analyst",
    category: "Analytics",
    icon: "trending-up",
    description: "Analyzes squad and operational performance data, produces weekly dashboards and KPI reports.",
    since: "Jun 2024",
    color: "#46A758",
  },
  {
    id: 'r4',
    name: "Scrum Master",
    category: "Process",
    icon: "target",
    description: "Facilitates sprint ceremonies, removes blockers and ensures delivery cadence for the tech squad.",
    since: "Sep 2024",
    color: "#2EC8EE",
  },
];

const mockProjects = [
  {
    id: 'p1', name: "Platform Rebuild v2", color: "#46A758",
    progress: 45, tasksCompleted: 6, tasksTotal: 14,
    role: "Lead Developer", status: "active" as const,
  },
  {
    id: 'p2', name: "First Team Ops", color: "#0091FF",
    progress: 62, tasksCompleted: 6, tasksTotal: 10,
    role: "Developer", status: "active" as const,
  },
  {
    id: 'p3', name: "Analytics Dashboard", color: "#f59e0b",
    progress: 90, tasksCompleted: 9, tasksTotal: 10,
    role: "Contributor", status: "completed" as const,
  },
];

const mockTasks = [
  { id: 't1', name: "CI/CD Pipeline Optimization", project: "Platform Rebuild v2", status: 'in-progress' as const, priority: 'high' as const, dueDate: "Feb 7, 2026" },
  { id: 't2', name: "GitHub Actions Workflow Update", project: "Platform Rebuild v2", status: 'todo' as const, priority: 'medium' as const, dueDate: "Feb 14, 2026" },
  { id: 't3', name: "Injury Assessment Reports", project: "First Team Ops", status: 'in-progress' as const, priority: 'high' as const, dueDate: "Feb 12, 2026" },
  { id: 't4', name: "API Gateway Migration", project: "Platform Rebuild v2", status: 'todo' as const, priority: 'medium' as const, dueDate: "Feb 20, 2026" },
  { id: 't5', name: "KPI Dashboard Charts", project: "Analytics Dashboard", status: 'completed' as const, priority: 'low' as const, dueDate: "Jan 30, 2026" },
  { id: 't6', name: "Player Stats Integration", project: "Analytics Dashboard", status: 'completed' as const, priority: 'medium' as const, dueDate: "Jan 25, 2026" },
];

const mockSubtaskGroups = [
  {
    taskName: "CI/CD Pipeline Optimization",
    project: "Platform Rebuild v2",
    subtasks: [
      { id: 's1', name: "Docker container build analysis", completed: true },
      { id: 's2', name: "GitHub Actions workflow rewrite", completed: false },
      { id: 's3', name: "Staging environment validation", completed: false },
    ],
  },
  {
    taskName: "Injury Assessment Reports",
    project: "First Team Ops",
    subtasks: [
      { id: 's4', name: "Data collection from medical staff", completed: true },
      { id: 's5', name: "Report template setup", completed: true },
      { id: 's6', name: "Sign-off with coaching staff", completed: false },
    ],
  },
  {
    taskName: "API Gateway Migration",
    project: "Platform Rebuild v2",
    subtasks: [
      { id: 's7', name: "Endpoint mapping document", completed: false },
      { id: 's8', name: "Auth middleware refactor", completed: false },
    ],
  },
];

const ficheDePoste = {
  title: "Senior Developer",
  department: "Engineering & Tech Division",
  reportingTo: "Bilel Mansour — Owner & CEO",
  contractType: "Full-time CDI",
  updatedAt: "Jan 15, 2026",
  mission: "Develop, maintain and continuously improve the club's digital platform and internal tools, ensuring high performance, scalability and security across all systems.",
  responsibilities: [
    "Design and implement new platform features aligned with product roadmap",
    "Conduct thorough code reviews and enforce engineering best practices",
    "Mentor junior developers and facilitate knowledge sharing sessions",
    "Collaborate with product and design teams on technical feasibility",
    "Monitor system health and respond to incidents within SLA",
    "Maintain technical documentation for all delivered features",
  ],
  competencies: [
    { label: "React / TypeScript", level: 95 },
    { label: "Node.js / APIs", level: 88 },
    { label: "DevOps / CI-CD", level: 72 },
    { label: "System Design", level: 80 },
  ],
  kpis: [
    "Feature delivery velocity (sprints)",
    "Code review turnaround < 24h",
    "Bug resolution rate > 90%",
    "Platform uptime SLA 99.9%",
  ],
};

const reglement = {
  updatedAt: "Feb 1, 2026",
  signedAt: "Mar 10, 2024",
  sections: [
    {
      id: 'reg1',
      title: "Working Hours & Attendance",
      icon: "clock",
      color: "#0091FF",
      articles: [
        { id: 'a1', num: "1.1", text: "Standard working hours are 09:00–18:00, Monday to Friday, with a one-hour lunch break." },
        { id: 'a2', num: "1.2", text: "Remote work is permitted up to 3 days per week subject to manager approval." },
        { id: 'a3', num: "1.3", text: "Absences must be declared via HR portal at least 24 hours in advance." },
      ],
    },
    {
      id: 'reg2',
      title: "Code of Conduct",
      icon: "shield",
      color: "#46A758",
      articles: [
        { id: 'a4', num: "2.1", text: "All employees must maintain respectful, professional communication in all channels." },
        { id: 'a5', num: "2.2", text: "Confidential club data must not be shared externally without written authorisation." },
        { id: 'a6', num: "2.3", text: "Personal conflicts must be escalated to HR before affecting team operations." },
      ],
    },
    {
      id: 'reg3',
      title: "Communication & Meetings",
      icon: "message",
      color: "#2EC8EE",
      articles: [
        { id: 'a7', num: "3.1", text: "All team meetings require a shared agenda 30 minutes before the scheduled time." },
        { id: 'a8', num: "3.2", text: "Response to internal messages is expected within 2 working hours during core hours." },
      ],
    },
    {
      id: 'reg4',
      title: "Performance & Evaluation",
      icon: "bar",
      color: "#f59e0b",
      articles: [
        { id: 'a9', num: "4.1", text: "Performance reviews are conducted quarterly with direct line manager and HR." },
        { id: 'a10', num: "4.2", text: "OKRs must be set at the start of each quarter and reviewed at mid-point." },
        { id: 'a11', num: "4.3", text: "Exceptional contributions are recognised through the Club Innovation Awards programme." },
      ],
    },
  ],
};

type MainTab = 'roles' | 'projects' | 'tasks' | 'subtasks' | 'fiche' | 'reglement';

interface MemberPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function StatusBadge({ status }: { status: 'completed' | 'in-progress' | 'todo' }) {
  const map = {
    completed: { label: 'Completed', bg: 'rgba(70,167,88,0.12)', color: '#46A758', border: 'rgba(70,167,88,0.25)', Icon: CheckCircle2 },
    'in-progress': { label: 'In Progress', bg: 'rgba(0,145,255,0.1)', color: '#0091FF', border: 'rgba(0,145,255,0.2)', Icon: Clock },
    todo: { label: 'To Do', bg: 'rgba(163,163,163,0.1)', color: '#737373', border: 'rgba(163,163,163,0.2)', Icon: AlertCircle },
  };
  const { label, bg, color, border, Icon } = map[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const colors = { high: '#E5484D', medium: '#f59e0b', low: '#46A758' };
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium capitalize"
      style={{ color: colors[priority] }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors[priority] }} />
      {priority}
    </span>
  );
}

function RoleIcon({ icon, color }: { icon: string; color: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    star: <Star className="w-4 h-4" />,
    zap: <Zap className="w-4 h-4" />,
    'trending-up': <TrendingUp className="w-4 h-4" />,
    target: <Target className="w-4 h-4" />,
  };
  return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: color + '18', border: `1px solid ${color}33`, color }}>
      {iconMap[icon] ?? <Star className="w-4 h-4" />}
    </div>
  );
}

function RegIcon({ icon, color }: { icon: string; color: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    clock: <Clock className="w-4 h-4" />,
    shield: <Shield className="w-4 h-4" />,
    message: <MessageSquare className="w-4 h-4" />,
    bar: <BarChart2 className="w-4 h-4" />,
  };
  return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: color + '18', border: `1px solid ${color}33`, color }}>
      {iconMap[icon] ?? <FileText className="w-4 h-4" />}
    </div>
  );
}

const TAB_CONFIG: { id: MainTab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'roles', label: 'Roles', Icon: Award },
  { id: 'projects', label: 'Projects', Icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', Icon: ListTodo },
  { id: 'subtasks', label: 'Subtasks', Icon: Layers },
  { id: 'fiche', label: 'Fiche de Poste', Icon: FileText },
  { id: 'reglement', label: 'Règlement', Icon: BookOpen },
];

export default function MemberPreviewModal({ isOpen, onClose }: MemberPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('roles');
  const [expandedReg, setExpandedReg] = useState<string | null>('reg1');
  const [ficheSection, setFicheSection] = useState<'overview' | 'competencies' | 'kpis'>('overview');

  if (!isOpen) return null;

  const totalSubtasks = mockSubtaskGroups.reduce((s, g) => s + g.subtasks.length, 0);
  const completedSubtasks = mockSubtaskGroups.reduce((s, g) => s + g.subtasks.filter(st => st.completed).length, 0);
  const activeTasks = mockTasks.filter(t => t.status !== 'completed').length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        className="bg-neutral-50 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
      >

        {/* HEADER */}
        <div className="relative flex-shrink-0 border-b border-neutral-200 overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(ellipse at top left, ${mockMember.avatarColor} 0%, transparent 60%)` }} />
          <div className="relative px-6 py-5 flex items-start gap-5 pr-14">
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                style={{ background: `linear-gradient(135deg, ${mockMember.avatarColor} 0%, #005FC2 100%)` }}
              >
                {mockMember.initials}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-50"
                style={{ background: '#46A758' }}
                title="Active"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-heading-2 text-default-font">{mockMember.name}</h2>
                <span
                  className="px-2.5 py-0.5 rounded-full text-caption-bold"
                  style={{ background: 'rgba(70,167,88,0.12)', color: '#46A758', border: '1px solid rgba(70,167,88,0.25)' }}
                >
                  Active
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <Briefcase className="w-3.5 h-3.5 text-subtext-color" />
                <span className="text-body text-subtext-color">{mockMember.title}</span>
                <span className="text-subtext-color">·</span>
                <Users className="w-3.5 h-3.5 text-subtext-color" />
                <span className="text-body text-subtext-color">{mockMember.department}</span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-subtext-color" />
                  <span className="text-caption text-subtext-color">{mockMember.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-subtext-color" />
                  <span className="text-caption text-subtext-color">{mockMember.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-subtext-color" />
                  <span className="text-caption text-subtext-color">{mockMember.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-subtext-color" />
                  <span className="text-caption text-subtext-color">Joined {mockMember.joinedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 mt-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-100 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all">
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-100 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all">
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative px-6 pb-4 flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
              <span className="text-caption text-subtext-color">{mockRoles.length} roles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-subtext-color" />
              <span className="text-caption text-subtext-color">{mockProjects.length} projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5 text-subtext-color" />
              <span className="text-caption text-subtext-color">{activeTasks} active, {completedTasks} done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-subtext-color" />
              <span className="text-caption text-subtext-color">{completedSubtasks}/{totalSubtasks} subtasks</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Shield className="w-3.5 h-3.5 text-subtext-color" />
              <span className="text-caption text-subtext-color">{mockMember.contractType}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-subtext-color" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex-shrink-0 border-b border-neutral-200 bg-neutral-100 px-6 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {TAB_CONFIG.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="relative flex items-center gap-1.5 px-3 py-3 text-caption-bold transition-all whitespace-nowrap"
                  style={{ color: active ? '#0091FF' : 'rgb(163,163,163)' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                      style={{ background: '#0091FF' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6">

          {/* ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-3">
              {mockRoles.map(role => (
                <div
                  key={role.id}
                  className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-all group"
                  style={{ borderLeftWidth: 3, borderLeftColor: role.color }}
                >
                  <div className="flex items-start gap-4">
                    <RoleIcon icon={role.icon} color={role.color} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-body-bold text-default-font">{role.name}</span>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: role.color + '18', color: role.color, border: `1px solid ${role.color}33` }}
                            >
                              {role.category}
                            </span>
                          </div>
                          <p className="text-caption text-subtext-color leading-relaxed">{role.description}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all"
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-subtext-color" />
                          <span className="text-caption text-subtext-color">Since {role.since}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-neutral-300 text-caption-bold text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all mt-2">
                + Assign New Role
              </button>
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {mockProjects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: proj.color + '18', border: `1px solid ${proj.color}33` }}
                    >
                      <FolderOpen className="w-5 h-5" style={{ color: proj.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-body-bold text-default-font truncate">{proj.name}</span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                            style={{ background: proj.color + '18', color: proj.color, border: `1px solid ${proj.color}33` }}
                          >
                            {proj.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 transition-all"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Reassign
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-caption text-subtext-color">Progress</span>
                            <span className="text-caption font-semibold" style={{ color: proj.color }}>{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-150 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${proj.progress}%`, background: proj.color }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-caption text-subtext-color flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#46A758' }} />
                          {proj.tasksCompleted}/{proj.tasksTotal} tasks
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TASKS */}
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
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all">
                            <RefreshCw className="w-3 h-3" />Reassign
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <StatusBadge status={task.status} />
                        <PriorityDot priority={task.priority} />
                        <div className="flex items-center gap-1 ml-auto">
                          <Calendar className="w-3 h-3 text-subtext-color" />
                          <span className="text-caption text-subtext-color">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUBTASKS */}
          {activeTab === 'subtasks' && (
            <div className="space-y-6">
              {mockSubtaskGroups.map(group => (
                <div key={group.taskName}>
                  <div className="flex items-center gap-2 mb-3 px-0.5">
                    <Layers className="w-3.5 h-3.5 text-subtext-color flex-shrink-0" />
                    <span className="text-caption-bold text-subtext-color uppercase tracking-wide whitespace-nowrap">{group.taskName}</span>
                    <span className="text-caption text-subtext-color ml-0.5">— {group.project}</span>
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
                          style={subtask.completed
                            ? { background: '#46A758', borderColor: '#46A758' }
                            : { background: 'transparent', borderColor: 'rgb(82,82,82)' }
                          }
                        >
                          {subtask.completed && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`flex-1 text-body min-w-0 ${subtask.completed ? 'line-through text-subtext-color' : 'text-default-font'}`}>
                          {subtask.name}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 flex-shrink-0">
                          <button className="flex items-center gap-1 px-2 py-1 rounded text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-brand-600 hover:text-brand-600 transition-all">
                            <RefreshCw className="w-3 h-3" />Reassign
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FICHE DE POSTE */}
          {activeTab === 'fiche' && (
            <div>
              {/* Fiche Header */}
              <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5 mb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(0,145,255,0.1)', border: '1px solid rgba(0,145,255,0.2)' }}
                    >
                      <FileText className="w-6 h-6" style={{ color: '#0091FF' }} />
                    </div>
                    <div>
                      <div className="text-heading-3 text-default-font mb-0.5">{ficheDePoste.title}</div>
                      <div className="text-caption text-subtext-color">{ficheDePoste.department}</div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-subtext-color" />
                          <span className="text-caption text-subtext-color">{ficheDePoste.reportingTo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3 text-subtext-color" />
                          <span className="text-caption text-subtext-color">{ficheDePoste.contractType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-subtext-color" />
                          <span className="text-caption text-subtext-color">Updated {ficheDePoste.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all">
                      <Download className="w-3.5 h-3.5" />PDF
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold text-white transition-all hover:opacity-90"
                      style={{ background: '#0091FF' }}>
                      <Edit3 className="w-3.5 h-3.5" />Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Fiche Sub-tabs */}
              <div className="flex items-center gap-1 p-1 bg-neutral-100 border border-neutral-200 rounded-lg mb-5">
                {(['overview', 'competencies', 'kpis'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFicheSection(s)}
                    className="flex-1 py-2 rounded-md text-caption-bold transition-all capitalize"
                    style={ficheSection === s
                      ? { background: 'rgb(24,24,24)', color: 'rgb(250,250,250)', border: '1px solid rgb(37,37,37)' }
                      : { color: 'rgb(163,163,163)' }
                    }
                  >
                    {s === 'kpis' ? 'KPIs' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {ficheSection === 'overview' && (
                <div className="space-y-5">
                  <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4" style={{ color: '#0091FF' }} />
                      <h4 className="text-heading-3 text-default-font">Mission Statement</h4>
                    </div>
                    <p className="text-body text-subtext-color leading-relaxed">{ficheDePoste.mission}</p>
                  </div>
                  <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#46A758' }} />
                      <h4 className="text-heading-3 text-default-font">Key Responsibilities</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {ficheDePoste.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(70,167,88,0.12)', border: '1px solid rgba(70,167,88,0.25)' }}>
                            <span className="text-xs font-bold" style={{ color: '#46A758' }}>{i + 1}</span>
                          </div>
                          <span className="text-body text-subtext-color">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {ficheSection === 'competencies' && (
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <h4 className="text-heading-3 text-default-font">Core Competencies</h4>
                  </div>
                  <div className="space-y-5">
                    {ficheDePoste.competencies.map(comp => (
                      <div key={comp.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-body text-default-font font-medium">{comp.label}</span>
                          <span className="text-caption-bold" style={{ color: '#0091FF' }}>{comp.level}%</span>
                        </div>
                        <div className="w-full bg-neutral-150 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${comp.level}%`, background: 'linear-gradient(90deg, #0091FF 0%, #2EC8EE 100%)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ficheSection === 'kpis' && (
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <h4 className="text-heading-3 text-default-font">Key Performance Indicators</h4>
                  </div>
                  <div className="space-y-2.5">
                    {ficheDePoste.kpis.map((kpi, i) => (
                      <div key={i}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-neutral-200 bg-neutral-50"
                        style={{ borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}
                      >
                        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontWeight: 700, fontSize: 11 }}>
                          {i + 1}
                        </div>
                        <span className="text-body text-default-font">{kpi}</span>
                        <ChevronRight className="w-4 h-4 text-subtext-color ml-auto flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REGLEMENT */}
          {activeTab === 'reglement' && (
            <div>
              {/* Reg Header */}
              <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(70,167,88,0.1)', border: '1px solid rgba(70,167,88,0.2)' }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: '#46A758' }} />
                  </div>
                  <div>
                    <div className="text-body-bold text-default-font">Règlement Intérieur</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-caption text-subtext-color">Updated {reglement.updatedAt}</span>
                      <span
                        className="flex items-center gap-1 text-caption"
                        style={{ color: '#46A758' }}
                      >
                        <Check className="w-3 h-3" />Signed {reglement.signedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 transition-all">
                    <Download className="w-3.5 h-3.5" />PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />Send for Signature
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {reglement.sections.map(section => (
                  <div key={section.id} className="bg-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedReg(expandedReg === section.id ? null : section.id)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-neutral-150 transition-colors"
                    >
                      <RegIcon icon={section.icon} color={section.color} />
                      <div className="flex-1 min-w-0">
                        <div className="text-body-bold text-default-font">{section.title}</div>
                        <div className="text-caption text-subtext-color">{section.articles.length} articles</div>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 text-subtext-color flex-shrink-0 transition-transform"
                        style={{ transform: expandedReg === section.id ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      />
                    </button>

                    {expandedReg === section.id && (
                      <div className="border-t border-neutral-200 divide-y divide-neutral-200">
                        {section.articles.map(article => (
                          <div key={article.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-neutral-50 transition-colors">
                            <span
                              className="text-caption-bold flex-shrink-0 mt-0.5 w-8"
                              style={{ color: section.color }}
                            >
                              {article.num}
                            </span>
                            <p className="text-body text-subtext-color leading-relaxed flex-1">{article.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 border-t border-neutral-200 bg-neutral-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-subtext-color" />
            <span className="text-caption text-subtext-color">Preview mode — changes require confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-caption-bold bg-neutral-50 border border-neutral-200 text-subtext-color hover:border-neutral-300 hover:text-default-font transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Full Profile
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-body text-default-font bg-neutral-50 border border-neutral-200 hover:bg-neutral-150 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
