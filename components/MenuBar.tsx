// components/MenuBar.tsx
import React from 'react';
import { Editor } from '@tiptap/react';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        Bold
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        Italic
      </button>
      {/* Fügen Sie weitere Schaltflächen für andere Formatierungen hinzu */}
    </div>
  );
};

export default MenuBar;
