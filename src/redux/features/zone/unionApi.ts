import { tags } from "@/constants";
import { TArgsParam, TResponseRedux, Union } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/unions";

const unionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUnions: builder.query({
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
            transformResponse: (response: TResponseRedux<Union[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.unionTag],
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
            providesTags: [tags.unionTag],
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
            invalidatesTags: [tags.unionTag],
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
            invalidatesTags: [tags.unionTag],
        }),
        deleteUnion: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.unionTag],
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
