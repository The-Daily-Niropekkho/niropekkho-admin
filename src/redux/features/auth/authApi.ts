import { tags } from "@/constants";
import { TResponseRedux, User } from "@/types";
import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        sendLoginRequest: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/send-login-request",
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response) => {
                return response;
            },
        }),
        // Rsend OTP
        resendOtp: builder.mutation({
            query: (data) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body: data,
            }),
        }),

        // Register
        createModerator: builder.mutation({
            query: (data) => ({
                url: "/users/create-moderator-account",
                method: "POST",
                body: data,
            }),
        }),
        createWriter: builder.mutation({
            query: (data) => ({
                url: "/users/create-writer-account",
                method: "POST",
                body: data,
            }),
        }),
        createSubAdmin: builder.mutation({
            query: (data) => ({
                url: "/users/create-sub-admin-account",
                method: "POST",
                body: data,
            }),
        }),
        // Temp User Register
        createTempUser: builder.mutation({
            query: (data) => ({
                url: "/users/temp-user",
                method: "POST",
                body: data,
            }),
        }),

        // Get user profile
        getUserProfile: builder.query({
            query: () => ({
                url: "/auth/profile",
                method: "GET",
            }),
            providesTags: [tags.userTag],
            transformResponse: (response: TResponseRedux<User>) => {
                return response.data;
            },
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
        changePassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/change-password",
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
    overrideExisting: false,
});

export const {
    useSendLoginRequestMutation,
    useResendOtpMutation,
    useCreateTempUserMutation,
    useCreateModeratorMutation,
    useCreateWriterMutation,
    useChangePasswordMutation,
    useCreateSubAdminMutation,
    useGetUserProfileQuery,
    useGetTokenOTPforgetPasswordMutation,
    useVerifyAccountMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
} = authApi;
