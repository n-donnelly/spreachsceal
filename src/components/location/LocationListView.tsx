import React, { useEffect, useState } from 'react';
import { Location, Project } from '../../types';
import { LocationPage } from './LocationPage';

interface LocationListViewProps {
    project: Project | null;
    onProjectUpdate: (project: Project) => void;
}

const LocationListView: React.FC<LocationListViewProps> = ({ project, onProjectUpdate }) => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showNewLocationForm, setShowNewLocationForm] = useState(false);
    const [newLocationName, setNewLocationName] = useState('');

    // Update locations whenever project changes
    useEffect(() => {
        if (project) {
            setLocations(project.locations || []);
        } else {
            setLocations([]);
        }
    }, [project]);

    if (!project) {
        return <div>No project selected</div>;
    }

    const handleLocationSelect = (locationId: string) => {
        const location = locations.find(location => location.id === locationId);
        if (location) {
            setSelectedLocation(location);
            console.log("Selected Location: " + location.name);
        }
    }

    const handleLocationDeselect = () => {
        setSelectedLocation(null);
        // Ensure we have the latest locations from the project
        if (project) {
            setLocations(project.locations || []);
        }
        console.log("Deselected Location");
    }

    const handleAddLocation = () => {
        if (!newLocationName.trim()) {
            alert('Please enter a name for the location');
            return;
        }

        const newLocation: Location = {
            id: crypto.randomUUID(),
            name: newLocationName,
            description: '',
            notes: []
        };

        const updatedProject = {
            ...project,
            locations: [...project.locations, newLocation]
        };

        onProjectUpdate(updatedProject);
        setLocations([...locations, newLocation]);
        setNewLocationName('');
    };

    const handleDeleteLocation = (locationId: string) => {
        const updatedProject = {
            ...project,
            locations: project.locations.filter(location => location.id !== locationId)
        };
        onProjectUpdate(updatedProject);
        setLocations(project.locations.filter(location => location.id !== locationId));
        setSelectedLocation(null);
        console.log("Deleted Location: " + locationId);
    };

    const handleUpdateLocation = (updatedLocation: Location) => {
        const updatedProject = {
            ...project,
            locations: project.locations.map(location =>
            location.id === updatedLocation.id ? updatedLocation : location
            )
        };
        onProjectUpdate(updatedProject);
        setLocations(project.locations.map(location =>
            location.id === updatedLocation.id ? updatedLocation : location
        ));
        setSelectedLocation(updatedLocation);
        console.log("Updated Location: " + updatedLocation.name);
    };

    if (selectedLocation) {
        return (
        <LocationPage
            location={selectedLocation}
            project={project} 
            onLocationUpdate={handleUpdateLocation}
            onDeselect={handleLocationDeselect}
            />
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Locations</h2>
                <button 
                    onClick={() => setShowNewLocationForm(!showNewLocationForm)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                {showNewLocationForm ? 'Cancel' : 'Add Location'}
                </button>
            </div>
        
            {showNewLocationForm && (
                <div className="mb-4 p-4 border rounded bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">New Location</h3>
                <input
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Location Name"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                />
                <div className="flex justify-end">
                    <button 
                    onClick={handleAddLocation}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                    Add
                    </button>
                </div>
                </div>
            )}
        
            {locations.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                No Locations added yet. Click "Add Location" to create one.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                    <div 
                    key={location.id} 
                    className="p-4 border rounded bg-white shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
                    onClick={() => handleLocationSelect(location.id)}
                    >
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{location.name}</h3>
                        <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLocation(location.id);
                        }}
                        className="text-red-600 hover:underline text-sm"
                        >
                        Delete
                        </button>
                    </div>
                    {location.description && (
                        <p className="text-gray-700 mt-2 line-clamp-3">{location.description}</p>
                    )}
                    </div>
                ))}
                </div>
            )}
            </div>
    );
}

export default LocationListView;