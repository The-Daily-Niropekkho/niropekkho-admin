/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    Bookmark,
    ClassicEditor,
    Code,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Fullscreen,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageEditing,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Markdown,
    MediaEmbed,
    PageBreak,
    Paragraph,
    PasteFromMarkdownExperimental,
    PasteFromOffice,
    PlainTableOutput,
    RemoveFormat,
    SimpleUploadAdapter,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableLayout,
    TableProperties,
    TableToolbar,
    // TextPartLanguage,
    TextTransformation,
    Title,
    TodoList,
    Underline,
    WordCount,
} from "ckeditor5";
import { useEffect, useMemo, useRef, useState } from "react";

import "ckeditor5/ckeditor5.css";
import { S3UploadAdapter } from "../ck-editor/s3-upload-adapter";
import { useTheme } from "../theme-context";

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = "GPL"; // or <YOUR_LICENSE_KEY>.

export default function App() {
    const editorContainerRef = useRef(null);
    const [setProgressList] = useState([]);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const { isDark: isDarkMode } = useTheme();
    // Add custom styles
    // Add custom styles
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
      /* Dark mode styles */
      ${
          isDarkMode
              ? `
        /* Dark mode variables */
        :root {
          --editor-bg: #1f1f1f;
          --editor-text: #e0e0e0;
          --editor-border: #444;
          --editor-toolbar-bg: #2a2a2a;
          --editor-hover-bg: #3a3a3a;
          --editor-disabled-bg: #2a2a2a;
          --editor-disabled-text: #666;
        }

        /* Editor main area */
        .ck.ck-editor__main > .ck-editor__editable {
          background-color: var(--editor-bg) !important;
          color: var(--editor-text) !important;
          border-color: var(--editor-border) !important;
        }

        /* Toolbar */
        .ck.ck-editor__top .ck-sticky-panel .ck-toolbar {
          background-color: var(--editor-toolbar-bg) !important;
          border-color: var(--editor-border) !important;
        }

        /* Buttons */
        .ck.ck-button, .ck.ck-button.ck-on {
          color: var(--editor-text) !important;
          background-color: var(--editor-toolbar-bg) !important;
        }

        .ck.ck-button:hover, .ck.ck-button.ck-on:hover {
          background-color: var(--editor-hover-bg) !important;
        }

        .ck.ck-icon :not([fill]) {
          fill: var(--editor-text) !important;
        }

        /* Dropdown panels */
        .ck.ck-dropdown__panel {
          background-color: var(--editor-toolbar-bg) !important;
          border-color: var(--editor-border) !important;
        }

        .ck.ck-list__item .ck-button:hover:not(.ck-disabled) {
          background-color: var(--editor-hover-bg) !important;
        }

        /* Form elements */
        .ck.ck-input {
          background-color: var(--editor-bg) !important;
          border-color: var(--editor-border) !important;
          color: var(--editor-text) !important;
        }

        .ck.ck-labeled-field-view > .ck.ck-labeled-field-view__input-wrapper > .ck.ck-label {
          color: var(--editor-text) !important;
        }

        /* Disabled elements */
        .ck.ck-button.ck-disabled {
          background-color: var(--editor-disabled-bg) !important;
          color: var(--editor-disabled-text) !important;
        }

        /* Toolbar separator */
        .ck.ck-toolbar .ck.ck-toolbar__separator {
          background-color: var(--editor-border) !important;
        }

        /* Tables */
        .ck-content .table table {
          border-color: var(--editor-border) !important;
        }

        .ck-content .table table td, .ck-content .table table th {
          border-color: var(--editor-border) !important;
        }

        .ck-content .table table th {
          background-color: rgba(16, 185, 129, 0.1);
        }

        /* Balloon panels */
        .ck.ck-balloon-panel {
          background-color: var(--editor-toolbar-bg) !important;
          border-color: var(--editor-border) !important;
        }

        .ck.ck-balloon-panel .ck-button {
          color: var(--editor-text) !important;
        }

        /* Word count */
        .ck-word-count {
          background-color: var(--editor-bg) !important;
          color: var(--editor-text) !important;
          border-color: var(--editor-border) !important;
        }

        /* Links */
        .ck-content a {
          color: #3b82f6;
        }
      `
              : ""
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [isDarkMode]);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                extraPlugins: [CustomUploadPlugin],
                toolbar: {
                    items: [
                        "undo",
                        "redo",
                        "|",
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "highlight",
                        "|",
                        "fontSize",
                        "fontFamily",
                        "fontColor",
                        "fontBackgroundColor",
                        "|",
                        "link",
                        "blockQuote",
                        "code",
                        "removeFormat",
                        "|",
                        "bulletedList",
                        "numberedList",
                        "todoList",
                        "outdent",
                        "indent",
                        "|",
                        "insertImage",
                        "mediaEmbed",
                        "insertTable",
                        "|",
                        "horizontalLine",
                        "pageBreak",
                        "|",
                        "specialCharacters",
                        "findAndReplace",
                        "|",
                        "sourceEditing",
                        "fullscreen",
                    ],
                    shouldNotGroupWhenFull: true,
                },
                plugins: [
                    Alignment,
                    Autoformat,
                    AutoImage,
                    AutoLink,
                    Autosave,
                    BlockQuote,
                    Bold,
                    Bookmark,
                    Code,
                    Essentials,
                    FindAndReplace,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    Fullscreen,
                    GeneralHtmlSupport,
                    Heading,
                    Highlight,
                    HorizontalLine,
                    HtmlComment,
                    HtmlEmbed,
                    ImageBlock,
                    ImageCaption,
                    ImageEditing,
                    ImageInline,
                    ImageInsert,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    ImageUtils,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    Markdown,
                    MediaEmbed,
                    PageBreak,
                    Paragraph,
                    PasteFromMarkdownExperimental,
                    PasteFromOffice,
                    PlainTableOutput,
                    RemoveFormat,
                    SimpleUploadAdapter,
                    SourceEditing,
                    SpecialCharacters,
                    SpecialCharactersArrows,
                    SpecialCharactersCurrency,
                    SpecialCharactersEssentials,
                    SpecialCharactersLatin,
                    SpecialCharactersMathematical,
                    SpecialCharactersText,
                    Strikethrough,
                    Style,
                    Subscript,
                    Superscript,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableLayout,
                    TableProperties,
                    TableToolbar,
                    // TextPartLanguage,
                    TextTransformation,
                    Title,
                    TodoList,
                    Underline,
                    WordCount,
                ],
                fontFamily: {
                    supportAllValues: true,
                },
                fontSize: {
                    options: [10, 12, 14, "default", 18, 20, 22],
                    supportAllValues: true,
                },
                fullscreen: {
                    onEnterCallback: (container: HTMLElement) =>
                        container.classList.add(
                            "editor-container",
                            "editor-container_classic-editor",
                            "editor-container_include-style",
                            "editor-container_include-word-count",
                            "editor-container_include-fullscreen",
                            "main-container"
                        ),
                },
                heading: {
                    options: [
                        {
                            model: "paragraph",
                            view: "p",
                            title: "Paragraph",
                            class: "ck-heading_paragraph",
                        },
                        {
                            model: "heading1",
                            view: "h1",
                            title: "Heading 1",
                            class: "ck-heading_heading1",
                        },
                        {
                            model: "heading2",
                            view: "h2",
                            title: "Heading 2",
                            class: "ck-heading_heading2",
                        },
                        {
                            model: "heading3",
                            view: "h3",
                            title: "Heading 3",
                            class: "ck-heading_heading3",
                        },
                        {
                            model: "heading4",
                            view: "h4",
                            title: "Heading 4",
                            class: "ck-heading_heading4",
                        },
                        {
                            model: "heading5",
                            view: "h5",
                            title: "Heading 5",
                            class: "ck-heading_heading5",
                        },
                        {
                            model: "heading6",
                            view: "h6",
                            title: "Heading 6",
                            class: "ck-heading_heading6",
                        },
                    ],
                },
                htmlSupport: {
                    allow: [
                        {
                            name: /^.*$/,
                            styles: true,
                            attributes: true,
                            classes: true,
                        },
                    ],
                },
                image: {
                    toolbar: [
                        "toggleImageCaption",
                        "imageTextAlternative",
                        "|",
                        "imageStyle:inline",
                        "imageStyle:wrapText",
                        "imageStyle:breakText",
                        "|",
                        "resizeImage",
                    ],
                },
                initialData:
                    '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: "https://",
                    decorators: {
                        toggleDownloadable: {
                            mode: "manual",
                            label: "Downloadable",
                            attributes: {
                                download: "file",
                            },
                        },
                    },
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true,
                    },
                },
                placeholder: "Type or paste your content here!",
                style: {
                    definitions: [
                        {
                            name: "Article category",
                            element: "h3",
                            classes: ["category"],
                        },
                        {
                            name: "Title",
                            element: "h2",
                            classes: ["document-title"],
                        },
                        {
                            name: "Subtitle",
                            element: "h3",
                            classes: ["document-subtitle"],
                        },
                        {
                            name: "Info box",
                            element: "p",
                            classes: ["info-box"],
                        },
                        {
                            name: "CTA Link Primary",
                            element: "a",
                            classes: ["button", "button--green"],
                        },
                        {
                            name: "CTA Link Secondary",
                            element: "a",
                            classes: ["button", "button--black"],
                        },
                        {
                            name: "Marker",
                            element: "span",
                            classes: ["marker"],
                        },
                        {
                            name: "Spoiler",
                            element: "span",
                            classes: ["spoiler"],
                        },
                    ],
                },
                table: {
                    contentToolbar: [
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "tableProperties",
                        "tableCellProperties",
                    ],
                },
            },
        };
    }, [isLayoutReady]);

    function CustomUploadPlugin(editor: any) {
        editor.plugins.get("FileRepository").createUploadAdapter = (
            loader: any
        ) => {
            return new S3UploadAdapter(loader, setProgressList);
        };
    }

    return (
        <div
            className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-word-count editor-container_include-fullscreen"
            ref={editorContainerRef}
        >
            <div className="editor-container__editor">
                <div ref={editorRef}>
                    {editorConfig && (
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log("Content:", data);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
