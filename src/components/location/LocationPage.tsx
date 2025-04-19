import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProject } from "../../data/storage";
import { Location } from "../../types";

export const LocationPage = () => {
    const { id, locationId } = useParams();
    const navigate = useNavigate();
    const [location, setLocation] = useState<Location | null>(null);

    useEffect(() => {
        const project = getProject(id!);
        const loc = project?.locations.find((l) => l.id === locationId);
        setLocation(loc || null);
    }, [id, locationId]);

    const updateLocation = (updates: Partial<Location>) => {
        if (!location) return;

        const project = getProject(id!);
        if (!project) {
            console.error("Project not found");
            return;
        }

        const locIndex = project.locations.findIndex((l) => l.id === locationId);
        if (locIndex === undefined || locIndex === -1) {
            console.error("Location not found in project");
            return;
        }

        const updated = { ...project.locations[locIndex], ...updates };
        project.locations[locIndex] = updated;
        setLocation(updated);
    };

    if (!location) {
        return <div>Location not found</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <input
                    className="text-3xl font-bold w-full p-2 border rounded"
                    value={location.name}
                    onChange={(e) => updateLocation({ name: e.target.value })}
                />
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 underline ml-4"
                >
                    ← Back
                </button>
            </div>            

            <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <textarea
                    className="w-full h-40 p-2 border rounded"
                    value={location.description}
                    onChange={(e) => updateLocation({ description: e.target.value })}
                />
            </div>
        </div>
    );

}