import config from "@/config";
import {
    categoryTag,
    countryTag,
    districtTag,
    divisionTag,
    mediaTag,
    topicTag,
    unionTag,
    upazillaTag,
    userTag,
    userTags,
} from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery,
    endpoints: () => ({}),
    tagTypes: [
        ...Object.values(userTags),
        categoryTag,
        userTag,
        mediaTag,
        topicTag,
        countryTag,
        divisionTag,
        districtTag,
        upazillaTag,
        unionTag,
    ],
});
