import { tags } from "@/constants";
import { Post, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/post`;

const postApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPosts: builder.query({
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
            transformResponse: (response: TResponseRedux<Post[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.postTag],
        }),
        getPostDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Post>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.postTag],
        }),
        createPost: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Post>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.postTag],
        }),
        updatePost: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Post>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.postTag],
        }),
        deletePost: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.postTag],
        }),
    }),
});

export const {
    useGetAllPostsQuery,
    useGetPostDetailsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postApi;
