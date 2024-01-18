import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Quiz from "./components/quiz";

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  let fetchQuestions = async () => {
    let response = await fetch("https://opentdb.com/api.php?amount=5");
    let data = await response.json();
    if (data.response_code === 0) {
      console.log("Success fetching questions");
      return data.results;
    } else console.log(`Error fetching questions`);
  };

  //shuffle answers and make each answer as an object with a boolean value for correct or incorrect
  useEffect(() => {
    async function getQuestions() {
      let questions = await fetchQuestions();
      let newQuestions = questions.map((question) => {
        let answers = [...question.incorrect_answers, question.correct_answer];
        let shuffledAnswers = answers.sort(() => Math.random() - 0.5);
        let newAnswers = shuffledAnswers.map((answer) => {
          return {
            answer: answer,
            correct: answer === question.correct_answer,
          };
        });
        return {
          ...question,
          answers: newAnswers,
        };
      });
      setQuestions(newQuestions);
    }
    getQuestions();
  }, []);

  //If the user selects an answer, we need to update the state of the answer to isSelected: true
  function selectAnswer(questionText, answerText) {
    let newQuestions = questions.map((question) => {
      if (question.question === questionText) {
        let newAnswers = question.answers.map((answer) => {
          if (answer.answer === answerText) {
            return {
              ...answer,
              isSelected: true,
            };
          } else {
            return {
              ...answer,
              isSelected: false,
            };
          }
        });
        return {
          ...question,
          answers: newAnswers,
        };
      } else {
        return question;
      }
    });
    setQuestions(newQuestions);
  }

  //When the user clicks the submit button, we need to update the state of isSubmitted to true, compare the selected answers to the correct answers, and calculate the score(number of correct answers) and display it to the user.
  function submitAnswers() {
    setIsSubmitted(true);

    let newScore = 0;
    let newQuestions = questions.map((question) => {
      let newAnswers = question.answers.map((answer) => {
        if (answer.isSelected && answer.correct) {
          newScore++;
          return {
            ...answer,
            isSelected: true,
            isCorrect: true,
          };
        } else if (answer.isSelected && !answer.correct) {
          return {
            ...answer,
            isSelected: true,
            isCorrect: false,
          };
        } else if (!answer.isSelected && answer.correct) {
          return {
            ...answer,
            isSelected: false,
            isCorrect: true,
          };
        } else {
          return {
            ...answer,
            isSelected: false,
            isCorrect: false,
          };
        }
      });
      return {
        ...question,
        answers: newAnswers,
      };
    });
    setQuestions(newQuestions);
    setScore(newScore);
  }

  console.log(`questions`, questions);
  let questionList = questions.map((question) => {
    return (
      <Quiz
        key={question.question}
        type={question.type}
        difficulty={question.difficulty}
        category={question.category}
        question={question.question}
        answers={question.answers}
        isSubmitted={isSubmitted}
        selectAnswer={selectAnswer}
      />
    );
  });
  return (
    <main>
      {isStarted ? (
        <>
          {questionList}
          {isSubmitted ? (
            <>
              <p>You scored {score}/5 correct answers</p>
              <button
                className="submit"
                onClick={() => {
                  setIsStarted(false);
                  setIsSubmitted(false);
                }}
              >
                Restart quiz
              </button>
            </>
          ) : (
            <button
              className="submit"
              onClick={submitAnswers}
            >
              Check answers
            </button>
          )}
        </>
      ) : (
        <>
          <h1>Quizzical</h1>
          <button onClick={() => setIsStarted(true)}>Start quiz</button>
        </>
      )}
      <footer
        style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.8rem" }}
      >
        <p>
          Questions by{" "}
          <a
            href="https://opentdb.com/"
            style={{ color: "inherit" }}
          >
            Open Trivia DB
          </a>{" "}
          under{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            style={{ color: "inherit" }}
          >
            CC BY-SA 4.0
          </a>
          . No changes made.
        </p>
      </footer>
    </main>
  );
}

export default App;
