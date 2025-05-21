// components/features/media/MediaFolders.tsx
import { TFileDocument } from "@/types";
import { FolderOutlined } from "@ant-design/icons";

interface MediaFoldersProps {
    mediaItems: TFileDocument[];
    activeFolder: string;
    isDark?: boolean;
    setActiveFolder: (folder: string) => void;
}

export default function MediaFolders({
    mediaItems,
    activeFolder,
    setActiveFolder,
    isDark,
}: MediaFoldersProps) {
    //     folder: ["Images", "Videos", "Documents", "Archives", "Uncategorized"][
    //     Math.floor(Math.random() * 5)
    // ]

    const folders = Array.from(new Set(mediaItems.map((item) => item.fileType)));

    return (
        <div className="media-folders">
            <h3 className={`sidebar-title ${isDark ? "dark" : ""}`}>
                <FolderOutlined /> Folders
            </h3>
            <ul className="folder-list">
                <li
                    className={`folder-item ${
                        activeFolder === "all" ? "active" : ""
                    } ${isDark ? "dark" : ""}`}
                    onClick={() => setActiveFolder("all")}
                >
                    <FolderOutlined /> All Files
                    <span className="folder-count">{mediaItems.length}</span>
                </li>
                {folders.map((folder) => (
                    <li
                        key={folder}
                        className={`folder-item ${
                            activeFolder === folder ? "active" : ""
                        } ${isDark ? "dark" : ""}`}
                        onClick={() => setActiveFolder(folder)}
                    >
                        <FolderOutlined /> {folder.charAt(0).toUpperCase() + folder.slice(1)}
                        <span className="folder-count">
                            {
                                mediaItems.filter(
                                    (item) => item.fileType === folder
                                ).length
                            }

                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
