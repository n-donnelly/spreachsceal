import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './texteditor.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none w-full max-w-none',
        placeholder,
      },
    },
  });

  return (
    <div className={`editor-container ${className}`}>
      <div className="editor-toolbar">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`editor-button ${editor?.isActive('bold') ? 'active' : ''}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`editor-button ${editor?.isActive('italic') ? 'active' : ''}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`editor-button ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          title="Heading"
        >
          H
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`editor-button ${editor?.isActive('bulletList') ? 'active' : ''}`}
          title="Bullet List"
        >
          • List
        </button>
      </div>
      <EditorContent editor={editor} className="editor-content-area" />
    </div>
  );
};

export default RichTextEditor;
