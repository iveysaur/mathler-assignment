import { ATTEMPT_LENGTH } from "../constants";

//
function AttemptRow({
  attempt,
  solution,
  isCurrentInput,
}: {
  attempt: string;
  solution: string;
  isCurrentInput: boolean;
}) {
  const attemptParts = attempt.split("");
  const solutionParts = solution.split("");

  //
  const assignCharacterClasses = () => {
    let classes: string[] = [];
    const modifiedSolutionParts = [...solutionParts];

    attemptParts.map((part, index) => {
      if (part === undefined || isCurrentInput) return;
      if (modifiedSolutionParts[index] === part) {
        classes[index] = "correct";
        modifiedSolutionParts[index] = "";
      }
    });

    attemptParts.map((part, index) => {
      if (part === undefined || isCurrentInput || classes[index] === "correct")
        return;
      if (modifiedSolutionParts.includes(part)) {
        classes[index] = "different";
        modifiedSolutionParts[modifiedSolutionParts.indexOf(part)] = "";
      } else {
        classes[index] = "incorrect";
      }
    });

    return classes;
  };
  const characterClasses: string[] = assignCharacterClasses();

  //
  return (
    <div className="attempt-row">
      {attemptParts.length === 0 ? (
        <div style={{ display: "flex" }}>
          {[...Array(ATTEMPT_LENGTH)].map((v, i) => (
            <div className={"attempt-box"} key={i}></div>
          ))}
        </div>
      ) : null}

      {attemptParts.map((character, index) => (
        <div
          className={"attempt-box " + characterClasses[index]}
          key={`${character}-${index}`}
        >
          {character ?? ""}
        </div>
      ))}

      {attemptParts.length !== 0 ||
      (attemptParts.length > 0 && attemptParts.length < ATTEMPT_LENGTH) ? (
        <div style={{ display: "flex" }}>
          {[...Array(ATTEMPT_LENGTH - attemptParts.length)].map((v, i) => (
            <div className={"attempt-box"} key={i}></div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AttemptRow;
