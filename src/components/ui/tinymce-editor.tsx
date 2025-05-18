/* eslint-disable @typescript-eslint/no-explicit-any */

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { useTheme } from "../theme-context";

interface TinyMCEEditorProps {
    onChange: (value: any) => void;
    initialValue?: string;
    onBlur?: () => void;
    init?: Record<string, string | number | boolean | string[]>;
}

export default function TinyMCEEditor({
    onChange,
    initialValue = "<p>Enter your content here...</p>",
    onBlur,
    init: customInit,
}: TinyMCEEditorProps) {
    const editorRef = useRef<any>(null);
    const { theme } = useTheme()
    const defaultInit = {
        licenseKey: "gpl",
        height: 500,
        menubar: false,
        plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
        ],
        toolbar:
            "undo redo | blocks | bold italic underline forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | " +
            "removeformat code fullscreen help",
        skin: theme === "dark" ? "oxide-dark" : "oxide",
        content_css: theme === "dark" ? "dark" : "default",
        content_style: theme === "dark"
            ? "body { font-family:Helvetica,Arial,sans-serif; font-size:16px; background-color: #1a1a1a; color: #ffffff; }"
            : "body { font-family:Helvetica,Arial,sans-serif; font-size:16px; background-color: #ffffff; color: #000000; }",
    };

    return (
        <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            onInit={(_evt: any, editor: any) => {
                editorRef.current = editor;
            }}
            initialValue={initialValue}
            onEditorChange={onChange}
            onBlur={onBlur}
            init={{
                ...defaultInit,
                ...customInit,
            }}
        />
    );
}
