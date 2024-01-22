import React from "react";

const FormQuestionEssay = ({ answers = [], handleAnswer = () => {} }) => {
  return (
    <div className="flex flex-col mt-6 gap-7">
      <h2 className="text-2xl font-semibold self-center text-red-600">
        English Placement Test
      </h2>
      <div className="flex flex-col gap-3">
        <span className="font-bold">
          25. Please Write a paragraph on the following subject. "Why Learning
          English is important for me"
        </span>
        <textarea
          className="bg-white rounded border border-gray-400 px-2 py-2 min-h-52"
          value={answers?.find((f) => f?.question_id === 999)?.answer_id}
          onChange={(val) => handleAnswer(999, val.target.value)}
        />
      </div>
    </div>
  );
};

export default FormQuestionEssay;
