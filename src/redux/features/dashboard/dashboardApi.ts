import { tags } from "@/constants";
import { DashboardChart, DashboardSatistics, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/dashboard`;

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.query({
            query: () => {
                return {
                    url: url,
                };
            },
            transformResponse: (
                response: TResponseRedux<DashboardSatistics>
            ) => {
                return response.data;
            },
            providesTags: [tags.dashboardSatisticsTag],
        }),
        getChartData: builder.query({
            query: () => {
                return {
                    url: `${url}/chart`,
                };
            },
            transformResponse: (
                response: TResponseRedux<DashboardChart>
            ) => {
                return response.data;
            },
            providesTags: [tags.dashboardChartTag],
        }),
    }),
});

export const { useGetStatisticsQuery, useGetChartDataQuery } = dashboardApi;
