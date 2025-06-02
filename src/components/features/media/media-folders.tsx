"use client";

import { useTheme } from "@/components/theme-context";
import { FileType } from "@/constants";
import { FolderOutlined } from "@ant-design/icons";

interface MediaFoldersProps {
    activeFolder: string;
    setActiveFolder: (folder: string) => void;
}

export default function MediaFolders({
    activeFolder,
    setActiveFolder,
}: MediaFoldersProps) {
    //     folder: ["Images", "Videos", "Documents", "Archives", "Uncategorized"][
    //     Math.floor(Math.random() * 5)
    // ]
    const { isDark } = useTheme();
    const folders = Object.values(FileType);

    return (
        <div className="media-folders">
            <div className="flex justify-between" style={{marginBottom: 10}}>
                <h3 className={`sidebar-title ${isDark ? "dark" : ""}`}>
                    <FolderOutlined /> Folders
                </h3>
            </div>
            <ul className="folder-list">
                <li
                    className={`folder-item ${
                        activeFolder === "all" ? "active" : ""
                    } ${isDark ? "dark" : ""}`}
                    onClick={() => setActiveFolder("all")}
                >
                    <FolderOutlined /> All Files
                </li>
                {folders.map((folder) => (
                    <li
                        key={folder}
                        className={`folder-item ${
                            activeFolder === folder ? "active" : ""
                        } ${isDark ? "dark" : ""}`}
                        onClick={() => setActiveFolder(String(folder))}
                    >
                        <FolderOutlined />{" "}
                        {String(folder)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
