/* eslint-disable @typescript-eslint/no-explicit-any */
import fileObjectToLink from "@/utils/fileObjectToLink";
import { FilProgressMultipleFilesUploaderS3 } from "@/utils/handleFileUploderFileProgress";
import { message } from "antd";

export class S3UploadAdapter {
    private loader: any;
    private setProgressList: any;

    constructor(loader: any, setProgressList: any) {
        this.loader = loader;
        this.setProgressList = setProgressList;
    }

    async upload() {
        const file = await this.loader.file;

        const hide = message.loading(`Uploading ${file.name}...`, 0); // persistent toast

        try {
            const uploaded = await FilProgressMultipleFilesUploaderS3(
                [file],
                this.setProgressList
            );
            const uploadedFile = uploaded?.[0];

            const url = fileObjectToLink(uploadedFile);

            message.success(`${file.name} uploaded successfully`);
            hide(); // remove loading toast

            return {
                default: url, // Image URL for CKEditor to insert
            };
        } catch (error) {
            message.error(`${file.name} upload failed`);
            hide();
            throw error;
        }
    }

    abort() {
        // Optionally handle upload cancellation
    }
}
