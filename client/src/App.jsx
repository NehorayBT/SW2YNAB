import { useState, useEffect, createContext } from "react";
import StepManager from "./components/StepManager";
import "./style.css";

export const GlobalContext = createContext();

function App() {
  // managing all the state of the App
  const [step, setStep] = useState("splitwise_login");
  const [swType, setSwType] = useState("");
  const [swId, setSwId] = useState("");
  const [swStartDate, setSwStartDate] = useState("");
  const [swEndDate, setSwEndDate] = useState("");
  const [swLimit, setSwLimit] = useState("");
  const [swExpenses, setSwExpenses] = useState([]);
  const [ynabAccountId, setYnabAccountId] = useState("");
  const [ynabBudgetId, setYnabBudgetId] = useState("");

  // wrapping in a GlobalContext provider
  return (
    <GlobalContext.Provider
      value={{
        step,
        setStep,
        swType,
        setSwType,
        swId,
        setSwId,
        swStartDate,
        setSwStartDate,
        swEndDate,
        setSwEndDate,
        swLimit,
        setSwLimit,
        swExpenses,
        setSwExpenses,
        ynabAccountId,
        setYnabAccountId,
        ynabBudgetId,
        setYnabBudgetId,
      }}
    >
      <StepManager />
    </GlobalContext.Provider>
  );
}

export default App;
