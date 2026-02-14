import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import Home from "./pages/Home.tsx";
import Layout from "./components/Layout.tsx";
import SidebarProvider from "./contexts/SidebarContext.tsx";
import CartProvider from "./contexts/CartContext.tsx";
import ProductProvider from "./contexts/ProductContext.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import TestItem from "./pages/TestItem.tsx";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/test-item",
        element: <TestItem />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <CartProvider>
        <ProductProvider>
          <RouterProvider router={router} />
        </ProductProvider>
      </CartProvider>
    </SidebarProvider>
  </StrictMode>,
);
