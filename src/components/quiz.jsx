import he from "he";

export default function Quiz({
  type,
  difficulty,
  category,
  question,
  answers,
  isSubmitted,
  selectAnswer,
}) {
  return (
    <div>
      <h3>{he.decode(question)}</h3>
      {answers.map((answer) => {
        return (
          <button
            className={answer.isSelected ? "answer selected" : "answer"}
            key={answer.answer}
            onClick={() => selectAnswer(question, answer.answer)}
          >
            {he.decode(answer.answer)}
          </button>
        );
      })}
      <hr />
    </div>
  );
}
