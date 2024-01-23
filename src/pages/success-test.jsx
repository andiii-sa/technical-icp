import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SuccessTest = () => {
  const state = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.duration) {
      navigate("/");
    }
  }, [state, navigate]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col border-blue-500 items-center justify-center px-5 py-8 border rounded w-full mt-5">
        <h2 className="text-2xl text-blue-500 font-bold">Thank You</h2>
        <span className="mt-4">Your result will be sent to</span>
        <span className="font-semibold text-xl mt-1">ELC</span>
        <span className="mt-4">Test time</span>
        <span className="font-semibold text-xl mt-1">{state?.duration}</span>
        <span className="mt-4">Test date</span>
        <span className="font-semibold text-xl mt-1">{state?.date}</span>
      </div>
      <Link to="/" className="underline text-sm mt-5">
        back to ELC online test
      </Link>
    </div>
  );
};

export default SuccessTest;
