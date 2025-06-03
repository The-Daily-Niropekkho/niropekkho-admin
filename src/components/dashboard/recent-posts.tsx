"use client";

import config from "@/config";
import { useDebounced } from "@/hooks/use-debounce";
import { useGetAllNewsQuery } from "@/redux/features/news/newsApi";
import { Category, News, TArgsParam } from "@/types";
import { Card, Input, Tag } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../theme-context";
import Table from "../ui/data-table";

export default function RecentPosts() {
    const { isDark } = useTheme();

    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const query: TArgsParam = {};
    query["page"] = page;
    query["limit"] = limit;
    query["sortBy"] = sortBy;
    query["sortOrder"] = sortOrder;
    query["status"] = "published";

    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });
    if (!!debouncedSearchTerm) {
        query["searchTerm"] = debouncedSearchTerm;
    }

    const {
        data: news,
        isLoading: isNewsLoading,
        isFetching: isNewsFetching,
    } = useGetAllNewsQuery(query);

    const columns = [
        {
            title: "Headline",
            dataIndex: "headline",
            key: "headline",
            render: (text: string, record: News) => (
                <Link
                    href={`${config?.host_front}/${record?.category?.slug}/${record?.id}/${record?.slug}`}
                    target="_blank"
                    style={{ maxWidth: "250px", display: "block" }}
                >
                    {text}
                </Link>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category: Category) => <Tag>{category?.title}</Tag>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    published: "green",
                    draft: "orange",
                    scheduled: "purple",
                    archived: "gray",
                };
                return (
                    <Tag
                        color={colorMap[status] || "default"}
                        style={{ textTransform: "capitalize" }}
                    >
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: "Publish Date",
            dataIndex: "publish_date",
            key: "publish_date",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Reporter",
            key: "reporter",
            render: (data: News) => {
                if (data?.reporter) {
                    const user = Object.values(data?.reporter).filter(
                        Boolean
                    )[0];
                    return (
                        <span style={{ maxWidth: "80px" }}>{`${
                            user?.first_name || ""
                        } ${user?.last_name || ""}`}</span>
                    );
                } else if (data?.generic_reporter) {
                    return (
                        <span style={{ maxWidth: "80px" }}>
                            {data?.generic_reporter.name}
                        </span>
                    );
                } else {
                    return "N/A";
                }
            },
        },
    ];

    return (
        <Card
            title="Recent Posts"
            className="dashboard-card"
            bodyStyle={{
                padding: "0",
                background: isDark ? "#1f2937" : "#ffffff",
            }}
            extra={
                <Input
                    type="text"
                    placeholder="Search here ..."
                    onChange={(e) => setSearchText(e.target.value)}
                />
            }
            style={{
                paddingLeft: 0,
                paddingRight: 0,
            }}
        >
            <Table<News>
                data={news?.data || []}
                meta={news?.meta ?? {}}
                columns={columns}
                isLoading={isNewsLoading}
                page={page}
                limit={limit}
                setLimit={setLimit}
                setPage={setPage}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
                isFetching={isNewsFetching}
            />
        </Card>
    );
}
