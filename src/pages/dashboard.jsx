import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  ApiCreateStudent,
  ApiGetListQuestion,
  ApiSaveAnswers,
} from "../api/apiStore/assesment";
import Steps from "../components/Steps";
import FormProfile from "../components/FormProfile";
import FormQuestionMultipleChoice from "../components/FormQuestionMultipleChoice";
import FormQuestionEssay from "../components/FormQuestionEssay";
import { formatTime } from "../utils/formatTime";

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
  const [questions, setQuestions] = useState([]);
  const [answerQuestion, setAnswerQuestion] = useState([]);
  const [isRunningTimer, setIsRunningTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const timeInterval = useRef(null);

  const [formProfile, setFormProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  const [profile, setProfile] = useState({
    name: "uchia sasule",
    email: "sasuleh@yopmail.com",
    phone: "083211112222",
    age: "19",
    study_plan: null,
    updated_at: "2024-01-22T05:33:02.000000Z",
    created_at: "2024-01-22T05:33:02.000000Z",
    id: 222,
    student_answer_id: 286,
    set_question: "SetB",
  });

  const handleStartTimer = () => {
    if (isRunningTimer) return;
    setIsRunningTimer(true);
    timeInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const { hours, minutes, seconds } = formatTime(timer);

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

  const validationFormQuestion = (path) => {
    const answer = [...answerQuestion];
    let data = [];
    if (path === "questB") {
      data = answer?.slice(6, 12);
    } else if (path === "questC") {
      data = answer?.slice(12, 18);
    } else if (path === "questD") {
      data = answer?.slice(18, 24);
    } else {
      data = answer?.slice(0, 6);
    }

    let isFindEmpty = false;
    data.forEach((item) => {
      if (item?.answer_id === "") {
        isFindEmpty = true;
      }
    });

    if (isFindEmpty) {
      MySwal.fire({
        title: <p>Harap menjawab semua pertanyaan</p>,
        icon: "error",
      });
      return true;
    }
    return false;
  };

  const saveUser = async () => {
    try {
      // cant update user, because dont have api edit user
      if (!profile) {
        const formData = new FormData();
        formData.append("name", formProfile.name);
        formData.append("email", formProfile.email);
        formData.append("age", formProfile.age);
        formData.append("phone", formProfile.phone);

        const res = await ApiCreateStudent(formProfile);
        if (res?.status === 200) {
          setProfile(res?.data?.data);
          getQuestion();
          handleStartTimer();
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getQuestion = async () => {
    try {
      const params = {
        student_id: profile?.id,
        set_question: profile?.set_question,
      };
      const res = await ApiGetListQuestion(params);
      setQuestions(res?.data ?? []);
      setAnswerQuestion(
        res?.data?.length > 0
          ? [
              ...res?.data?.map(
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
            ]
          : []
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleNextForm = () => {
    if (activeStep === "") {
      if (validationFormProfile()) {
        return;
      }
      saveUser();
    } else {
      if (validationFormQuestion(activeStep)) {
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

  const saveAnswers = async () => {
    try {
      const formData = new FormData();
      formData.append("student_id", profile.id);
      formData.append("student_answer_id", profile.student_answer_id);
      formData.append("student_answers", JSON.stringify(answerQuestion));
      formData.append("duration", `${hours}:${minutes}`);
      formData.append("timestamp", new Date().valueOf());

      const result = await ApiSaveAnswers(formData);

      console.log("result", result);

      if (result?.status === 200) {
        MySwal.fire({
          title: <p>Success</p>,
          text: "You have completed all tests! Please claim your results at the Yes2Malaysia Info Day",
          icon: "success",
          allowOutsideClick: false,
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/success-test", {
              state: {
                duration: result?.data?.duration,
                date: result?.data?.created_at,
              },
            });
          }
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleFinish = async () => {
    MySwal.fire({
      title: <p>Apakah anda yakin bahwa sudah selesai mengerjakan?</p>,
      icon: "info",
      allowOutsideClick: false,
      showDenyButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        saveAnswers();
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
    <div className="w-full py-5">
      <div className="flex flex-col justify-center items-center mb-5">
        <span>{`${hours} : ${minutes} : ${seconds}`}</span>
        <span>{`Date: ${dateNow.getDate()} / ${dateNow.getMonth()} / ${dateNow.getFullYear()}`}</span>
      </div>
      <Steps items={steps} active={activeStep} />
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
        {["questA", "questB", "questC", "questD", "essay"].includes(
          activeStep
        ) && (
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
