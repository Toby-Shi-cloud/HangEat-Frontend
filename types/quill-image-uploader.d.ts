declare module 'quill-image-uploader' {
    import Quill from 'quill';

    interface Options {
        upload: (file: File) => Promise<string>;
    }

    class ImageUploader {
        constructor(quill: Quill, options: Options);
    }

    export default ImageUploader;
}
