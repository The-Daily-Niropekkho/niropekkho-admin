
import { Category, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item: TQueryParam) => {
                        console.log(item);
                        
                        if (item.value !== undefined && item.value !== "") {
                            params.append(item.name, item.value as string);
                        }
                    });
                }
                return {
                    url: `/category`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Category[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["categories"],
        }),
        getCategoryDetails: builder.query({
            query: (id) => {
                return {
                    url: `/category/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Category>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: ["categories"],
        }),
        createCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `/category`,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Category>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: ["categories"],
        }),
        updateCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `/category/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Category>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: ["categories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `/category/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["categories"],
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
