// src/components/dashboard/ProjectHighlights.tsx
"use client";

import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface ProjectData {
  name: string;
  code: string;
  location: string;
  employees: number;
  workHours: number;
  otHours: number;
  lastUpdated: string;
}

interface ProjectHighlightsProps {
  projects: ProjectData[];
}

const ProjectHighlights: React.FC<ProjectHighlightsProps> = ({ projects }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Project Highlights
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.code} • {project.location}</p>
                </div>
                <button
                  className="border border-gray-200 rounded-lg px-4 py-1 text-black-900 bg-white text-sm font-medium transition hover:border-gray-300"
                >
                  Details
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Employees</p>
                  <p className="font-medium">{project.employees}</p>
                </div>
                <div>
                  <p className="text-gray-600">Work Hours</p>
                  <p className="font-medium">{project.workHours}</p>
                </div>
                <div>
                  <p className="text-gray-600">OT Hours</p>
                  <p className="font-medium">{project.otHours}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Last updated: {project.lastUpdated}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectHighlights;