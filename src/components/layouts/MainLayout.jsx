import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const MainLayout = () => {
  return (
    <main className="bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex flex-col px-12">
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;
