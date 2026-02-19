import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Plus, MessageSquare, Lightbulb, X, Save, CheckCircle, ChevronDown, Search, Filter, Folder } from 'lucide-react';
import { AddProjectModal } from './AddProjectModal';

interface Meeting {
  id: number;
  title: string;
  topic: string;
  date: string;
  time: string;
  groups: string[];
  members: string[];
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  duration: string;
  location: string;
  description: string;
}

interface MeetingDetailsPageProps {
  meeting: Meeting;
  onBack: () => void;
}

interface Task {
  id: number;
  title: string;
  project: string;
  subTask: string;
  assignedTo: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

interface Project {
  id: number;
  name: string;
  subTasks: string[];
}

const mockMembers = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@club.com' },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@club.com' },
  { id: 3, name: 'Pierre Bernard', email: 'pierre.bernard@club.com' },
  { id: 4, name: 'Sophie Dubois', email: 'sophie.dubois@club.com' },
  { id: 5, name: 'Luc Petit', email: 'luc.petit@club.com' },
];

const mockProjects: Project[] = [
  { 
    id: 1, 
    name: 'Stadium Renovation', 
    subTasks: ['Design Phase', 'Construction', 'Quality Control', 'Final Inspection'] 
  },
  { 
    id: 2, 
    name: 'Youth Development Program', 
    subTasks: ['Curriculum Design', 'Coach Training', 'Equipment Purchase', 'Student Recruitment'] 
  },
  { 
    id: 3, 
    name: 'Marketing Campaign', 
    subTasks: ['Market Research', 'Content Creation', 'Social Media', 'Event Planning'] 
  },
];

const mockDiscussions = [
  { id: 1, topic: 'Budget allocation for Q1', author: 'Jean Dupont', timestamp: '10:15 AM' },
  { id: 2, topic: 'Training facility upgrades needed', author: 'Marie Martin', timestamp: '10:32 AM' },
  { id: 3, topic: 'Recruitment strategy for summer', author: 'Pierre Bernard', timestamp: '11:05 AM' },
];

