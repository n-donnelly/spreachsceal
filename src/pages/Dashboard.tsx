import { ProjectProvider} from "../components/project/ProjectContext";
import './Dashboard.css';
import { ProjectNavigation } from "../components/project/ProjectNavigation";
import { Outlet } from "react-router-dom";

export const Dashboard = () => {
    return (
    <ProjectProvider>
      <div className="project-layout">

        {/* Navigation Bar */}
        <ProjectNavigation />

        {/* Main Content Area - this is where your components will render */}
        <main className="project-content">
          <Outlet />
        </main>
      </div>
    </ProjectProvider>
  );
};
