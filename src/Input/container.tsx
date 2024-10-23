import { INPUT_SECOND_ROW } from "../constants";

// Container for the input buttons (0-9, operators, enter, and delete).
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

    // Check the attempts for the status of the current input.
    attempts.some((attempt) => {
      if (!attempt.includes(input)) return false;
      const characters = attempt.split("");

      characters.some((character, index) => {
        if (character === undefined || character !== input) return false;
        // If we ever find a match we can exit early and immediately set
        // the class to correct (green).
        if (solutionParts[index] === character) {
          correct = true;
          return true;
        }

        if (solutionParts.includes(character)) {
          different = true;
        }
        // Seen is needed to differentiate between a character that
        // doesn't exist in the attempts at all vs one that has appeared
        // but is incorrect.
        if (!solutionParts.includes(character)) {
          seen = true;
        }
      });
      if (correct) return true;
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
        {/* Create a box for 0-9. */}
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
