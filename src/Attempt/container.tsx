import AttemptRow from "./row";

import { NUM_ATTEMPTS } from "../constants";

//
function AttemptContainer({
  currentAttempt,
  attempts,
  solution,
}: {
  currentAttempt: string[];
  attempts: string[];
  solution: string;
}) {
  const getEmptyRowCount = () => {
    if (attempts.length === NUM_ATTEMPTS) return 0;
    if (attempts.length === 0 && currentAttempt.length === 0) {
      return NUM_ATTEMPTS - 1;
    }
    if (currentAttempt.length > 0) {
      return NUM_ATTEMPTS - attempts.length - 1;
    }
    return NUM_ATTEMPTS - 1 - attempts.length;
  };

  //
  return (
    <div>
      {attempts.length > 0 ? (
        <div>
          {attempts.map((attempt) => (
            <AttemptRow
              attempt={attempt}
              solution={solution}
              isCurrentInput={false}
              key={attempt}
            />
          ))}
        </div>
      ) : null}

      {attempts.length !== NUM_ATTEMPTS && currentAttempt ? (
        <AttemptRow
          attempt={currentAttempt.join("")}
          solution={solution}
          isCurrentInput={true}
          key={currentAttempt.join("")}
        />
      ) : null}

      {[...Array(getEmptyRowCount())].map((v, i) => (
        <AttemptRow
          attempt={""}
          solution={solution}
          isCurrentInput={false}
          key={`empty-attempt-${i}`}
        />
      ))}
    </div>
  );
}

export default AttemptContainer;
