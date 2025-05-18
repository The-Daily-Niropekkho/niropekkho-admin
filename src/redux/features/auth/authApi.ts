import { User } from "@/types";
import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        // This endpoint is used to login a user
        sendLoginRequest: builder.mutation({
            query: (data) => ({
                url: "/auth/send-login-request",
                method: "POST",
                body: data,
            }),
        }),
        // Register
        // This endpoint is used to register a new user
        register: builder.mutation({
            query: (data) => ({
                url: "/users",
                method: "POST",
                body: data,
            }),
        }),
        createSubUser: builder.mutation({
            query: (data) => ({
                url: "/users/create-sub-b2b-account",
                method: "POST",
                body: data,
            }),
        }),
        // Temp User Register
        // This endpoint is used to register a temp user
        tempUserRegister: builder.mutation({
            query: (data) => ({
                url: "/users/temp-user",
                method: "POST",
                body: data,
            }),
        }),

        // Get user profile
        // This endpoint is used to fetch the user profile data
        getUserProfile: builder.query({
            query: () => ({
                url: "/auth/profile",
                method: "GET",
            }),
            providesTags: ["user"],
            transformResponse: (response: { data: User }) => {
                return response.data;
            },
        }),

        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: "/auth/profile",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
        verifyAccount: builder.mutation({
            query: ({ email, token }) => {
                return {
                    url: `/auth/verify/${email}`,
                    method: "POST",
                    headers: {
                        Authorization: token,
                    },
                };
            },
        }),
        forgetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/forgot-password",
                    body: data,
                    method: "POST",
                };
            },
        }),
        getTokenOTPforgetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/forgot-password/set-otp",
                    body: data,
                    method: "POST",
                };
            },
        }),
        resetPassword: builder.mutation({
            query: ({ resetPasswordToken, newPassword, token_id }) => ({
                url: "/auth/forgot-password/token-to-set-password",
                method: "POST",
                body: { resetPasswordToken, newPassword, token_id },
            }),
        }),
    }),
});

export const {
    useSendLoginRequestMutation,
    useRegisterMutation,
    useCreateSubUserMutation,
    useTempUserRegisterMutation,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetTokenOTPforgetPasswordMutation,
    useVerifyAccountMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
} = authApi;
