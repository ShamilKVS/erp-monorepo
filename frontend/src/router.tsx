import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/home";
import Login from "./pages/login";
import Products from "./pages/products";
import CreateProductPage from "./pages/products/create";
import Sales from "./pages/sales";
import CreateSale from "./pages/sales/create";
import SalesHistory from "./pages/sales/history";
import EditProductPage from "./pages/products/edit";
import Summary from "./pages/summary";

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
          path: "/products/edit/:id",
          element: <EditProductPage />,
        },
        {
          path: "/sales",
          element: <Sales />,
        },
        {
          path: "/sales/create",
          element: <CreateSale />,
        },
        {
          path: "/sales/history",
          element: <SalesHistory />,
        },
        {
          path: "/summary",
          element: <Summary />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);               

export default router;