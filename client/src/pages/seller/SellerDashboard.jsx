import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetAllProjectsQuery, useDeleteProjectMutation } from "@/redux/api/projectApi";
import { toast } from "react-toastify";

function SellerDashboard() {
  const navigate = useNavigate();

  // Fetch projects using Redux Query
  const { data: projects, isLoading, isError } = useGetAllProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  // Handle delete functionality
  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId).unwrap();
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  if (isLoading) return <p className="text-white">Loading projects...</p>;
  if (isError) return <p className="text-red-500">Failed to fetch projects.</p>;

  return (
    <div className="bg-black text-white p-5">
      <h1 className="text-2xl font-semibold mb-5">My Projects</h1>
      
      <div className="mt-5">
        {projects?.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.map((project) => (
              <div key={project._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <img src={project.thumbnail} alt={project.title} className="w-full h-40 object-cover rounded" />
                <h2 className="text-lg font-semibold mt-2">{project.title}</h2>
                <p className="text-sm text-gray-400">{project.description}</p>
                <p className="text-sm mt-1">Category: {project.category}</p>
                <p className="text-sm mt-1">Level: {project.level}</p>

                <div className="mt-1">
                  {project.discountPercentage > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-sm">
                        {project.discountPercentage}% off
                      </span>
                      <span className="text-sm line-through text-gray-400">
                        ₹{project.price}
                      </span>
                      <span className="text-white">
                        ₹{(project.price - (project.price * project.discountPercentage / 100)).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm">Price: ₹{project.price}</p>
                  )}
                </div>

                <p className="text-sm mt-1">Price: ${project.price}</p>
                <p className="text-sm mt-1">Status: {project.status}</p>

                <div className="flex justify-between mt-3">
                  <Button 
                    onClick={() => navigate(`/seller/edit-project/${project._id}`)}
                    className="bg-blue-500"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(project._id)} className="bg-red-500">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
