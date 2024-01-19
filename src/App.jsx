import { useState } from "react";
import Quiz from "./components/quiz";

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  let fetchQuestions = async () => {
    let response = await fetch("https://opentdb.com/api.php?amount=5");
    let data = await response.json();
    if (data.response_code === 0) {
      console.log("Success fetching questions");
      setIsLoading(true);
      return data.results;
    } else {
      console.log(`Error fetching questions`);
      setIsError(true);
    }
  };

  //shuffle answers and make each answer as an object with a boolean value for correct or incorrect
  async function getQuestions() {
    setIsLoading(true);
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
    setIsLoading(false);
  }
  function handleStartButton() {
    if (!isStarted && !isLoading && !isError) {
      setIsStarted(true);
      getQuestions();
      console.log("case 1");
    } else if (isStarted && isError) {
      setIsError(false);
      getQuestions();
      console.log("case 2");
    } else {
      console.log("default");
    }
  }
  console.log(`isStarted`, isStarted);

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
  const questionList = questions.map((question) => (
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
  ));

  const handleRestart = () => {
    setIsStarted(false);
    setIsSubmitted(false);
  };

  return (
    <main>
      {isStarted && !isLoading ? (
        <>
          {questionList}
          <div className="submit-container">
            {isSubmitted && (
              <p className="score">You scored {score}/5 correct answers</p>
            )}
            <button
              className="submit"
              onClick={isSubmitted ? handleRestart : submitAnswers}
            >
              {isSubmitted ? "Play again" : "Check answers"}
            </button>
          </div>
        </>
      ) : (
        <div className="start-container">
          <h1>Quizzical</h1>
          <button
            className="start"
            onClick={() => handleStartButton()}
          >
            Start quiz
          </button>
          {isLoading && !isError && <p>Loading...</p>}
          {isError && (
            <p>
              Error fetching questions. Please click the button to try again.
            </p>
          )}
        </div>
      )}
      <footer>
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
