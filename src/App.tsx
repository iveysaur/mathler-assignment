import { useState, useEffect } from "react";
import "./App.css";

import InputContainer from "./Input/container";
import AttemptContainer from "./Attempt/container";

import {
  SOLUTION,
  NUM_ATTEMPTS,
  ATTEMPT_LENGTH,
  ALLOWABLE_INPUT,
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
    const input = e.key === "Backspace" ? "Delete" : e.key;
    if (!ALLOWABLE_INPUT.test(input)) return;
    handleInputClick(input);
  };

  //
  const handleInputClick = (input: string) => {
    if (correct || attempts.length === NUM_ATTEMPTS) return;

    setIncorrectEval(false);
    if (input === "Enter") {
      if (currentAttempt.length !== ATTEMPT_LENGTH) return;
      if (eval(currentAttempt.join("")) === eval(SOLUTION)) {
        if (currentAttempt.join("") !== SOLUTION) {
          setAttempts(attempts.concat(SOLUTION));
          setCurrentInput([]);
          setCorrect(true);
          return;
        }
        setAttempts(attempts.concat(currentAttempt.join("")));
        setCurrentInput([]);
        setCorrect(true);
        return;
      }
      if (eval(currentAttempt.join("")) !== eval(SOLUTION)) {
        setIncorrectEval(true);
        return;
      }
      setAttempts(attempts.concat(currentAttempt.join("")));
      setCurrentInput([]);
      if (attempts.length === NUM_ATTEMPTS - 1) setIncorrectFinish(true);
      return;
    }
    if (input === "Delete") {
      setCurrentInput(currentAttempt.slice(0, -1));
      return;
    }
    if (currentAttempt.length >= 6) return;

    setCurrentInput(currentAttempt.concat(input));
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
