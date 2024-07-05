import React from "react";
import Button from "./button";
import Display from "./Display";
import History from "./History";
import useCalculator from "../hooks/useCalculator";

const Calculator = () => {
  const {
    display,
    isEditing,
    history,
    handleButtonClick,
    handleInputChange,
    setIsEditing,
  } = useCalculator();

  return (
    <div className="calculator">
      <Display
        value={display}
        onClick={() => setIsEditing(true)}
        onChange={handleInputChange}
        isEditing={isEditing}
        onBlur={() => setIsEditing(false)}
      />
      <div className="calculator-buttons">
        {[
          "AC",
          "+/-",
          "%",
          "÷",
          7,
          8,
          9,
          "✕",
          4,
          5,
          6,
          "-",
          1,
          2,
          3,
          "+",
          0,
          ".",
          "=",
        ].map((btn, i) => (
          <Button
            key={i}
            className={
              btn === 0
                ? "zero number"
                : typeof btn === "number"
                ? "number"
                : ["+", "-", "✕", "÷"].includes(btn)
                ? "operator"
                : btn === "="
                ? "equal operator"
                : btn === "."
                ? "number"
                : "other"
            }
            label={btn}
            onClick={handleButtonClick}
          />
        ))}
      </div>
      <History history={history} />
    </div>
  );
};

export default Calculator;
