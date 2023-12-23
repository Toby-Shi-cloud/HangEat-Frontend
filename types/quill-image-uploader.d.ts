declare module 'quill-image-uploader' {
    import Quill from 'quill';

    interface ImageUploaderOptions {
        upload: (file: File) => Promise<string>;
        dropPlaceholder?: string;
        uploadPlaceholder?: string;
        toolbarButton?: {
            className?: string;
            icon?: string;
            title?: string;
        };
    }

    class ImageUploader {
        constructor(quill: Quill, options: ImageUploaderOptions);
    }

    export default ImageUploader;
}
