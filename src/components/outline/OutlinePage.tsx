import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProject } from '../../data/storage';
import { Outline } from '../../types';

export const OutlinePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [outline, setOutline] = useState<Outline | null>(null);

    useEffect(() => {
        const project = getProject(id!);
        const outline = project?.outline;
        setOutline(outline || null);
    }, [id]);

    if (!outline) {
        return <div>Outline not found</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Outline</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 underline ml-4"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}