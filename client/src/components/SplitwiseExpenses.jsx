import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlobalContext } from "../App";
import SplitwiseExpense from "./SplitwiseExpense";

export default function SplitwiseExpenses() {
  const { swType, swId, swStartDate, swEndDate, swLimit, setStep } =
    useContext(GlobalContext);

  const fetchExpenses = async () => {
    // --- adding relevant parameters ---

    const params = new URLSearchParams();

    const entityId = swType === "friend" ? "friend_id" : "group_id";
    params.append(entityId, swId);

    if (swStartDate !== "") params.append("dated_after", swStartDate);
    if (swEndDate !== "") params.append("dated_before", swEndDate);
    if (swLimit !== "") params.append("limit", swLimit);

    const res = await fetch(
      `http://localhost:5000/api/splitwise/expenses?${params.toString()}`
    );
    if (!res.ok) throw new Error("Failed to fetch expenses");
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["expenses", swType, swId, swStartDate, swEndDate, swLimit],
    queryFn: fetchExpenses,
  });

  if (isLoading)
    return (
      <div className="main-col-container">
        <h1>Loading expenses</h1>
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
    <div className="main-col-container sw-expenses">
      <h1 className="sw-expenses-header">Splitwise expenses</h1>
      <button onClick={() => setStep("splitwise_range")}>Go back</button>
      <ul>
        {data.expenses.map((expense) => (
          <SplitwiseExpense key={expense.id} expense={expense} />
        ))}
      </ul>
    </div>
  );
}
