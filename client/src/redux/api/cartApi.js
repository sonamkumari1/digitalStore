import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CART_API = "http://localhost:8010/api/cart";

export const cartApi = createApi({
  reducerPath: "cartApi",
  tagTypes: ["Cart_Tag"],
  baseQuery: fetchBaseQuery({ baseUrl: CART_API, credentials: "include" }),

  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Cart_Tag"],
    }),

    addToCart: builder.mutation({
      query: ({ projectId, quantity }) => ({
        url: "/add",
        method: "POST",
        body: { projectId, quantity },
      }),
      invalidatesTags: ["Cart_Tag"], // ✅ Auto-refresh cart
    }),

    allCarts: builder.query({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
      providesTags: ["Cart_Tag"], // ✅ Ensures data is refetched
    }),

    updateCart: builder.mutation({
      query: ({ projectId, quantity }) => ({
        url: "/",
        method: "PUT",
        body: { projectId, quantity },
      }),
      invalidatesTags: ["Cart_Tag"],
    }),

    removeCartItem: builder.mutation({
      query: (projectId) => ({
        url: `/remove/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart_Tag"], // ✅ Auto-refresh cart
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useAllCartsQuery,
  useUpdateCartMutation,
  useRemoveCartItemMutation,
} = cartApi;
