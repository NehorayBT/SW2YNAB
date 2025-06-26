import { useState, createContext } from "react";
import StepManager from "./components/StepManager";
import "./style.css";

export const GlobalContext = createContext();

function App() {
  const [step, setStep] = useState("splitwise_login");
  const [swType, setSwType] = useState("");
  const [swId, setSwId] = useState("");
  const [swStartDate, setSwStartDate] = useState("");
  const [swEndDate, setSwEndDate] = useState("");
  const [swLimit, setSwLimit] = useState("");

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
      }}
    >
      <StepManager />
    </GlobalContext.Provider>
  );
}

export default App;
