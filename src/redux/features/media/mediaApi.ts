/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tags } from "@/constants";
import { baseApi } from "@/redux/api/baseApi";
import { TArgsParam, TFileDocument, TResponseRedux } from "@/types";

const url = `/file-manager`;
export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMedia: builder.query({
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
            transformResponse: (response: TResponseRedux<TFileDocument[]>) => {
                return {
                    data: response.data || [],
                    meta: response.meta,
                };
            },
            providesTags: [tags.mediaTag], 
        }),
    }),
});

export const { useGetMediaQuery } = mediaApi;
