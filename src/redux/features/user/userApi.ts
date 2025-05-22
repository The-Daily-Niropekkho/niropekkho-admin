import { userTags } from "@/constants";
import { TResponseRedux, User } from "@/types";
import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // check username existence
        checkUsername: builder.query({
            query: (username) => ({
                url: `/users/check-username?username=${username}`,
                method: "GET",
            }),
        }),
        getAllAdminUser: builder.query({
            query: () => ({
                url: `users/get-admin`,
                method: "GET",
            }),

            transformResponse: (response: TResponseRedux<User[]>) => {
                return { data: response.data, meta: response.meta };
            },
            providesTags: [userTags.admin],
        }),
        getAllWriterUser: builder.query({
            query: () => ({
                url: `users/get-writer-users`,
                method: "GET",
            }),

            transformResponse: (response: TResponseRedux<User[]>) => {
                return { data: response.data, meta: response.meta };
            },
            providesTags: [userTags.writer],
        }),
        getAllModeratorUser: builder.query({
            query: () => ({
                url: `users/get-moderator-users`,
                method: "GET",
            }),

            transformResponse: (response: TResponseRedux<User[]>) => {
                return { data: response.data, meta: response.meta };
            },
            providesTags: [userTags.moderator],
        }),
        getSingleUser: builder.query({
            query: () => ({
                url: `users/get-moderator-users`,
                method: "GET",
            }),

            transformResponse: (response: TResponseRedux<User>) => {
                return { data: response.data };
            },
        }),

        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    url: `/auth/profile`,
                    method: "PUT",
                    body: data,
                };
            },
            invalidatesTags: ["user"],
        }),
        updateUser: builder.mutation({
            query: (data) => {
                return {
                    url: `/users/${data?.id}`,
                    method: "PUT",
                    body: data?.data,
                };
            },
            invalidatesTags: ["user"],
        }),
        deleteUser: builder.mutation({
            query: (id) => {
                return {
                    url: `/users/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [...Object.values(userTags)],
        }),
    }),
});

export const {
    useCheckUsernameQuery,
    useGetAllAdminUserQuery,
    useGetAllModeratorUserQuery,
    useGetAllWriterUserQuery,
    useGetSingleUserQuery,
    useUpdateProfileMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;
