/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/config";
import { tags, userTags } from "@/constants";
import { signout } from "@/service/auth";
import {
    BaseQueryApi,
    BaseQueryFn,
    createApi,
    DefinitionType,
    FetchArgs,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: `${config.host}/api/v1`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<
    FetchArgs,
    BaseQueryApi,
    DefinitionType
> = async (args, api, extraOption): Promise<any> => {
    const result = await baseQuery(args, api, extraOption);

    if (result?.error?.status === 401) {
        // const res = await fetch(
        //     "http://localhost:5000/api/v1/auth/refresh-token",
        //     {
        //         method: "POST",
        //         credentials: "include",
        //     }
        // );
        // const data = await res.json();
        // if (data?.data?.accessToken) {
        //     const user = (api.getState() as RootState).auth.user;

        //     api.dispatch(setUser({ user, token: data?.data?.accessToken }));
        //     result = await baseQuery(args, api, extraOption);
        // }
        // api.dispatch(baseApi.util.resetApiState());
        localStorage.clear();
        await signout();
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    endpoints: () => ({}),
    tagTypes: [...Object.values(tags), ...Object.values(userTags)],
});
