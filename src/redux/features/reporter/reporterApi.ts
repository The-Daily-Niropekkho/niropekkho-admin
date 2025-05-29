import { reporterTag } from "@/constants";
import { GenericReporter, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/generic-reporters`;

const reporterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGenericReporters: builder.query({
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
            transformResponse: (
                response: TResponseRedux<GenericReporter[]>
            ) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [reporterTag],
        }),
        getGenericReporterDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<GenericReporter>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [reporterTag],
        }),
        createGenericReporter: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<GenericReporter>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [reporterTag],
        }),
        updateGenericReporter: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<GenericReporter>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [reporterTag],
        }),
        deleteGenericReporter: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [reporterTag],
        }),
    }),
});

export const {
    useGetAllGenericReportersQuery,
    useGetGenericReporterDetailsQuery,
    useCreateGenericReporterMutation,
    useUpdateGenericReporterMutation,
    useDeleteGenericReporterMutation,
} = reporterApi;
