/* eslint-disable @typescript-eslint/no-explicit-any */
import { tags } from "@/constants";
import { News, TArgsParam, TopNews, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/news`;
const urlTop = `/news-utils/top-read-news`;

const newsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNews: builder.query({
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
                    url: `${url}/dashboard-news`,
                    params: cleanedParams,
                };
            },
            transformResponse: (response: TResponseRedux<News[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.newsTag],
        }),
        getAllTopNews: builder.query({
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
                    url: urlTop,
                    params: cleanedParams,
                };
            },
            transformResponse: (response: TResponseRedux<TopNews[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.newsTag],
        }),
        getNewsDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<News>) => {
                return response.data;
            },
            providesTags: (result, error, id) => [
                tags.newsTag,
                { type: tags.newsTag, id },
            ],
        }),
        createNews: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<News>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.newsTag],
        }),
        updateNews: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<News>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: (result, error, arg) => [
                { type: tags.newsTag, id: arg },
            ],
        }),
        deleteNews: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.newsTag],
        }),
    }),
});

export const {
    useGetAllNewsQuery,
    useGetAllTopNewsQuery,
    useGetNewsDetailsQuery,
    useCreateNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
} = newsApi;
