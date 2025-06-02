import { tags } from "@/constants";
import { Subcategory, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/subcategory`;

const subcategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSubcategories: builder.query({
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
                    url,
                    params: cleanedParams,
                };
            },
            transformResponse: (response: TResponseRedux<Subcategory[]>) => ({
                data: response.data,
                meta: response.meta,
            }),
            providesTags: [tags.subcategoryTag],
        }),

        getSubcategoryDetails: builder.query({
            query: (id: string) => ({
                url: `${url}/${id}`,
            }),
            transformResponse: (response: TResponseRedux<Subcategory>) => ({
                data: response.data,
            }),
            providesTags: [tags.subcategoryTag],
        }),

        createSubcategory: builder.mutation({
            query: (data: Partial<Subcategory>) => ({
                url,
                method: "POST",
                body: data,
            }),
            transformResponse: (response: TResponseRedux<Subcategory>) => ({
                data: response.data,
            }),
            invalidatesTags: [tags.subcategoryTag],
        }),

        updateSubcategory: builder.mutation({
            query: ({ id, data }: { id: string; data: Partial<Subcategory> }) => ({
                url: `${url}/${id}`,
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response: TResponseRedux<Subcategory>) => ({
                data: response.data,
            }),
            invalidatesTags: [tags.subcategoryTag],
        }),

        deleteSubcategory: builder.mutation({
            query: (id: string) => ({
                url: `${url}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tags.subcategoryTag],
        }),
    }),
});

export const {
    useGetAllSubcategoriesQuery,
    useGetSubcategoryDetailsQuery,
    useCreateSubcategoryMutation,
    useUpdateSubcategoryMutation,
    useDeleteSubcategoryMutation,
} = subcategoryApi;
