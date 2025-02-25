import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import MainLayout from "./layout/MainLayout";
import Hero from "./components/Hero";
import SubHero from "./components/SubHero";
import AddProjectForm from "./pages/seller/AddProjectForm";
import Project from "./pages/user/Project";
import ProjectDetails from "./pages/user/ProjectDetails";
import Dashboard from "./pages/user/Dashboard";
import Search from "./pages/user/Search";
import SellerDashboard from "./pages/seller/SellerDashboard";
import EditProject from "./pages/seller/EditProject";
import EditSellerProfile from "./pages/seller/EditSellerProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/user/Profile";
import CartPage from "./pages/user/CartPage";
import LikesPage from "./pages/user/LikesPage";
import FirstPage from "./pages/seller/FirstPage";
import SellerProfile from "./pages/user/SellerProfile";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Hero />
            <SubHero />
            <Project/>
          </>
        ),
      },
      {
        path: "/store",
        element: <Dashboard />,
      },
      
      {
        path: "projects/search",
        element: <Search />,
      },
      {
        path: "/project/:projectId",
        element: <ProjectDetails />,
      },
    ],

  },
  // Separate routes without MainLayout
  {
    path: "/seller",
    element: <div className="admin-layout"><Outlet /></div>,
    children: [
      {
        path: "dashboard",
        element: <SellerDashboard />
      },
      {
         path: "first-page",
          element: <FirstPage />
      },
      {
        path: "add-project",
        element: <AddProjectForm />,
      },
      {
        path: "edit-project/:id",
        element: <EditProject/>
      },
      {
        path: "editSeller-profile/:id",
        element: <EditSellerProfile />
      },
      {
        path: "seller-profile/project/:projectId",
        element: <SellerProfile />,
      }
    ]
  },
  {
    path: "/admin",
    element: <div className="admin-layout"><Outlet /></div>,
    children: [
      {
        path: "",
        element: <AdminDashboard />
      }
    ]
  },
  {
    path: "/user",
    element: <div className="user-layout"><Outlet /></div>,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "projects",
        element: <Project />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path:"cartPage",
        element: <CartPage/>
      },
      {
        path:"likesPage",
        element:<LikesPage/>
      }
    ],
  }
  
]);

export default function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}
