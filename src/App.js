import React, { useState, useEffect } from "react";
import "./App.css";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(30);
  const [isAnswerable, setIsAnswerable] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setQuestions(data.slice(0, 10)))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  useEffect(() => {
    if (timer === 0) {
      nextQuestion();
    } else {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  useEffect(() => {
    if (timer === 20) {
      setIsAnswerable(true);
    }
  }, [timer]);

  const parseChoices = (body) => {
    const words = body.split(" ");
    const choices = ["A", "B", "C", "D"];
    return choices.map((choice, index) => ({
      text: words[index % words.length],
      value: choice,
    }));
  };

  const selectAnswer = (answer) => {
    if (isAnswerable) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = {
        question: questions[currentQuestionIndex].title,
        answer,
      };
      setUserAnswers(updatedAnswers);
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30);
      setIsAnswerable(false);
    } else {
      setCurrentQuestionIndex(questions.length);
    }
  };

  const renderResults = () => (
    <div>
      <h2>Sonuçlar</h2>
      <table>
        <thead>
          <tr>
            <th>Soru</th>
            <th>Verilen Yanıt</th>
          </tr>
        </thead>
        <tbody>
          {userAnswers.map((answer, index) => (
            <tr key={index}>
              <td>{answer.question}</td>
              <td>{answer.answer || "Yanıtlanmadı"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderQuestion = () => {
    if (questions.length === 0) {
      return <p>Yükleniyor...</p>;
    }

    const question = questions[currentQuestionIndex];
    const choices = parseChoices(question.body);

    return (
      <div>
        <h2>{question.title}</h2>
        <div className="choices-container">
          {choices.map((choice, index) => (
            <button
              key={index}
              className="choice-button"
              disabled={!isAnswerable}
              onClick={() => selectAnswer(choice.value)}
            >
              {choice.value}: {choice.text}
            </button>
          ))}
        </div>
        <p>Kalan Süre: {timer} saniye</p>
        <p>
          {currentQuestionIndex + 1} / {questions.length}
        </p>{" "}
        {/* Soru numarası gösterimi */}
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {currentQuestionIndex >= questions.length
        ? renderResults()
        : renderQuestion()}
    </div>
  );
};

export default QuizApp;
