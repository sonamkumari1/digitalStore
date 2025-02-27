import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PROJECT_API = "http://localhost:8010/api/projects";

export const projectApi = createApi({
  reducerPath: "projectApi",
  tagTypes: ["Projects_Tag", "Project_Tag"],
  baseQuery: fetchBaseQuery({ baseUrl: PROJECT_API, credentials: "include" }),

  endpoints: (builder) => ({

    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/",
        method: "POST",
        body: projectData,
      }),
    }),

    addToCart: builder.mutation({
      query: ({ projectId, quantity }) => ({
        url: `/cart`,
        method: "POST",
        body: { projectId, quantity },
      }),
      invalidatesTags: ["Cart_Tag"],
    }),

    searchProjects: builder.query({
      query: ({searchQuery, categories, sortByPrice }) => {
        
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;

        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }

        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
    getAllProjects: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Projects_Tag"],
    }),

    likeProject: builder.mutation({
      query: (projectId) => ({
        url: `/like/${projectId}`,
        method: "POST",
      }),
      invalidatesTags: ["Projects_Tag"],
    }),
     
    getAllLikedProjects: builder.query({  
      query: () => ({
        url: "/liked",
        method: "GET",
      }),
      providesTags: ["Projects_Tag"],
    }),

    removeLikedProject: builder.mutation({
      query: (projectId) => ({
        url: `/${projectId}/unlike`,  // Corrected URL
        method: "POST",
      }),
      invalidatesTags: ["Projects_Tag"],
    }),
    

    getProjectById: builder.query({
      query: (projectId) => ({
        url: `/${projectId}`,
        method: "GET",
      }),
      
    }),


    updateProject: builder.mutation({
      query: ({ id, projectData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: projectData,
      }),
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    
    getProjectByCreator: builder.query({
      query: (creatorId) => ({
        url: `/creator/${creatorId}`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useLikeProjectMutation,
  useGetAllLikedProjectsQuery,
  useRemoveLikedProjectMutation,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useSearchProjectsQuery,
  useAddToCartMutation,
  useGetProjectByCreatorQuery,
} = projectApi;
