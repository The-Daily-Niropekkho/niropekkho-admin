
import { categoryTag } from "@/constants";
import { Category, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/category`

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
            providesTags: [categoryTag],
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
            providesTags: [categoryTag],
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
            invalidatesTags: [categoryTag],
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
            invalidatesTags: [categoryTag],
        }),
        deleteCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [categoryTag],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryDetailsQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;
