/* eslint-disable @typescript-eslint/ban-ts-comment */
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
    TodoList,
    Underline,
    WordCount,
} from "ckeditor5";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button, Select } from "antd";
import "ckeditor5/ckeditor5.css";
import { useTheme } from "../theme-context";
import { S3UploadAdapter } from "./s3-upload-adapter";

interface CKEditorProps {
    value?: string;
    onChange: (data: string) => void;
}

const demoAds = [
    {
        id: "ad1",
        label: "Ad: Product Banner",
        html: `<div class="ad-block"><img src="https://via.placeholder.com/300x100?text=Ad+Banner" alt="Ad Banner"/><p><small>Sponsored</small></p></div>`,
    },
    {
        id: "ad2",
        label: "Ad: Text Promo",
        html: `<div class="ad-block"><p><strong>50% off on all items!</strong></p><p>Visit our store today.</p><p><small>Sponsored</small></p></div>`,
    },
    {
        id: "ad3",
        label: "Ad: Call to Action",
        html: `<div class="ad-block"><p>🚀 Try our new service today!</p><a href="/promo" target="_blank">Learn more →</a></div>`,
    },
];

export default function Editor({ value, onChange }: CKEditorProps) {
    console.log(value, "value from editor");
    
    const editorContainerRef = useRef(null);
    const [, setFileProgressList] = useState<
        Array<{ name: string; progress: number; status: string; url?: string }>
    >([]);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const { isDark: isDarkMode } = useTheme();
    const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
    const [editorInstance, setEditorInstance] = useState<any>(null);
    // Add custom styles
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
      /* Dark mode styles */
      ${
          isDarkMode
              ? `
:root {
  --ck-color-base-background: #0f172a; /* bg-slate-900 */
  --ck-color-base-border: #1e293b;     /* border-slate-800 */
  --ck-color-toolbar-background: #1e293b; /* toolbar dark */
  --ck-color-text: #e2e8f0;            /* text-slate-200 */
  --ck-color-button-default-hover-background: #334155; /* hover */
  --ck-color-button-default-active-background: #475569; /* active */
  --ck-color-dropdown-panel-background: #1e293b;
  --ck-color-dropdown-panel-border: #334155;
  --ck-color-focus-border: #3b82f6;
  --ck-color-link-default: #3b82f6;
}

/* Main editor area */
.ck.ck-editor__main > .ck-editor__editable {
  background-color: var(--ck-color-base-background) !important;
  color: var(--ck-color-text) !important;
  border-color: var(--ck-color-base-border) !important;
    box-shadow: none !important;
    min-height: 200px !important;
    padding: 10px !important;
}

/* Toolbar container */
.ck.ck-toolbar__container {
    background-color: var(--ck-color-toolbar-background) !important;
    border-color: var(--ck-color-base-border) !important;
    }
/* Toolbar items */
.ck.ck-toolbar__items {
    background-color: var(--ck-color-toolbar-background) !important;
    border-color: var(--ck-color-base-border) !important;
    }
/* Toolbar dropdowns */
.ck.ck-dropdown {
    background-color: var(--ck-color-dropdown-panel-background) !important;
    border-color: var(--ck-color-dropdown-panel-border) !important;
    color: var(--ck-color-text) !important;
    }
/* Toolbar dropdown items */
.ck.ck-dropdown__panel .ck-list {
    background-color: var(--ck-color-dropdown-panel-background) !important;
    color: var(--ck-color-text) !important;
    }
/* Toolbar dropdown item hover */
.ck.ck-dropdown__panel .ck-list .ck-list__item:hover {
    background-color: var(--ck-color-button-default-hover-background) !important;
    color: var(--ck-color-text) !important;
    }
/* Toolbar dropdown item active */
.ck.ck-dropdown__panel .ck-list .ck-list__item.ck-on {
    background-color: var(--ck-color-button-default-active-background) !important;
    color: var(--ck-color-text) !important;
    }
    

/* Toolbar */
.ck.ck-toolbar {
  background-color: var(--ck-color-toolbar-background) !important;
  border-color: var(--ck-color-base-border) !important;
}

/* Toolbar buttons */
.ck.ck-button {
  color: var(--ck-color-text) !important;
}
.ck.ck-button:hover,
.ck.ck-button.ck-on {
  background-color: var(--ck-color-button-default-hover-background) !important;
}
.ck.ck-button.ck-on:hover {
  background-color: var(--ck-color-button-default-active-background) !important;
}

/* Placeholder text */
.ck.ck-editor__editable:not(.ck-focused)::before {
  color: #64748b !important; /* slate-400 */
}

/* Dropdowns */
.ck.ck-dropdown__panel {
  background-color: var(--ck-color-dropdown-panel-background) !important;
  border-color: var(--ck-color-dropdown-panel-border) !important;
  color: var(--ck-color-text) !important;
}
.ck.ck-dropdown__panel .ck-list {
  background-color: var(--ck-color-dropdown-panel-background) !important;
    color: var(--ck-color-text) !important;
}
/* Dropdown items */
.ck.ck-list .ck-list__item {
    color: var(--ck-color-text) !important;
}
/* Dropdown item hover */
.ck.ck-list .ck-list__item:hover {
    background-color: var(--ck-color-button-default-hover-background) !important;
    color: var(--ck-color-text) !important;
}
/* Dropdown item active */
.ck.ck-list .ck-list__item.ck-on {
    background-color: var(--ck-color-button-default-active-background) !important;
    color: var(--ck-color-text) !important;
}
/* Focused elements */
.ck.ck-focused {
    border-color: var(--ck-color-focus-border) !important;
    box-shadow: 0 0 0 1px var(--ck-color-focus-border) !important;
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
                    TodoList,
                    Underline,
                    WordCount,
                ],
                fontFamily: {
                    options: [
                        "SolaimanLipi, sans-serif",
                        "Nikosh, sans-serif",
                        "Siyam Rupali, sans-serif",
                        "Kalpurush, sans-serif",
                        "default",
                        "Arial, Helvetica, sans-serif",
                        "Times New Roman, Times, serif",
                    ],
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
                initialData: "",
                licenseKey: "GPL",
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
                placeholder: "Start writing your article...",
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
                mediaEmbed: {
                    previewsInData: true,
                    providers: [
                        {
                            name: "youtube",
                            url: /^https?:\/\/(www\.)?youtube\.com\/watch\?v=.*$/,
                            html: (match: (string | URL)[]) => {
                                const videoId = new URL(
                                    match[0]
                                ).searchParams.get("v");
                                return (
                                    '<div class="ck-media__wrapper">' +
                                    `<iframe width="640" height="360" src="https://www.youtube.com/embed/${videoId}" ` +
                                    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' +
                                    "</div>"
                                );
                            },
                        },
                    ],
                },
            },
        };
    }, [isLayoutReady]);

    function CustomUploadPlugin(editor: any) {
        editor.plugins.get("FileRepository").createUploadAdapter = (
            loader: any
        ) => {
            return new S3UploadAdapter(loader, setFileProgressList);
        };
    }

    const insertAdPlaceholder = () => {
        if (!selectedAdId || !editorInstance) return;

        const html = `
        <div class="ad-placeholder" data-ad-id="${selectedAdId}">[Ad: ${selectedAdId}]<p><small>Sponsored</small></p></div>
        <p></p>
        `;

        const viewFragment = editorInstance.data.processor.toView(html);
        const modelFragment = editorInstance.data.toModel(viewFragment);

        editorInstance.model.insertContent(modelFragment);
    };

    useEffect(() => {
        if (editorInstance && value !== editorInstance.getData()) {
            editorInstance.setData(value || "");
        }

    }, [value, editorInstance]);

    return (
        <div
            className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-word-count editor-container_include-fullscreen"
            ref={editorContainerRef}
        >
            <div className="editor-container__editor">
                <div ref={editorRef}>
                    <div
                        className="flex md:justify-end gap-2 md:gap-3.5"
                        style={{
                            marginBottom: "10px",
                        }}
                    >
                        <Select
                            placeholder="Select ad to insert"
                            style={{ width: 180 }}
                            value={selectedAdId || undefined}
                            onChange={(val) => setSelectedAdId(val)}
                        >
                            {demoAds.map((ad) => (
                                <Select.Option key={ad.id} value={ad.id}>
                                    {ad.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <Button
                            type="primary"
                            onClick={insertAdPlaceholder}
                            disabled={!selectedAdId}
                        >
                            Insert Ad
                        </Button>
                    </div>
                    {editorConfig && (
                        <CKEditor
                            editor={ClassicEditor}
                            data={value || ""}
                            // @ts-ignore
                            config={editorConfig}
                            onReady={(editor) => setEditorInstance(editor)}
                            onChange={(event, editor) =>
                                onChange(editor.getData())
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
