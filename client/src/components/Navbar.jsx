import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useLogoutUserMutation } from "@/redux/api/authApi";
import { useAllCartsQuery } from "@/redux/api/cartApi";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { userLoggedOut } from "@/redux/authSlice";
import { useGetAllLikedProjectsQuery } from "@/redux/api/projectApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userRole = user?.role || "user";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartData } = useAllCartsQuery();
  const cart = cartData?.[0];
  const cartItemCount = cart?.cartItems?.length || 0;

  const { data } = useGetAllLikedProjectsQuery();
  const totalLikedProjects = data?.length || 0;

  const [logoutUser, { isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
    dispatch(userLoggedOut());
    localStorage.removeItem("user");
  };
  

  useEffect(() => {
    if (isSuccess) {
      toast.success("User logged out.");
      navigate("/user/login");
    }
  
    if (isAuthenticated && userRole === "seller") {
      navigate("/seller/first-page"); // Add a leading "/"
    }
  }, [isSuccess, isAuthenticated, userRole, navigate]);
  

  const isMainRoute =
    !location.pathname.startsWith("/seller") &&
    !location.pathname.startsWith("/admin") &&
    !location.pathname.startsWith("/user");

  if (!isMainRoute) return null;

  const menuList =
    userRole === "seller"
      ? [
          { name: "Add Project", link: "/seller/add-project" },
          { name: "Dashboard", link: "/seller/dashboard" },
          { name: "Project List", link: "/seller/project-list" },
        ]
      : [
          { name: "Home", link: "/" },
          { name: "Store", link: "/store" },
          { name: "Explore", link: "/explore" },
        ];

  return (
    <div className="p-4 px-6 md:px-12 lg:px-20 bg-black text-white flex justify-between items-center relative">
      <h2 className="font-bold lg:text-4xl text-2xl cursor-pointer" onClick={() => navigate("/")}>
        DigiStore
      </h2>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6">
        {menuList.map((menu, index) => (
          <li
            key={index}
            className="text-2xl font-semibold cursor-pointer hover:border-b-2 hover:border-white px-3"
            onClick={() => navigate(menu.link)}
          >
            {menu.name}
          </li>
        ))}
      </ul>

      {/* Icons + Mobile Menu Button */}
      <div className="flex items-center gap-4">
        <Button className="bg-red-500" onClick={() => navigate("/user/login")}>
          Become a seller
        </Button>

        {/* Cart Icon */}
        <div className="relative cursor-pointer" onClick={() => navigate("/user/cartPage")}>
          <ShoppingBag className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
              {cartItemCount}
            </span>
          )}
        </div>

        {/* Like Icon */}
        <div className="relative cursor-pointer" onClick={() => navigate("/user/likesPage")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="white"
            stroke="none"
            className="cursor-pointer hover:fill-red-500 transition-colors duration-200 ml:3 lg:ml-3"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          {totalLikedProjects > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
              {totalLikedProjects}
            </span>
          )}
        </div>

        {/* User Dropdown */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer ml:3 lg:ml-3">
                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="User Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
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
                  </>
                )}
                {userRole === "admin" && (
                  <DropdownMenuItem>
                    <Link to="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {userRole === "user" && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/user/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="bg-white text-black" onClick={() => navigate("/user/login")}>
            Login
          </Button>
        )}

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
          ) : (
            <Menu className="w-6 h-6 cursor-pointer" onClick={() => setIsMobileMenuOpen(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
