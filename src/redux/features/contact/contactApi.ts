
import { contactTag } from "@/constants";
import { Contact, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/contact-settings`;

const contactApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getContactDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Contact[]>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [contactTag],
        }),
        createContact: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Contact>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [contactTag],
        }),
        updateContact: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Contact>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [contactTag],
        }),
        deleteContact: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [contactTag],
        }),
    }),
});

export const {
    useGetContactDetailsQuery,
    useCreateContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation
} = contactApi;
