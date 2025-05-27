import { reporterTag } from "@/constants";
import { GenericReporter, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/generic-reporters`;

const reporterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGenericReporters: builder.query({
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
