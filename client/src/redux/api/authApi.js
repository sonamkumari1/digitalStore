import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const AUTH_API = "https://digitalstore-p5is.onrender.com/api/users/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: AUTH_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error("Error in register:", error);
        }
      },
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log("Login Error:", error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.log("Logout Error:", error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log("Load User Error:", error);
        }
      },
    }),

    updateUserProfile: builder.mutation({
      query: (formData) => ({
        url: "profile/update", // Endpoint for updating user profile
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),
    updateSellerProfile: builder.mutation({
      query: (formData) => ({
        url: "seller-profile/update", // Endpoint for updating user profile
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "all",
        method: "GET",
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginUserMutation,
  useUpdateUserProfileMutation,
  useUpdateSellerProfileMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} = authApi;
