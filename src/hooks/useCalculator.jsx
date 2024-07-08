import { useState, useEffect } from "react";
import CalculatorAPI from "../api/CalculatorAPI";
import Big from "big.js";

const useCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState(CalculatorAPI.getHistory());
  const [operator, setOperator] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dem, setDem] = useState(0);
  const [isOperatorEntered, setIsOperatorEntered] = useState(false);
  const [canEnterDot, setCanEnterDot] = useState(true);
  const handleButtonClick = (value) => {
    if (dem >= 9 && value !== "AC" && value !== "=") return;
    if (value === "AC") {
      resetCalculator();
    } else if (value === "+/-") {
      toggleSign();
    } else if (value === "%") {
      calculatePercentage();
    } else if (value === "=") {
      if (!isOperatorEntered) {
        setIsOperatorEntered(true);
        evaluateExpression();
      }
      setDem(0); // Reset character count after evaluation
    } else if (["÷", "✕", "-", "+"].includes(value)) {
      if (!isOperatorEntered) {
        setOperator(value);
        setDisplay((prev) => prev + value);
        setIsOperatorEntered(true);
        setDem(dem + 1);
        setCanEnterDot(true);
      }
    } else if (value === ".") {
      if (canEnterDot && !isOperatorEntered) {
        setDisplay((prev) => prev + value);
        setCanEnterDot(false); // Không cho phép nhập dấu chấm lần nữa cho đến khi nhập số hoặc toán tử mới
        setDem(dem + 1);
        setIsOperatorEntered(true);
      }
    } else {
      if (display === "0" && value !== ".") {
        setDisplay(String(value));
        setDem(1); // Reset character count if the first number is entered
        setCanEnterDot(true);
      } else {
        setIsOperatorEntered(false);
        setDisplay((prev) => prev + String(value));
        setDem(dem + 1);
      }
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 9) {
      setDisplay(inputValue);
      setDem(inputValue.length);
    }
  };

  const resetCalculator = () => {
    setDisplay("0");
    setOperator("");
    setIsOperatorEntered(false);
    setCanEnterDot(true);
    setDem(0);
  };

  const toggleSign = () => {
    setDisplay((prev) => String(-1.0 * parseFloat(prev)));
  };

  const calculatePercentage = () => {
    setDisplay((prev) => {
      const bigValue = new Big(prev);
      return bigValue.div(100).toString();
    });
  };
  const evaluateExpression = () => {
    try {
      const sanitizedDisplay = display.replace(/÷/g, "/").replace(/✕/g, "*");
      if (!/^[\d+\-*/.() ]+$/.test(sanitizedDisplay)) {
        throw new Error("Invalid characters in expression");
      }
      const result = safeEvaluate(sanitizedDisplay);
      const entry = `${display} = ${result}`;
      setHistory((prev) => [...prev, entry]);
      setDisplay(String(result));
      CalculatorAPI.addHistory(entry);
      setIsOperatorEntered(false);
    } catch (error) {
      setDisplay("Error");
      console.error("Error evaluating expression:", error);
    }
  };

  const safeEvaluate = (expression) => {
    try {
      const operands = expression.split(/([+\-*/])/).filter(Boolean);
      let bigResult = new Big(operands[0]);
      for (let i = 1; i < operands.length; i += 2) {
        const operator = operands[i];
        const operand = new Big(operands[i + 1]);

        switch (operator) {
          case "+":
            bigResult = bigResult.plus(operand);
            break;
          case "-":
            bigResult = bigResult.minus(operand);
            break;
          case "*":
            bigResult = bigResult.times(operand);
            break;
          case "/":
            bigResult = bigResult.div(operand);
            break;
          default:
            throw new Error("Invalid operator");
        }
      }
      return bigResult.toString();
    } catch {
      throw new Error("Invalid expression");
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      CalculatorAPI.clearHistory();
    }
  }, [history]);

  return {
    display,
    isEditing,
    history,
    handleButtonClick,
    handleInputChange,
    setIsEditing,
  };
};

export default useCalculator;
