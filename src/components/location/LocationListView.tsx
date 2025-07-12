import React, { useEffect, useState } from 'react';
import { Location } from '../../types/location';
import './Location.css';
import { NewLocationDialog } from './NewLocationDialog';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../project/ProjectContext';

export const LocationListView: React.FC = () => {
    const navigate = useNavigate();
    const { project, updateProject } = useProject();
    const [locations, setLocations] = useState<Location[]>([]);
    const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);

    useEffect(() => {
        if (project) {
            setLocations(project.locations || []);
        } else {
            setLocations([]);
        }
    }, [project]);

    if (!project) {
        return <div className="no-project-selected">No project selected</div>;
    }

    const handleLocationSelect = (locationId: number) => {
        navigate(`/projects/${project.id}/locations/${locationId}`);
    };


    const handleNewLocationCreated = (newLocation: Location) => {
        const updatedProject = {
            ...project,
            locations: [...(project.locations || []), newLocation]
        };
        updateProject(updatedProject);
        setLocations((prev) => [...prev, newLocation]);
        setShowNewLocationDialog(false);
    };



    const handleDeleteLocation = (event: React.MouseEvent, locationId: number) => {
        event.stopPropagation();

        if (window.confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
            const updatedProject = {
                ...project,
                locations: project.locations.filter((loc) => loc.id !== locationId)
            };
            updateProject(updatedProject);
            setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
        }
    };

    return (
        <div className="locations-container">
            <div className="section-header">
                <h1 className="section-title">Locations</h1>
                <button 
                    className="add-location-button"
                    onClick={() => setShowNewLocationDialog(true)}
                >
                    Add Location
                </button>
            </div>

            {locations.length === 0 ? (
                <div className="empty-locations-message">
                    No locations yet. Click "Add Location" to create your first location.
                </div>
            ) : (
                <div className="locations-grid">
                    {locations
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((location) => (
                            <div 
                                key={location.id}
                                onClick={() => handleLocationSelect(location.id)}
                                className="location-card"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleLocationSelect(location.id);
                                    }
                                }}
                            >
                                <div className="location-card-header">
                                    <h3 className="location-card-name">{location.name}</h3>
                                    <p className="location-card-description">
                                        {location.description || 'No description provided'}
                                    </p>
                                </div>
                                
                                <div className="location-actions">
                                    <button onClick={(e) => handleDeleteLocation(e, location.id)} className="button delete">Delete</button>
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
