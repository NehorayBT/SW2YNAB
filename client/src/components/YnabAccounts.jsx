import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { GlobalContext } from "../App";

export default function YnabAccounts() {
  const { setStep, ynabBudgetId, setYnabAccountId } = useContext(GlobalContext);

  const fetchAccounts = async () => {
    const res = await fetch(
      `http://localhost:5000/api/ynab/budgets/${ynabBudgetId}/accounts`
    );
    if (!res.ok) throw new Error("Failed to fetch accounts");
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const onClick = (id) => {
    setYnabAccountId(id);
    setStep("ynab_export");
  };

  if (isLoading)
    return (
      <div className="main-col-container">
        <h1>Loading accounts</h1>
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
