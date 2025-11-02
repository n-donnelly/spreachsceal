import { useState } from 'react';
import { CreateProjectDialog } from '../components/project/CreateProjectDialog';

const ProjectHome = () => {
    const [showDialog, setShowDialog] = useState(false);

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
              onCreated={() => setShowDialog(false)}
            />
          )}
    
          <ul className="mt-6 space-y-2">
            
          </ul>
        </div>
    );
};

export default ProjectHome;