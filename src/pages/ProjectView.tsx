import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProject } from "../data/storage";
import { Project } from "../types";
import NewRevisionDialog from "../components/revision/NewRevisionDialog";
import { NewCharacterDialog } from "../components/character/NewCharacterDialog";
import { NewLocationDialog } from "../components/location/NewLocationDialog";

export const ProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [showRevisionDialog, setShowRevisionDialog] = useState(false);
    const [showCharDialog, setShowCharDialog] = useState(false);
    const [showLocationDialog, setShowLocationDialog] = useState(false);

    const refreshProject = () => {
        setProject(getProject(id!))
    }

    useEffect(() => {
        refreshProject();
    }, [id]);

    if (!project) return <div className="p-6">Project not found</div>;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <p className="text-gray-600">{project.genre}</p>
                <p className="mt-2">{project.description}</p>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Revisions</h2>
                    <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setShowRevisionDialog(true)}
                        >
                            Save  as Revision
                    </button>

                </div>

                {project.revisions.length === 0 ? (
                    <p className="mt-2 text-gray-500">No revisions yet.</p>
                ) : (
                    <ul className="mt-4 space-y-2">
                        {project.revisions.map((rev, idx) => (
                            <li key={idx} className="p-3 bg-white shadow rounded border">
                                <span className="font-medium">{rev.versionName}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {showRevisionDialog && (
                <NewRevisionDialog
                    projectId={project.id}
                    onClose={() => setShowRevisionDialog(false)}
                    onCreated={refreshProject}
                />
            )}

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Characters</h2>
                    <button
                        onClick={() => setShowCharDialog(true)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        + New Character
                    </button>
                </div>
                <ul className="grid grid-cols-2 gap-4">
                {project?.characters.map((char) => (
                    <li
                    key={char.id}
                    className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                        navigate(`/project/${project.id}/character/${char.id}`)
                    }
                    >
                        <h3 className="font-semibold">{char.name}</h3>
                        <p className="text-sm text-gray-600">{char.description}</p>
                    </li>
                ))}
                </ul>
            </div>

            {showCharDialog && (
                <NewCharacterDialog
                projectId={project.id}
                onClose={() => setShowCharDialog(false)}
                onCreated={() => refreshProject()}
                />
            )}

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Locations</h2>
                    <button
                        onClick={() => setShowLocationDialog(true)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        + New Location
                    </button>
                </div>
                <ul className="grid grid-cols-2 gap-4">
                {project?.locations.map((location) => (
                    <li
                    key={location.id}
                    className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                        navigate(`/project/${project.id}/location/${location.id}`)
                    }
                    >
                        <h3 className="font-semibold">{location.name}</h3>
                        <p className="text-sm text-gray-600">{location.description}</p>
                    </li>
                ))}
                </ul>
            </div>

            {showLocationDialog && (
                <NewLocationDialog
                    projectId={project.id}
                    onClose={() => setShowLocationDialog(false)}
                    onCreated={() => refreshProject()}
                />
            )}

        </div>
    );
};
