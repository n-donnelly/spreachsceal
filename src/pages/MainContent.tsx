import { useState, useEffect } from 'react';
import { ChaptersList } from "../components/chapter/ChapterListView";
import { EncyclopediaPage } from "../components/encylcopedia/EncyclopediaPage";
import NotesList from "../components/note/noteslist";
import { OutlinePage } from "../components/outline/OutlinePage";
import { RevisionListView } from "../components/revision/RevisionListView";
import { saveProject } from "../data/storage";
import { Project } from "../types";
import { ProjectView } from "../components/project/ProjectView";
import { CharacterListView } from "../components/character/CharacterListView";
import { LocationListView } from "../components/location/LocationListView";

interface MainContentProps {
    activeSection: string;
    project: Project | null;
    onSectionChange: (section: string, optionalId?: string) => void;
}

export const MainContent = ({ activeSection, project, onSectionChange }: MainContentProps) => {
    // Maintain internal project state to ensure consistency across navigation
    const [currentProject, setCurrentProject] = useState<Project | null>(project);

    // Update internal state when project prop changes
    useEffect(() => {
        setCurrentProject(project);
    }, [project]);

    const handleProjectUpdate = (updatedProject: Project) => {
        // Update internal state first
        setCurrentProject(updatedProject);
        
        // Save to storage
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
                        project={currentProject} 
                        onProjectUpdate={handleProjectUpdate} 
                        onSectionChange={handleSectionChange} 
                   />;  
        case "chapters":
            return <ChaptersList 
                        project={currentProject} 
                        onProjectUpdate={handleProjectUpdate}
                   />;
        case "characters":
            return <CharacterListView 
                        project={currentProject} 
                        onProjectUpdate={handleProjectUpdate}
                   />;
        case "locations":
            return <LocationListView 
                        project={currentProject} 
                        onProjectUpdate={handleProjectUpdate}
                    />;
        case "outline":
            return <OutlinePage
                        project={currentProject}
                        onProjectUpdate={handleProjectUpdate}
                    />;
        case "encyclopedia":
            return <EncyclopediaPage
                        project={currentProject}
                        onProjectUpdate={handleProjectUpdate}
                    />;
        case "notes":
            return <NotesList 
                        project={currentProject} 
                        onProjectUpdate={handleProjectUpdate}
                   />;
        case "revisions":
            return <RevisionListView
                        project={currentProject}
                        onProjectUpdate={handleProjectUpdate}
                    />;
        default:
            return <ProjectView
                        project={currentProject}
                        onProjectUpdate={handleProjectUpdate}
                        onSectionChange={handleSectionChange}
                   />;
    }
};
