import { useState } from "react";
import { Location } from "../../types";
import './Location.css';
import { useProjectContext } from "../project/ProjectContext";

interface NewLocationDialogProps {
    onClose: () => void;
    onCreated: (location: Location) => void;
}

export const NewLocationDialog: React.FC<NewLocationDialogProps> = ({ onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { getNextId } = useProjectContext();

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Please enter a location name');
            return;
        }

        const newLocation: Location = {
            id: getNextId('location'),
            name: name.trim(),
            description: description.trim(),
            notes: []
        };

        onCreated(newLocation);
        onClose();
    };

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Create New Location</h2>
                
                <form className="dialog-form">
                    <div className="dialog-field">
                        <label htmlFor="location-name" className="dialog-label">
                            Name *
                        </label>
                        <input
                            id="location-name"
                            type="text"
                            className="dialog-input"
                            placeholder="Location name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="dialog-field">
                        <label htmlFor="location-description" className="dialog-label">
                            Description
                        </label>
                        <textarea
                            id="location-description"
                            className="dialog-textarea"
                            placeholder="Location description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="dialog-footer">
                        <button 
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className="create-button"
                            disabled={!name.trim()}
                            onClick={handleCreate}
                        >
                            Create Location
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};