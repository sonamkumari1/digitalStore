import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/redux/api/projectApi";

function SellerProfile() {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjectByIdQuery(projectId);

  if (isLoading) return <h1 className="text-white text-center mt-10">Loading Profile...</h1>;

  return (
    <div className="max-w-4xl mx-auto px-4 my-10 mt-20 bg-black text-white p-6 rounded-lg shadow-lg">
      <h1 className="font-bold text-3xl text-center md:text-left mb-6">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 mb-4 border-4 border-gray-700 shadow-md">
            <AvatarImage
              src={data?.creator?.photoUrl || "https://github.com/shadcn.png"}
              alt="Profile Picture"
              className="rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full">
          <div className="mb-4 border-b border-gray-700 pb-2">
            <h1 className="font-semibold text-gray-300 text-lg">Name:
              <span className="font-normal text-gray-400 ml-2">
                {data?.project?.creator?.name}
              </span>
            </h1>
          </div>
          <div className="mb-4 border-b border-gray-700 pb-2">
            <h1 className="font-semibold text-gray-300 text-lg">Email:
              <span className="font-normal text-gray-400 ml-2">
                {data?.project?.creator?.email}
              </span>
            </h1>
          </div>
          <div className="mb-4">
            <h1 className="font-semibold text-gray-300 text-lg">Role:
              <span className="font-normal text-gray-400 ml-2">
                {data?.project?.creator?.role}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;
