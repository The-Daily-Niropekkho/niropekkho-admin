import { tags } from "@/constants";
import { TArgsParam, TResponseRedux, Upazilla } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/upazillas";

const upazillaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUpazillas: builder.query({
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
            transformResponse: (response: TResponseRedux<Upazilla[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.upazillaTag],
        }),
        getUpazillaDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Upazilla>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.upazillaTag],
        }),
        createUpazilla: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Upazilla>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.upazillaTag],
        }),
        updateUpazilla: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Upazilla>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.upazillaTag],
        }),
        deleteUpazilla: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.upazillaTag],
        }),
    }),
});

export const {
    useGetAllUpazillasQuery,
    useGetUpazillaDetailsQuery,
    useCreateUpazillaMutation,
    useUpdateUpazillaMutation,
    useDeleteUpazillaMutation,
} = upazillaApi;
