// components/plugins/ToolbarPlugin.tsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND, TextFormatType } from 'lexical';
import { useEffect, useState } from 'react';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
          } else {
            setIsBold(false);
            setIsItalic(false);
            setIsUnderline(false);
          }
        });
        return false;
      },
      1
    );
  }, [editor]);

  const applyFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="toolbar">
      <button onClick={() => applyFormat('bold')} className={isBold ? 'active' : ''} aria-label="Fett" type="button">
        <b>B</b>
      </button>
      <button onClick={() => applyFormat('italic')} className={isItalic ? 'active' : ''} aria-label="Kursiv" type="button">
        <i>I</i>
      </button>
      <button onClick={() => applyFormat('underline')} className={isUnderline ? 'active' : ''} aria-label="Unterstrichen" type="button">
        <u>U</u>
      </button>
      {/* Weitere Buttons für andere Formatierungen können hier hinzugefügt werden */}
    </div>
  );
}
