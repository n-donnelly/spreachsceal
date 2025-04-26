import { Project } from "../types";
import { ProjectView } from "./ProjectView";

interface MainContentProps {
    activeSection: string;
    project: Project | null;
}

export const MainContent = ({ activeSection, project }: MainContentProps) => {
    switch (activeSection) {
        case "overview":
        case "project":
            return <ProjectView />;  
        case "chapters":
            return <div>Chapters</div>;
        case "characters":
            return <div>Characters</div>;
        case "locations":
            return <div>Locations</div>;
        case "outline":
            return <div>Outline</div>;
        case "encyclopedia":
            return <div>Encyclopedia</div>;
        case "notes":
            return <div>Notes</div>;
        case "revisions":
            return <div>Revisions</div>;
        default:
            return <ProjectView/>;  
    }
};