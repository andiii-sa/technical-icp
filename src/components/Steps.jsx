import React from "react";

const Steps = ({ items = [], active = "" }) => {
  return (
    <div className="flex items-center justify-center">
      {items?.map((item, idx) => (
        <div key={idx} className="flex items-center">
          {idx !== 0 && (
            <div
              className={`w-5 md:w-14 h-2 rounded-sm -mr-1 ${
                items?.findIndex((f) => f?.path === active) >= idx
                  ? "bg-blue-200"
                  : "bg-gray-400"
              }`}
            ></div>
          )}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
              items?.findIndex((f) => f?.path === active) >= idx
                ? "bg-blue-200 text-blue-400"
                : "bg-gray-400 text-white"
            }`}
          >
            {idx + 1}
          </div>
          <div
            className={`hidden lg:flex flex-col ml-2 gap-0 text-sm mr-2 cursor-pointer ${
              items?.findIndex((f) => f?.path === active) >= idx
                ? "text-blue-400"
                : "text-gray-400"
            }`}
          >
            <span>{item?.title}</span>
            <span>{item?.subTitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Steps;
