import React, { useState } from 'react';
import { X, Plus, Trash2, ChevronDown, User, Calendar } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-50 rounded-lg shadow-overlay w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
          <h2 className="text-heading-2 text-default-font">Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200 text-neutral-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Project Details Section */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-body-bold text-default-font mb-2">
                Project Name *
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                className="w-full px-4 py-3 bg-neutral-100 border border-neutral-border rounded-lg text-body text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-body-bold text-default-font mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your project..."
                rows={4}
                className="w-full px-4 py-3 bg-neutral-100 border border-neutral-border rounded-lg text-body text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-3 text-default-font">Tasks</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-150 text-brand-600 rounded-lg transition-colors duration-200 text-body-bold">
                <Plus size={16} />
                Add Task
              </button>
            </div>

            {/* Task Item Example */}
            <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-border space-y-4">
              {/* Task Header */}
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Task name"
                    className="w-full px-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-body text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 transition-colors"
                  />
                  <textarea
                    placeholder="Task description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-caption text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 transition-colors resize-none"
                  />
                </div>
                <button className="p-2 hover:bg-neutral-150 rounded-lg transition-colors text-error-600">
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Task Assignment & Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-caption text-subtext-color mb-1">
                    Assign to
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-color" />
                    <select className="w-full pl-9 pr-8 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-body text-default-font appearance-none focus:outline-none focus:border-brand-600 transition-colors cursor-pointer">
                      <option>Select member</option>
                      <option>John Doe</option>
                      <option>Jane Smith</option>
                      <option>Bob Johnson</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext-color pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-caption text-subtext-color mb-1">
                    Due date
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-color" />
                    <input
                      type="date"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption-bold text-subtext-color">Subtasks</span>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-neutral-150 text-brand-600 rounded text-caption-bold transition-colors">
                    <Plus size={14} />
                    Add Subtask
                  </button>
                </div>

                {/* Subtask Item Example */}
                <div className="flex items-start gap-3 pl-4 border-l-2 border-neutral-200">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Subtask name"
                      className="w-full px-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-caption text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 transition-colors"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-subtext-color" />
                        <select className="w-full pl-7 pr-6 py-1.5 bg-neutral-0 border border-neutral-border rounded text-caption text-default-font appearance-none focus:outline-none focus:border-brand-600 transition-colors cursor-pointer">
                          <option>Assign to</option>
                          <option>John Doe</option>
                          <option>Jane Smith</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-subtext-color pointer-events-none" />
                      </div>

                      <div className="relative">
                        <Calendar size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-subtext-color" />
                        <input
                          type="date"
                          className="w-full pl-7 pr-2 py-1.5 bg-neutral-0 border border-neutral-border rounded text-caption text-default-font focus:outline-none focus:border-brand-600 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-neutral-150 rounded transition-colors text-error-600">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Another Subtask Item Example */}
                <div className="flex items-start gap-3 pl-4 border-l-2 border-neutral-200">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Subtask name"
                      className="w-full px-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-caption text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 transition-colors"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-subtext-color" />
                        <select className="w-full pl-7 pr-6 py-1.5 bg-neutral-0 border border-neutral-border rounded text-caption text-default-font appearance-none focus:outline-none focus:border-brand-600 transition-colors cursor-pointer">
                          <option>Assign to</option>
                          <option>John Doe</option>
                          <option>Jane Smith</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-subtext-color pointer-events-none" />
                      </div>

                      <div className="relative">
                        <Calendar size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-subtext-color" />
                        <input
                          type="date"
                          className="w-full pl-7 pr-2 py-1.5 bg-neutral-0 border border-neutral-border rounded text-caption text-default-font focus:outline-none focus:border-brand-600 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-neutral-150 rounded transition-colors text-error-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Another Task Item Example */}
            <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-border space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Task name"
                    className="w-full px-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-body text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 transition-colors"
                  />
                  <textarea
                    placeholder="Task description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-caption text-default-font placeholder:text-subtext-color focus:outline-none focus:border-brand-600 transition-colors resize-none"
                  />
                </div>
                <button className="p-2 hover:bg-neutral-150 rounded-lg transition-colors text-error-600">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-caption text-subtext-color mb-1">
                    Assign to
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-color" />
                    <select className="w-full pl-9 pr-8 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-body text-default-font appearance-none focus:outline-none focus:border-brand-600 transition-colors cursor-pointer">
                      <option>Select member</option>
                      <option>John Doe</option>
                      <option>Jane Smith</option>
                      <option>Bob Johnson</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext-color pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-caption text-subtext-color mb-1">
                    Due date
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-color" />
                    <input
                      type="date"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-0 border border-neutral-border rounded-lg text-body text-default-font focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption-bold text-subtext-color">Subtasks</span>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-neutral-150 text-brand-600 rounded text-caption-bold transition-colors">
                    <Plus size={14} />
                    Add Subtask
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-border bg-neutral-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-150 text-default-font rounded-lg transition-colors duration-200 text-body-bold"
          >
            Cancel
          </button>
          <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors duration-200 text-body-bold">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
