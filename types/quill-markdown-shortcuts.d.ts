declare module 'quill-markdown-shortcuts' {
    import Quill from 'quill';

    interface QuillMarkdownShortcutsOptions {
        /* Add any options here */
    }

    class QuillMarkdownShortcuts {
        constructor(quill: Quill, options?: QuillMarkdownShortcutsOptions);
    }

    export default QuillMarkdownShortcuts;
}
