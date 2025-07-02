import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { GlobalContext } from "../App";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";

export default function YnabBudgets() {
  // a function to fetch the current user's budgets
  const fetchBudgets = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/ynab/budgets`
    );
    if (!res.ok) throw new Error("Failed to fetch budgets");
    return res.json();
  };

  // react query
  const { data, isLoading, error } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  // importing global context
  const { setStep, setYnabBudgetId } = useContext(GlobalContext);

  // handling clicking on one of the budgets
  const onClick = (id) => {
    // updating the selected budget's state
    setYnabBudgetId(id);
    // moving to the next step
    setStep("ynab_accounts");
  };

  // handling render of loading/error based on query's state
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message="error.message" />;

  // rendering
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
