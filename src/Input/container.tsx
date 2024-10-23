import { INPUT_SECOND_ROW } from "../constants";

//
function InputContainer({
  attempts,
  solution,
  handleInputClick,
}: {
  attempts: string[];
  solution: string;
  handleInputClick: Function;
}) {
  const solutionParts = solution.split("");

  //
  const getInputClass = (input: string) => {
    if (input === "Enter" || input === "Delete" || attempts.length < 1)
      return "";

    let correct = false;
    let different = false;
    let seen = false;

    attempts.map((attempt) => {
      const characters = attempt.split("");
      characters.map((character, index) => {
        if (character !== input || character === undefined) return;
        if (solutionParts[index] === character) {
          correct = true;
          seen = true;
        }
        if (solutionParts.includes(character)) {
          different = true;
          seen = true;
        }
        if (!solutionParts.includes(character)) {
          seen = true;
        }
      });
    });

    if (correct) return "correct";
    if (different) return "different";
    if (!seen) return "";
    return "incorrect";
  };

  //
  return (
    <div className="input-container">
      <div className="input-row">
        {[...Array(10)].map((v, index) => (
          <div
            className={"input-box " + getInputClass(index.toString())}
            onClick={(e: any) => {
              e.preventDefault();
              handleInputClick(index.toString());
            }}
            key={`input-${index}`}
          >
            {index}
          </div>
        ))}
      </div>

      <div className="input-row">
        {INPUT_SECOND_ROW.map((input) => (
          <div
            className={
              "input-box " +
              (input === "Enter" || input === "Delete" ? "wide-input " : "") +
              getInputClass(input)
            }
            onClick={(e: any) => {
              e.preventDefault();
              handleInputClick(input);
            }}
            key={`input-${input}`}
          >
            {input}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InputContainer;
