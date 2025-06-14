/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import CustomImage from "@/components/ui/image";
import config from "@/config";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import { useGetAllNewsQuery } from "@/redux/features/news/newsApi";
import {
    useGetAllAdminUserQuery,
    useGetAllModeratorUserQuery,
    useGetAllWriterUserQuery,
} from "@/redux/features/user/userApi";
import { Category, News, TArgsParam, TFileDocument } from "@/types";
import {
    DownloadOutlined,
    FilterOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Collapse,
    DatePicker,
    Dropdown,
    Flex,
    Menu,
    Select,
    Space,
    Tag,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useState } from "react";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

pdfMake.vfs = pdfFonts.vfs;

const getDateRangeByOption = (option: string): [any, any] | null => {
    const today = dayjs();
    switch (option) {
        case "today":
            return [today.startOf("day"), today.endOf("day")];
        case "yesterday":
            return [
                today.subtract(1, "day").startOf("day"),
                today.subtract(1, "day").endOf("day"),
            ];
        case "last_week":
            return [
                today.subtract(1, "week").startOf("week"),
                today.subtract(1, "week").endOf("week"),
            ];
        case "last_month":
            return [
                today.subtract(1, "month").startOf("month"),
                today.subtract(1, "month").endOf("month"),
            ];
        case "last_3_months":
            return [
                today.subtract(3, "month").startOf("month"),
                today.endOf("month"),
            ];
        case "last_6_months":
            return [
                today.subtract(6, "month").startOf("month"),
                today.endOf("month"),
            ];
        case "last_year":
            return [
                today.subtract(1, "year").startOf("year"),
                today.endOf("year"),
            ];
        default:
            return null;
    }
};

// Custom styles with green color scheme
const filterStyles = {
    select: {
        minWidth: 200,
        borderRadius: "8px",
        transition: "all 0.3s ease",
    },
    card: {
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
    },
    darkCard: {
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        background: "linear-gradient(135deg, #1f1f1f, #2c2c2c)",
    },
};

