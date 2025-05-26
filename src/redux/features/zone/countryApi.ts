import { countryTag } from "@/constants";
import { Country, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = "/countries";

const countryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCountries: builder.query({
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
