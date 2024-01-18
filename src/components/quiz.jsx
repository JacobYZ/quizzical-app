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
        let buttonClass = "answer";
        if (isSubmitted) {
          buttonClass += " submitted";
          if (answer.isCorrect) {
            buttonClass += " correct";
          } else if (answer.isSelected) {
            buttonClass += " incorrect";
          }
        } else if (answer.isSelected) {
          buttonClass += " selected";
        }

        return (
          <button
            className={buttonClass}
            key={answer.answer}
            onClick={() => selectAnswer(question, answer.answer)}
            disabled={isSubmitted}
          >
            {he.decode(answer.answer)}
          </button>
        );
      })}
      <hr />
    </div>
  );
}
