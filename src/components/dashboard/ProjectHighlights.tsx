"use client";
import React, { useEffect, useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { getSession } from 'next-auth/react'; // Import getSession

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

const ProjectHighlights: React.FC<ProjectHighlightsProps> = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProjects = async () => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/all`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`, // Add the token
        },
      });

      if (!response.ok) throw new Error('Failed to fetch projects');

      const result = await response.json();
      console.log('API response:', result);

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
      } else {
        console.error('Unexpected data structure:', result);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Project Highlights
        </h2>
      </div>
      <div className="py-6">
        {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading projects...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.code} • {project.location}
                  </p>
                </div>
                {/* <button
                  className="border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-1 bg-white dark:bg-gray-700 text-sm font-medium text-black dark:text-white transition hover:border-gray-300 dark:hover:border-gray-500"
                >
                  Details
                </button> */}
              </div>  
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Employees</p>
                  <p className="font-medium dark:text-white">{project.employees}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Work Hours</p>
                  <p className="font-medium dark:text-white">{project.workHours}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">OT Hours</p>
                  <p className="font-medium dark:text-white">{project.otHours}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last updated: {project.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectHighlights;
