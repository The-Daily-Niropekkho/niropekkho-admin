import { tags } from "@/constants";
import { DashboardSatistics, TResponseRedux } from "@/types";
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
    }),
});

export const { useGetStatisticsQuery } = dashboardApi;
