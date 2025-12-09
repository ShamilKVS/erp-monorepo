import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/home";
import Login from "./pages/login";
import Products from "./pages/products";
import CreateProductPage from "./pages/products/create";
import Sales from "./pages/sales";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/products/create",
          element: <CreateProductPage />,
        },
        {
          path: "/sales",
          element: <Sales />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);               

export default router;