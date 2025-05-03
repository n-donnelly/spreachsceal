import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { useProject } from "../components/project/ProjectContext";
import './Dashboard.css'; // Assuming you have a CSS file for styling

export const Dashboard = () => {
    const { currentProject, loading, error } = useProject(); 
    const [activeSection, setActiveSection] = useState<string>("overview");

    console.log("Current Project:", currentProject);
    console.log("Loading:", loading); 
    console.log("Error:", error);

    const handleSectionChange = (section: string, optionalId?: string) => {
        setActiveSection(section);
    };
    
    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.href = '/'}>
                Back to Projects
                </button>
            </div>
        );
    }

    if (!currentProject) {
        return <div className="p-6">No project found</div>;
    }

    return (
        <div className="dashboard-container">
            <Sidebar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
            />

            <div className="main-panel">
                <Header projectTitle={currentProject.title} />
                <MainContent 
                    activeSection={activeSection} 
                    project={currentProject}
                    onSectionChange={handleSectionChange}
                />
            </div>
        </div>
    );
};
