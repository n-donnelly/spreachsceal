import { ChaptersList } from "../components/chapter/ChapterListView";
import CharacterListView from "../components/character/CharacterListView";
import { EncyclopediaPage } from "../components/encylcopedia/EncyclopediaPage";
import LocationListView from "../components/location/LocationListView";
import NotesList from "../components/note/noteslist";
import { OutlinePage } from "../components/outline/OutlinePage";
import { RevisionListView } from "../components/revision/RevisionListView";
import { saveProject } from "../data/storage";
import { Project } from "../types";
import { ProjectView } from "../components/project/ProjectView";

interface MainContentProps {
    activeSection: string;
    project: Project | null;
    onSectionChange: (section: string, optionalId?: string) => void;
}

export const MainContent = ({ activeSection, project, onSectionChange }: MainContentProps) => {

    const handleProjectUpdate = (updatedProject: Project) => {
        // Handle project update logic here
        saveProject(updatedProject);
        console.log("Project updated:", updatedProject);
    }

    // This function will be passed to child components to allow them to request section changes
    const handleSectionChange = (section: string, optionalId?: string) => {
        onSectionChange(section, optionalId);
    }

    switch (activeSection) {
        case "overview":
        case "project":
            return <ProjectView 
                        project={project} 
                        onProjectUpdate={handleProjectUpdate} 
                        onSectionChange={handleSectionChange} 
                   />;  
        case "chapters":
            return <ChaptersList 
                        project={project} 
                        onProjectUpdate={handleProjectUpdate}
                   />;
        case "characters":
            return <CharacterListView 
                        project={project} 
                        onProjectUpdate={handleProjectUpdate}
                   />;
        case "locations":
            return <LocationListView 
                        project={project} 
                        onProjectUpdate={handleProjectUpdate}
                    />;
        case "outline":
            return <OutlinePage
                        project={project}
                        onProjectUpdate={handleProjectUpdate}
                    />;
        case "encyclopedia":
            return <EncyclopediaPage
                        project={project}
                        onProjectUpdate={handleProjectUpdate}
                    />;
        case "notes":
            return <NotesList 
                        project={project} 
                        onProjectUpdate={handleProjectUpdate}
                   />;
        case "revisions":
            return <RevisionListView
                        project={project}
                        onProjectUpdate={handleProjectUpdate}
                    />;
        default:
            return <ProjectView
                        project={project}
                        onProjectUpdate={handleProjectUpdate}
                        onSectionChange={handleSectionChange}
                   />;
    }
};
