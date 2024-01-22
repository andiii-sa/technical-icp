import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between gap-2 items-center py-3 bg-white px-12">
      <div className="flex gap-2 items-center">
        <span className="text-xs">
          English <br /> Language <br /> Company
        </span>
      </div>
      <button
        className="flex items-center gap-2 px-2 py-2 text-orange-500"
        onClick={() => window.location.reload()}
      >
        <i className="bx bx-refresh text-xl"></i>
        <span>Reset Form</span>
      </button>
    </nav>
  );
};

export default Navbar;
