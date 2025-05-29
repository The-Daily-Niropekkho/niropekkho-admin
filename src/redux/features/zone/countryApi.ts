import { countryTag } from "@/constants";
import { Country, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/countries";

const countryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCountries: builder.query({
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
            transformResponse: (response: TResponseRedux<Country[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [countryTag],
        }),
        getCountryDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Country>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [countryTag],
        }),
        createCountry: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Country>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [countryTag],
        }),
        updateCountry: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Country>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [countryTag],
        }),
        deleteCountry: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [countryTag],
        }),
    }),
});

export const {
   useGetAllCountriesQuery,
    useGetCountryDetailsQuery,
    useCreateCountryMutation,
    useUpdateCountryMutation,
    useDeleteCountryMutation,
} = countryApi;
