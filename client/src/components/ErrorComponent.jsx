import { useContext } from "react";
import { GlobalContext } from "../App";

export default function ErrorComponent({ message }) {
  const { setStep } = useContext(GlobalContext);

  // return to first step
  const onClick = () => {
    setStep("splitwise_login");
  };

  return (
    <div className="main-col-container">
      <h1>Error</h1>
      <p id="error-message">{message}</p>
      <button onClick={onClick}>Try again</button>
    </div>
  );
}
