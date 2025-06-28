import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { GlobalContext } from "../App";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";

export default function YnabAccounts() {
  const { setStep, ynabBudgetId, setYnabAccountId } = useContext(GlobalContext);

  // a function to fetch the current user's bank accounts (which are set-up in YNAB)
  const fetchAccounts = async () => {
    const res = await fetch(
      `http://localhost:5000/api/ynab/budgets/${ynabBudgetId}/accounts`
    );
    if (!res.ok) throw new Error("Failed to fetch accounts");
    return res.json();
  };

  // making the query
  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  // handling clicking on one of the accounts
  const onClick = (id) => {
    // saving the account in the state (for later use)
    setYnabAccountId(id);
    // moving to the next step
    setStep("ynab_export");
  };

  // rendering loading/error based on query's state
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error.message} />;

  // rendering
  return (
    <div className="main-col-container">
      <h1>Choose account</h1>
      <div className="col-container entity-container">
        <ul>
          {data.accounts.map((account) => (
            <li key={account.id}>
              <button onClick={() => onClick(account.id)}>
                {account.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
