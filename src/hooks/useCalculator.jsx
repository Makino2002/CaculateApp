import { useState, useEffect } from "react";
import CalculatorAPI from "../api/CalculatorAPI";

const useCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState(CalculatorAPI.getHistory());
  const [operator, setOperator] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isOperatorEntered, setIsOperatorEntered] = useState(false); // Track if an operator has been entered

  const handleButtonClick = (value) => {
    if (value === "AC") {
      resetCalculator();
    } else if (value === "+/-") {
      toggleSign();
    } else if (value === "%") {
      calculatePercentage();
    } else if (value === "=") {
      evaluateExpression();
    } else if (["÷", "✕", "-", "+"].includes(value)) {
      // Only add the operator if one has not already been entered
      if (!isOperatorEntered) {
        setOperator(value);
        setDisplay((prev) => prev + value);
        setIsOperatorEntered(true);
      }
    } else {
      // Clear the previous result if a new number is entered after "="
      if (display === "0" && value !== ".") {
        setDisplay(String(value));
      } else {
        setDisplay((prev) => prev + String(value));
      }
      setIsOperatorEntered(false); // Reset operator tracking if a number is entered
    }
  };

  const handleInputChange = (event) => {
    setDisplay(event.target.value);
  };

  const resetCalculator = () => {
    setDisplay("0");
    setOperator("");
    setIsOperatorEntered(false); // Reset operator tracking
  };

  const toggleSign = () => {
    setDisplay((prev) => String(-1.0 * parseFloat(prev)));
  };

  const calculatePercentage = () => {
    setDisplay((prev) => String(parseFloat(prev) / 100));
  };

  const evaluateExpression = () => {
    try {
      // Replace symbols with JavaScript operators
      const sanitizedDisplay = display.replace(/÷/g, "/").replace(/✕/g, "*");

      // Validate the input before evaluation
      if (!/^[\d+\-*/.() ]+$/.test(sanitizedDisplay)) {
        throw new Error("Invalid characters in expression");
      }

      // Check if the input is a simple number
      if (!isNaN(sanitizedDisplay)) {
        const result = parseFloat(sanitizedDisplay);
        const entry = `${display} = ${result}`;
        setHistory((prev) => [...prev, entry]);
        setDisplay(String(result));
        CalculatorAPI.addHistory(entry);
        return;
      }

      // Evaluate the expression safely
      const result = safeEvaluate(sanitizedDisplay);
      const entry = `${display} = ${result}`;
      setHistory((prev) => [...prev, entry]);
      setDisplay(String(result));
      CalculatorAPI.addHistory(entry);
      setIsOperatorEntered(false); // Allow new operator entry after evaluation
    } catch (error) {
      setDisplay("Error");
      console.error("Error evaluating expression:", error);
    }
  };

  // Safe evaluation function to replace `eval`
  const safeEvaluate = (expression) => {
    try {
      // Use Function constructor for safer evaluation
      return Function('"use strict"; return (' + expression + ")")();
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
