
import { tags } from "@/constants";
import { Department, TArgsParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const url = `/department`;

const departmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDepartments: builder.query({
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
            transformResponse: (response: TResponseRedux<Department[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: [tags.departmentTag],
        }),
        getDepartmentDetails: builder.query({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                };
            },
            transformResponse: (response: TResponseRedux<Department>) => {
                return {
                    data: response.data,
                };
            },
            providesTags: [tags.departmentTag],
        }),
        createDepartment: builder.mutation({
            query: (data) => {
                return {
                    url: url,
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: TResponseRedux<Department>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.departmentTag],
        }),
        updateDepartment: builder.mutation({
            query: (data) => {
                return {
                    url: `${url}/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            transformResponse: (response: TResponseRedux<Department>) => {
                return {
                    data: response.data,
                };
            },
            invalidatesTags: [tags.departmentTag],
        }),
        deleteDepartment: builder.mutation({
            query: (id) => {
                return {
                    url: `${url}/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [tags.departmentTag],
        }),
    }),
});

export const {
    useGetAllDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
} = departmentApi;
