
import { contactTag } from "@/constants";
import { Contact, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/contact-settings`;

const contactApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getContactDetails: builder.query({
            query: () => {
                return {
                    url: url,
                };
            },
            transformResponse: (response: TResponseRedux<Contact[]>) => {
                return response.data
            },
            providesTags: [contactTag],
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
        
    }),
});

export const {
    useGetContactDetailsQuery,
    useUpdateContactMutation
} = contactApi;
