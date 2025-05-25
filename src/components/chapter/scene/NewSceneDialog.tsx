import { useState } from 'react';
import { getProject, saveProject } from '../../../data/storage';
import { Scene } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    projectId: string;
    chapterId: string;
    nextSceneNumber: number;
    onClose: () => void;
    onCreated: () => void;
}

export const NewSceneDialog: React.FC<Props> = ({ projectId, chapterId, nextSceneNumber,onClose, onCreated }) => {
    const [number, setNumber] = useState(nextSceneNumber);
    const [overview, setOverview] = useState('');

    const handleCreate = () => {
        const project = getProject(projectId);
        if (!project) {
            console.error('Project not found');
            alert('Project not found');
            return;
        }

        const chapter = project.chapters.find(chapter => chapter.id === chapterId);
        if (!chapter) {
            console.error('Chapter not found');
            alert('Chapter not found');
            return;
        }

        const newScene: Scene = {
            id: uuidv4(),
            number,
            overview,
            locationId: "",
            characters: [],
            content: "",
            notes: []
        };

        chapter.scenes.push(newScene);
        saveProject(project);
        onCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">New Scene</h2>
                <input
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Scene Number"
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value))}
                />
                <textarea
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Overview"
                    rows={4}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="text-gray-600 underline">Cancel</button>
                    <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
                </div>
            </div>
        </div>
    )

}