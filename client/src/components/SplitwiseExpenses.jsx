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

  if (isLoading) return <p>Loading expenses...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <button onClick={() => setStep("splitwise_range")}>Go back</button>
      <ul>
        {data.expenses.map((expense) => (
          <SplitwiseExpense key={expense.id} expense={expense} />
        ))}
      </ul>
    </>
  );
}
