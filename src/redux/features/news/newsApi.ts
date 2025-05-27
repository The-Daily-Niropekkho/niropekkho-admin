import { newsTag } from "@/constants";
import { News, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/news`;

const newsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNews: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item: TQueryParam) => {
                        if (item.value !== undefined && item.value !== "") {
                            params.append(item.name, item.value as string);
                        }
                    });
                }
                return {
                    url: url,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<News[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [newsTag],
        }),
        getNewsDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<News>) => {
                return response.data
            },
            providesTags: [newsTag],
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
            invalidatesTags: [newsTag],
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
            invalidatesTags: [newsTag],
        }),
        deleteNews: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [newsTag],
        }),
    }),
});

export const {
    useGetAllNewsQuery,
    useGetNewsDetailsQuery,
    useCreateNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
} = newsApi;
