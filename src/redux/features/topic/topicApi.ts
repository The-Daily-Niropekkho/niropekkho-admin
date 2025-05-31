import { tags } from "@/constants";
import { TArgsParam, Topic, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/topic";

const topicApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTopics: builder.query({
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
            transformResponse: (response: TResponseRedux<Topic[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.topicTag],
        }),
        getTopicDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Topic>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.topicTag],
        }),
        createTopic: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Topic>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.topicTag],
        }),
        updateTopic: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Topic>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.topicTag],
        }),
        deleteTopic: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.topicTag],
        }),
    }),
});

export const {
    useGetAllTopicsQuery,
    useGetTopicDetailsQuery,
    useCreateTopicMutation,
    useUpdateTopicMutation,
    useDeleteTopicMutation,
} = topicApi;
