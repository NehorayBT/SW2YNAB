import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlobalContext } from "../App";

export default function SplitwiseExpenses() {
  const { swType, swId } = useContext(GlobalContext);

  const fetchExpenses = async () => {
    const res = await fetch(
      `http://localhost:5000/api/splitwise/expenses?id=${swId}&type=${swType}`
    );
    if (!res.ok) throw new Error("Not authorized");
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  if (isLoading) return <p>Loading expenses...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.expenses.map((expense) => {
        return <li key={expense.id}>{expense.description}</li>;
      })}
    </ul>
  );
}
