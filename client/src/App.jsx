import { useState, createContext } from "react";
import StepManager from "./components/StepManager";
import "./style.css";

export const GlobalContext = createContext();

function App() {
  const [step, setStep] = useState("splitwise_login");
  const [swType, setSwType] = useState(null);
  const [swId, setSwId] = useState(null);

  return (
    <GlobalContext.Provider
      value={{ step, setStep, swType, setSwType, swId, setSwId }}
    >
      <StepManager />
    </GlobalContext.Provider>
  );
}

export default App;
