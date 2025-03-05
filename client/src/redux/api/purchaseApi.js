import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PROJECT_PURCHASE_API = "https://digitalstore-p5is.onrender.com/api/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PROJECT_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (projectId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { projectId },
      }),
    }),
    createCheckoutSessionForCart: builder.mutation({
      query: () => ({
        url: "/checkout/create-checkout-session-cart",
        method: "POST",
      }),
    }),
    getProjectDetailWithStatus: builder.query({
      query: (projectId) => ({
        url: `/project/${projectId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getPurchasedProject: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useCreateCheckoutSessionForCartMutation,
  useGetProjectDetailWithStatusQuery,
  useGetPurchasedProjectQuery,
} = purchaseApi;