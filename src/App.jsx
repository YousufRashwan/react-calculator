// I should relearn regex, this is a mess!

import { useState, useEffect } from "react";

const buttons = [
  { id: "clear", text: "AC", type: "clear" },
  { id: "divide", text: "/", type: "operation" },
  { id: "multiply", text: "*", type: "operation" },
  { id: "seven", text: "7", type: "number" },
  { id: "eight", text: "8", type: "number" },
  { id: "nine", text: "9", type: "number" },
  { id: "subtract", text: "-", type: "operation" },
  { id: "four", text: "4", type: "number" },
  { id: "five", text: "5", type: "number" },
  { id: "six", text: "6", type: "number" },
  { id: "add", text: "+", type: "operation" },
  { id: "one", text: "1", type: "number" },
  { id: "two", text: "2", type: "number" },
  { id: "three", text: "3", type: "number" },
  { id: "equals", text: "=", type: "equals" },
  { id: "zero", text: "0", type: "number" },
  { id: "decimal", text: ".", type: "decimal" },
];

const isOperation = (char) => {
  if (char === "+" || char === "*" || char === "/" || char === "-") {
    return true;
  }
  return false;
};

const App = () => {
  const [input, setInput] = useState("0");
  const [eq, setEq] = useState("");
  const [limit, setLimit] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    if (limit) {
      setTimeout(() => setLimit(""), 1000);
    }
  }, [limit]);

  const handleButtonClick = ({ id, type, text }) => {
    if (type === "clear") {
      setInput("0");
      setEq("");
    }
    if (result && type === "operation") {
      setEq(result + text);
      setInput(text);
      setResult("");
      return;
    }
    if (result && type === "number") {
      setEq(text);
      setInput(text);
      setResult("");
      return;
    }
    if (id === "zero") {
      if (input.length === 12) {
        setLimit("Digit Limit Met");
        return;
      }
      if (eq === "0") {
        return;
      } else if (!eq) {
        setEq("0");
      } else if (input === "0") {
        return;
      } else if (input !== 0 && !isOperation(input)) {
        setInput((prevInput) => prevInput + "0");
        setEq((prevEq) => prevEq + "0");
      }
      return;
    }
    if (type === "number") {
      if (input.length === 12) {
        setLimit("Digit Limit Met");
        return;
      }
      setEq((prevEq) => {
        return prevEq !== "0" ? prevEq + text : text;
      });
      if (input === "0" || isOperation(input)) {
        setInput(text);
      } else {
        setInput((prevInput) => prevInput + text);
      }
    }
    if (!eq && type === "operation") {
      setInput(text);
      setEq("0" + text);
      return;
    }
    if (id === "subtract") {
      if (eq.length >= 2) {
        if (
          !isOperation(eq[eq.length - 2]) ||
          !isOperation(eq[eq.length - 1])
        ) {
          setEq((prevEq) => prevEq + "-");
        }
      } else if (eq.length === 1) {
        setEq((prevEq) => prevEq + "-");
      }
      setInput("-");
    }
    if (type === "operation" && id !== "subtract") {
      if (eq.length >= 3 && eq[eq.length - 1] === "-") {
        setEq((prevEq) => {
          const newEq = prevEq.slice(0, prevEq.length - 2) + text;
          return newEq;
        });
      } else if (eq.length && isOperation(eq[eq.length - 1])) {
        setEq((prevEq) => {
          const newEq = prevEq.slice(0, prevEq.length - 1) + text;
          return newEq;
        });
      } else {
        setEq((prevEq) => prevEq + text);
      }
      setInput(text);
    }
    if (type === "decimal") {
      if (isOperation(input)) {
        setInput("0.");
        setEq((prevEq) => prevEq + "0.");
      } else {
        if (!input.includes(".")) {
          setInput((prevInput) => prevInput + ".");
          setEq((prevEq) => (!prevEq ? "0." : prevEq + "."));
        }
      }
    }
    if (type === "equals") {
      let eqCopy = eq.slice(0);
      while (isOperation(eqCopy[eqCopy.length - 1])) {
        eqCopy = eqCopy.slice(0, eqCopy.length - 1);
      }
      let processedEq = eqCopy
        .replace(/--/g, "-(-")
        .replace(/(\(-\d+)/g, "$1)");
      let res = eval(processedEq).toString();

      // in case you need to make result shorter
      // if (res.includes(".")) {
      //   console.log(res);
      //   const decimalPart = res.split(".")[1];
      //   console.log(decimalPart);
      //   if (decimalPart.length > 4) {
      //     res = parseFloat(res);
      //     res = res.toPrecision(4);
      //     console.log("hey");
      //   }
      // }

      setEq((prevEq) => prevEq + "=" + res);
      setInput(res);
      setResult(res);
    }
  };

  const renderedButtons = buttons.map((button) => (
    <button
      key={button.id}
      id={button.id}
      className={`${button.id} ${
        (button.type === "number" || button.type === "operation") && button.type
      }`}
      onClick={() => handleButtonClick(button)}
    >
      {button.text}
    </button>
  ));
  return (
    <div className="container">
      <div id="equation" className="equation">
        {eq}
      </div>
      <div id="display" className="display">
        {limit || input}
      </div>
      <div className="grid__container">{renderedButtons}</div>
    </div>
  );
};

export default App;
