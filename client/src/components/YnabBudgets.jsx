import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { GlobalContext } from "../App";

const fetchBudgets = async () => {
  const res = await fetch("http://localhost:5000/api/ynab/budgets");
  if (!res.ok) throw new Error("Failed to fetch budgets");
  return res.json();
};

export default function YnabBudgets() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  const { setStep, setYnabBudgetId, swExpenses } = useContext(GlobalContext);

  const onClick = (id) => {
    setYnabBudgetId(id);
    setStep("ynab_accounts");
  };

  if (isLoading)
    return (
      <div className="main-col-container">
        <h1>Loading budgets</h1>
      </div>
    );
  if (error)
    return (
      <div className="main-col-container">
        <h1>Error</h1>
        <h2>{error.message}</h2>
      </div>
    );

  return (
    <div className="main-col-container">
      <h1>Choose budget</h1>
      <div className="col-container entity-container">
        <ul>
          {data.budgets.map((budget) => (
            <li key={budget.id}>
              <button onClick={() => onClick(budget.id)}>{budget.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
