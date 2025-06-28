import SplitwiseLogin from "./SplitwiseLogin";
import Splitwise from "./Splitwise";
import SplitwiseRange from "./SplitwiseRange";
import SplitwiseExpenses from "./SplitwiseExpenses";
import YnabBudgets from "./YnabBudgets";
import YnabAccounts from "./YnabAccounts";
import YnabExport from "./YnabExport";
import { GlobalContext } from "../App";
import { useContext } from "react";

// this is a main component that manages and renders the current step we're in
// (each step is a different component)
export default function StepManager() {
  const { step } = useContext(GlobalContext);

  if (step === "splitwise_login") return <SplitwiseLogin />;
  if (step === "splitwise") return <Splitwise />;
  if (step === "splitwise_range") return <SplitwiseRange />;
  if (step == "splitwise_expenses") return <SplitwiseExpenses />;
  if (step === "ynab_budgets") return <YnabBudgets />;
  if (step === "ynab_accounts") return <YnabAccounts />;
  if (step === "ynab_export") return <YnabExport />;

  console.log("Step not found");
}
