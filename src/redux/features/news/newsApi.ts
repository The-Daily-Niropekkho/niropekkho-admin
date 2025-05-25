import { News, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

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
                    url: `/news`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<News[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["categories"],
        }),
        getNewsDetails: builder.query({
            query: (id) => {
                return {
                    url: `/news/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<News>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: ["categories"],
        }),
        createNews: builder.mutation({
            query: (data) => {
                return {
                    url: `/news`,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<News>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: ["categories"],
        }),
        updateNews: builder.mutation({
            query: (data) => {
                return {
                    url: `/news/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<News>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: ["categories"],
        }),
        deleteNews: builder.mutation({
            query: (id) => {
                return {
                    url: `/news/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["categories"],
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
