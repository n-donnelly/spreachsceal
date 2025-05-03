import { Location, NoteFile, Project } from "../../types";
import { useState, useEffect } from "react";
import NoteCard from "../note/notecard";

interface LocationPageProps {
    location: Location;
    project: Project;
    onLocationUpdate: (location: Location) => void;
    onDeselect: () => void;
}

export const LocationPage = ({ location, project, onLocationUpdate, onDeselect }: LocationPageProps) => {
    const getNewNote = () => {
        return {
            id: crypto.randomUUID(),
            title: "",
            content: ""
        };
    }

    const [name, setName] = useState(location.name);
    const [description, setDescription] = useState(location.description);
    const [notes, setNotes] = useState<NoteFile[]>(location.notes || []);
    const [newNote, setNewNote] = useState(getNewNote());
    const [isEdited, setIsEdited] = useState(false); 

    useEffect(() => {
        // Update state when character prop changes
        setName(location.name);
        setDescription(location.description);
        setNotes(location.notes || []);
    }, [location]);

    const handleSave = () => {
        onLocationUpdate({
            ...location,
            name,
            description,
            notes
        });
        setIsEdited(false);
    };

    const handleAddNote = () => {
        if (newNote.title.trim()) {
            setNotes([...notes, newNote]);
            setNewNote(getNewNote());
            setIsEdited(true);
        }
    };

    const handleRemoveNote = (index: number) => {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
        setIsEdited(true);
    };

    const handleEditNote = (updatedNode: NoteFile) => {
        const updatedNotes = [...notes];
        const index = updatedNotes.findIndex(note => note.id === updatedNode.id);
        if (index !== -1) {
            updatedNotes[index] = updatedNode;
            setNotes(updatedNotes);
            setIsEdited(true);
        }
    };

    const handleDeselect = () => {
        onDeselect();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Location Details</h1>
                <div className="space-x-2">
                    <button 
                        onClick={handleDeselect} 
                        className="px-4 py-2 border rounded text-gray-600"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleSave} 
                        className={`px-4 py-2 rounded text-white ${isEdited ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!isEdited}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Location Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setIsEdited(true);
                        }}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Character Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setIsEdited(true);
                        }}
                        rows={4}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Location Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            className="flex-grow p-2 border rounded-l"
                            placeholder="Add a new note"
                        />
                        <button
                            onClick={handleAddNote}
                            className="bg-blue-600 text-white px-4 py-2 rounded-r"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {notes.length === 0 ? (
                            <p className="text-gray-500 italic">No notes added</p>
                        ) : (
                            notes.map((note, index) => (
                                <NoteCard key={index} note={note} onDelete={() => handleRemoveNote(index)} onEdit={handleEditNote} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}