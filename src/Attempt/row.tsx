import { ATTEMPT_LENGTH } from "../constants";

//
function AttemptRow({
  attempt,
  solution,
  isCurrentAttempt,
}: {
  attempt: string;
  solution: string;
  isCurrentAttempt: boolean;
}) {
  // Split the attempt and solution into individual characters.
  const attemptParts = attempt.split("");
  const solutionParts = solution.split("");

  // Get the color classes for each attempt box (green, yellow, grey).
  const assignCharacterClasses = () => {
    if (isCurrentAttempt) return [];

    let classes: string[] = [];

    // Copy the solution Array so we can safely mutate it.
    const modifiedSolutionParts = [...solutionParts];

    // Do a first pass to mark off any correct boxes (green).
    // These are the only the ones that are an exact match in value
    // and placement.
    attemptParts.map((attemptPart, index) => {
      if (attemptPart === undefined) return;

      if (modifiedSolutionParts[index] === attemptPart) {
        classes[index] = "correct";
        // Remove these from the solution array so we don't incorrectly mark
        // any duplicate characters as different (yellow) in the next pass.
        modifiedSolutionParts[index] = "";
      }
    });

    // Do a second pass to check for any correct values with wrong
    // placements (yellow), otherwise mark as incorrect (grey).
    attemptParts.map((attemptPart, index) => {
      // Don't update any boxes that are empty or already correct.
      if (attemptPart === undefined || classes[index] === "correct") {
        return;
      }

      // Mark different (yellow) when the character exists in the solution
      // in the wrong place.
      if (modifiedSolutionParts.includes(attemptPart)) {
        classes[index] = "different";
        // Remove the character from the solution so we don't incorrectly mark
        // any duplicates.
        modifiedSolutionParts[modifiedSolutionParts.indexOf(attemptPart)] = "";
      } else {
        classes[index] = "incorrect";
      }
    });

    return classes;
  };
  const characterClasses: string[] = assignCharacterClasses();

  // Get a count for how many empty rows to display.
  const getEmptyBoxCount = () => {
    // All boxes are already filled in.
    if (attemptParts.length === ATTEMPT_LENGTH) return 0;

    return ATTEMPT_LENGTH - attemptParts.length;
  };

  //
  return (
    <div className="attempt-row">
      {attemptParts.map((character, index) => (
        <div
          className={"attempt-box " + characterClasses[index]}
          key={`${character}-${index}`}
        >
          {character ?? ""}
        </div>
      ))}

      {[...Array(getEmptyBoxCount())].map((v, i) => (
        <div className={"attempt-box"} key={i}></div>
      ))}
    </div>
  );
}

export default AttemptRow;
