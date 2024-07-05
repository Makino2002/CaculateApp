import React from "react";
import Calculator from "./components/Calculator";

const App = () => {
  return (
    <div className="App">
      <button className="icon Red"></button>
      <button className="icon Yellow"></button>
      <button className="icon Blue"></button>
      <Calculator />
    </div>
  );
};

export default App;
