interface HeaderProps {
    projectTitle: string;
}

export const Header = ({ projectTitle }: HeaderProps) => {
    return (
        <header className="header">
            <h1 className="text-2xl font-bold">{projectTitle}</h1>
            <div className="header-actions">
                {/* TODO: Add any actions that might be needed here */}
            </div>
        </header>
    );
};
