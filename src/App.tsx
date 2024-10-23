import { useState, useEffect } from "react";
import "./App.css";

import InputContainer from "./Input/container";
import AttemptContainer from "./Attempt/container";

import {
  SOLUTION,
  NUM_ATTEMPTS,
  ATTEMPT_LENGTH,
  ALLOWABLE_INPUT,
  OPERATORS,
} from "./constants";

//
function App() {
  const [attempts, setAttempts] = useState<string[]>([]);
  const [currentAttempt, setCurrentInput] = useState<string[]>([]);
  const [incorrectEval, setIncorrectEval] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [incorrectFinish, setIncorrectFinish] = useState(false);

  //
  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardPress, false);

    return () => {
      document.removeEventListener("keydown", handleKeyboardPress, false);
    };
  }, [currentAttempt]);

  //
  const handleKeyboardPress = (e: any) => {
    // The event key for Delete is "Backspace", convert it to match
    // what is used in the rest of the app.
    const input = e.key === "Backspace" ? "Delete" : e.key;

    // Check that the keyboard input is one of the valid input options.
    if (!ALLOWABLE_INPUT.test(input)) return;

    handleInputClick(input);
  };

  //
  const handleInputClick = (input: string) => {
    // Ignore any inputs after the game is done.
    if (correct || attempts.length === NUM_ATTEMPTS) return;

    // Reset the incorrect eval message once the attempt changes.
    setIncorrectEval(false);

    switch (input) {
      case "Enter":
        handleEnter();
        break;
      case "Delete":
        setCurrentInput(currentAttempt.slice(0, -1));
        break;
      default:
        // Ignore any inputs after the attempt is full.
        if (currentAttempt.length >= ATTEMPT_LENGTH) return;
        setCurrentInput(currentAttempt.concat(input));
        break;
    }
  };

  //
  const handleEnter = () => {
    // Don't allow incomplete attempts, invalid evals (errors), and
    // attempts with invalid zeros.
    if (
      currentAttempt.length !== ATTEMPT_LENGTH ||
      !isValidEval(currentAttempt) ||
      hasInvalidZero(currentAttempt)
    ) {
      return;
    }

    if (isCommutative([...currentAttempt])) {
      // When the equation is correct but in a different order.
      if (currentAttempt.join("") !== SOLUTION) {
        // Reorder to match the expected equation.
        setAttempts(attempts.concat(SOLUTION));
        setCurrentInput([]);
        setCorrect(true);
        return;
      }

      // When the equation is an exact match.
      setAttempts(attempts.concat(currentAttempt.join("")));
      setCurrentInput([]);
      setCorrect(true);
      return;
    }

    // Don't allow attempts that do not evaluate to the correct number.
    if (eval(currentAttempt.join("")) !== eval(SOLUTION)) {
      setIncorrectEval(true);
      return;
    }

    // Update the attempt list since this attempt is valid but incorrect.
    setAttempts(attempts.concat(currentAttempt.join("")));
    setCurrentInput([]);

    // If this was the last attempt, end the game with a loss.
    if (attempts.length === NUM_ATTEMPTS - 1) setIncorrectFinish(true);
    return;
  };

  // Check if an attempt is commutative with the solution.
  // This can give a false positive in the very rare case that an
  // attempt has all the right values but technically is a different equation.
  // Ex: 11+1*1 and 11*1+1.
  // I decided to allow these cases, I am not sure what the original
  // Mathler does in these cases since it is too rare to get a chance to test
  // it myself on their end.
  const isCommutative = (attempt: string[]) => {
    const sameEval = eval(attempt.join("")) === eval(SOLUTION);
    const sameCharacters =
      attempt.sort().join("") === SOLUTION.split("").sort().join("");

    return sameEval && sameCharacters;
  };

  //
  const hasInvalidZero = (attempt: string[]) => {
    if (attempt[0] === "0") return true;

    return (
      attempt.filter((character, index) => {
        if (index === 0 || index === ATTEMPT_LENGTH - 1) return;

        const zeroFollowsOperator =
          character === "0" && OPERATORS.includes(attempt[index - 1]);
        const operatorFollowsZero =
          character === "0" && OPERATORS.includes(attempt[index + 1]);
        return zeroFollowsOperator && !operatorFollowsZero;
      }).length > 0
    );
  };

  // Catch and disallow any evals that would error.
  const isValidEval = (attempt: string[]) => {
    try {
      eval(attempt.join(""));
      return true;
    } catch (e: any) {
      return false;
    }
  };

  //
  return (
    <div className="App">
      <div className="title">Mathler</div>
      <div className="problem">
        Find the hidden calculation{" "}
        <span className="highlight">that equals {eval(SOLUTION)}</span>
      </div>

      <AttemptContainer
        currentAttempt={currentAttempt}
        attempts={attempts}
        solution={SOLUTION}
      />
      <InputContainer
        attempts={attempts}
        solution={SOLUTION}
        handleInputClick={handleInputClick}
      />

      {incorrectEval ? (
        <div className="evalNote">
          Solution must equal{" "}
          <span className="highlight">{eval(SOLUTION)}</span>, please try again.
        </div>
      ) : null}

      {correct ? <div className="evalNote">You got it!</div> : null}

      {incorrectFinish ? (
        <div className="evalNote">
          Sorry you didn't get it. The answer was{" "}
          <span className="highlight">{SOLUTION}</span>.
        </div>
      ) : null}
    </div>
  );
}

export default App;
