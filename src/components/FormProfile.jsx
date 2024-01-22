import React from "react";

const FormProfile = ({ data, onChange = () => {} }) => {
  return (
    <div className="flex flex-col gap-7 mt-6">
      <h2 className="text-2xl font-semibold self-center">Student Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          className="bg-white rounded border border-gray-400 px-2 py-2"
          placeholder="Student Name (In English)"
          value={data?.name}
          onChange={(val) => onChange("name", val.target.value)}
        />
        <input
          type="text"
          className="bg-white rounded border border-gray-400 px-2 py-2"
          placeholder="Email Address"
          value={data?.email}
          onChange={(val) => onChange("email", val.target.value)}
        />
        <input
          type="text"
          className="bg-white rounded border border-gray-400 px-2 py-2"
          placeholder="Phone Number"
          inputMode="numeric"
          value={data?.phone}
          onChange={(val) =>
            onChange("phone", val.target.value.replace(/[^0-9]/g, ""))
          }
        />
        <input
          type="text"
          className="bg-white rounded border border-gray-400 px-2 py-2"
          placeholder="Age"
          value={data?.age}
          onChange={(val) =>
            onChange("age", val.target.value.replace(/[^0-9]/g, ""))
          }
        />
      </div>
      <div className="">
        * Dont forget to claim your results at your infoDay
      </div>
    </div>
  );
};

export default FormProfile;
