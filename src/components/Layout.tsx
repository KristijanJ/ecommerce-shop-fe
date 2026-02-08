import { Outlet, ScrollRestoration } from "react-router";

function Layout() {
  return (
    <div className="bg-[#0e0f1c] text-white min-h-screen">
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}

export default Layout;
