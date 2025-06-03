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
  className = ''
}) => {
  const myExtensions: any[] = [StarterKit];
  
  const editor = useEditor({
    extensions: myExtensions,
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

  // Add this to your RichTextEditor component's event handlers

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Insert tab or spaces
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // You can insert either a tab character or spaces
        const tabNode = document.createTextNode('    '); // 4 spaces
        // OR use: const tabNode = document.createTextNode('\t'); // actual tab
        
        range.deleteContents();
        range.insertNode(tabNode);
        
        // Move cursor after the inserted content
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Trigger the onChange callback
        const editorElement = e.currentTarget;
        if (onChange && editorElement instanceof HTMLElement) {
          onChange(editorElement.innerHTML);
        }
      }
    }
  };

  // Then add onKeyDown={handleKeyDown} to your contentEditable div


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
      <EditorContent editor={editor} onKeyDown={handleKeyDown} className="editor-content-area" />
    </div>
  );
};

export default RichTextEditor;
