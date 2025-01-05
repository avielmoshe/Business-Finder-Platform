import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Error from "./pages/Error";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BusinessPage from "./pages/BusinessPage";
import AddBusiness from "./pages/AddBusiness";
import YourBusiness from "./pages/YourBusiness";
import { useAuth } from "./providers/auth-provider";
import { isUserValid } from "./utils/api";
import { useEffect } from "react";

function App() {
  const { setUser, user } = useAuth();

  useEffect(() => {
    (async () => {
      const dataAuth = await isUserValid();
      if (dataAuth) {
        setUser({
          id: dataAuth.id,
          username: dataAuth.username,
          email: dataAuth.email,
          role: dataAuth.role,
          plan: dataAuth.plan,
        });
      } else {
        setUser(null);
      }
    })();
  }, []);

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/add-business",
          element: <AddBusiness />,
        },
        {
          path: "/your-business/:id",
          element: <YourBusiness />,
        },
        {
          path: "/settings",
          element: <SettingsPage />,
        },
        {
          path: "/businessPage/:id",
          element: <BusinessPage />,
        },
        {
          path: "*",
          element: <Error />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signUp",
      element: <SignUp />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
