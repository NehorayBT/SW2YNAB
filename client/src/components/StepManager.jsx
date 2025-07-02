import SplitwiseLogin from "./SplitwiseLogin";
import Splitwise from "./Splitwise";
import SplitwiseRange from "./SplitwiseRange";
import SplitwiseExpenses from "./SplitwiseExpenses";
import YnabBudgets from "./YnabBudgets";
import YnabAccounts from "./YnabAccounts";
import YnabExport from "./YnabExport";
import { GlobalContext } from "../App";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// this is a main component that manages and renders the current step we're in
// (each step is a different component)
export default function StepManager() {
  const { step } = useContext(GlobalContext);

  const getStepComponent = () => {
    switch (step) {
      case "splitwise_login":
        return <SplitwiseLogin />;
      case "splitwise":
        return <Splitwise />;
      case "splitwise_range":
        return <SplitwiseRange />;
      case "splitwise_expenses":
        return <SplitwiseExpenses />;
      case "ynab_budgets":
        return <YnabBudgets />;
      case "ynab_accounts":
        return <YnabAccounts />;
      case "ynab_export":
        return <YnabExport />;
      default:
        return <div>Unknown step: {step}</div>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {getStepComponent()}
      </motion.div>
    </AnimatePresence>
  );
}
