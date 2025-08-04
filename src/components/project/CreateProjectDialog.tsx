import React, { useState } from "react";
import { createNewProject, Project } from "../../types";
import "./CreateProjectDialog.css";
import { useAuth } from "../../authentication/AuthContext";
import { LocalProjectService } from "../../data/LocalProjectService";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateProjectDialog: React.FC<Props> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const projectService = new LocalProjectService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newProject = createNewProject(user.uid, title, genre);
    projectService.saveProject(newProject);
    onCreated();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="create-project-overlay" onClick={handleOverlayClick}>
      <div className="create-project-dialog">
        <h2 className="create-project-title">Create New Project</h2>
        <form onSubmit={handleSubmit} className="create-project-form">
          <input
            className="create-project-input"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <input
            className="create-project-input"
            placeholder="Genre (e.g., Fantasy, Mystery, Romance)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
          <textarea
            className="create-project-textarea"
            placeholder="Project Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="create-project-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="create-project-cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="create-project-submit-button"
              disabled={!title.trim() || !genre.trim()}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