const mockIdeas = [
  { id: 1, idea: 'Implement new performance tracking system', author: 'Sophie Dubois', votes: 12 },
  { id: 2, idea: 'Host community engagement events', author: 'Luc Petit', votes: 8 },
  { id: 3, idea: 'Create mentorship program', author: 'Jean Dupont', votes: 15 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-brand-50 text-brand-600 border-brand-200';
    case 'Completed':
      return 'bg-success-50 text-success-600 border-success-200';
    case 'Cancelled':
      return 'bg-error-50 text-error-600 border-error-200';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-error-50 text-error-600 border-error-200';
    case 'Medium':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    case 'Low':
      return 'bg-success-50 text-success-600 border-success-200';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-success-50 text-success-600 border-success-200';
    case 'In Progress':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    case 'To Do':
      return 'bg-brand-50 text-brand-600 border-brand-200';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

export function MeetingDetailsPage({ meeting, onBack }: MeetingDetailsPageProps) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Review budget proposal',
      project: 'Stadium Renovation',
      subTask: 'Design Phase',
      assignedTo: 'Jean Dupont',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Prepare training materials',
      project: 'Youth Development Program',
      subTask: 'Coach Training',
      assignedTo: 'Marie Martin',
      status: 'To Do',
      priority: 'Medium'
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    project: '',
    subTask: '',
    assignedTo: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: projects.length + 1,
        name: newProjectName,
        subTasks: []
      };
      setProjects([...projects, newProject]);
      setNewTask({ ...newTask, project: newProjectName, subTask: '' });
      setNewProjectName('');
      setShowNewProjectInput(false);
    }
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.project && newTask.subTask && newTask.assignedTo) {
      const task: Task = {
        id: tasks.length + 1,
        title: newTask.title,
        project: newTask.project,
        subTask: newTask.subTask,
        assignedTo: newTask.assignedTo,
        status: 'To Do',
        priority: newTask.priority
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        project: '',
        subTask: '',
        assignedTo: '',
        priority: 'Medium'
      });
      setShowTaskModal(false);
    }
  };

  const selectedProject = projects.find(p => p.name === newTask.project);

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-[1400px] mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-body text-brand-600 hover:text-brand-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Meetings
        </button>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-heading-1 text-default-font mb-2">{meeting.title}</h1>
              <p className="text-body text-subtext-color">{meeting.topic}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-caption-bold border ${getStatusColor(meeting.status)}`}>
              {meeting.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Calendar className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color">Date</div>
                <div className="text-body-bold text-default-font">{meeting.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Clock className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color">Time</div>
                <div className="text-body-bold text-default-font">{meeting.time}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color">Location</div>
                <div className="text-body-bold text-default-font">{meeting.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Users className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color">Participants</div>
                <div className="text-body-bold text-default-font">{meeting.members.length} members</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h3 className="text-heading-3 text-default-font mb-2">Description</h3>
            <p className="text-body text-subtext-color">{meeting.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                <h2 className="text-heading-2 text-default-font">Discussion Points</h2>
              </div>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Plus className="w-4 h-4 text-brand-600" />
              </button>
            </div>
            <div className="space-y-3">
              {mockDiscussions.map((discussion) => (
                <div key={discussion.id} className="p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                  <div className="text-body text-default-font mb-1">{discussion.topic}</div>
                  <div className="text-caption text-subtext-color">
                    {discussion.author} • {discussion.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning-600" />
                <h2 className="text-heading-2 text-default-font">Ideas & Suggestions</h2>
              </div>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Plus className="w-4 h-4 text-brand-600" />
              </button>
            </div>
            <div className="space-y-3">
              {mockIdeas.map((idea) => (
                <div key={idea.id} className="p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                  <div className="text-body text-default-font mb-1">{idea.idea}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-caption text-subtext-color">{idea.author}</div>
                    <div className="text-caption-bold text-brand-600">{idea.votes} votes</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <h2 className="text-heading-2 text-default-font">Tasks To Do</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-200 text-brand-600 rounded-lg text-body hover:bg-neutral-150 transition-colors"
              >
                <Folder className="w-4 h-4" />
                Add Project
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 bg-neutral-100 rounded-lg border border-neutral-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-body-bold text-default-font mb-1">{task.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-caption text-subtext-color">
                        {task.project} → {task.subTask}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-caption-bold border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                    <div className={`px-2 py-1 rounded text-caption-bold border ${getTaskStatusColor(task.status)}`}>
                      {task.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-caption-bold">
                    {task.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-caption text-subtext-color">Assigned to {task.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-neutral-50 border-b border-neutral-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading-2 text-default-font">Add New Task</h2>
                <p className="text-body text-subtext-color mt-1">Create a task and assign it to a project</p>
              </div>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setShowNewProjectInput(false);
                  setNewProjectName('');
                  setNewTask({
                    title: '',
                    project: '',
                    subTask: '',
                    assignedTo: '',
                    priority: 'Medium'
                  });
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-subtext-color" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-caption-bold text-default-font mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-2">Project</label>
                {!showNewProjectInput ? (
                  <div className="space-y-2">
                    <select
                      value={newTask.project}
                      onChange={(e) => setNewTask({ ...newTask, project: e.target.value, subTask: '' })}
                      className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                    >
                      <option value="" className="bg-neutral-100 text-subtext-color">Select a project...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.name} className="bg-neutral-100 text-default-font">
                          {project.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowNewProjectInput(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-brand-600 hover:bg-neutral-150 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                      placeholder="Enter new project name..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddProject}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Project
                      </button>
                      <button
                        onClick={() => {
                          setShowNewProjectInput(false);
                          setNewProjectName('');
                        }}
                        className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {newTask.project && selectedProject && (
                <div>
                  <label className="block text-caption-bold text-default-font mb-2">Sub-Task</label>
                  <select
                    value={newTask.subTask}
                    onChange={(e) => setNewTask({ ...newTask, subTask: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                  >
                    <option value="" className="bg-neutral-100 text-subtext-color">Select a sub-task...</option>
                    {selectedProject.subTasks.map((subTask, index) => (
                      <option key={index} value={subTask} className="bg-neutral-100 text-default-font">
                        {subTask}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-caption-bold text-default-font mb-2">Assign To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                >
                  <option value="" className="bg-neutral-100 text-subtext-color">Select a member...</option>
                  {mockMembers.map((member) => (
                    <option key={member.id} value={member.name} className="bg-neutral-100 text-default-font">
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-caption-bold text-default-font mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
                >
                  <option value="Low" className="bg-neutral-100 text-default-font">Low</option>
                  <option value="Medium" className="bg-neutral-100 text-default-font">Medium</option>
                  <option value="High" className="bg-neutral-100 text-default-font">High</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setShowNewProjectInput(false); 
                    setNewProjectName('');
                    setNewTask({
                      title: '',
                      project: '',
                      subTask: '',
                      assignedTo: '',
                      priority: 'Medium'
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddTask}
                  disabled={!newTask.title || !newTask.project || !newTask.subTask || !newTask.assignedTo}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </div>
  );
}

const mockMeetings: Meeting[] = [
  {
    id: 1,
    title: 'Weekly Team Strategy Session',
    topic: 'Performance Review & Tactical Planning',
    date: '15 Jan 2026',
    time: '10:00 AM',
    groups: ['First Team', 'Coaching Staff'],
    members: ['Head Coach', 'Assistant Coach', 'Team Captain', 'Performance Analyst'],
    status: 'Completed',
    duration: '2 hours',
    location: 'Conference Room A',
    description: 'Weekly strategy meeting to review team performance and plan for upcoming matches.'
  },
  {
    id: 2,
    title: 'Youth Academy Development Meeting',
    topic: 'Talent Pipeline & Training Programs',
    date: '18 Jan 2026',
    time: '2:00 PM',
    groups: ['Academy', 'Development Staff'],
    members: ['Academy Director', 'Youth Coach', 'Scout Manager'],
    status: 'Upcoming',
    duration: '1.5 hours',
    location: 'Training Ground Office',
    description: 'Discussion on youth player development and academy program improvements.'
  },
  {
    id: 3,
    title: 'Medical & Fitness Review',
    topic: 'Player Health & Injury Prevention',
    date: '20 Jan 2026',
    time: '9:00 AM',
    groups: ['Medical Staff', 'Performance Team'],
    members: ['Team Doctor', 'Physiotherapist', 'Fitness Coach', 'Nutritionist'],
    status: 'Upcoming',
    duration: '1 hour',
    location: 'Medical Center',
    description: 'Monthly review of player health status and injury prevention strategies.'
  }
];

export function MeetingsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Upcoming' | 'Completed' | 'Cancelled'>('all');

  if (selectedMeeting) {
    return <MeetingDetailsPage meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />;
  }

  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-2">Meetings</h1>
          <p className="text-body text-subtext-color">Manage and track all team meetings</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext-color" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetings..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
              >
                <option value="all">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Meeting
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 hover:border-brand-600 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-heading-2 text-default-font">{meeting.title}</h2>
                    <div className={`px-3 py-1 rounded-full text-caption-bold border ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </div>
                  </div>
                  <p className="text-body text-subtext-color">{meeting.topic}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <div>
                    <div className="text-caption text-subtext-color">Date</div>
                    <div className="text-body-bold text-default-font">{meeting.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <div>
                    <div className="text-caption text-subtext-color">Time</div>
                    <div className="text-body-bold text-default-font">{meeting.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <div>
                    <div className="text-caption text-subtext-color">Location</div>
                    <div className="text-body-bold text-default-font">{meeting.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-600" />
                  <div>
                    <div className="text-caption text-subtext-color">Participants</div>
                    <div className="text-body-bold text-default-font">{meeting.members.length} members</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-200">
                {meeting.groups.map((group) => (
                  <span
                    key={group}
                    className="px-3 py-1 rounded-lg text-caption-bold bg-brand-50 text-brand-600"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredMeetings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body text-subtext-color">No meetings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}