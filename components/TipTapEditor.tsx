// components/TipTapEditor.tsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';

interface TipTapEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div className="tiptap-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
