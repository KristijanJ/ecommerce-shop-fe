import { Outlet, ScrollRestoration } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen">
      <ScrollRestoration />
      <Header />
      <Outlet />
      <Sidebar />
      <Footer />
    </div>
  );
}

export default Layout;
