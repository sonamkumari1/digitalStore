import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useLikeProjectMutation,
  useRemoveLikedProjectMutation,
} from "@/redux/api/projectApi";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { ShoppingCart, Eye, Heart } from "lucide-react";

function Projects({ project }) {
  const userId = useSelector((state) => state.auth.user?._id);
  const [likeProject] = useLikeProjectMutation();
  const [removeLikedProject] = useRemoveLikedProjectMutation();
  const [addToCart] = useAddToCartMutation();
  const [liked, setLiked] = useState(project.likes.includes(userId));
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await removeLikedProject(project._id).unwrap(); 
      } else {
        await likeProject(project._id).unwrap();
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  

  const handleAddToCart = async () => {
    try {
      await addToCart({ projectId: project._id, quantity: 1 }).unwrap();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <Card
      className="relative bg-black overflow-hidden rounded-lg dark:bg-gray-900 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      <div className="relative">
        <img src={project?.thumbnail} alt="Project Thumbnail" className="w-full h-auto" />
      </div>

      {/* Overlay with Actions */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-300">
          <div className="flex gap-4">
            <ShoppingCart
              className="text-white cursor-pointer hover:text-green-500 transition-colors duration-200"
              size={24}
              onClick={handleAddToCart}
            />
            <Heart
              className={`cursor-pointer transition-colors duration-200 ${
                liked ? "text-red-500" : "text-white hover:text-red-500"
              }`}
              size={24}
              fill={liked ? "red" : "white"}
              onClick={handleLikeToggle}
            />
            <Eye
              className="text-white cursor-pointer hover:text-gray-300 transition-colors duration-200"
              size={24}
              onClick={() => navigate(`/project/${project._id}`)}
            />
          </div>
        </div>
      )}

      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate text-gray-500">
          {project.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={"http://github.com/shadcn.png"}
                alt="Instructor Avatar"
                className={`rounded-full transition-all duration-300 ${
                  showOverlay ? "blur-sm" : ""
                }`}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <h1 className={`font-medium text-sm text-gray-500 ${
                  showOverlay ? "blur-sm" : ""}`}>
              {project?.creator?.name}
            </h1>
          </div>
          <span className="text-white text-sm font-bold">{project.level}</span>
        </div>
        <div className="bg-green-400/20 rounded-md px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-sm">
                  {project.discountPercentage}% off
                </span>
                <span className="text-sm line-through text-gray-400">
                  ${project.price}
                </span>
                <span className="font-bold text-lg text-white">
                  $
                  {(
                    project.price -
                    (project.price * project.discountPercentage) / 100
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Projects;
