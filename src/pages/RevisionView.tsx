// src/pages/RevisionView.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Project, Revision } from '../types';
import { v4 as uuidv4 } from 'uuid';

const RevisionView = () => {
  const { id: projectId } = useParams<{id: string}>();
  const [project, setProject] = useState<Project | null>(null);

  //Temp: Mock data until storage is implemented
  useEffect(() => {
    const stored = localStorage.getItem(`project_${projectId}`);
    if (stored) {
        setProject(JSON.parse(stored));
    }
  }, [projectId]);

  const handleAddRevision = () => {
    const name = prompt('Enter revision name:');
    if (!name || !project) return;
    
    const newRevision: Revision = {
      id: uuidv4(),
      versionName: name,
      date: new Date().toISOString(),
      chapters: []
    };

    const updatedProject = {
      ...project,
      revisions: [...project.revisions, newRevision]
    };

    setProject(updatedProject);
    localStorage.setItem(`project_${projectId}`, JSON.stringify(updatedProject));
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{project?.title}</h1>
      <p className="text-gray-600">{project?.description}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Revisions</h2>
        {project?.revisions.length === 0 && <p>No revisions yet.</p>}
        <ul className="mt-2">
            {project?.revisions.map((rev) => (
                <li key={rev.id}>
                <a
                    href={`/project/${project.id}/revision/${rev.id}`}
                    className="text-blue-600 hover:underline"
                >
                    📝 {rev.versionName}
                </a>
                </li>
            ))}
        </ul>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddRevision}
        >
          ➕ Add Revision
        </button>
      </div>
    </div>
  );
};

export default RevisionView;
