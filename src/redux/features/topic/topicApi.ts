import { topicTag } from "@/constants";
import { Topic, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/topic";

const topicApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTopics: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item: TQueryParam) => {
                        if (item.value !== undefined && item.value !== "") {
                            params.append(item.name, item.value as string);
                        }
                    });
                }
                return {
                    url: url,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Topic[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [topicTag],
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
            providesTags: [topicTag],
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
            invalidatesTags: [topicTag],
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
            invalidatesTags: [topicTag],
        }),
        deleteTopic: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [topicTag],
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
