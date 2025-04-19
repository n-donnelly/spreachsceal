// Inside RevisionView.tsx
import React, { useState } from 'react';
import { getProject, saveProject } from '../../data/storage';
import { Revision } from '../../types';

interface Props {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}

const NewRevisionDialog: React.FC<Props> = ({
  projectId,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const project = getProject(projectId);
      
      if (!project) {
        console.error('Project not found');
        alert('Project not found');
        return;
      }

      const newRevision: Revision = {
        id: crypto.randomUUID(),
        versionName: name,
        chapters: project.chapters,
        date: new Date().toISOString()
      }

      project.revisions.push(newRevision);
      saveProject(project);

      onCreated();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">New Revision</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Revision Name (e.g., First Draft)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewRevisionDialog;