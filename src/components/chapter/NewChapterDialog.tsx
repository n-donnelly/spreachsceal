import { useState } from 'react';
import { Chapter } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { getProject, saveProject } from '../../data/storage';

interface Props {
    projectId: string;
    onClose: () => void;
    onCreated: () => void;
}

export const NewChapterDialog: React.FC<Props> = ({ projectId, onClose, onCreated }) => {
    const [title, setTitle] = useState('');
    const [index, setIndex] = useState(1);

    const handleCreate = () => {
        const project = getProject(projectId);
        if (!project) {
            console.error('Project not found');
            alert('Project not found');
            return;
        }

        const newChapter: Chapter = {
            id: uuidv4(),
            title,
            index: project.chapters.length + 1,
            scenes: [],
            locations: [],
            characters: [],
            notes: []
        };

        project.chapters.push(newChapter);
        saveProject(project);
        onCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">New Chapter</h2>
                <input
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Chapter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Chapter Number"
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                    type="number"
                />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="text-gray-600 underline">Cancel</button>
                    <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
                </div>
            </div>
        </div>
    )
}