import React, { useState } from 'react';
import RichTextEditor from '../editor/texteditor';
import './ProjectsPage.css';
import { useProject } from './ProjectContext';
import { useNavigate } from 'react-router-dom';

export const ProjectView: React.FC = () => {
    const navigate = useNavigate();
    const { project, updateProject, loading, error } = useProject();
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [description, setDescription] = useState(project?.description || '');

    // Update description state when project changes
    React.useEffect(() => {
        if (project) {
            setDescription(project.description || '');
        }
    }, [project]);

    if (loading) {
        return <div className="project-loading">Loading project...</div>;
    }

    if (error) {
        return <div className="project-error">Error: {error}</div>;
    }

    if (!project) {
        return <div className="no-project-selected">Project not found</div>;
    }

    const totalWordCount = project.chapters.reduce((total, chapter) => {
        return total + chapter.scenes.reduce((sceneTotal, scene) => {
            // Count words in the scene.content field
            const words = scene.content
                ? scene.content.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length
                : 0;
            return sceneTotal + words;
        }, 0);
    }, 0);

    const handleDescriptionChange = (newDescription: string) => {
        setDescription(newDescription);
        const updatedProject = { ...project, description: newDescription };
        updateProject(updatedProject);
    };

    const navigateToSection = (section: string) => {
        navigate(`/projects/${project.id}/${section}`);
    };

    const navigateToChapter = (chapterId: number) => {
        navigate(`/projects/${project.id}/chapters/${chapterId}`);
    };

    const navigateToCharacter = (characterId: number) => {
        navigate(`/projects/${project.id}/characters/${characterId}`);
    };

    const navigateToLocation = (locationId: number) => {
        navigate(`/projects/${project.id}/locations/${locationId}`);
    };

    return (
        <div className="project-view-container">
            <div className="section-header">
                <h1 className="section-title">{project.title}</h1>
            </div>
            <div className="project-meta">
                <span>Genre: {project.genre}</span>
                <span>Chapters: {project.chapters.length}</span>
            </div>
            
            <div className="project-description-section">
                <h2 className="section-title">Description</h2>
                <RichTextEditor 
                    content={description} 
                    onChange={handleDescriptionChange}
                    className="description-editor"
                />
            </div>

            {/* Tabs Navigation */}
            <div className="tabs-navigation">
                <nav className="tabs-nav">
                    <button 
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'chapters' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chapters')}
                    >
                        Chapters
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'characters' ? 'active' : ''}`}
                        onClick={() => setActiveTab('characters')}
                    >
                        Characters
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('locations')}
                    >
                        Locations
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        Notes
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'revisions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('revisions')}
                    >
                        Revisions
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="tab-section-title">Project Overview</h2>
                        <div className="overview-grid">
                            <div className="overview-card">
                                <h3 className="overview-card-title">Statistics</h3>
                                <ul className="stats-list">
                                    <li>Chapters: {project.chapters.length}</li>
                                    <li>Characters: {project.characters.length}</li>
                                    <li>Locations: {project.locations.length}</li>
                                    <li>Notes: {project.notes.length}</li>
                                    <li>Revisions: {project.revisions.length}</li>
                                    <li>Total Words: {totalWordCount}</li>
                                </ul>
                            </div>
                            <div className="overview-card">
                                <h3 className="overview-card-title">Recent Activity</h3>
                                <div className="recent-activity">
                                    {project.revisions.length > 0 ? (
                                        <div>
                                            <p>Latest revision: {project.revisions[project.revisions.length - 1].versionName}</p>
                                            <p>Date: {new Date(project.revisions[project.revisions.length - 1].date).toLocaleDateString()}</p>
                                        </div>
                                    ) : (
                                        <p>No revisions yet</p>
                                    )}
                                </div>
                            </div>
                            <div className="overview-card">
                                <h3 className="overview-card-title">Quick Actions</h3>
                                <div className="quick-actions">
                                    <button 
                                        className="quick-action-button"
                                        onClick={() => navigateToSection('chapters')}
                                    >
                                        📚 View Chapters
                                    </button>
                                    <button 
                                        className="quick-action-button"
                                        onClick={() => navigateToSection('characters')}
                                    >
                                        👥 Manage Characters
                                    </button>
                                    <button 
                                        className="quick-action-button"
                                        onClick={() => navigateToSection('locations')}
                                    >
                                        📍 View Locations
                                    </button>
                                    <button 
                                        className="quick-action-button"
                                        onClick={() => navigateToSection('notes')}
                                    >
                                        📝 View Notes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'chapters' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Chapters</h2>
                            <button 
                                className="view-all-button"
                                onClick={() => navigateToSection('chapters')}
                            >
                                View All Chapters
                            </button>
                        </div>
                        
                        {project.chapters.length > 0 ? (
                            <div className="items-grid">
                                {project.chapters.slice(0, 6).map(chapter => (
                                    <div 
                                        key={chapter.id} 
                                        className="item-card"
                                        onClick={() => navigateToChapter(chapter.id)}
                                    >
                                        <h3 className="item-card-title">{chapter.index}. {chapter.title}</h3>
                                        <p className="item-card-meta">{chapter.scenes.length} scenes</p>
                                    </div>
                                ))}
                                {project.chapters.length > 6 && (
                                    <div className="show-more-card" onClick={() => navigateToSection('chapters')}>
                                        <p>+{project.chapters.length - 6} more chapters</p>
                                        <p>Click to view all</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No chapters yet.</p>
                                <button 
                                    className="create-button"
                                    onClick={() => navigateToSection('chapters')}
                                >
                                    Create First Chapter
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'characters' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Characters</h2>
                            <button 
                                className="view-all-button"
                                onClick={() => navigateToSection('characters')}
                            >
                                View All Characters
                            </button>
                        </div>
                        
                        {project.characters.length > 0 ? (
                            <div className="items-grid">
                                {project.characters.slice(0, 6).map(character => (
                                    <div 
                                        key={character.id} 
                                        className="item-card"
                                        onClick={() => navigateToCharacter(character.id)}
                                    >
                                        <h3 className="item-card-title">{character.name}</h3>
                                        <p className="item-card-meta">{character.description}</p>
                                    </div>
                                ))}
                                {project.characters.length > 6 && (
                                    <div className="show-more-card" onClick={() => navigateToSection('characters')}>
                                        <p>+{project.characters.length - 6} more characters</p>
                                        <p>Click to view all</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No characters yet.</p>
                                <button 
                                    className="create-button"
                                    onClick={() => navigateToSection('characters')}
                                >
                                    Create First Character
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'locations' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Locations</h2>
                            <button 
                                className="view-all-button"
                                onClick={() => navigateToSection('locations')}
                            >
                                View All Locations
                            </button>
                        </div>
                        
                        {project.locations.length > 0 ? (
                            <div className="items-grid">
                                {project.locations.slice(0, 6).map(location => (
                                    <div 
                                        key={location.id} 
                                        className="item-card"
                                        onClick={() => navigateToLocation(location.id)}
                                    >
                                        <h3 className="item-card-title">{location.name}</h3>
                                        <p className="item-card-meta">{location.description}</p>
                                    </div>
                                ))}
                                {project.locations.length > 6 && (
                                    <div className="show-more-card" onClick={() => navigateToSection('locations')}>
                                        <p>+{project.locations.length - 6} more locations</p>
                                        <p>Click to view all</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No locations yet.</p>
                                <button 
                                    className="create-button"
                                    onClick={() => navigateToSection('locations')}
                                >
                                    Create First Location
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Notes</h2>
                            <button 
                                className="view-all-button"
                                onClick={() => navigateToSection('notes')}
                            >
                                View All Notes
                            </button>
                        </div>
                        
                        {project.notes.length > 0 ? (
                            <div className="items-grid">
                                {project.notes.slice(0, 6).map(note => (
                                    <div 
                                        key={note.id} 
                                        className="item-card"
                                    >
                                        <h3 className="item-card-title">{note.title}</h3>
                                        <div 
                                            className="item-card-meta"
                                            dangerouslySetInnerHTML={{ __html: note.content.substring(0, 100) + '...' }}
                                        />
                                    </div>
                                ))}
                                {project.notes.length > 6 && (
                                    <div className="show-more-card" onClick={() => navigateToSection('notes')}>
                                        <p>+{project.notes.length - 6} more notes</p>
                                        <p>Click to view all</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No notes yet.</p>
                                <button 
                                    className="create-button"
                                    onClick={() => navigateToSection('notes')}
                                >
                                    Create First Note
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'revisions' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Revisions</h2>
                            <button 
                                className="view-all-button"
                                onClick={() => navigateToSection('revisions')}
                            >
                                View All Revisions
                            </button>
                        </div>
                        
                        {project.revisions.length > 0 ? (
                            <div className="items-grid">
                                {project.revisions
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .slice(0, 6)
                                    .map(revision => (
                                    <div 
                                        key={revision.id} 
                                        className="item-card"
                                    >
                                        <h3 className="item-card-title">{revision.versionName}</h3>
                                        <p className="item-card-meta">
                                            {new Date(revision.date).toLocaleDateString()} - {revision.chapters.length} chapters
                                        </p>
                                    </div>
                                ))}
                                {project.revisions.length > 6 && (
                                    <div className="show-more-card" onClick={() => navigateToSection('revisions')}>
                                        <p>+{project.revisions.length - 6} more revisions</p>
                                        <p>Click to view all</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No revisions yet.</p>
                                <button 
                                    className="create-button"
                                    onClick={() => navigateToSection('revisions')}
                                >
                                    Create First Revision
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

};

export default ProjectView;
