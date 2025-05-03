import { Character, NoteFile, Project } from "../../types";
import { useState, useEffect } from "react";
import NoteCard from "../note/notecard";

interface CharacterPageProps {
    character: Character;
    project: Project;
    onCharacterUpdate: (character: Character) => void;
    onDeselect: () => void;
}

export const CharacterPage = ({ character, project, onCharacterUpdate, onDeselect }: CharacterPageProps) => {
    const getNewNote = () => {
        return {
            id: crypto.randomUUID(),
            title: "",
            content: ""
        };
    }

    const [name, setName] = useState(character.name);
    const [description, setDescription] = useState(character.description);
    const [aliases, setAliases] = useState<string[]>(character.aliases || []);
    const [newAlias, setNewAlias] = useState("");
    const [notes, setNotes] = useState<NoteFile[]>(character.notes || []);
    const [newNote, setNewNote] = useState(getNewNote());
    const [isEdited, setIsEdited] = useState(false);  
    
    const otherCharacters = project.characters.filter((c) => c.id !== character.id);

    useEffect(() => {
        // Update state when character prop changes
        setName(character.name);
        setDescription(character.description);
        setAliases(character.aliases || []);
        setNotes(character.notes || []);
    }, [character]);

    const handleSave = () => {
        // Find the project containing this character
        
        onCharacterUpdate({
            ...character,
            name,
            description,
            aliases,
            notes
        });
        setIsEdited(false);
    };

    const handleAddAlias = () => {
        if (newAlias.trim()) {
            setAliases([...aliases, newAlias.trim()]);
            setNewAlias("");
            setIsEdited(true);
        }
    };

    const handleRemoveAlias = (index: number) => {
        const updatedAliases = [...aliases];
        updatedAliases.splice(index, 1);
        setAliases(updatedAliases);
        setIsEdited(true);
    };

    const handleAddNote = () => {
        newNote.title = newNote.title.trim();
        newNote.content = newNote.content.trim();
        newNote.id = crypto.randomUUID();
        setNotes([...notes, newNote]);
        setNewNote(getNewNote());
        setIsEdited(true);
    };

    const handleRemoveNote = (index: number) => {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
        setIsEdited(true);
    };

    const handleEditNote = (updatedNote: NoteFile) => {
        const updatedNotes = [...notes];
        const noteIndex = updatedNotes.findIndex(note => note.id === updatedNote.id);
        if (noteIndex !== -1) {
            updatedNotes[noteIndex] = updatedNote;
        }
        setNotes(updatedNotes);
        setIsEdited(true);
    };

    const handleBack = () => {
        onDeselect();
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Character Details</h1>
                <div className="space-x-2">
                    <button 
                        onClick={handleBack} 
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
                {/* Character Name */}
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

                {/* Character Aliases */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aliases</label>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={newAlias}
                            onChange={(e) => setNewAlias(e.target.value)}
                            className="flex-grow p-2 border rounded-l"
                            placeholder="Add a new alias"
                        />
                        <button
                            onClick={handleAddAlias}
                            className="bg-blue-600 text-white px-4 py-2 rounded-r"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {aliases.length === 0 ? (
                            <p className="text-gray-500 italic">No aliases added</p>
                        ) : (
                            aliases.map((alias, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span>{alias}</span>
                                    <button
                                        onClick={() => handleRemoveAlias(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Character Notes */}
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

                {/* Relationships section could be added here in the future */}
            </div>
        </div>
    );
};
