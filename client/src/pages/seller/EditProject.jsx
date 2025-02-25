import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUpdateProjectMutation, useGetProjectByIdQuery } from "@/redux/api/projectApi";
import { toast } from "react-toastify";

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: project, isLoading: isFetching } = useGetProjectByIdQuery(id);
  const [updateProject, { isLoading, isError, error }] = useUpdateProjectMutation();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    level: "",
    price: "",
    discountPercentage: "",
    status: "",
    thumbnail: null,
    video: null,
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  useEffect(() => {
    if (project?.project) {
      setFormData({
        title: project.project.title || "",
        category: project.project.category || "",
        description: project.project.description || "",
        level: project.project.level || "",
        price: project.project.price || "",
        discountPercentage: project.project.discountPercentage || "",
        status: project.project.status || "",
        thumbnail: null,
        video: null,
      });
      setPreviewThumbnail(project.project.thumbnail || "");
    }
  }, [project]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));
      if (type === "thumbnail") {
        const reader = new FileReader();
        reader.onload = () => setPreviewThumbnail(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const editProjectHandler = async () => {
    try {
      const projectData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          projectData.append(key, formData[key]);
        }
      });

      await updateProject({ id, projectData }).unwrap();
      toast.success("Project updated successfully");
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Update Failed:", error);
      toast.error("Failed to update project");
    }
  };

  return (
    <div className="flex-1 mx-10 space-y-4 py-20 px-60 bg-black text-gray-300">
      <h1 className="text-xl font-semibold">Edit Project</h1>
      {isFetching ? (
        <p>Loading project details...</p>
      ) : (
        <>
          {Object.entries(formData).map(([key, value]) => (
            key !== "thumbnail" && key !== "video" && (
              <div key={key}>
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input id={key} type="text" value={value} onChange={handleChange} />
              </div>
            )
          ))}

          <div>
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input id="thumbnail" type="file" onChange={(e) => handleFileChange(e, "thumbnail")} accept="image/*" />
            {previewThumbnail && <img src={previewThumbnail} alt="Thumbnail Preview" className="w-96 h-80 my-2" />}
          </div>

          <div>
            <Label htmlFor="video">Video</Label>
            <Input id="video" type="file" onChange={(e) => handleFileChange(e, "video")} accept="video/*" />
          </div>

          <div className="flex items-center gap-5 mt-4">
            <Button variant="outline" onClick={() => navigate("/seller/projects")}>Back</Button>
            <Button disabled={isLoading} onClick={editProjectHandler}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update"}
            </Button>
          </div>

          {isError && <p className="text-red-500">Error: {error?.message}</p>}
        </>
      )}
    </div>
  );
};

export default EditProject;
