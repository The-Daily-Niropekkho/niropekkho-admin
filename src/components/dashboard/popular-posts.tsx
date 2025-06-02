/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import config from "@/config";
import { useDebounced } from "@/hooks/use-debounce";
import { useGetAllTopNewsQuery } from "@/redux/features/news/newsApi";
import { TArgsParam, TopNews } from "@/types";
import { Card, Input, Tag } from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTheme } from "../theme-context";
import Table from "../ui/data-table";

export default function PopularPosts() {
    const { isDark } = useTheme();

    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [sortBy, setSortBy] = useState("total_view");
    const [sortOrder, setSortOrder] = useState<string>("desc");

    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });

    const query: TArgsParam = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(debouncedSearchTerm && { searchTerm: debouncedSearchTerm }),
        fields: "category,publisher",
    };

    const { data: news, isLoading, isFetching } = useGetAllTopNewsQuery(query);

    const columns = useMemo(
        () => [
            {
                title: "Headline",
                key: "headline",
                render: (_: any, record: TopNews) => (
                    <Link
                        href={`${config.host_front}/${record.news?.category?.slug}/${record.id}/${record?.news?.slug}`}
                        target="_blank"
                        style={{ maxWidth: "200px", display: "block" }}
                    >
                        {record?.news?.headline}
                    </Link>
                ),
            },
            {
                title: "Category",
                key: "category",
                render: (_: any, record: TopNews) => (
                    <Tag>{record?.news?.category?.title}</Tag>
                ),
            },
            {
                title: "Total Share",
                dataIndex: "total_share",
                key: "total_share",
                render: (total_share: number) => total_share,
            },
            {
                title: "Total View",
                dataIndex: "total_view",
                key: "total_view",
                render: (total_view: number) => total_view,
            },
            {
                title: "Publish Date",
                key: "publish_date",
                render: (data: TopNews) => {
                    const date = data?.news?.publish_date;
                    return date ? new Date(date).toLocaleDateString() : "N/A";
                },
            },
            {
                title: "Reporter",
                key: "reporter",
                render: (data: TopNews) => {
                    const reporter = data?.news?.reporter;
                    const generic_reporter = data?.news?.generic_reporter;
                    if (reporter) {
                        const user = Object.values(reporter).find(Boolean);
                        return user
                            ? `${user.first_name || ""} ${user.last_name || ""}`
                            : "N/A";
                    }
                    return generic_reporter?.name || "N/A";
                },
            },
        ],
        []
    );

    return (
        <Card
            title="Popular Posts"
            className="dashboard-card"
            bodyStyle={{
                padding: 0,
                background: isDark ? "#1f2937" : "#ffffff",
            }}
            extra={
                <Input
                    placeholder="Search here ..."
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />
            }
            style={{
                paddingLeft: 0,
                paddingRight: 0,
            }}
        >
            <Table<TopNews>
                data={news?.data || []}
                meta={news?.meta ?? {}}
                columns={columns}
                isLoading={isLoading}
                page={page}
                limit={limit}
                setLimit={setLimit}
                setPage={setPage}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
                isFetching={isFetching}
            />
        </Card>
    );
}
