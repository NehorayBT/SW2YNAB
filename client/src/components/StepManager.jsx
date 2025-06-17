import Login from "./Login";
import SplitwiseLogin from "./SplitwiseLogin";
import Splitwise from "./Splitwise";
import SplitwiseExpenses from "./SplitwiseExpenses";
import YnabLogin from "./YnabLogin";
import YNAB from "./YNAB";
import { GlobalContext } from "../App";
import { useContext, useEffect } from "react";

export default function StepManager() {
  const { step, setStep } = useContext(GlobalContext);

  if (step === "splitwise_login") return <SplitwiseLogin />;
  if (step === "splitwise") return <Splitwise />;
  if (step == "splitwise_transactions") return <SplitwiseExpenses />;
  if (step === "ynab_login") return <YnabLogin />;
  if (step == "ynab") return <YNAB />;

  console.log("Step not found");
}
