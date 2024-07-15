import { useState, useEffect } from "react";
import Big from "big.js";

const LOCAL_STORAGE_KEY = "calculatorHistory";

const CalculatorAPI = {
  getHistory: () => {
    const history = localStorage.getItem(LOCAL_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  },
  addHistory: (entry) => {
    const history = CalculatorAPI.getHistory();
    history.push(entry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  },
  clearHistory: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
};

const useCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState(CalculatorAPI.getHistory());
  const [operator, setOperator] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dem, setDem] = useState(0);
  const [isOperatorEntered, setIsOperatorEntered] = useState(false);
  const [canEnterDot, setCanEnterDot] = useState(true);
  const [hasEvaluated, setHasEvaluated] = useState(false); // State to track if "=" has been pressed
  const [lastValue, setLastValue] = useState(null); // Store the last entered value
  const [resetErr, setResetErr] = useState(false);

  const handleButtonClick = (value) => {
    if (value === "AC") {
      resetCalculator("0");
    } else if (value === "+/-") {
      if (resetErr) {
        resetCalculator("0");
        setResetErr(false);
      }
      toggleSign();
    } else if (value === "%") {
      if (resetErr) {
        resetCalculator("0");
        setResetErr(false);
      }
      handlePercentage();
    } else if (value === "=") {
      if (resetErr) {
        resetCalculator("0");
        setResetErr(false);
      }
      if (!isOperatorEntered) {
        setIsOperatorEntered(true);
        evaluateExpression();
      } else if (lastValue && operator) {
        setDisplay((prev) => prev + operator + lastValue);
        evaluateExpression();
      } else {
        resetCalculator("0");
      }
      setHasEvaluated(true);
      setDem(0); // Reset character count after evaluation
    } else if (["÷", "✕", "-", "+"].includes(value)) {
      if (resetErr) {
        resetCalculator("0");
        setResetErr(false);
      }
      const endsWithOperator = ["÷", "✕", "-", "+"].includes(display.slice(-1));
      if (endsWithOperator) {
        setDisplay((prev) => prev.slice(0, -1) + value); // Replace the last operator
        setOperator(value); // Update the current operator state
      } else {
        setOperator(value);
        setLastValue(display); // Store the last value before the operator
        setDisplay((prev) => prev + value);
      }

      setIsOperatorEntered(true);
      setDem(dem + 1);
      setCanEnterDot(true);
      setHasEvaluated(false); // Reset after operator input
    } else if (value === ".") {
      if (resetErr) {
        resetCalculator("0");
        setResetErr(false);
      }
      if (canEnterDot && !isOperatorEntered) {
        setDisplay((prev) => prev + value);
        setCanEnterDot(false); // Không cho phép nhập dấu chấm lần nữa cho đến khi nhập số hoặc toán tử mới
        setDem(dem + 1);
        setIsOperatorEntered(true);
        setHasEvaluated(false); // Reset after dot input
      }
      if (canEnterDot && isOperatorEntered) {
        setDisplay((prev) => prev + value);
        setCanEnterDot(false); // Không cho phép nhập dấu chấm lần nữa cho đến khi nhập số hoặc toán tử mới
        setDem(dem + 1);
        setIsOperatorEntered(true);
        setHasEvaluated(false); // Reset after dot input
      }
    } else {
      if (hasEvaluated) {
        resetCalculator("");
        setHasEvaluated(false);
      }
      if (resetErr) {
        resetCalculator("");
        setResetErr(false);
      }
      if (display === "0" && value !== ".") {
        setDisplay(String(value));
        setDem(1); // Reset character count if the first number is entered
        setCanEnterDot(true);
      } else {
        setDisplay((prev) => prev + String(value));
        setDem(dem + 1);
      }
    }
  };

  // const handlePercentage = () => {
  //   setDisplay((prev) => {
  //     const endsWithOperator = ["÷", "✕", "-", "+"].includes(prev.slice(-1));
  //     const lastChar = prev[prev.length - 1];
  //     if (endsWithOperator) {
  //       // Handle cases like "8+%"
  //       const operatorIndex = prev.length - 1;
  //       const numberBeforeOperator = prev.slice(0, operatorIndex);
  //       const bigValue = new Big(numberBeforeOperator);
  //       const percentageValue = bigValue
  //         .times(numberBeforeOperator / 100)
  //         .toString();
  //       if (lastChar === "-" || lastChar === "+") {
  //         const percentageValue = bigValue
  //           .times(numberBeforeOperator / 100)
  //           .toString();
  //       }
  //       if (lastChar === "✕" || lastChar === "÷") {
  //         const percentageValue = bigValue.times(1 / 100).toString();
  //       }
  //       return numberBeforeOperator + prev[operatorIndex] + percentageValue;
  //     } else {
  //       // Handle cases like "8%"
  //       const bigValue = new Big(prev);
  //       return bigValue.div(100).toString();
  //     }
  //   });
  // };
  const handlePercentage = () => {
    setDisplay((prev) => {
      const endsWithOperator = ["÷", "✕", "-", "+"].includes(prev.slice(-1));
      const lastChar = prev[prev.length - 1];
      console.log(lastChar);
      if (endsWithOperator) {
        // Handle cases like "8+%"
        const operatorIndex = prev.length - 1;
        const numberBeforeOperator = prev.slice(0, operatorIndex);
        const bigValue = new Big(numberBeforeOperator);

        // return numberBeforeOperator + prev[operatorIndex] + percentageValue;
        if (lastChar === "+" || lastChar === "-") {
          const percentageValue = bigValue
            .times(numberBeforeOperator / 100)
            .toString();
          return numberBeforeOperator + prev[operatorIndex] + percentageValue;
        }
        if (lastChar === "✕" || lastChar === "÷") {
          const percentageValue = bigValue.times(1 / 100).toString();
          return numberBeforeOperator + prev[operatorIndex] + percentageValue;
        }
      } else {
        // Handle cases like "8%"
        const bigValue = new Big(prev);
        return bigValue.div(100).toString();
      }
    });
  };

  const formatDisplay = (value) => {
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const handleInputChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/,/g, ""); // Remove any existing commas for proper handling

    // if (inputValue.length <= 9) {
    //   // Format the input value with thousands separator
    //   const formattedValue = formatDisplay(inputValue);
    //   setDisplay(formattedValue);
    //   setDem(formattedValue.replace(/,/g, "").length); // Count characters excluding commas
    // }
  };

  const resetCalculator = (value) => {
    setHasEvaluated(true);
    setDisplay(value);
    setOperator("");
    setIsOperatorEntered(false);
    setCanEnterDot(true);
    setDem(0);
    setLastValue(null); // Reset last value
  };

  const toggleSign = () => {
    setDisplay((prev) => {
      const currentValue = -1.0 * parseFloat(prev);
      return String(currentValue);
    });
  };

  const evaluateExpression = () => {
    try {
      const sanitizedDisplay = display
        .replace(/÷/g, "/")
        .replace(/✕/g, "*")
        .trim();
      if (!/^[\d+\-*/.() ]+$/.test(sanitizedDisplay)) {
        throw new Error("Invalid characters in expression");
      }
      let result = safeEvaluate(sanitizedDisplay);

      // Only add to history if the expression contains an operator
      if (/[\+\-\*/]/.test(sanitizedDisplay)) {
        const entry = `${display} = ${result}`;
        setHistory((prev) => [...prev, entry]);
        CalculatorAPI.addHistory(entry);
      }

      // Convert result to scientific notation if it exceeds 9 characters
      if (result.length > 9) {
        result = new Big(result).toExponential(2).toString();
      }

      setDisplay(String(result));
      setIsOperatorEntered(false);
      setLastValue(result); // Store the result for repeat operation
    } catch (error) {
      setDisplay("Error");
      setResetErr(true);
      console.error("Error evaluating expression:", error);
    }
  };

  const safeEvaluate = (expression) => {
    try {
      const operands = expression.split(/([+\-*/])/).filter(Boolean);
      if (operands[0] === "-") {
        operands.unshift("0");
      }
      const lastChar = expression[expression.length - 1];
      const oper = ["+", "-", "*", "/"];
      if (oper.includes(lastChar)) {
        operands.push(operands[0]);
      }
      // Function to process multiplication and division first
      const processMultiplicationAndDivision = (arr) => {
        const newArr = [];
        let i = 0;
        while (i < arr.length) {
          if (arr[i] === "*") {
            const prev = newArr.pop();
            newArr.push(new Big(prev).times(new Big(arr[i + 1])).toString());
            i += 2;
          } else if (arr[i] === "/") {
            const prev = newArr.pop();
            newArr.push(new Big(prev).div(new Big(arr[i + 1])).toString());
            i += 2;
          } else {
            newArr.push(arr[i]);
            i++;
          }
        }
        return newArr;
      };

      // Function to process addition and subtraction
      const processAdditionAndSubtraction = (arr) => {
        let result = new Big(arr[0]);
        for (let i = 1; i < arr.length; i += 2) {
          const operator = arr[i];
          const operand = new Big(arr[i + 1]);

          switch (operator) {
            case "+":
              result = result.plus(operand);
              break;
            case "-":
              result = result.minus(operand);
              break;
            default:
              throw new Error("Invalid operator");
          }
        }
        return result.toString();
      };

      // First pass: Process multiplication and division
      const afterMulDiv = processMultiplicationAndDivision(operands);

      // Second pass: Process addition and subtraction
      const finalResult = processAdditionAndSubtraction(afterMulDiv);

      return finalResult;
    } catch (error) {
      throw new Error("Invalid expression");
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      CalculatorAPI.clearHistory();
    }
  }, [history]);

  return {
    display: formatDisplay(display),
    isEditing,
    history,
    handleButtonClick,
    handleInputChange,
    setIsEditing,
  };
};

export default useCalculator;
