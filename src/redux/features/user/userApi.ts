import { userTag, userTags } from "@/constants";
import { TArgsParam, TResponseRedux, User } from "@/types";
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
                    url: `users/get-admin`,
                    params: cleanedParams,
                };
            },
            transformResponse: (response: TResponseRedux<User[]>) => {
                return { data: response.data, meta: response.meta };
            },
            providesTags: [userTags.admin],
        }),
        getAllWriterUser: builder.query({
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
                    url: `users/get-writer-users`,
                    params: cleanedParams,
                };
            },
            transformResponse: (response: TResponseRedux<User[]>) => {
                return { data: response.data, meta: response.meta };
            },
            providesTags: [userTags.writer],
        }),
        getAllModeratorUser: builder.query({
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
                    url: `users/get-moderator-users`,
                    params: cleanedParams,
                };
            },
            transformResponse: (response: TResponseRedux<User[]>) => {
                return { data: response.data, meta: response.meta };
            },
            providesTags: [userTags.moderator],
        }),
        getSingleUser: builder.query({
            query: (id) => ({
                url: `users/${id}`,
                method: "GET",
            }),

            transformResponse: (response: TResponseRedux<User>) => {
                return response.data;
            },
        }),
        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    url: `/users/${data?.id}`,
                    method: "PATCH",
                    body: data?.data,
                };
            },
            invalidatesTags: [userTag],
        }),
        updateUser: builder.mutation({
            query: (data) => {
                return {
                    url: `/users/${data?.id}`,
                    method: "PATCH",
                    body: data?.data,
                };
            },
            invalidatesTags: [userTag],
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
