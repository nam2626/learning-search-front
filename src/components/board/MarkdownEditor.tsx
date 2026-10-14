import { useEffect, useRef } from 'react';
import type Editor from '@toast-ui/editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  minHeight?: string;
  disabled?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder,
  minHeight = '260px',
  disabled = false,
}: MarkdownEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hostRef.current) return;

    let disposed = false;

    const mountEditor = async () => {
      await Promise.all([
        import('@toast-ui/editor/dist/toastui-editor.css'),
        import('@toast-ui/editor/dist/i18n/ko-kr'),
      ]);
      const { default: EditorConstructor } = await import('@toast-ui/editor');
      if (disposed || !hostRef.current) return;

      const editor = new EditorConstructor({
        el: hostRef.current,
        initialValue: initialValueRef.current,
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        minHeight,
        height: 'auto',
        language: 'ko-KR',
        placeholder,
        usageStatistics: false,
        autofocus: false,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'link'],
          ['code', 'codeblock'],
        ],
      });
      editor.on('change', () => onChangeRef.current(editor.getMarkdown()));

      const elements = editor.getEditorElements();
      elements.wwEditor.setAttribute('aria-label', label);
      elements.mdEditor.setAttribute('aria-label', `${label} Markdown 원문`);
      editorRef.current = editor;
    };

    void mountEditor();

    return () => {
      disposed = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [label, minHeight, placeholder]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.getMarkdown() !== value) {
      editor.setMarkdown(value, false);
    }
  }, [value]);

  return (
    <div
      className={`board-markdown-editor mt-2 rounded-xl ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      aria-disabled={disabled}
    >
      <div ref={hostRef} />
    </div>
  );
}
