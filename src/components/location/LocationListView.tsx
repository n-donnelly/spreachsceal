import React, { useEffect, useState } from 'react';
import { Project } from '../../types/project';
import { Location } from '../../types/location';
import { saveProject } from '../../data/storage';
import './Location.css';
import { LocationPage } from './LocationPage';
import { NewLocationDialog } from './NewLocationDialog';

interface LocationListViewProps {
    project: Project | null;
    onProjectUpdate: (project: Project) => void;
}

export const LocationListView: React.FC<LocationListViewProps> = ({ project, onProjectUpdate }) => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);

    useEffect(() => {
        if (project) {
            setLocations(project.locations || []);
        } else {
            setLocations([]);
        }
    }, [project]);

    // Reset selected location if it no longer exists in the project
    useEffect(() => {
        if (selectedLocation && project) {
            const stillExists = project.locations.find(loc => loc.id === selectedLocation.id);
            if (!stillExists) {
                setSelectedLocation(null);
            }
        }
    }, [project, selectedLocation]);

    if (!project) {
        return <div className="no-project-selected">No project selected</div>;
    }

    const handleLocationSelect = (locationId: string) => {
        const location = locations.find(loc => loc.id === locationId);
        if (location) {
            setSelectedLocation(location);
        }
    };

    const handleLocationDeselect = () => {
        setSelectedLocation(null);
    };

    const handleLocationUpdate = (updatedLocation: Location) => {
        const updatedProject = {
            ...project,
            locations: project.locations.map(loc => 
                loc.id === updatedLocation.id ? updatedLocation : loc
            )
        };
        
        onProjectUpdate(updatedProject);
        saveProject(updatedProject);
    };

    const handleNewLocationCreated = (newLocation: Location) => {
        onProjectUpdate({
            ...project,
            locations: [...(project.locations || []), newLocation]
        });
        setLocations((prev) => [...prev, newLocation]);
        setShowNewLocationDialog(false);
    };

    // If a location is selected, show the location page
    if (selectedLocation) {
        return (
            <LocationPage
                location={selectedLocation}
                project={project}
                onLocationUpdate={handleLocationUpdate}
                onDeselect={handleLocationDeselect}
            />
        );
    }

    // Otherwise, show the locations list
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
