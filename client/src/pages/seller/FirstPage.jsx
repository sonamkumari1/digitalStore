import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useLogoutUserMutation } from "@/redux/api/authApi";

function FirstPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userRole = user?.role;

  const [logoutUser, { isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
    dispatch(userLoggedOut());
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (!isAuthenticated || userRole !== "seller") {
      navigate("/user/login"); // Redirect if not authenticated or not a seller
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="shadow p-4 flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold text-white">Seller Platform</h1>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <a
            href="#features"
            className="text-gray-300 text-sm md:text-base hover:text-white"
            onClick={() => navigate("/seller/dashboard")}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-300 text-sm md:text-base hover:text-white"
          >
            How It Works
          </a>

          {/* User Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ml-2 md:ml-3">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="User Avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36 md:w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {userRole === "seller" && (
                    <>
                      <DropdownMenuItem>
                        <Link to="/seller/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/seller/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              className="bg-blue-500 text-white text-sm px-3 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/seller/login")}
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 text-white">
        <h2 className="text-2xl md:text-4xl font-bold px-4">Create & Sell Student Projects</h2>
        <p className="mt-3 text-sm md:text-lg text-gray-300 px-6">
          Easily create, manage, and track student projects in one place.
        </p>
        <button
          className="mt-5 bg-blue-500 text-white text-sm md:text-base px-5 py-2 md:px-6 md:py-3 rounded hover:bg-blue-600"
          onClick={() => navigate("/seller/add-project")}
        >
          Start Creating
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="p-4 md:p-8">
        <h2 className="text-xl md:text-3xl font-bold text-center text-white">Why Sell Here?</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mt-6">
          <div className="p-4 bg-gray-700 rounded text-white text-center text-sm md:text-base">
            📚 Easy Project Creation
          </div>
          <div className="p-4 bg-gray-700 rounded text-white text-center text-sm md:text-base">
            📈 Track Student Engagement
          </div>
          <div className="p-4 bg-gray-700 rounded text-white text-center text-sm md:text-base">
            💰 Earn Revenue
          </div>
        </div>
      </section>
    </div>
  );
}

export default FirstPage;
