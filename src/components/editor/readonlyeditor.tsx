import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './texteditor.css';

interface ReadOnlyEditorProps {
    content: string;
    className?: string;
}

const ReadOnlyEditor: React.FC<ReadOnlyEditorProps> = ({ 
    content,
    className = '',
}) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none w-full max-w-none',
            },
        },
    });

    return (
        <div className={`editor-container ${className}`}>
            <EditorContent editor={editor} />
        </div>
    );
};

export default ReadOnlyEditor;