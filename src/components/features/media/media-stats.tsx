import { InfoCircleOutlined } from "@ant-design/icons";

interface MediaStatsProps {
    stats: {
        total: number;
        images: number;
        videos: number;
        documents: number;
        other: number;
    };
    isDark?: boolean;
}

export default function MediaStats({ stats, isDark }: MediaStatsProps) {
    return (
        <div className="media-stats">
            <h3 className={`sidebar-title ${isDark ? "dark" : ""}`}>
                <InfoCircleOutlined /> Statistics
            </h3>
            <ul className="stats-list">
                {Object.entries(stats).map(([key, value]) => (
                    <li key={key} className={`stats-item ${isDark ? "dark" : ""}`}>
                        <span className="stats-label">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        <span className="stats-value">{value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}