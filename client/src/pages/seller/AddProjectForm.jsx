import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateProjectMutation } from "@/redux/api/projectApi";
import { toast } from "react-toastify";

const AddProjectForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseTitle: "",
    category: "",
    description: "",
    level: "",
    price: "",
    discountPercentage:"",
    video: null,
    thumbnail: null,
    status: "",
  });
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [createProject, { isLoading, isSuccess, isError, error }] =
    useCreateProjectMutation();

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const createCourseHandler = async () => {
    const courseData = new FormData();
    courseData.append("title", formData.courseTitle);
    courseData.append("category", formData.category);
    courseData.append("description", formData.description);
    courseData.append("level", formData.level);
    courseData.append("price", formData.price);
    courseData.append("discountPercentage", formData.discountPercentage)
    courseData.append("status", formData.status);
    if (formData.video) courseData.append("video", formData.video);
    if (formData.thumbnail) courseData.append("thumbnail", formData.thumbnail);

    try {
      await createProject(courseData).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Project created successfully");
      navigate("/seller/first-page");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="w-full min-h-screen flex-1 mx-10 space-y-4 py-20 px-60 bg-black text-gray-300">
      <h1 className="text-xl font-semibold">Add a New Course</h1>
      <p className="text-sm text-gray-600">
        Provide basic course details for your new course.
      </p>

      <div>
        <Label htmlFor="courseTitle">Title</Label>
        <Input
          id="courseTitle"
          type="text"
          value={formData.courseTitle}
          onChange={handleChange}
          placeholder="Your Course Name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {[
                "Web Development",
                "Mobile Apps",
                "AI Projects",
                "Game Development",
                "Data Science",
                "Blockchain",
                "Other",
              ].map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          placeholder=" Description"
          className="w-full h-32 p-2 bg-gray-800 text-white border border-gray-600 rounded-md"
        />
      </div>

      <div>
        <Label htmlFor="level">Level</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, level: value }))
          }
        >
          <SelectTrigger id="level" className="w-full">
            <SelectValue placeholder="Select a Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Levels</SelectLabel>
              {["Beginner", "Medium", "Advanced"].map((levelOption) => (
                <SelectItem key={levelOption} value={levelOption}>
                  {levelOption}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

<div className="flex gap-8">
<div className="flex-1">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder=" Price"
        />
        </div>
        <div className="flex-1">
        <Label htmlFor="price">discount Price</Label>
        <Input
          id="discountPercentage"
          type="number"
          value={formData.discountPercentage}
          onChange={handleChange}
          placeholder="discount Percentage"
        />
      </div>
</div>
      

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {["Active", "Inactive"].map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="video">Video</Label>
        <Input
          id="video"
          type="file"
          onChange={handleChange}
          accept="video/*"
        />
      </div>

      <div>
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          onChange={selectThumbnail}
          accept="image/*"
        />

        {previewThumbnail && (
          <img
            src={previewThumbnail}
            alt="Thumbnail Preview"
            className="w-96 h-80 my-2"
          />
        )}
      </div>

      <div className="flex items-center gap-5 mt-4">
        <Button variant="outline" onClick={() => navigate("/admin/course")}>
          Back
        </Button>
        <Button disabled={isLoading} onClick={createCourseHandler}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </div>

      {isError && <p className="text-red-500">Error: {error?.message}</p>}
    </div>
  );
};

export default AddProjectForm;
