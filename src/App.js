import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import SuccessTest from "./pages/success-test";

import "./assets/style/main.css";
import MainLayout from "./components/layouts/MainLayout";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "success-test",
          element: <SuccessTest />,
        },
      ],
    },
    // {
    //   path: "/",
    //   element: <Dashboard />,
    // },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
