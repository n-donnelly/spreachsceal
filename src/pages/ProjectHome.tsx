import { useState } from 'react';
import { getProjects } from '../data/storage';
import { CreateProjectDialog } from '../components/project/CreateProjectDialog';

const ProjectHome = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [projects, setProjects] = useState(getProjects());

    const refreshProjects = () => setProjects(getProjects());

    return (
        <div className="p-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowDialog(true)}
          >
            + New Project
          </button>
    
          {showDialog && (
            <CreateProjectDialog
              onClose={() => setShowDialog(false)}
              onCreated={refreshProjects}
            />
          )}
    
          <ul className="mt-6 space-y-2">
            {projects.map((proj) => (
              <li 
                key={proj.id} 
                className="p-4 bg-white shadow rounded"
                onClick={() => window.location.href = `/project/${proj.id}`}
                style={{ cursor: 'pointer' }}
            >
                <h3 className="text-lg font-semibold">{proj.title}</h3>
              </li>
            ))}
          </ul>
        </div>
    );
};

export default ProjectHome;