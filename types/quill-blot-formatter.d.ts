declare module 'quill-blot-formatter/dist/BlotFormatter' {
    import Quill from 'quill';

    interface Options {
        specs: any[];
        overlay: any;
        align: any;
        resize: any;
    }

    class BlotFormatter {
        constructor(quill: Quill, options?: Options);
    }

    export default BlotFormatter;
}