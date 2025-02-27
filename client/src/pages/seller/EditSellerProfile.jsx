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
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [experience, setExperience] = useState(0);
  const [companyOrCollege, setCompanyOrCollege] = useState("");

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

  useEffect(() => {
    if (data?.user) {
      setName(data.user.name || "");
      setExperience(data.user.experience || 0);
      setCompanyOrCollege(data.user.companyOrCollege || "");
    }
  }, [data]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };


  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
   
    formData.append("experience", experience);
    formData.append("companyOrCollege", companyOrCollege);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated successfully.");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile.");
    }
  }, [updateUserData, isSuccess, isError, error, refetch]);

  if (isLoading) return <h1>Profile Loading...</h1>;

  const user = data?.user;

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 my-10 mt-20">
        <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
              <AvatarImage
                src={user?.photoUrl || "https://github.com/shadcn.png"}
                alt="User Profile"
              />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Name:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.name}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Email:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.email}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Role:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.role?.toUpperCase()}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Experience:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.experience}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Company/College:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.companyOrCollege}
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
                    <Label>Experience</Label>
                    <Input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(Number(e.target.value))}
                      placeholder="Experience"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Company/College</Label>
                    <Input
                      type="text"
                      value={companyOrCollege}
                      onChange={(e) => setCompanyOrCollege(e.target.value)}
                      placeholder="Company/College"
                      className="col-span-3"
                    />
                  </div>

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
