import React, { useState } from 'react';
import { Project } from '../types';
import RichTextEditor from '../components/editor/texteditor';

interface ProjectViewProps {
    project: Project | null;
    onProjectUpdate: (project: Project) => void;
    onSectionChange: (section: string, optionalId?: string) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, onProjectUpdate, onSectionChange }) => {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [description, setDescription] = useState(project?.description || '');

    if (!project) {
        return <div className="p-6">No project selected</div>;
    }

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
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                <div className="text-sm text-gray-600 mb-4">
                    <span className="mr-4">Genre: {project.genre}</span>
                    <span>Chapters: {project.chapters.length}</span>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <RichTextEditor 
                        content={description} 
                        onChange={handleDescriptionChange}
                        className="min-h-[150px] border rounded p-3"
                    />
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b mb-6">
                <nav className="flex space-x-6">
                    <button 
                        className={`py-2 px-1 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`py-2 px-1 ${activeTab === 'chapters' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('chapters')}
                    >
                        Chapters
                    </button>
                    <button 
                        className={`py-2 px-1 ${activeTab === 'characters' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('characters')}
                    >
                        Characters
                    </button>
                    <button 
                        className={`py-2 px-1 ${activeTab === 'locations' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('locations')}
                    >
                        Locations
                    </button>
                    <button 
                        className={`py-2 px-1 ${activeTab === 'notes' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        Notes
                    </button>
                    <button 
                        className={`py-2 px-1 ${activeTab === 'revisions' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
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
                        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="font-medium mb-2">Statistics</h3>
                                <ul className="space-y-1">
                                    <li>Chapters: {project.chapters.length}</li>
                                    <li>Characters: {project.characters.length}</li>
                                    <li>Locations: {project.locations.length}</li>
                                    <li>Notes: {project.notes.length}</li>
                                    <li>Revisions: {project.revisions.length}</li>
                                </ul>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="font-medium mb-2">Recent Activity</h3>
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
                )}

                {activeTab === 'chapters' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Chapters</h2>
                        </div>
                        
                        {project.chapters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.chapters.map(chapter => (
                                    <div 
                                        key={chapter.id} 
                                        className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => navigateToChapter(chapter.id)}
                                    >
                                        <h3 className="font-medium">{chapter.index}. {chapter.title}</h3>
                                        <p className="text-sm text-gray-600">{chapter.scenes.length} scenes</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No chapters yet. </p>
                        )}
                    </div>
                )}

                {/* Similar patterns for characters, locations, notes, and revisions tabs */}
                {/* ... */}
            </div>
        </div>
    );
};
export default ProjectView;