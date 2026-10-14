declare module '@toast-ui/editor' {
  interface EditorElements {
    mdEditor: HTMLElement;
    mdPreview: HTMLElement;
    wwEditor: HTMLElement;
  }

  interface EditorOptions {
    el: HTMLElement;
    height?: string;
    minHeight?: string;
    initialValue?: string;
    previewStyle?: 'tab' | 'vertical';
    initialEditType?: 'markdown' | 'wysiwyg';
    language?: string;
    useCommandShortcut?: boolean;
    usageStatistics?: boolean;
    toolbarItems?: string[][];
    hideModeSwitch?: boolean;
    placeholder?: string;
    autofocus?: boolean;
  }

  export default class Editor {
    constructor(options: EditorOptions);
    on(type: string, handler: () => void): void;
    getMarkdown(): string;
    setMarkdown(markdown: string, cursorToEnd?: boolean): void;
    getEditorElements(): EditorElements;
    destroy(): void;
  }
}

declare module '@toast-ui/editor/dist/i18n/ko-kr';
