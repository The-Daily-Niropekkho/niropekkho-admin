
import { tags } from "@/constants";
import { EpaperCategory, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/epaper/category`;

const epaperCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEpaperCategories: builder.query({
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
            transformResponse: (response: TResponseRedux<EpaperCategory[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.categoryTag],
        }),
        getEpaperCategoryDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<EpaperCategory>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.categoryTag],
        }),
        createEpaperCategory: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<EpaperCategory>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.categoryTag],
        }),
        updateEpaperCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<EpaperCategory>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.categoryTag],
        }),
        deleteEpaperCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.categoryTag],
        }),
    }),
});

export const {
    useGetAllEpaperCategoriesQuery,
    useCreateEpaperCategoryMutation,
    useUpdateEpaperCategoryMutation,
    useDeleteEpaperCategoryMutation,
} = epaperCategoryApi;
