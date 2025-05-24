import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Location } from '../../types/location';
import { saveProject } from '../../data/storage';
import './Location.css';

interface LocationListViewProps {
    project: Project | null;
    onProjectUpdate: (project: Project) => void;
}

interface NewLocationDialogProps {
    onClose: () => void;
    onCreated: (location: Location) => void;
}

const NewLocationDialog: React.FC<NewLocationDialogProps> = ({ onClose, onCreated }) => {
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

export const LocationListView: React.FC<LocationListViewProps> = ({ project, onProjectUpdate }) => {
    const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);

    if (!project) {
        return <div className="locations-container">No project selected</div>;
    }

    const handleNewLocationCreated = (newLocation: Location) => {
        const updatedProject = {
            ...project,
            locations: [...project.locations, newLocation]
        };
        
        onProjectUpdate(updatedProject);
        saveProject(updatedProject);
    };

    const handleLocationClick = (locationId: string) => {
        // This would typically navigate to the location detail page
        // For now, we'll just log it
        console.log('Navigate to location:', locationId);
    };

    return (
        <div className="locations-container">
            <div className="locations-header">
                <h1 className="locations-title">Locations</h1>
                <button 
                    className="add-location-button"
                    onClick={() => setShowNewLocationDialog(true)}
                >
                    Add Location
                </button>
            </div>

            {project.locations.length === 0 ? (
                <div className="empty-locations-message">
                    No locations yet. Click "Add Location" to create your first location.
                </div>
            ) : (
                <div className="locations-grid">
                    {project.locations.map((location) => (
                        <div 
                            key={location.id} 
                            className="location-card"
                            onClick={() => handleLocationClick(location.id)}
                        >
                            <div className="location-card-header">
                                <h3 className="location-card-name">{location.name}</h3>
                                <p className="location-card-description">
                                    {location.description || 'No description provided'}
                                </p>
                            </div>
                            
                            <div className="location-card-stats">
                                <span>{location.notes.length} notes</span>
                                <span>Location</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showNewLocationDialog && (
                <NewLocationDialog
                    onClose={() => setShowNewLocationDialog(false)}
                    onCreated={handleNewLocationCreated}
                />
            )}
        </div>
    );
};
