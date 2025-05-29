import { divisionTag } from "@/constants";
import { Division, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/divisions";

const divisionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDivisions: builder.query({
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
