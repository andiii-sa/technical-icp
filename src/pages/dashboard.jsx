import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Dashboard = () => {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Student",
      subTitle: "Profile",
      path: "",
    },
    {
      title: "Question",
      subTitle: "(1-6)",
      path: "questA",
    },
    {
      title: "Question",
      subTitle: "(7-12)",
      path: "questB",
    },
    {
      title: "Question",
      subTitle: "(13-18)",
      path: "questC",
    },
    {
      title: "Question",
      subTitle: "(19-24)",
      path: "questD",
    },
    {
      title: "Writing",
      subTitle: "Task",
      path: "essay",
    },
  ];

  const dateNow = new Date();
  const [activeStep, setActiveStep] = useState("");
  const [questions, setQuestions] = useState(listQuestion ?? []);
  const [answerQuestion, setAnswerQuestion] = useState([
    ...listQuestion?.map(
      (question) =>
        ({
          question_id: question.id,
          answer_id: "",
        } ?? [])
    ),
    {
      question_id: 999,
      answer_id: "",
    },
  ]);
  const [formProfile, setFormProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  const handleActiveStep = (step) => {
    setActiveStep(step);
  };

  const validationFormProfile = () => {
    if (
      formProfile.name === "" ||
      formProfile.email === "" ||
      formProfile.phone === "" ||
      formProfile.age === ""
    ) {
      MySwal.fire({
        title: <p>Semua field wajib diisi!</p>,
        icon: "error",
      });
      return true;
    }
    return false;
  };

  const handleNextForm = () => {
    if (activeStep === "") {
      if (validationFormProfile()) {
        return;
      }
    }
    const findIdx = steps.findIndex((f) => f.path === activeStep);
    handleActiveStep(steps[findIdx + 1].path);
  };

  const handlePrevForm = () => {
    const findIdx = steps.findIndex((f) => f.path === activeStep);
    handleActiveStep(steps[findIdx - 1].path);
  };

  const handleAnswerQuestion = (id, val) => {
    let data = [...answerQuestion];
    const findIdx = answerQuestion?.findIndex((f) => f?.question_id === id);
    data[findIdx] = {
      ...data[findIdx],
      answer_id: val,
    };
    setAnswerQuestion(data);
  };

  const handleFinish = () => {
    MySwal.fire({
      title: <p>Success</p>,
      text: "You have completed all tests! Please claim your results at the Yes2Malaysia Info Day",
      icon: "success",
      allowOutsideClick: false,
    }).then((res) => {
      if (res.isConfirmed) {
        navigate("/success-test");
      }
    });
  };

  const questionPart = useMemo(() => {
    const question = [...questions];
    if (activeStep === "questB") {
      return question?.slice(6, 12);
    } else if (activeStep === "questC") {
      return question?.slice(12, 18);
    } else if (activeStep === "questD") {
      return question?.slice(18, 24);
    } else {
      return question?.slice(0, 6);
    }
  }, [questions, activeStep]);

  return (
    <div className="w-full px-12 py-5">
      <div className="flex flex-col justify-center items-center mb-5">
        <span>15:43</span>
        <span>{`Date: ${dateNow.getDate()} / ${dateNow.getMonth()} / ${dateNow.getFullYear()}`}</span>
      </div>
      <Steps
        items={steps}
        handleActiveStep={handleActiveStep}
        active={activeStep}
      />
      {activeStep === "" && (
        <FormProfile
          data={formProfile}
          onChange={(key, val) =>
            setFormProfile((prev) => ({ ...prev, [key]: val }))
          }
        />
      )}
      {activeStep !== "" && activeStep !== "essay" && (
        <FormQuestionMultipleChoice
          questions={questionPart}
          answers={answerQuestion}
          handleAnswer={handleAnswerQuestion}
          activeStep={activeStep}
        />
      )}
      {activeStep === "essay" && (
        <FormQuestionEssay
          answers={answerQuestion}
          handleAnswer={handleAnswerQuestion}
        />
      )}

      <div className="flex justify-end mt-5 gap-3">
        {activeStep !== "" && (
          <button
            className="px-4 py-2 rounded border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
            onClick={handlePrevForm}
          >
            Previous
          </button>
        )}
        {activeStep !== "essay" && (
          <button
            className="px-4 py-2 rounded border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
            onClick={handleNextForm}
          >
            Next
          </button>
        )}
        {activeStep === "essay" && (
          <button
            className="px-4 py-2 rounded border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
            onClick={handleFinish}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

const Steps = ({ items = [], active = "", handleActiveStep = () => {} }) => {
  return (
    <div className="flex items-center justify-center">
      {items?.map((item, idx) => (
        <div key={idx} className="flex items-center">
          {idx !== 0 && (
            <div
              className={`w-14 h-2 rounded-sm -mr-1 ${
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
            onClick={() => handleActiveStep(item?.path)}
          >
            {idx + 1}
          </div>
          <div
            className={`flex flex-col ml-2 gap-0 text-sm mr-2 cursor-pointer ${
              items?.findIndex((f) => f?.path === active) >= idx
                ? "text-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => handleActiveStep(item?.path)}
          >
            <span>{item?.title}</span>
            <span>{item?.subTitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const FormProfile = ({ data, onChange = () => {} }) => {
  return (
    <div className="flex flex-col gap-7 mt-6">
      <h2 className="text-2xl font-semibold self-center">Student Details</h2>
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-rows-3 grid-flow-col gap-5">
        {questions?.map((question, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="font-bold text-lg">{`${idxNumber(idx)}. ${
              question?.question
            }`}</span>
            <div className="grid grid-cols-2 gap-1">
              {question?.option?.map((opt, idy) => (
                <div
                  key={idy}
                  className={`py-2 px-1 rounded-lg cursor-pointer hover:bg-green-50 ${
                    answers?.find((f) => f?.question_id === question?.id)
                      ?.answer_id === opt?.key
                      ? "bg-green-500"
                      : ""
                  }`}
                  onClick={() => handleAnswer(question?.id, opt?.key)}
                >
                  <span className="uppercase">{`${opt?.key}. `}</span>
                  <span className="">{opt?.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

const listQuestion = [
  {
    id: 25,
    set_question: "SetB",
    question: "My sister _______ a doctor. She’s working at the hospital now.",
    is_active: 1,
    created_at: "2023-10-17T17:47:41.000000Z",
    updated_at: "2023-10-17T17:47:41.000000Z",
    option: [
      {
        id: 97,
        question_id: 25,
        key: "a",
        text: "is being",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 98,
        question_id: 25,
        key: "b",
        text: "was",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 99,
        question_id: 25,
        key: "c",
        text: "is",
        is_true: 1,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 100,
        question_id: 25,
        key: "d",
        text: "are",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
    ],
  },
  {
    id: 26,
    set_question: "SetB",
    question: "Ahmad ___________   football at the moment.",
    is_active: 1,
    created_at: "2023-10-17T17:47:41.000000Z",
    updated_at: "2023-10-17T17:47:41.000000Z",
    option: [
      {
        id: 101,
        question_id: 26,
        key: "a",
        text: "is playing",
        is_true: 1,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 102,
        question_id: 26,
        key: "b",
        text: "plays",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 103,
        question_id: 26,
        key: "c",
        text: "was playing",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 104,
        question_id: 26,
        key: "d",
        text: "play",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
    ],
  },
  {
    id: 27,
    set_question: "SetB",
    question: "Mina  _________  the piano really well. Just listen!",
    is_active: 1,
    created_at: "2023-10-17T17:47:41.000000Z",
    updated_at: "2023-10-17T17:47:41.000000Z",
    option: [
      {
        id: 105,
        question_id: 27,
        key: "a",
        text: "playing",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 106,
        question_id: 27,
        key: "b",
        text: "played",
        is_true: 0,
        created_at: "2023-10-17T17:47:41.000000Z",
        updated_at: "2023-10-17T17:47:41.000000Z",
      },
      {
        id: 107,
        question_id: 27,
        key: "c",
        text: "play",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 108,
        question_id: 27,
        key: "d",
        text: "plays",
        is_true: 1,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
    ],
  },
  {
    id: 28,
    set_question: "SetB",
    question: "Last night __________  at a disco. It was really noisy.",
    is_active: 1,
    created_at: "2023-10-17T17:47:42.000000Z",
    updated_at: "2023-10-17T17:47:42.000000Z",
    option: [
      {
        id: 109,
        question_id: 28,
        key: "a",
        text: "we are",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 110,
        question_id: 28,
        key: "b",
        text: "we went",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 111,
        question_id: 28,
        key: "c",
        text: "we’re",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 112,
        question_id: 28,
        key: "d",
        text: "we were",
        is_true: 1,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
    ],
  },
  {
    id: 29,
    set_question: "SetB",
    question:
      "Lim  __________  old electrician. He wired my house before he retired.",
    is_active: 1,
    created_at: "2023-10-17T17:47:42.000000Z",
    updated_at: "2023-10-17T17:47:42.000000Z",
    option: [
      {
        id: 113,
        question_id: 29,
        key: "a",
        text: "is a",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 114,
        question_id: 29,
        key: "b",
        text: "was an",
        is_true: 1,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 115,
        question_id: 29,
        key: "c",
        text: "working",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 116,
        question_id: 29,
        key: "d",
        text: "studied",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
    ],
  },
  {
    id: 30,
    set_question: "SetB",
    question:
      "We usually put an adjective _______ a noun, except with the verb ‘be’.",
    is_active: 1,
    created_at: "2023-10-17T17:47:42.000000Z",
    updated_at: "2023-10-17T17:47:42.000000Z",
    option: [
      {
        id: 117,
        question_id: 30,
        key: "a",
        text: "before",
        is_true: 1,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 118,
        question_id: 30,
        key: "b",
        text: "after",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 119,
        question_id: 30,
        key: "c",
        text: "between",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 120,
        question_id: 30,
        key: "d",
        text: "next",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
    ],
  },
  {
    id: 31,
    set_question: "SetB",
    question: "Q: _______________ are you going? – A. I’m going by bus.",
    is_active: 1,
    created_at: "2023-10-17T17:47:42.000000Z",
    updated_at: "2023-10-17T17:47:42.000000Z",
    option: [
      {
        id: 121,
        question_id: 31,
        key: "a",
        text: "Where",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 122,
        question_id: 31,
        key: "b",
        text: "What",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 123,
        question_id: 31,
        key: "c",
        text: "When",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 124,
        question_id: 31,
        key: "d",
        text: "How",
        is_true: 1,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
    ],
  },
  {
    id: 32,
    set_question: "SetB",
    question: " _____________  to Japan?  Did you enjoy it?",
    is_active: 1,
    created_at: "2023-10-17T17:47:42.000000Z",
    updated_at: "2023-10-17T17:47:42.000000Z",
    option: [
      {
        id: 125,
        question_id: 32,
        key: "a",
        text: "Were you ever go",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 126,
        question_id: 32,
        key: "b",
        text: "Have you ever been",
        is_true: 1,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 127,
        question_id: 32,
        key: "c",
        text: "Have you ever gone",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 128,
        question_id: 32,
        key: "d",
        text: "Are you ever going",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
    ],
  },
  {
    id: 33,
    set_question: "SetB",
    question: "The city is  _____________ than the countryside.",
    is_active: 1,
    created_at: "2023-10-17T17:47:42.000000Z",
    updated_at: "2023-10-17T17:47:42.000000Z",
    option: [
      {
        id: 129,
        question_id: 33,
        key: "a",
        text: "busy",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 130,
        question_id: 33,
        key: "b",
        text: "the busiest",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 131,
        question_id: 33,
        key: "c",
        text: "busier",
        is_true: 1,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 132,
        question_id: 33,
        key: "d",
        text: "more busy",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
    ],
  },
  {
    id: 34,
    set_question: "SetB",
    question: "Q: How did you get here?\n        A:  We ______________.",
    is_active: 1,
    created_at: "2023-10-17T17:47:42.000000Z",
    updated_at: "2023-10-17T17:47:42.000000Z",
    option: [
      {
        id: 133,
        question_id: 34,
        key: "a",
        text: "drive",
        is_true: 0,
        created_at: "2023-10-17T17:47:42.000000Z",
        updated_at: "2023-10-17T17:47:42.000000Z",
      },
      {
        id: 134,
        question_id: 34,
        key: "b",
        text: "drove",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 135,
        question_id: 34,
        key: "c",
        text: "drived",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 136,
        question_id: 34,
        key: "d",
        text: "driving",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 35,
    set_question: "SetB",
    question: "My sister is a nice person __________  .",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 137,
        question_id: 35,
        key: "a",
        text: "I really like him",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 138,
        question_id: 35,
        key: "b",
        text: "I’m really liking her",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 139,
        question_id: 35,
        key: "c",
        text: "I’m really like her",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 140,
        question_id: 35,
        key: "d",
        text: "I really like her ",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 36,
    set_question: "SetB",
    question: "Ivan can’t sing well, but he plays his guitar  __________.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 141,
        question_id: 36,
        key: "a",
        text: "beauty",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 142,
        question_id: 36,
        key: "b",
        text: "beautiful",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 143,
        question_id: 36,
        key: "c",
        text: "beautifully",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 144,
        question_id: 36,
        key: "d",
        text: "beauteous",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 37,
    set_question: "SetB",
    question: "I like curry now, but I ____________ like it when I was young.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 145,
        question_id: 37,
        key: "a",
        text: "used to",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 146,
        question_id: 37,
        key: "b",
        text: "didn’t use to",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 147,
        question_id: 37,
        key: "c",
        text: "didn’t used to",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 148,
        question_id: 37,
        key: "d",
        text: "never",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 38,
    set_question: "SetB",
    question: "Look at those clouds. Take an umbrella it  _________ .",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 149,
        question_id: 38,
        key: "a",
        text: "will rain",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 150,
        question_id: 38,
        key: "b",
        text: "will be raining",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 151,
        question_id: 38,
        key: "c",
        text: "raining",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 152,
        question_id: 38,
        key: "d",
        text: "‘s going to rain",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 39,
    set_question: "SetB",
    question: "I’ve been living here _________ last summer.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 153,
        question_id: 39,
        key: "a",
        text: "since",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 154,
        question_id: 39,
        key: "b",
        text: "until",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 155,
        question_id: 39,
        key: "c",
        text: "for",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 156,
        question_id: 39,
        key: "d",
        text: "during",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 40,
    set_question: "SetB",
    question:
      "I __________ swim when I was five years old, but my brother was unable to.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 157,
        question_id: 40,
        key: "a",
        text: "can",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 158,
        question_id: 40,
        key: "b",
        text: "am able to",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 159,
        question_id: 40,
        key: "c",
        text: "could",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 160,
        question_id: 40,
        key: "d",
        text: "able",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 41,
    set_question: "SetB",
    question:
      "The teacher  _______________ talking, but we continued and got into trouble.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 161,
        question_id: 41,
        key: "a",
        text: "said to stop",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 162,
        question_id: 41,
        key: "b",
        text: "said we stop",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 163,
        question_id: 41,
        key: "c",
        text: "told us to stop",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 164,
        question_id: 41,
        key: "d",
        text: "tell us to stop",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 42,
    set_question: "SetB",
    question: "If you want to pass your test. You _________study hard.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 165,
        question_id: 42,
        key: "a",
        text: "must to",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 166,
        question_id: 42,
        key: "b",
        text: "had to",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 167,
        question_id: 42,
        key: "c",
        text: "got to",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 168,
        question_id: 42,
        key: "d",
        text: "need to",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 43,
    set_question: "SetB",
    question: "If I hadn’t joined the course I _________ met you.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 169,
        question_id: 43,
        key: "a",
        text: "needn’t have",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 170,
        question_id: 43,
        key: "b",
        text: "mustn’t have",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 171,
        question_id: 43,
        key: "c",
        text: "won’t have",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 172,
        question_id: 43,
        key: "d",
        text: "wouldn’t have",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 44,
    set_question: "SetB",
    question: "The phrasal verb, ‘give _____  ’means ‘distribute’.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 173,
        question_id: 44,
        key: "a",
        text: "up",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 174,
        question_id: 44,
        key: "b",
        text: "in",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 175,
        question_id: 44,
        key: "c",
        text: "out",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 176,
        question_id: 44,
        key: "d",
        text: "back",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 45,
    set_question: "SetB",
    question:
      "By the time you get back _________ the meal and we can eat straight away.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 177,
        question_id: 45,
        key: "a",
        text: "I’ll have cooked",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 178,
        question_id: 45,
        key: "b",
        text: "I’ll cook",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 179,
        question_id: 45,
        key: "c",
        text: "I’ll be cooking",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 180,
        question_id: 45,
        key: "d",
        text: "I had cooked",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 46,
    set_question: "SetB",
    question: "Here is a fact. - Mercedes cars ___________ in Germany.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 181,
        question_id: 46,
        key: "a",
        text: "be manufactured",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 182,
        question_id: 46,
        key: "b",
        text: "are manufactured",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 183,
        question_id: 46,
        key: "c",
        text: "have been manufactured",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 184,
        question_id: 46,
        key: "d",
        text: "manufacturer",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 47,
    set_question: "SetB",
    question: "There isn’t ____________ , you’ll have to go and buy some.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 185,
        question_id: 47,
        key: "a",
        text: "some milk in the fridge",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 186,
        question_id: 47,
        key: "b",
        text: "no milk in the fridge",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 187,
        question_id: 47,
        key: "c",
        text: "any milk in the fridge",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 188,
        question_id: 47,
        key: "d",
        text: "a milk in the fridge",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
  {
    id: 48,
    set_question: "SetB",
    question: "The e-book  ___________ on the way here, was very exciting.",
    is_active: 1,
    created_at: "2023-10-17T17:47:43.000000Z",
    updated_at: "2023-10-17T17:47:43.000000Z",
    option: [
      {
        id: 189,
        question_id: 48,
        key: "a",
        text: "which I read",
        is_true: 1,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 190,
        question_id: 48,
        key: "b",
        text: "that I am reading",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 191,
        question_id: 48,
        key: "c",
        text: "what I have read",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
      {
        id: 192,
        question_id: 48,
        key: "d",
        text: "I have been reading",
        is_true: 0,
        created_at: "2023-10-17T17:47:43.000000Z",
        updated_at: "2023-10-17T17:47:43.000000Z",
      },
    ],
  },
];
