import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProject } from '../../data/storage';
import { Encyclopedia, EncyclopediaEntry } from '../../types';

export const EncyclopediaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [encyclopedia, setEncyclopedia] = useState<Encyclopedia | null>(null);

    useEffect(() => {
        const project = getProject(id!);
        const encyc = project?.encyclopedia;
        setEncyclopedia(encyc || null);
    }, [id]);

    if (!encyclopedia) {
        return <div>Encyclopedia not found</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Encyclopedia</h2>
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