import AttemptRow from "./row";

import { NUM_ATTEMPTS } from "../constants";

// Container for the user's attempted equations.
function AttemptContainer({
  currentAttempt,
  attempts,
  solution,
}: {
  currentAttempt: string[];
  attempts: string[];
  solution: string;
}) {
  // Get a count for how many empty rows to display.
  const getEmptyRowCount = () => {
    // All rows are already filled in.
    if (attempts.length === NUM_ATTEMPTS) return 0;

    return NUM_ATTEMPTS - 1 - attempts.length;
  };

  //
  return (
    <div>
      {attempts.map((attempt, index) => (
        <AttemptRow
          attempt={attempt}
          solution={solution}
          isCurrentAttempt={false}
          key={`${attempt}-${index}`}
        />
      ))}

      {/* Add a row for the current attempt as long as the attempt rows 
          aren't already completed. */}
      {attempts.length !== NUM_ATTEMPTS ? (
        <AttemptRow
          attempt={currentAttempt.join("")}
          solution={solution}
          isCurrentAttempt={true}
          key={`${currentAttempt.join("")}-current`}
        />
      ) : null}

      {/* Add empty rows at the bottom to add up to the number of
          allowed attempts. */}
      {[...Array(getEmptyRowCount())].map((v, i) => (
        <AttemptRow
          attempt={""}
          solution={solution}
          isCurrentAttempt={false}
          key={`empty-attempt-${i}`}
        />
      ))}
    </div>
  );
}

export default AttemptContainer;
