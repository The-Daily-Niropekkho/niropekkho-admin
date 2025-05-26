import { unionTag } from "@/constants";
import { TQueryParam, TResponseRedux, Union } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/unions";

const unionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUnions: builder.query({
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
            transformResponse: (response: TResponseRedux<Union[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [unionTag],
        }),
        getUnionDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Union>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [unionTag],
        }),
        createUnion: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Union>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [unionTag],
        }),
        updateUnion: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Union>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [unionTag],
        }),
        deleteUnion: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [unionTag],
        }),
    }),
});

export const {
    useGetAllUnionsQuery,
    useGetUnionDetailsQuery,
    useCreateUnionMutation,
    useUpdateUnionMutation,
    useDeleteUnionMutation,
} = unionApi;
