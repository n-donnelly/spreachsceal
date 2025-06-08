import { useState } from "react";
import { Location } from "../../types";
import './Location.css';

interface NewLocationDialogProps {
    onClose: () => void;
    onCreated: (location: Location) => void;
}

export const NewLocationDialog: React.FC<NewLocationDialogProps> = ({ onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Please enter a location name');
            return;
        }

        const newLocation: Location = {
            id: crypto.randomUUID(),
            name: name.trim(),
            description: description.trim(),
            notes: []
        };

        onCreated(newLocation);
        onClose();
    };

    return (
        <div className="location-dialog-overlay" onClick={onClose}>
            <div className="location-dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="location-dialog-title">Create New Location</h2>
                
                <form onSubmit={handleSubmit} className="location-dialog-form">
                    <div className="location-dialog-field">
                        <label htmlFor="location-name" className="location-dialog-label">
                            Name *
                        </label>
                        <input
                            id="location-name"
                            type="text"
                            className="location-dialog-input"
                            placeholder="Location name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="location-dialog-field">
                        <label htmlFor="location-description" className="location-dialog-label">
                            Description
                        </label>
                        <textarea
                            id="location-description"
                            className="location-dialog-textarea"
                            placeholder="Location description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="location-dialog-footer">
                        <button 
                            type="button" 
                            className="location-cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="location-create-button"
                            disabled={!name.trim()}
                        >
                            Create Location
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};