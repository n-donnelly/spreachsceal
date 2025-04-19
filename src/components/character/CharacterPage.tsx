import { useNavigate, useParams } from "react-router-dom";
import { Character } from "../../types";
import { useState } from "react";
import { getProject } from "../../data/storage";

export const CharacterPage = () => {
    const { projectId, charId } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState<Character | null>(null);

    useEffect(() => {
        const project = getProject(projectId!);
        const char = project?.characters.find(c => c.id === charId);
        setCharacter(char || null);
    }, [projectId, charId]);
}