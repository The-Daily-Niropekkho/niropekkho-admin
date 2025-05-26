import { divisionTag } from "@/constants";
import { Division, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/divisions";

const divisionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDivisions: builder.query({
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
            transformResponse: (response: TResponseRedux<Division[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [divisionTag],
        }),
        getDivisionDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Division>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [divisionTag],
        }),
        createDivision: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Division>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [divisionTag],
        }),
        updateDivision: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Division>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [divisionTag],
        }),
        deleteDivision: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [divisionTag],
        }),
    }),
});

export const {
    useGetAllDivisionsQuery,
    useGetDivisionDetailsQuery,
    useCreateDivisionMutation,
    useUpdateDivisionMutation,
    useDeleteDivisionMutation,
} = divisionApi;
