import React from "react";
import { Link } from "react-router-dom";

const SuccessTest = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col border-blue-500 items-center justify-center px-5 py-8 border rounded w-full mt-5">
        <h2 className="text-2xl text-blue-500 font-bold">Thank You</h2>
        <span className="mt-4">Your result will be sent to</span>
        <span className="font-semibold text-xl mt-1">ELC</span>
        <span className="mt-4">Test time</span>
        <span className="font-semibold text-xl mt-1">19:22</span>
        <span className="mt-4">Test date</span>
        <span className="font-semibold text-xl mt-1">19 / 22 / 22</span>
      </div>
      <Link to="/" className="underline text-sm mt-5">
        back to ELC online test
      </Link>
    </div>
  );
};

export default SuccessTest;
