import { useState } from "react";
import { getProject, saveProject } from "../../data/storage";
import { Location } from "../../types";
import { v4 as uuidv4 } from "uuid";

interface Props {
    projectId: string;
    onClose: () => void;
    onCreated: () => void;
}

export const NewLocationDialog: React.FC<Props> = ({ projectId, onClose, onCreated }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");

    const handleCreate = () => {
        const project = getProject(projectId);
        if (!project) {
            console.error("Project not found");
            alert("Project not found");
            return;
        }

        const newLocation: Location = {
            id: uuidv4(),
            name,
            description,
            notes: [],
        };

        project.locations.push(newLocation);
        saveProject(project);
        onCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">New Location</h2>
                <input
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Location Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                
                <textarea
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="text-gray-600 underline">Cancel</button>
                    <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
                </div>
            </div>
        </div>
    );
}