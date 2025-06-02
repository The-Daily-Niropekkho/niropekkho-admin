/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table as AntdTable } from "antd";
import { ColumnsType } from "antd/es/table";

interface TableProps<TData> {
    data: TData[];
    meta: { total?: number };
    columns: ColumnsType<TData>;
    isLoading: boolean;
    isFetching: boolean;
    page: number;
    setPage: (page: number) => void;
    limit: number;
    setLimit: (limit: number) => void;
    setSortBy: (field: string) => void;
    setSortOrder: (order: string) => void;
    setStatus?: (value: string | undefined) => void;
    setMediaType?: (value: string | undefined) => void;
}
export default function Table<TData>({
    data,
    meta,
    columns,
    isLoading,
    isFetching,
    page,
    setPage,
    limit,
    setLimit,
    setSortBy,
    setStatus,
    setMediaType,
    setSortOrder,
}: TableProps<TData>) {
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setPage(pagination.current);
        setLimit(pagination.pageSize);

        if (sorter.field && sorter.order) {
            setSortBy(sorter.field);
            setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
        } else {
            setSortBy("createdAt");
            setSortOrder("desc");
        }

        if (setStatus) {
            // Extract selected filters
            if (filters.status) setStatus(filters.status[0]);
            else setStatus(undefined);
        }
        if (setMediaType) {
            // Extract selected filters
            if (filters.media_type) setMediaType(filters.media_type[0]);
            else setMediaType(undefined);
        }
    };
    return (
        <AntdTable
            dataSource={data}
            columns={columns}
            loading={isLoading || isFetching}
            rowKey="title"
            pagination={{
                current: page,
                pageSize: limit,
                total: meta?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
            }}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
        />
    );
}
