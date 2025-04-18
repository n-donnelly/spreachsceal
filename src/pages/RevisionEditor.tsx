// src/pages/RevisionEditor.tsx
import { useParams } from 'react-router-dom';

const RevisionEditor = () => {
  const { projectId, revisionId } = useParams<{ projectId: string; revisionId: string }>();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Revision Editor</h1>
      <p>Project ID: {projectId}</p>
      <p>Revision ID: {revisionId}</p>
      {/* You’ll load and display the selected revision here */}
    </div>
  );
};

export default RevisionEditor;