/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { TFileDocument, TResponseRedux } from "@/types";

export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMedia: builder.query<TFileDocument[], void>({
            query: () => ({
                url: `/aws/get-all-files?continuationToken=1F3weZoZzVI0LtxwjTLx+Ql0pZo0dRiFOcE34BcODDBLSYmp0lkdB7pmhwJy6g1K7iP4Oev0dytZqnqmku3mHjKqTFVpE9h45`,
                method: "GET",
            }),
            transformResponse: (response: TResponseRedux<TFileDocument[]>) => {
                return response.data || [];
            },
            providesTags: [{ type: "Media", id: "LIST" }],
        }),
    }),
});

export const { useGetMediaQuery } = mediaApi;
