import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  useGetProjectByCreatorQuery,
  useGetProjectByIdQuery,
} from "@/redux/api/projectApi";

function SellerProfile() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const creatorId = data?.project?.creator?._id;

  const { data: creatorProjects, isLoading: isProjectsLoading } =
    useGetProjectByCreatorQuery(creatorId, {
      skip: !creatorId,
    });

  if (isLoading || isProjectsLoading)
    return <h1 className="text-white text-center mt-10">Loading Profile...</h1>;

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10 mt-16 bg-black text-white rounded-lg shadow-lg">
        <h1 className="font-bold text-3xl text-center md:text-left mb-6">
          PROFILE
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-28 w-28 md:h-36 md:w-36 mb-4 border-4 border-gray-700 shadow-md">
              <AvatarImage
                src={
                  data?.project?.creator?.photoUrl ||
                  "https://github.com/shadcn.png"
                }
                alt="Profile Picture"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full">
            <div className="mb-4 border-b border-gray-700 pb-2">
              <h1 className="font-semibold text-gray-300 text-lg">
                Name:
                <span className="font-normal text-gray-400 ml-2">
                  {data?.project?.creator?.name}
                </span>
              </h1>
            </div>
            <div className="mb-4 border-b border-gray-700 pb-2">
              <h1 className="font-semibold text-gray-300 text-lg">
                Email:
                <span className="font-normal text-gray-400 ml-2">
                  {data?.project?.creator?.email}
                </span>
              </h1>
            </div>
            <div className="mb-4">
              <h1 className="font-semibold text-gray-300 text-lg">
                Role:
                <span className="font-normal text-gray-400 ml-2">
                  {data?.project?.creator?.role}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Display Projects by Creator */}
      <div className="mt-10 px-10">
        <h2 className="font-bold text-2xl text-white mb-10">
          Projects by {data?.project?.creator?.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creatorProjects?.projects?.length ? (
            creatorProjects.projects.map((project) => (
              <Card
                key={project._id}
                className="bg-black rounded-lg dark:bg-gray-900 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={project?.thumbnail}
                    alt="Course Thumbnail"
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="px-5 py-4 space-y-3">
                  <h1 className="hover:underline font-bold text-lg truncate text-gray-500">
                    {project?.title}
                  </h1>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/seller/seller-profile/project/${project._id}`
                          )
                        }
                      >
                        <Avatar className="h-8 w-8 cursor-pointer">
                          <AvatarImage
                            src={
                              project?.creator?.photoUrl ||
                              "http://github.com/shadcn.png"
                            }
                            alt="Instructor Avatar"
                            className="rounded-full"
                          />
                          <AvatarFallback>
                            {data?.project?.creator?.name}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                      <h1 className="font-medium text-sm text-gray-500 truncate w-24">
                        {data?.project?.creator?.name}
                      </h1>
                    </div>
                    <Badge className="bg-green-600 text-white px-2 py-1 text-xs rounded-full">
                      {project?.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="bg-green-400/20 rounded-md px-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {project?.discountPercentage > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-green-500 text-sm">
                                {project.discountPercentage}% off
                              </span>
                              <span className="text-sm line-through text-gray-400">
                                ₹{project.price}
                              </span>
                              <span className="font-bold text-lg text-white">
                                ₹
                                {(
                                  project.price -
                                  (project.price * project.discountPercentage) /
                                    100
                                ).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-lg text-white">
                              ₹{project?.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
               
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-400">No projects found for this creator.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;
