import { EditOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";

const activities = [
    {
        title: "Profile updated",
        time: "2 hours ago",
        type: "update",
    },
    {
        title: "Logged in from new device",
        time: "Yesterday",
        type: "login",
    },
    {
        title: "Password changed",
        time: "3 days ago",
        type: "security",
    },
    {
        title: "Email verified",
        time: "1 week ago",
        type: "verify",
    },
];

export default function ActivityLogs() {
    return (

            <List
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    icon={
                                        item.type === "update" ? (
                                            <EditOutlined />
                                        ) : item.type === "login" ? (
                                            <UserOutlined />
                                        ) : item.type === "security" ? (
                                            <LockOutlined />
                                        ) : (
                                            <MailOutlined />
                                        )
                                    }
                                    style={{
                                        backgroundColor:
                                            item.type === "update"
                                                ? "#52c41a"
                                                : item.type === "login"
                                                ? "#1890ff"
                                                : item.type === "security"
                                                ? "#fa8c16"
                                                : "#722ed1",
                                    }}
                                />
                            }
                            title={item.title}
                            description={item.time}
                        />
                    </List.Item>
                )}
            />
    );
}
