import React from 'react';
import { NoteFile } from '../../types';
import RichTextEditor from '../editor/texteditor';
import './notes.css';

interface NoteCardProps {
  note: NoteFile;
  onDelete: (noteId: string) => void;
  onEdit: (note: NoteFile) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(note.content);

  const handleSave = () => {
    onEdit({
      ...note,
      content: editedContent
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          {isEditing ? (
            <>
              <button className="btn btn-text" onClick={handleCancel}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <button className="btn btn-text" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="btn btn-text" onClick={() => onDelete(note.id)}>Delete</button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <RichTextEditor 
          content={editedContent} 
          onChange={setEditedContent}
          placeholder="Enter note content..."
          className="note-editor"
        />
      ) : (
        <div 
          className="note-content"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      )}
    </div>
  );
};

export default NoteCard;
