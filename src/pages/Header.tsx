interface HeaderProps {
    projectTitle: string;
}

export const Header = ({ projectTitle }: HeaderProps) => {
    return (
        <header className="header">
            <div className="header-left"></div>
            <h1 className="header-title">{projectTitle}</h1>
            <div className="header-actions">
                {/* TODO: Add any actions that might be needed here */}
            </div>
        </header>
    );
};
