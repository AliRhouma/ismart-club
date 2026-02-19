import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  { id: 6, name: 'Sarah Johnson', email: 'sarah.johnson@club.com' },
  { id: 7, name: 'Mike Chen', email: 'mike.chen@club.com' },
  { id: 8, name: 'Emma Davis', email: 'emma.davis@club.com' },
  { id: 9, name: 'Alex Rivera', email: 'alex.rivera@club.com' },
  { id: 10, name: 'Lisa Park', email: 'lisa.park@club.com' },
];

const initialProjects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    subTasks: ['Homepage Design', 'Player Profiles Section', 'News & Media Hub', 'Ticket Booking System']
  },
  {
    id: 2,
    name: 'Marketing Campaign Q1',
    subTasks: ['Social Media Strategy', 'Email Campaign', 'Billboard Advertising']
  },
  {
    id: 3,
    name: 'Mobile App Development',
    subTasks: ['Feature Requirements', 'UI/UX Design', 'Backend Architecture']
  },
  {
    id: 4,
    name: 'Stadium Renovation',
    subTasks: ['Safety Inspections', 'VIP Lounge Construction', 'Seating Installation']
  },
  {
    id: 5,
    name: 'Youth Academy Program',
    subTasks: ['Curriculum Development', 'Coach Recruitment', 'Facility Upgrades']
  },
  {
    id: 6,
    name: 'Analytics Dashboard',
    subTasks: ['Data Pipeline Setup', 'Visualization Components', 'Machine Learning Models']
  },
];

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: '',
    subTask: '',
    assignedTo: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    status: 'not-started' as 'not-started' | 'in-progress' | 'on-hold' | 'in-review' | 'completed',
    dueDate: ''
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
    if (newTask.title && newTask.project && newTask.assignedTo) {
      console.log('Task added:', newTask);

      setNewTask({
        title: '',
        description: '',
        project: '',
        subTask: '',
        assignedTo: '',
        priority: 'Medium',
        status: 'not-started',
        dueDate: ''
      });
      onClose();
    }
  };

  const handleClose = () => {
    setShowNewProjectInput(false);
    setNewProjectName('');
    setNewTask({
      title: '',
      description: '',
      project: '',
      subTask: '',
      assignedTo: '',
      priority: 'Medium',
      status: 'not-started',
      dueDate: ''
    });
    onClose();
  };

  const selectedProject = projects.find(p => p.name === newTask.project);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-50 border-b border-neutral-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-heading-2 text-default-font">Add New Task</h2>
            <p className="text-body text-subtext-color mt-1">Create a task and assign it to a project</p>
          </div>
          <button
            onClick={handleClose}
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
            <label className="block text-caption-bold text-default-font mb-2">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600 resize-none"
              placeholder="Enter task description..."
              rows={3}
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

          {newTask.project && selectedProject && selectedProject.subTasks.length > 0 && (
            <div>
              <label className="block text-caption-bold text-default-font mb-2">Sub-Task (Optional)</label>
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

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-caption-bold text-default-font mb-2">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
              >
                <option value="not-started" className="bg-neutral-100 text-default-font">Not Started</option>
                <option value="in-progress" className="bg-neutral-100 text-default-font">In Progress</option>
                <option value="on-hold" className="bg-neutral-100 text-default-font">On Hold</option>
                <option value="in-review" className="bg-neutral-100 text-default-font">In Review</option>
                <option value="completed" className="bg-neutral-100 text-default-font">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-caption-bold text-default-font mb-2">Due Date</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-body text-default-font hover:bg-neutral-150 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              disabled={!newTask.title || !newTask.project || !newTask.assignedTo}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-body hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
