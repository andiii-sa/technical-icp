import React from "react";

const FormQuestionMultipleChoice = ({
  questions = [],
  answers = [],
  handleAnswer = () => {},
  activeStep = "",
}) => {
  const idxNumber = (idx) => {
    if (activeStep === "questA") {
      return idx + 1;
    } else if (activeStep === "questB") {
      return idx + 1 + 6;
    } else if (activeStep === "questC") {
      return idx + 1 + 12;
    } else if (activeStep === "questD") {
      return idx + 1 + 18;
    }
  };
  return (
    <div className="flex flex-col mt-6 gap-7">
      <h2 className="text-2xl font-semibold self-center text-red-600">
        English Placement Test
      </h2>
      <p className=" self-center text-center">
        Please read each sentence below and indicate your answer by clicking on
        the option. <br />
        When you are finished, click on the "Next" button at the bottom.
      </p>
      <div className="grid grid-cols-1 md:grid-rows-3 md:grid-flow-col gap-5">
        {questions?.map((question, idx) => (
          <div key={idx} className="flex flex-col gap-1 quest md:w-[45vw]">
            <span className="font-bold text-lg whitespace-break-spaces">{`${idxNumber(
              idx
            )}. ${question?.question}`}</span>
            <div className="grid grid-cols-2 gap-1">
              {question?.option?.map((opt, idy) => (
                <div
                  key={idy}
                  className={`py-2 px-1 rounded-lg cursor-pointer ${
                    answers?.find((f) => f?.question_id === question?.id)
                      ?.answer_id === opt?.key
                      ? "bg-green-500"
                      : "hover:bg-green-50"
                  }`}
                  onClick={() => handleAnswer(question?.id, opt?.key)}
                >
                  <span className="uppercase">{`${opt?.key}. `}</span>
                  <span className="whitespace-break-spaces break-all ">
                    {opt?.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormQuestionMultipleChoice;
