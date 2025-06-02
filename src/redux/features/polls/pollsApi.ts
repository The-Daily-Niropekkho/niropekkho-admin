import { tags } from "@/constants";
import { Poll, PollOption, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/polls";

const pollApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPolls: builder.query({
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
            transformResponse: (response: TResponseRedux<Poll[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.pollTag],
        }),
        getPollDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Poll>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.pollTag],
        }),
        createPoll: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Poll>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.pollTag],
        }),
        updatePoll: builder.mutation({
            query: ({ id, data }: { id: string; data: Partial<Poll> }) => {
                return {
                    url: `${url}/${id}`,
                    method: "PATCH",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Poll>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.pollTag],
        }),
        deletePoll: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.pollTag],
        }),
        voteOnPoll: builder.mutation({
            query: ({ pollId, option }: { pollId: string; option: string }) => {
                return {
                    url: `${url}/${pollId}/vote`,
                    method: "POST",
                    body: { option },
                };
            },
            transformResponse: (response: TResponseRedux<Poll>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.pollTag],
        }),
        getPollResults: builder.query({
            query: (pollId) => {
                return {
                    url: `${url}/${pollId}/results`,
                };
            },
            transformResponse: (response: TResponseRedux<{
                options: Array<PollOption & { votes: number; percentage: number }>;
                totalVotes: number;
            }>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.pollTag],
        }),
    }),
});

export const {
    useGetAllPollsQuery,
    useGetPollDetailsQuery,
    useCreatePollMutation,
    useUpdatePollMutation,
    useDeletePollMutation,
    useVoteOnPollMutation,
    useGetPollResultsQuery,
} = pollApi;