// Animation variants
const filterVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AllReportsPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryFromUrl = searchParams.get("category_id");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [mediaType, setMediaType] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState(
        categoryFromUrl || ""
    );
    const [dateRange, setDateRange] = useState<[any, any] | null>(null);
    const [userTab, setUserTab] = useState("moderator");
    const [selectedUser, setSelectedUser] = useState<string | undefined>(
        undefined
    );

    const {
        data: categories,
        isLoading: isCategoryLoading,
        isFetching: isCategoryFetching,
    } = useGetAllCategoriesQuery({ limit: 9999 });

    const { data: moderatorUsers, isLoading: isModeratorLoading } =
        useGetAllModeratorUserQuery({ limit: 9999 });
    const { data: writerUsers, isLoading: isWriterLoading } =
        useGetAllWriterUserQuery({ limit: 9999 });
    const { data: admins, isLoading: isGenericLoading } =
        useGetAllAdminUserQuery({ limit: 9999 });

    const query: TArgsParam = {
        page,
        limit,
        sortBy,
        sortOrder,
        status,
        mediaType,
        category_id: selectedCategory,
    };

    if (dateRange?.[0] && dateRange?.[1]) {
        query["createdAtFrom"] = dateRange[0].toISOString();
        query["createdAtTo"] = dateRange[1].toISOString();
    }

    if (selectedUser) {
        if (userTab === "moderator") query["created_by_id"] = selectedUser;
        else if (userTab === "writer") query["reporter_id"] = selectedUser;
        else if (userTab === "admin")
            query["created_by_id"] = selectedUser;
    }

    const {
        data: news,
        isLoading: isNewsLoading,
        isFetching: isNewsFetching,
    } = useGetAllNewsQuery(query);

    const handleCategoryChange = (value: string) => {
        const newCategory = value || "";
        setSelectedCategory(newCategory);
        const params = new URLSearchParams(searchParams.toString());
        if (newCategory) {
            params.set("category_id", newCategory);
        } else {
            params.delete("category_id");
        }
        router.replace(`?${params.toString()}`);
    };

    const handleResetFilters = () => {
        setSelectedCategory("");
        setDateRange(null);
        setSelectedUser(undefined);
        setUserTab("moderator");
        setStatus(undefined);
        setMediaType(undefined);
        router.replace("?");
    };

    const handleDownload = (type: string) => {
        const data = news?.data || [];
        const rows = data.map((item: any, index: number) => [
            index + 1,
            item.headline,
            item.category?.title,
            item.reporter
                ? `${
                      (
                          Object.values(item.reporter)[0] as {
                              first_name?: string;
                              last_name?: string;
                          }
                      )?.first_name || ""
                  } ${
                      (
                          Object.values(item.reporter)[0] as {
                              first_name?: string;
                              last_name?: string;
                          }
                      )?.last_name || ""
                  }`
                : item.generic_reporter?.name || "N/A",
            new Date(item.publish_date).toLocaleString(),
        ]);

        const headers = [
            "S/N",
            "Headline",
            "Category",
            "Reporter",
            "Publish Date",
        ];

        if (type === "xlsx") {
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

            const range = XLSX.utils.decode_range(worksheet["!ref"]!);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
                if (!worksheet[cell_address]) continue;
                worksheet[cell_address].s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: "FFFFCC" } },
                    alignment: { horizontal: "center" },
                };
            }

            XLSX.writeFile(workbook, "reports.xlsx", { bookType: "xlsx" });
        } else if (type === "pdf") {
            const docDefinition = {
                content: [
                    { text: "রিপোর্ট তালিকা", style: "header" },
                    {
                        table: {
                            headerRows: 1,
                            widths: [30, "*", "*", "*", "*"],
                            body: [headers, ...rows],
                        },
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        alignment: "center" as const,
                        margin: [0, 0, 0, 10] as [
                            number,
                            number,
                            number,
                            number
                        ],
                    },
                },
                // defaultStyle: {
                //     font: "Roboto", // অথবা তোমার ফন্ট নাম
                //     fontSize: 9,
                // },
                // fonts: {
                //     Roboto: {
                //         normal: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
                //         bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
                //         italics:
                //             "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
                //         bolditalics:
                //             "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
                //     },
                // },
            };

            pdfMake.createPdf(docDefinition).download("reports.pdf");
        }
    };

    const columns = [
        {
            title: "Serial",
            key: "serial",
            render: (_: any, __: News, index: number) => {
                return <span>{(page - 1) * limit + index + 1}</span>;
            },
            width: 80,
        },
        {
            title: "Thumbnail",
            dataIndex: "banner_image",
            key: "banner_image",
            render: (image: TFileDocument) => (
                <CustomImage src={image} width={80} height={80} />
            ),
        },
        {
            title: "Headline",
            dataIndex: "headline",
            key: "headline",
            render: (text: string, record: News) => (
                <Link
                    href={`${config?.host_front}/${record?.category?.slug}/${record?.id}/${record?.slug}`}
                    target="_blank"
                    style={{ maxWidth: "300px", display: "block" }}
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
            title: "Reporter",
            key: "reporter",
            render: (data: News) => {
                if (data?.reporter) {
                    const user = Object.values(data?.reporter).filter(
                        Boolean
                    )[0];
                    return `${user?.first_name || ""} ${user?.last_name || ""}`;
                } else if (data?.generic_reporter) {
                    return data?.generic_reporter.name;
                } else {
                    return "N/A";
                }
            },
        },
        {
            title: "Publish Date",
            dataIndex: "publish_date",
            key: "publish_date",
            render: (date: string) => new Date(date).toLocaleString(),
            sorter: (a: News, b: News) =>
                new Date(a.publish_date).getTime() -
                new Date(b.publish_date).getTime(),
        },
    ];

    const downloadMenu = (
        <Menu>
            <Menu.Item key="xlsx" onClick={() => handleDownload("xlsx")}>
                Download Excel
            </Menu.Item>
            <Menu.Item key="pdf" onClick={() => handleDownload("pdf")}>
                Download PDF
            </Menu.Item>
        </Menu>
    );

    const activeFilterCount =
        (selectedCategory ? 1 : 0) +
        (dateRange ? 1 : 0) +
        (selectedUser ? 1 : 0) +
        (status ? 1 : 0) +
        (mediaType ? 1 : 0);

    return (
        <>
            <div style={{ marginBottom: 24 }}>
                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 8,
                        color: isDark ? "#fff" : "#000",
                    }}
                >
                    All Reports
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and organize all reports articles with advanced
                    filtering and sorting options.
                </p>
            </div>

            <Collapse
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                    <FilterOutlined
                        rotate={isActive ? 90 : 0}
                        style={{
                            fontSize: 16,
                            color: isDark ? "#95de64" : "#0EA774",
                        }}
                    />
                )}
                style={{
                    ...(isDark ? filterStyles.darkCard : filterStyles.card),
                    marginBottom: 16,
                }}
            >
                <Panel
                    header={
                        <Space>
                            <span style={{ color: isDark ? "#fff" : "#000" }}>
                                Filters
                            </span>
                            <Badge
                                count={activeFilterCount}
                                style={{
                                    backgroundColor: isDark
                                        ? "#0EA774"
                                        : "#0EA774",
                                }}
                            />
                        </Space>
                    }
                    key="1"
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={filterVariants}
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                            style={{ width: "100%", padding: "16px 0" }}
                        >
                            {/* User Filter First */}
                            <Space wrap size="middle" align="center">
                                <Tooltip title="Filter by user (Moderator, Writer, or Admin)">
                                    <Select
                                        showSearch
                                        placeholder="Select User"
                                        optionFilterProp="children"
                                        value={selectedUser}
                                        onChange={(val, option) => {
                                            setSelectedUser(val);
                                            const opt: any = option;
                                            if (opt && opt.key) {
                                                const type = String(
                                                    opt.key
                                                ).split("-")[0];
                                                setUserTab(type);
                                            }
                                        }}
                                        loading={
                                            isModeratorLoading ||
                                            isWriterLoading ||
                                            isGenericLoading
                                        }
                                        style={{
                                            ...filterStyles.select,
                                            minWidth: 300,
                                        }}
                                        dropdownStyle={{ borderRadius: "8px" }}
                                        className={
                                            isDark ? "ant-select-dark" : ""
                                        }
                                        allowClear
                                    >
                                        <Select.OptGroup label="Moderator">
                                            {(moderatorUsers?.data || []).map(
                                                (user: any) => (
                                                    <Select.Option
                                                        key={`moderator-${user.id}`}
                                                        value={user.id}
                                                    >
                                                        {
                                                            user[
                                                                user?.user_type
                                                            ]?.first_name
                                                        }{" "}
                                                        {
                                                            user[
                                                                user?.user_type
                                                            ]?.last_name
                                                        }
                                                    </Select.Option>
                                                )
                                            )}
                                        </Select.OptGroup>
                                        <Select.OptGroup label="Writer">
                                            {(writerUsers?.data || []).map(
                                                (user: any) => (
                                                    <Select.Option
                                                        key={`writer-${user.id}`}
                                                        value={user.id}
                                                    >
                                                        {
                                                            user[
                                                                user?.user_type
                                                            ]?.first_name
                                                        }{" "}
                                                        {
                                                            user[
                                                                user?.user_type
                                                            ]?.last_name
                                                        }
                                                    </Select.Option>
                                                )
                                            )}
                                        </Select.OptGroup>
                                        <Select.OptGroup label="Admins">
                                            {(admins?.data || []).map(
                                                (user: any) => (
                                                    <Select.Option
                                                        key={`admin-${user.id}`}
                                                        value={user.id}
                                                    >
                                                        {
                                                            user[
                                                                user?.user_type
                                                            ]?.first_name
                                                        }{" "}
                                                        {
                                                            user[
                                                                user?.user_type
                                                            ]?.last_name
                                                        }
                                                    </Select.Option>
                                                )
                                            )}
                                        </Select.OptGroup>
                                    </Select>
                                </Tooltip>
                                <Tooltip title="Filter reports by category">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Filter by Category"
                                        value={selectedCategory || undefined}
                                        onChange={handleCategoryChange}
                                        loading={
                                            isCategoryLoading ||
                                            isCategoryFetching
                                        }
                                        optionFilterProp="children"
                                        dropdownStyle={{ borderRadius: "8px" }}
                                        className={
                                            isDark ? "ant-select-dark" : ""
                                        }
                                    >
                                        {(categories?.data || []).map(
                                            (category: Category) => (
                                                <Select.Option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.title}
                                                </Select.Option>
                                            )
                                        )}
                                    </Select>
                                </Tooltip>
                                {selectedUser && news?.meta && (
                                    <Space>
                                        <span
                                            style={{
                                                color: isDark ? "#fff" : "#000",
                                            }}
                                        >
                                            Total News :
                                        </span>
                                        <span
                                            style={{
                                                color: isDark
                                                    ? "#0EA774"
                                                    : "#0EA774",

                                            }}
                                            className="font-bold px-3 py-1"
                                        >
                                            {news?.meta?.total}
                                        </span>
                                    </Space>
                                )}
                            </Space>

                            {/* Action Buttons */}
                            <Space wrap size="middle" align="center">
                                <Tooltip title="Quickly select a date range">
                                    <Select
                                        allowClear
                                        placeholder="Quick Date Filter"
                                        onChange={(value) => {
                                            const range =
                                                getDateRangeByOption(value);
                                            setDateRange(range);
                                        }}
                                        dropdownStyle={{ borderRadius: "8px" }}
                                        className="min-w-36"
                                    >
                                        <Select.Option value="today">
                                            Today
                                        </Select.Option>
                                        <Select.Option value="yesterday">
                                            Yesterday
                                        </Select.Option>
                                        <Select.Option value="last_week">
                                            Last Week
                                        </Select.Option>
                                        <Select.Option value="last_month">
                                            Last Month
                                        </Select.Option>
                                        <Select.Option value="last_3_months">
                                            Last 3 Months
                                        </Select.Option>
                                        <Select.Option value="last_6_months">
                                            Last 6 Months
                                        </Select.Option>
                                        <Select.Option value="last_year">
                                            Last Year
                                        </Select.Option>
                                    </Select>
                                </Tooltip>

                                <Tooltip title="Select a custom date range">
                                    <RangePicker
                                        value={dateRange}
                                        onChange={(dates) =>
                                            setDateRange(dates)
                                        }
                                        className={
                                            isDark ? "ant-picker-dark" : ""
                                        }
                                    />
                                </Tooltip>
                                <Tooltip title="Download reports as Excel or PDF">
                                    <Dropdown
                                        overlay={downloadMenu}
                                        placement="bottomRight"
                                        // disabled={!selectedUser}
                                    >
                                        <Button
                                            type="primary"
                                            icon={<DownloadOutlined />}
                                            // disabled={!selectedUser}
                                        >
                                            Download
                                        </Button>
                                    </Dropdown>
                                </Tooltip>

                                <Tooltip title="Reset all filters">
                                    <Button
                                        type="primary"
                                        icon={<ReloadOutlined />}
                                        onClick={handleResetFilters}
                                    >
                                        Reset
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Flex>
                    </motion.div>
                </Panel>
            </Collapse>

            {selectedUser ? (
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
                    setStatus={setStatus}
                    setMediaType={setMediaType}
                    isFetching={isNewsFetching}
                />
            ) : (
                <div
                    style={{
                        padding: 40,
                        textAlign: "center",
                        fontSize: 16,
                        color: isDark ? "#fff" : "#888",
                    }}
                >
                    Please select a user to view reports.
                </div>
            )}
        </>
    );
}
