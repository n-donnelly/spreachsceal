import CharacterListView from "../components/character/CharacterListView";
import NotesList from "../components/note/noteslist";
import { saveProject } from "../data/storage";
import { Project } from "../types";
import { ProjectView } from "./ProjectView";

interface MainContentProps {
    activeSection: string;
    project: Project | null;
}

export const MainContent = ({ activeSection, project }: MainContentProps) => {

    const handleProjectUpdate = (updatedProject: Project) => {
        // Handle project update logic here
        saveProject(updatedProject);
        console.log("Project updated:", updatedProject);
    }

    switch (activeSection) {
        case "overview":
        case "project":
            return <ProjectView />;  
        case "chapters":
            return <div>Chapters</div>;
        case "characters":
            return <CharacterListView characters={project?.characters || []} />;
        case "locations":
            return <div>Locations</div>;
        case "outline":
            return <div>Outline</div>;
        case "encyclopedia":
            return <div>Encyclopedia</div>;
        case "notes":
            return <NotesList project={project} onProjectUpdate={handleProjectUpdate} />;
        case "revisions":
            return <div>Revisions</div>;
        default:
            return <ProjectView/>;  
    }
};