import React, { useState } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { useLikeProjectMutation, useRemoveLikedProjectMutation } from "@/redux/api/projectApi";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { useNavigate } from "react-router-dom";

function SearchResult({project}) {
  console.log(project)
  const userId = useSelector((state) => state.auth.user?._id);
  const [likeProject] = useLikeProjectMutation();
  const [removeLikedProject] = useRemoveLikedProjectMutation();
  const [addToCart] = useAddToCartMutation();
  const [liked, setLiked] = useState(project.likes.includes(userId));

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
    <Card className="bg-black overflow-hidden rounded-lg dark:bg-gray-900 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={project?.thumbnail}
          // src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
          alt="Course Thumbnail"
          className="w-full h-auto"
        />
      </div>
      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate text-gray-500">
          {project?.title}
        </h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 cursor-pointer" onClick={()=>navigate(`/seller/seller-profile/project/${project._id}`)}>
              <AvatarImage
                src={project?.creator?.photoUrl || "http://github.com/shadcn.png"}
                alt="Instructor Avatar"
                className="rounded-full"
              />
              <AvatarFallback>
                {project?.creator?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm text-gray-500">
              {project?.creator?.name}
            </h1>
          </div>
          <Badge
            className={"bg-green-600 text-white px-2 py-1 text-xs rounded-full"}
          >
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
                      ₹{(project.price - (project.price * project.discountPercentage / 100)).toFixed(2)}
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
          <div className="flex items-center gap-3 justify-between">
            <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer"  onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4 cursor-pointer"  />
            Add to Cart
            </Button>
            <Button onClick={() => navigate(`/project/${project._id}`)}>View Project</Button>

            <Heart
              className={`cursor-pointer transition-colors duration-200 ${
                liked ? "text-red-500" : "text-white hover:text-red-500"
              }`}
              size={24}
              fill={liked ? "red" : "white"}
              onClick={handleLikeToggle}
            />
          </div>
        
      </CardContent>
    </Card>
  );
}

export default SearchResult;
