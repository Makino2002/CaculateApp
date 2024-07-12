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

  // const handleButtonClick = (value) => {
  //   if (dem >= 9 && value !== "AC" && value !== "=") return;
  //   if (value === "AC") {
  //     resetCalculator();
  //   } else if (value === "+/-") {
  //     toggleSign();
  //   } else if (value === "%") {
  //     if (!isOperatorEntered) {
  //       setIsOperatorEntered(true);
  //       calculatePercentage();
  //     }
  //   } else if (value === "=") {
  //     if (!isOperatorEntered) {
  //       setIsOperatorEntered(true);
  //       evaluateExpression();
  //     }
  //     setDem(0); // Reset character count after evaluation
  //   } else if (["÷", "✕", "-", "+"].includes(value)) {
  //     const endsWithOperator = ["÷", "✕", "-", "+"].includes(display.slice(-1));
  //     if (endsWithOperator) {
  //       setDisplay((prev) => prev.slice(0, -1) + value); // Replace the last operator
  //       setOperator(value); // Update the current operator state
  //     } else {
  //       setOperator(value);
  //       setDisplay((prev) => prev + value);
  //     }
  //     setIsOperatorEntered(true);
  //     setDem(dem + 1);
  //     setCanEnterDot(true);
  //   } else if (value === ".") {
  //     if (canEnterDot && !isOperatorEntered) {
  //       setDisplay((prev) => prev + value);
  //       setCanEnterDot(false); // Không cho phép nhập dấu chấm lần nữa cho đến khi nhập số hoặc toán tử mới
  //       setDem(dem + 1);
  //       setIsOperatorEntered(true);
  //     }
  //   } else {
  //     if (display === "0" && value !== ".") {
  //       setDisplay(String(value));
  //       setDem(1); // Reset character count if the first number is entered
  //       setCanEnterDot(true);
  //     } else {
  //       setIsOperatorEntered(false);
  //       setDisplay((prev) => prev + String(value));
  //       setDem(dem + 1);
  //     }
  //   }
  // };
  const handleButtonClick = (value) => {
    if (dem >= 9 && value !== "AC" && value !== "=") return;

    if (value === "AC") {
      resetCalculator();
    } else if (value === "+/-") {
      toggleSign();
    } else if (value === "%") {
      if (!isOperatorEntered) {
        setIsOperatorEntered(true);
        calculatePercentage();
      }
    } else if (value === "=") {
      if (!isOperatorEntered) {
        setIsOperatorEntered(true);
        evaluateExpression();
      }
      setDem(0); // Reset character count after evaluation
    } else if (["÷", "✕", "-", "+"].includes(value)) {
      const endsWithOperator = ["÷", "✕", "-", "+"].includes(display.slice(-1));
      if (endsWithOperator) {
        setDisplay((prev) => prev.slice(0, -1) + value); // Replace the last operator
        setOperator(value); // Update the current operator state
      } else {
        setOperator(value);
        setDisplay((prev) => prev + value);
      }
      setIsOperatorEntered(true);
      setDem(dem + 1);
      setCanEnterDot(true);
    } else if (value === ".") {
      if (canEnterDot && !isOperatorEntered) {
        setDisplay((prev) => prev + value);
        setCanEnterDot(false); // Không cho phép nhập dấu chấm lần nữa cho đến khi nhập số hoặc toán tử mới
        setDem(dem + 1);
        setIsOperatorEntered(true);
      }
    } else {
      const lastCharIsOperator = ["÷", "✕", "-", "+"].includes(
        display.slice(-1)
      );
      const endsWithZeroAfterOperator =
        lastCharIsOperator && display.endsWith("0");
      console.log(endsWithZeroAfterOperator);
      console.log(display.endsWith("0"));
      console.log(lastCharIsOperator);

      if (endsWithZeroAfterOperator && value === "0") {
        // Ignore multiple '0's after an operator
        return;
      } else if (endsWithZeroAfterOperator) {
        // Replace the single '0' after the operator with the new value
        setDisplay((prev) => prev.slice(0, -1) + value);
        setDem(dem + 1);
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
    }
  };

  const formatDisplay = (value) => {
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const handleInputChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/,/g, ""); // Remove any existing commas for proper handling

    if (inputValue.length <= 9) {
      // Format the input value with thousands separator
      const formattedValue = formatDisplay(inputValue);
      setDisplay(formattedValue);
      setDem(formattedValue.replace(/,/g, "").length); // Count characters excluding commas
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
    setDisplay((prev) => {
      const currentValue = -1.0 * parseFloat(prev);
      return String(currentValue);
    });
  };

  const calculatePercentage = () => {
    setDisplay((prev) => {
      const bigValue = new Big(prev);
      return bigValue.div(100).toString();
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
      const result = safeEvaluate(sanitizedDisplay);
      console.log(result);

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

      if (operands[0] === "-") {
        operands.unshift("0");
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
