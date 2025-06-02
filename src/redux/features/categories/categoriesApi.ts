import { tags } from "@/constants";
import { Category, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/category`;

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
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
            transformResponse: (response: TResponseRedux<Category[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.categoryTag],
        }),
        getCategoryDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Category>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.categoryTag],
        }),
        createCategory: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Category>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.categoryTag],
        }),
        updateCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Category>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.categoryTag],
        }),
        updateCategoryPosition: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/position-update`,
                    method: "PATCH",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Category>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.categoryPosistionTag, tags.categoryTag],
        }),
        deleteCategory: builder.mutation({
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
    useGetAllCategoriesQuery,
    useGetCategoryDetailsQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useUpdateCategoryPositionMutation,
    useDeleteCategoryMutation,
} = categoryApi;
