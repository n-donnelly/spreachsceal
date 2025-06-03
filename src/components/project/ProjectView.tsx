import React, { useState } from 'react';
import { Project } from '../../types';
import RichTextEditor from '../editor/texteditor';
import './ProjectsPage.css';

interface ProjectViewProps {
    project: Project | null;
    onProjectUpdate: (project: Project) => void;
    onSectionChange: (section: string, optionalId?: string) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, onProjectUpdate, onSectionChange }) => {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [description, setDescription] = useState(project?.description || '');

    if (!project) {
        return <div className="no-project-selected">No project selected</div>;
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
        onProjectUpdate(updatedProject);
    };

    const navigateToNewChapter = () => {
        onSectionChange('chapters', 'new');
    };

    const navigateToNewCharacter = () => {
        onSectionChange('characters', 'new');
    };

    const navigateToNewLocation = () => {
        onSectionChange('locations', 'new');
    };

    const navigateToNewRevision = () => {
        onSectionChange('revisions', 'new');
    };

    const navigateToChapter = (chapterId: string) => {
        onSectionChange('chapters', chapterId);
    };

    const navigateToCharacter = (characterId: string) => {
        onSectionChange('characters', characterId);
    };

    const navigateToLocation = (locationId: string) => {
        onSectionChange('locations', locationId);
    };

    return (
        <div className="project-view-container">
            <div className="project-view-header">
                <h1 className="project-title">{project.title}</h1>
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
                        </div>
                    </div>
                )}

                {activeTab === 'chapters' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Chapters</h2>
                        </div>
                        
                        {project.chapters.length > 0 ? (
                            <div className="items-grid">
                                {project.chapters.map(chapter => (
                                    <div 
                                        key={chapter.id} 
                                        className="item-card"
                                        onClick={() => navigateToChapter(chapter.id)}
                                    >
                                        <h3 className="item-card-title">{chapter.index}. {chapter.title}</h3>
                                        <p className="item-card-meta">{chapter.scenes.length} scenes</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                No chapters yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'characters' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Characters</h2>
                        </div>
                        
                        {project.characters.length > 0 ? (
                            <div className="items-grid">
                                {project.characters.map(character => (
                                    <div 
                                        key={character.id} 
                                        className="item-card"
                                        onClick={() => navigateToCharacter(character.id)}
                                    >
                                        <h3 className="item-card-title">{character.name}</h3>
                                        <p className="item-card-meta">{character.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                No characters yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'locations' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Locations</h2>
                        </div>
                        
                        {project.locations.length > 0 ? (
                            <div className="items-grid">
                                {project.locations.map(location => (
                                    <div 
                                        key={location.id} 
                                        className="item-card"
                                        onClick={() => navigateToLocation(location.id)}
                                    >
                                        <h3 className="item-card-title">{location.name}</h3>
                                        <p className="item-card-meta">{location.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                No locations yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Notes</h2>
                        </div>
                        
                        {project.notes.length > 0 ? (
                            <div className="items-grid">
                                {project.notes.map(note => (
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
                            </div>
                        ) : (
                            <div className="empty-state">
                                No notes yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'revisions' && (
                    <div>
                        <div className="tab-section-header">
                            <h2 className="tab-section-title">Revisions</h2>
                        </div>
                        
                        {project.revisions.length > 0 ? (
                            <div className="items-grid">
                                {project.revisions
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
                            </div>
                        ) : (
                            <div className="empty-state">
                                No revisions yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectView;
