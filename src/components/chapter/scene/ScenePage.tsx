import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProject, saveProject } from "../../../data/storage";
import { Scene } from "../../../types";

export const ScenePage = () => {
    const { id, chapterId, sceneId } = useParams();
    const navigate = useNavigate();
    const [scene, setScene] = useState<Scene | null>(null);

    useEffect(() => {
        const project = getProject(id!);
        const chapter = project?.chapters.find((c) => c.id === chapterId);
        const scn = chapter?.scenes.find((s) => s.id === sceneId);
        setScene(scn || null);
    }, [id, chapterId, sceneId]);

    if (!scene) {
        return <div>Scene not found</div>;
    }

    const updateScene = (updates: Partial<Scene>) => {
        if (!scene) return;

        const project = getProject(id!);
        if (!project) {
            console.error("Project not found");
            return;
        }

        const chapterIndex = project.chapters.findIndex((c) => c.id === chapterId);
        if (chapterIndex === undefined || chapterIndex === -1) {
            console.error("Chapter not found in project");
            return;
        }

        const sceneIndex = project.chapters[chapterIndex].scenes.findIndex((s) => s.id === sceneId);
        if (sceneIndex === undefined || sceneIndex === -1) {
            console.error("Scene not found in chapter");
            return;
        }

        const updated = { ...project.chapters[chapterIndex].scenes[sceneIndex], ...updates };
        project.chapters[chapterIndex].scenes[sceneIndex] = updated;
        setScene(updated);
        saveProject(project);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <input
                className="text-3xl font-bold w-full p-2 border rounded"
                value={scene.number}
                type="number"
                onChange={(e) => updateScene({ number: Number(e.target.value) })}
                />
                <button
                onClick={() => navigate(-1)}
                className="text-blue-600 underline ml-4"
                >
                ← Back
                </button>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <textarea
                    className="w-full h-40 p-2 border rounded"
                    value={scene.overview}
                    onChange={(e) => updateScene({ overview: e.target.value })}
                />
            </div>
        </div>
    )
}