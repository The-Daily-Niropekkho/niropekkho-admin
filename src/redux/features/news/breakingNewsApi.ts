/* eslint-disable @typescript-eslint/no-explicit-any */
import { tags } from "@/constants";
import { BreakingNews, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/breaking-news`;

const breakingNewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBreakingNews: builder.query({
            query: (args: TArgsParam) => {
                const cleanedParams = Object.entries(args || {}).reduce(
                    (acc, [key, value]) => {
                        if (
                            value !== null &&
                            value !== undefined &&
                            value !== "" &&
                            value !== "all"
                        ) {
                            acc[key] = value;
                        }
                        return acc;
                    },
                    {} as TArgsParam
                );

                return {
                    url: url,
                    params: cleanedParams,
                };
            },
            transformResponse: (response: TResponseRedux<BreakingNews[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.breakingNewsTag],
        }),
        updateBreakingNews: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<BreakingNews>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.breakingNewsTag],
        }),
        deleteBreakingNews: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.breakingNewsTag],
        }),
    }),
});

export const {
    useGetAllBreakingNewsQuery,
    useUpdateBreakingNewsMutation,
    useDeleteBreakingNewsMutation,
} = breakingNewsApi;
