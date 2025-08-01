import { useState } from 'react';
import { getProject, saveProject } from '../../../data/storage';
import { Scene } from '../../../types';
import './Scene.css';
import { useProjectContext } from '../../project/ProjectContext';

interface Props {
    projectId: string;
    chapterId: number;
    nextSceneNumber: number;
    onClose: () => void;
    onCreated: (scene: Scene) => void;
}

export const  NewSceneDialog: React.FC<Props> = ({ 
    projectId, 
    chapterId, 
    nextSceneNumber, 
    onClose, 
    onCreated
}) => {
    const [number, setNumber] = useState(nextSceneNumber);
    const [overview, setOverview] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { getNextId } = useProjectContext();

    const handleCreate = () => {
        // Clear any previous errors
        setError(null);

        // Validate scene number
        if (!number || number < 1) {
            setError('Scene number must be a positive number');
            return;
        }

        const project = getProject(projectId);
        if (!project) {
            setError('Project not found');
            return;
        }

        const chapter = project.chapters.find(chapter => chapter.id === chapterId);
        if (!chapter) {
            setError('Chapter not found');
            return;
        }

        // Check if scene number already exists
        const existingScene = chapter.scenes.find(scene => scene.number === number);
        if (existingScene) {
            setError(`Scene ${number} already exists`);
            return;
        }

        const newScene: Scene = {
            id: getNextId('scene'),
            number,
            overview: overview.trim(),
            locationId: 0,
            characters: [],
            content: "",
            notes: []
        };

        chapter.scenes.push(newScene);
        
        // Sort scenes by number to maintain order
        chapter.scenes.sort((a, b) => a.number - b.number);
        
        saveProject(project);
        onCreated(newScene);
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setNumber(value);
        }
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    const handleOverviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setOverview(e.target.value);
    };

    const isValid = number && number > 0;

    return (
        <div className="new-scene-overlay" onClick={handleOverlayClick}>
            <div className="new-scene-dialog">
                <h2 className="new-scene-title">New Scene</h2>
                
                <div className="new-scene-form">
                    <input
                        className="new-scene-input"
                        placeholder="Scene Number"
                        type="number"
                        min="1"
                        value={number || ''}
                        onChange={handleNumberChange}
                        autoFocus
                    />
                    
                    <textarea
                        className="new-scene-textarea"
                        placeholder="Scene Overview (optional)"
                        rows={4}
                        value={overview}
                        onChange={handleOverviewChange}
                    />
                    
                    {error && (
                        <div className="new-scene-error">
                            {error}
                        </div>
                    )}
                    
                    <div className="new-scene-actions">
                        <button 
                            onClick={onClose} 
                            className="new-scene-cancel-button"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCreate} 
                            className="new-scene-create-button"
                            disabled={!isValid}
                            type="button"
                        >
                            Create Scene
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
