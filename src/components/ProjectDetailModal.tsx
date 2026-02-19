import {
  X,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Building2,
  ClipboardList,
  Users
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  completed: boolean;
  assignedTo: string | null;
}

interface SubProject {
  id: string;
  name: string;
  icon: any;
  assignedTo: string;
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  icon: any;
  color: string;
  departments: string[];
  subProjects: Record<string, SubProject>;
}

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const getProjectStats = (project: Project) => {
  const subProjects = Object.values(project.subProjects || {});
  const allTasks = subProjects.flatMap((sp: SubProject) => sp.tasks || []);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed).length;
  const pendingTasks = allTasks.filter(t => !t.completed && t.assignedTo).length;
  const unassignedTasks = allTasks.filter(t => !t.assignedTo).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return { totalTasks, completedTasks, pendingTasks, unassignedTasks, progress };
};

export function ProjectDetailModal({ isOpen, onClose, project }: ProjectDetailModalProps) {
  if (!isOpen || !project) return null;

  const stats = getProjectStats(project);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-default-background border border-neutral-border rounded-lg shadow-overlay max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-50 to-brand-200 p-6 flex items-center justify-between border-b border-brand-300">
          <div className="flex items-center gap-4">
            {project.icon && <project.icon size={32} className="text-brand-600" />}
            <div>
              <h2 className="text-heading-2 text-default-font">{project.name}</h2>
              <p className="text-brand-700 text-caption mt-1">Project Overview & Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-300/50 rounded-md transition-colors text-default-font"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* Project Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Tasks */}
            <div className="bg-brand-100/20 p-4 rounded-md border border-brand-300">
              <div className="flex items-center gap-2 mb-2">
                <Target size={20} className="text-brand-600" />
                <span className="text-caption-bold text-subtext-color">Total Tasks</span>
              </div>
              <p className="text-heading-1 text-default-font">{stats.totalTasks}</p>
            </div>

            {/* Completed */}
            <div className="bg-success-50/30 p-4 rounded-md border border-success-400">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={20} className="text-success-600" />
                <span className="text-caption-bold text-subtext-color">Completed</span>
              </div>
              <p className="text-heading-1 text-success-600">{stats.completedTasks}</p>
            </div>

            {/* Pending */}
            <div className="bg-warning-50/30 p-4 rounded-md border border-warning-400">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-warning-600" />
                <span className="text-caption-bold text-subtext-color">Pending</span>
              </div>
              <p className="text-heading-1 text-warning-600">{stats.pendingTasks}</p>
            </div>

            {/* Unassigned */}
            <div className="bg-error-50/30 p-4 rounded-md border border-error-400">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={20} className="text-error-600" />
                <span className="text-caption-bold text-subtext-color">Unassigned</span>
              </div>
              <p className="text-heading-1 text-error-600">{stats.unassignedTasks}</p>
            </div>
          </div>

          {/* Alert Banners */}
          <div className="space-y-3">
            {/* Pending Tasks Alert */}
            {stats.pendingTasks > 0 && (
              <div className="bg-warning-50 border border-warning-400 rounded-md p-4 flex items-start gap-3">
                <Clock size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-body-bold text-warning-700 mb-1">Pending Tasks Require Attention</h4>
                  <p className="text-caption text-warning-600">{stats.pendingTasks} tasks are pending and need to be started or reviewed.</p>
                </div>
                <button className="px-3 py-1.5 bg-warning-600 hover:bg-warning-700 text-white text-caption-bold rounded transition-colors">
                  View All
                </button>
              </div>
            )}

            {/* Unassigned Tasks Alert */}
            {stats.unassignedTasks > 0 && (
              <div className="bg-error-50 border border-error-400 rounded-md p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-error-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-body-bold text-error-700 mb-1">Unassigned Tasks</h4>
                  <p className="text-caption text-error-600">{stats.unassignedTasks} tasks have no assigned team member. Assign them to continue progress.</p>
                </div>
                <button className="px-3 py-1.5 bg-error-600 hover:bg-error-700 text-white text-caption-bold rounded transition-colors">
                  Assign Now
                </button>
              </div>
            )}
          </div>

          {/* Progress Overview */}
          <div className="bg-neutral-50 p-4 rounded-md border border-neutral-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-600" />
                <h3 className="text-heading-3 text-default-font">Overall Progress</h3>
              </div>
              <span className="text-heading-3 text-brand-600 font-monospace-body">{stats.progress}%</span>
            </div>
            <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all" style={{ width: `${stats.progress}%` }} />
            </div>
            <div className="flex justify-between mt-3 text-caption text-subtext-color">
              <span>{stats.completedTasks} of {stats.totalTasks} completed</span>
              <span>{stats.totalTasks - stats.completedTasks} remaining</span>
            </div>
          </div>

          {/* Assigned Departments */}
          {project.departments && project.departments.length > 0 && (
            <div className="bg-neutral-50 p-4 rounded-md border border-neutral-border">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={20} className="text-brand-600" />
                <h3 className="text-heading-3 text-default-font">Assigned Departments</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.departments.map((dept: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-neutral-100 border border-neutral-border px-3 py-1.5 rounded-md text-caption-bold text-subtext-color"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Projects & Tasks */}
          <div>
            <h3 className="text-heading-3 text-default-font mb-4 flex items-center gap-2">
              <ClipboardList size={20} className="text-brand-600" />
              Sub-Projects & Tasks
            </h3>
            <div className="space-y-4">
              {Object.values(project.subProjects || {}).map((subProject: SubProject) => (
                <div key={subProject.id} className="bg-neutral-50 rounded-md border border-neutral-border overflow-hidden">

                  {/* Sub-Project Header */}
                  <div className="bg-neutral-100 border-b border-neutral-border p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {subProject.icon && <subProject.icon size={20} className="text-brand-600" />}
                        <div>
                          <h4 className="text-body-bold text-default-font">{subProject.name}</h4>
                          {subProject.assignedTo && (
                            <p className="text-caption text-subtext-color flex items-center gap-1 mt-1">
                              <Users size={14} />
                              {subProject.assignedTo}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-caption text-subtext-color font-monospace-body">
                          {subProject.tasks?.filter((t: Task) => t.completed).length || 0}/{subProject.tasks?.length || 0}
                        </span>
                        <div className="w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full transition-all"
                            style={{
                              width: `${((subProject.tasks?.filter((t: Task) => t.completed).length || 0) / (subProject.tasks?.length || 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="p-4 space-y-2">
                    {subProject.tasks && subProject.tasks.length > 0 ? (
                      subProject.tasks.map((task: Task) => (
                        <div
                          key={task.id}
                          className={`border rounded-md p-3 hover:border-neutral-300 transition-all group ${
                            task.completed
                              ? 'bg-success-50/30 border-success-200/50'
                              : !task.assignedTo
                              ? 'bg-error-50/30 border-error-200'
                              : 'bg-warning-50/20 border-warning-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {task.completed ? (
                              <CheckCircle2 size={18} className="text-success-600 flex-shrink-0" />
                            ) : !task.assignedTo ? (
                              <AlertCircle size={18} className="text-error-600 flex-shrink-0" />
                            ) : (
                              <Clock size={18} className="text-warning-600 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className={`text-body ${task.completed ? 'text-subtext-color/50 line-through' : 'text-default-font'}`}>
                                {task.name}
                              </p>
                              {!task.completed && task.assignedTo && (
                                <p className="text-caption text-subtext-color mt-1 flex items-center gap-1">
                                  <Users size={12} />
                                  Assigned to: {task.assignedTo}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {task.completed && (
                                <span className="px-2 py-0.5 bg-success-50 text-success-600 text-[10px] font-bold uppercase tracking-wider rounded border border-success-200">
                                  Done
                                </span>
                              )}
                              {!task.completed && !task.assignedTo && (
                                <span className="px-2 py-0.5 bg-error-50 text-error-600 text-[10px] font-bold uppercase tracking-wider rounded border border-error-200">
                                  Unassigned
                                </span>
                              )}
                              {!task.completed && task.assignedTo && (
                                <span className="px-2 py-0.5 bg-warning-50 text-warning-600 text-[10px] font-bold uppercase tracking-wider rounded border border-warning-200">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-caption text-subtext-color italic text-center py-2">No tasks created yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-border bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-default-font rounded-md transition-colors border border-neutral-border text-body-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
