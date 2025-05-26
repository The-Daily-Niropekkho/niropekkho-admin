import { upazillaTag } from "@/constants";
import { TQueryParam, TResponseRedux, Upazilla } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/upazillas";

const upazillaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUpazillas: builder.query({
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
            transformResponse: (response: TResponseRedux<Upazilla[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [upazillaTag],
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
            providesTags: [upazillaTag],
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
            invalidatesTags: [upazillaTag],
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
            invalidatesTags: [upazillaTag],
        }),
        deleteUpazilla: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [upazillaTag],
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
