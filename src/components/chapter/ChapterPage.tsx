import { useNavigate, useParams } from "react-router-dom";
import { Chapter } from "../../types";
import { useState, useEffect } from "react";
import { getProject, saveProject } from "../../data/storage";

export const ChapterPage = () => {
    const {id, chapterId} = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState<Chapter | null>(null);

    useEffect(() => {
        const project = getProject(id!);
        const chap = project?.chapters.find(c => c.id === chapterId);
        setChapter(chap || null);
    }, [id, chapterId]);

    if(!chapter) {
        return <div>Chapter not found</div>;
    }

    const updateChapter = (updates: Partial<Chapter>) => {
        if (!chapter) return;

        const project = getProject(id!);
        if (!project) {
            console.error('Project not found');
            return;
        }

        const chapIndex = project.chapters.findIndex(c => c.id === chapterId);
        if (chapIndex === undefined || chapIndex === -1) {
            console.error('Chapter not found in project');
            return;
        }

        const updated = { ...project.chapters[chapIndex], ...updates };
        project.chapters[chapIndex] = updated;
        setChapter(updated);
        saveProject(project);
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <input
                className="text-3xl font-bold w-full p-2 border rounded"
                value={chapter.title}
                onChange={(e) => updateChapter({ title: e.target.value })}
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
                <input
                    className="w-full h-40 p-2 border rounded"
                    type="number"
                    value={chapter.index}
                    onChange={(e) => updateChapter({ index: parseInt(e.target.value) })}
                />
            </div>
        </div>
    )
}