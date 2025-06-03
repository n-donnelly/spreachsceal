import './Dashboard.css';

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

interface NavSection {
    id: string;
    label: string;
}

const navSections: NavSection[] = [
    { id: "overview", label: "Overview" },
    { id: "outline", label: "Outline" },
    { id: "chapters", label: "Chapters" },
    { id: "characters", label: "Characters" },
    { id: "locations", label: "Locations" },
    { id: "encyclopedia", label: "Encyclopedia" },
    { id: "notes", label: "Notes" },
    { id: "revisions", label: "Revisions" },
];

export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-header" onClick={() => window.location.href = '/'}>Novel Builder</h2>
            <nav className="nav-menu">
                {navSections.map((section) => (
                  <div
                    key={section.id}
                    className={`nav-item ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.label}
                  </div>  
                ))}
            </nav>
        </div>
    );
}