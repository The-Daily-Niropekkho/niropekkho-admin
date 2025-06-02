import { tags } from "@/constants";
import { District, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/districts";

const districtApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDistricts: builder.query({
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
            transformResponse: (response: TResponseRedux<District[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.districtTag],
        }),
        getDistrictDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<District>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.districtTag],
        }),
        createDistrict: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<District>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.districtTag],
        }),
        updateDistrict: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<District>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.districtTag],
        }),
        deleteDistrict: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.districtTag],
        }),
    }),
});

export const {
    useGetAllDistrictsQuery,
    useGetDistrictDetailsQuery,
    useCreateDistrictMutation,
    useUpdateDistrictMutation,
    useDeleteDistrictMutation,
} = districtApi;
