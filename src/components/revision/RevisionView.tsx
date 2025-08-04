// src/pages/RevisionView.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project, Revision } from '../../types';
import { useProjectContext } from '../project/ProjectContext';

const RevisionView = () => {
  const { id: projectId, revisionId } = useParams();
  const navigate = useNavigate();
  const { currentProject } = useProjectContext();

  const [revision, setRevision] = useState<Revision | null>(null);
  const revisionIdNum = revisionId ? parseInt(revisionId, 10) : null;

  useEffect(() => {
    const revision = currentProject?.revisions.find((rev) => rev.id === revisionIdNum);
    setRevision(revision || null);
  }, [currentProject, revisionId]);

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
