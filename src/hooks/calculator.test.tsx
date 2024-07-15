import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Calculator from "../components/Calculator"; // Adjust the import to your file structure
import "@testing-library/jest-dom/extend-expect";
describe("Calculator", () => {
  test("UI Check", () => {
    const { container } = render(<Calculator />);
    expect(container).toMatchSnapshot();
  });

  test("Clear Functionality", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonAC = getByText("AC");
    const buttonOne = getByText("1");

    fireEvent.click(buttonOne);
    expect(display).toHaveTextContent("1");

    fireEvent.click(buttonAC);
    expect(display).toHaveTextContent("0");
  });

  test("Addition Operation", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonOne = getByText("1");
    const buttonTwo = getByText("2");
    const buttonAdd = getByText("+");
    const buttonEquals = getByText("=");

    fireEvent.click(buttonOne);
    fireEvent.click(buttonAdd);
    fireEvent.click(buttonTwo);
    fireEvent.click(buttonEquals);

    expect(display).toHaveTextContent("3");
  });

  test("Addition Without Operands", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonAdd = getByText("+");
    const buttonEquals = getByText("=");

    fireEvent.click(buttonAdd);
    fireEvent.click(buttonEquals);

    expect(display).toHaveTextContent("0");
  });

  test("Addition with Missing Second Operand", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonTwo = getByText("2");
    const buttonAdd = getByText("+");
    const buttonEquals = getByText("=");

    fireEvent.click(buttonTwo);
    fireEvent.click(buttonAdd);
    fireEvent.click(buttonEquals);

    expect(display).toHaveTextContent("4");
  });

  test("Subtraction Operation", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonThree = getByText("3");
    const buttonOne = getByText("1");
    const buttonSubtract = getByText("-");
    const buttonEquals = getByText("=");

    fireEvent.click(buttonThree);
    fireEvent.click(buttonSubtract);
    fireEvent.click(buttonOne);
    fireEvent.click(buttonEquals);

    expect(display).toHaveTextContent("2");
  });

  test("Division by Zero", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonFive = getByText("5");
    const buttonZero = getByText("0");
    const buttonDivide = getByText("÷");
    const buttonEquals = getByText("=");

    fireEvent.click(buttonFive);
    fireEvent.click(buttonDivide);
    fireEvent.click(buttonZero);
    fireEvent.click(buttonEquals);

    expect(display).toHaveTextContent("Error");
  });

  test("Multiple Decimal Points", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonOne = getByText("1");
    const buttonDot = getByText(".");

    fireEvent.click(buttonOne);
    fireEvent.click(buttonDot);
    fireEvent.click(buttonOne);
    fireEvent.click(buttonDot);

    expect(display).toHaveTextContent("1.1");
  });

  test("New Entry After Calculation", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonTwo = getByText("2");
    const buttonAdd = getByText("+");
    const buttonEquals = getByText("=");
    const buttonThree = getByText("3");

    fireEvent.click(buttonTwo);
    fireEvent.click(buttonAdd);
    fireEvent.click(buttonTwo);
    fireEvent.click(buttonEquals);
    expect(display).toHaveTextContent("4");

    fireEvent.click(buttonThree);
    expect(display).toHaveTextContent("3");
  });

  test("Toggle Sign Operation", () => {
    const { getByText, getByTestId } = render(<Calculator />);

    const display = getByTestId("calculator-display");
    const buttonOne = getByText("1");
    const buttonToggle = getByText("+/-");

    fireEvent.click(buttonOne);
    fireEvent.click(buttonToggle);
    expect(display).toHaveTextContent("-1");

    fireEvent.click(buttonToggle);
    expect(display).toHaveTextContent("1");
  });
});
