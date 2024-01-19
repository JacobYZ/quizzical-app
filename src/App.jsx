import { useState, useId } from "react";
import Quiz from "./components/quiz";
import StartScreen from "./components/StartScreen";

function App() {
  const initialState = {
    isStarted: false,
    isLoading: false,
    isError: false,
    isSubmitted: false,
    category: 0,
    difficulty: "",
    type: "",
    errorMessage: "",
  };
  const [appState, setAppState] = useState(initialState);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  let fetchQuestions = async () => {
    setAppState((prevState) => ({ ...prevState, isLoading: true }));
    let response = await fetch(
      `https://opentdb.com/api.php?amount=5&category=${appState.category}&difficulty=${appState.difficulty}&type=${appState.type}`
    );
    let data = await response.json();
    if (data.response_code === 0) {
      console.log("Success fetching questions");
      setAppState((prevState) => ({
        ...prevState,
        isLoading: false,
        isError: false,
        category: 0,
        difficulty: "",
        type: "",
        errorMessage: "",
      }));
      return data.results;
    } else {
      let message;
      switch (data.response_code) {
        case 1:
          message =
            "Could not return results. The API doesn't have enough questions for your query.";
          break;
        case 2:
          message =
            "Contains an invalid parameter. Arguments passed in aren't valid.";
          break;
        case 3:
          message = "Session Token does not exist.";
          break;
        case 4:
          message =
            "Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.";
          break;
        case 5:
          message =
            "Too many requests have occurred. Each IP can only access the API once every 5 seconds.";
          break;
        default:
          message = "An unknown error occurred.";
      }
      setAppState((prevState) => ({
        ...prevState,
        isLoading: false,
        isError: true,
        errorMessage: message,
      }));
    }
  };

  //shuffle answers and make each answer as an object with a boolean value for correct or incorrect
  async function getQuestions() {
    setAppState((prevState) => ({ ...prevState, isLoading: true }));
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
    setAppState((prevState) => ({ ...prevState, isLoading: false }));
  }
  function handleSelectChange(event) {
    const { name, value } = event.target;
    setAppState((prevState) => ({ ...prevState, [name]: value }));
    console.log(`${name}: ${value}`);
  }
  function handleStartButton(event) {
    event.preventDefault();
    if (!appState.isStarted && !appState.isLoading && !appState.isError) {
      setAppState((prevState) => ({ ...prevState, isStarted: true }));
      getQuestions();
      console.log("case 1");
    } else if (appState.isStarted && appState.isError) {
      setAppState((prevState) => ({ ...prevState, isError: false }));
      getQuestions();
      console.log("case 2");
    } else if (appState.isStarted && !appState.isLoading && !appState.isError) {
      setAppState((prevState) => ({ ...prevState, isStarted: false }));
      console.log("case 3");
    }
  }

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
    setAppState((prevState) => ({ ...prevState, isSubmitted: true }));
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
      isSubmitted={appState.isSubmitted}
      selectAnswer={selectAnswer}
    />
  ));

  const handleRestart = () => {
    setAppState({ ...appState, isStarted: false, isSubmitted: false });
  };

  return (
    <main>
      {appState.isStarted && !appState.isLoading && !appState.isError ? (
        <>
          {questionList}
          <div className="submit-container">
            {appState.isSubmitted && (
              <p className="score">You scored {score}/5 correct answers</p>
            )}
            <button
              className="submit"
              onClick={appState.isSubmitted ? handleRestart : submitAnswers}
            >
              {appState.isSubmitted ? "Play again" : "Check answers"}
            </button>
          </div>
        </>
      ) : (
        <StartScreen
          handleStartButton={handleStartButton}
          appState={appState}
          handleSelectChange={handleSelectChange}
        />
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
