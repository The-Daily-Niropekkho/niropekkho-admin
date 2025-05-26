import { districtTag } from "@/constants";
import { District, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/districts";

const districtApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDistricts: builder.query({
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
            transformResponse: (response: TResponseRedux<District[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [districtTag],
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
            providesTags: [districtTag],
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
            invalidatesTags: [districtTag],
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
            invalidatesTags: [districtTag],
        }),
        deleteDistrict: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [districtTag],
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
