// src/pages/RevisionView.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project, Revision } from '../../types';
import NewRevisionDialog from './NewRevisionDialog';
import { getProject } from '../../data/storage';

const RevisionView = () => {
  const { id: projectId, revisionId } = useParams();
  const navigate = useNavigate();

  const [revision, setRevision] = useState<Revision | null>(null);

  console.log('Project ID:', projectId);
  console.log('Revision ID:', revisionId);

  useEffect(() => {
    const project = getProject(projectId!);
    const revision = project?.revisions.find((rev) => rev.id === revisionId);
    setRevision(revision || null);
  }, [projectId, revisionId]);

  if (!revision) {
    return <div className="p-6">Revision not found</div>;
  }

  // TODO: Add list of chapters
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{revision.versionName}</h1>
      <p className="text-gray-600">{new Date(revision.date).toLocaleDateString()}</p>
      
    </div>
  );
};

export default RevisionView;
