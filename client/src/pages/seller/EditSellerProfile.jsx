import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoadUserQuery, useUpdateUserProfileMutation } from "@/redux/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function EditSellerProfile() {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserProfileMutation();

  // Initialize form data with user data when it's loaded
  useEffect(() => {
    if (data && data.user) {
      setName(data.user.name || "");
      setPrice(data.user.price || 0);
      setDiscountPercentage(data.user.discountPercentage || 0);
    }
  }, [data]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    formData.append("price", price);
    formData.append("discountPercentage", discountPercentage);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error.message || "Failed to update profile");
    }
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading) return <h1>Profile Loading...</h1>;

  const user = data && data.user;

  // Calculate discounted price
  const discountedPrice = price - (price * discountPercentage / 100);

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 my-10 mt-20">
        <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
              <AvatarImage
                src={user?.photoUrl || "https://github.com/shadcn.png"}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                Name:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user.name}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                Email:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user.email}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                Role:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user.role.toUpperCase()}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Price:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user.discountPercentage > 0 ? (
                    <span className="flex items-center gap-2">
                      <span className="text-green-500">{user.discountPercentage}% off</span>
                      <span className="line-through">₹{user.price}</span>
                      <span>₹{(user.price - (user.price * user.discountPercentage / 100)).toFixed(2)}</span>
                    </span>
                  ) : (
                    <span>₹{user.price || 0}</span>
                  )}
                </span>
              </h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="mt-2">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="Enter price"
                      className="col-span-3"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Discount %</Label>
                    <Input
                      type="number"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                      placeholder="Enter discount"
                      className="col-span-3"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>

                  {/* Display calculated price */}
                  {discountPercentage > 0 && (
                    <div className="col-span-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-green-500 text-sm">
                          {discountPercentage}% off
                        </span>
                        <span className="text-sm line-through text-gray-400">
                          ₹{price}
                        </span>
                        <span className="font-bold text-sm">
                          ₹{discountedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Profile Photo</Label>
                    <Input
                      onChange={onChangeHandler}
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={updateUserIsLoading}
                    onClick={updateUserHandler}
                  >
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                        wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSellerProfile;
