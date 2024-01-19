import { useId } from "react";
const StartScreen = ({ handleStartButton, appState, handleSelectChange }) => {
  const id = useId();
  return (
    <div className="start-container">
      <h1>Quizzical</h1>
      <form className="start-form">
        <label htmlFor={id + "-category"}>Choose a category:</label>
        <select
          className="dropdown"
          value={appState.category}
          name="category"
          id={id + "-category"}
          onChange={handleSelectChange}
        >
          <option value="">Any category</option>
          <option value="9">General Knowledge</option>
          <option value="10">Entertainment: Books</option>
          <option value="11">Entertainment: Film</option>
          <option value="12">Entertainment: Music</option>
          <option value="13">Entertainment: Musicals &amp; Theatres</option>
          <option value="14">Entertainment: Television</option>
          <option value="15">Entertainment: Video Games</option>
          <option value="16">Entertainment: Board Games</option>
          <option value="17">Science &amp; Nature</option>
          <option value="18">Science: Computers</option>
          <option value="19">Science: Mathematics</option>
          <option value="20">Mythology</option>
          <option value="21">Sports</option>
          <option value="22">Geography</option>
          <option value="23">History</option>
          <option value="24">Politics</option>
          <option value="25">Art</option>
          <option value="26">Celebrities</option>
          <option value="27">Animals</option>
          <option value="28">Vehicles</option>
          <option value="29">Entertainment: Comics</option>
          <option value="30">Science: Gadgets</option>
          <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
          <option value="32">Entertainment: Cartoon &amp; Animations</option>
        </select>
        <label htmlFor={id + "-difficulty"}>Choose a difficulty:</label>
        <select
          className="dropdown"
          value={appState.difficulty}
          name="difficulty"
          id={id + "-difficulty"}
          onChange={handleSelectChange}
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <label htmlFor={id + "-type"}>Choose a type:</label>
        <select
          className="dropdown"
          value={appState.type}
          name="type"
          id={id + "-type"}
          onChange={handleSelectChange}
        >
          <option value="">Any type</option>
          <option value="multiple">Multiple choice</option>
          <option value="boolean">True / False</option>
        </select>
        <button
          className="start"
          onClick={handleStartButton}
        >
          Start quiz
        </button>
      </form>
      {appState.isLoading && !appState.isError && <p>Loading...</p>}
      {appState.isError && <p>Error: {appState.errorMessage}</p>}
    </div>
  );
};
export default StartScreen;
