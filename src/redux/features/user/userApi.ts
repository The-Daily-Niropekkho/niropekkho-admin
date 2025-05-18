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
        getAllB2BUser: builder.query({
            query: () => ({
                url: `users/get-b2b-users`,
                method: "GET",
            }),

            transformResponse: (response: TResponseRedux<User[]>) => {
                return { data: response.data, meta: response.meta };
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
    }),
});

export const {
    useCheckUsernameQuery,
    useGetAllB2BUserQuery,
    useUpdateProfileMutation,
} = userApi;
