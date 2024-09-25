'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

const RichTextEditor = ({ content, onChange, disabled = false }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-background rounded-md">
      <div className="flex flex-wrap gap-2 p-1 border-b">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          aria-label="Bold"
        >
          B
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          aria-label="Italic"
        >
          I
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          aria-label="Strike"
        >
          S
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          aria-label="Bullet List"
        >
          •
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          aria-label="Ordered List"
        >
          1.
        </Toggle>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
};

export default RichTextEditor;
