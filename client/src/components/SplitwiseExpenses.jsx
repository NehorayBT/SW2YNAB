import { useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlobalContext } from "../App";
import SplitwiseExpense from "./SplitwiseExpense";
import cloneDeep from "lodash/cloneDeep";
import ErrorComponent from "./ErrorComponent";
import LoadingComponent from "./LoadingComponent";

export default function SplitwiseExpenses() {
  const {
    swType,
    swId,
    swStartDate,
    swEndDate,
    swLimit,
    setStep,
    swExpenses,
    setSwExpenses,
  } = useContext(GlobalContext);

  // handling fetching the expenses using react-query
  const fetchExpenses = async () => {
    // ##############################
    // ### adding relevant params ###
    // ##############################

    const params = new URLSearchParams();

    // add the matching entity-param
    const entityId = swType === "friend" ? "friend_id" : "group_id";
    params.append(entityId, swId);

    // add optional start-date, end-date and limit params
    if (swStartDate !== "") params.append("dated_after", swStartDate);
    if (swEndDate !== "") params.append("dated_before", swEndDate);
    if (swLimit !== "") params.append("limit", swLimit);

    // fetch the actual data (splitwise expenses)
    const res = await fetch(
      `http://localhost:5000/api/splitwise/expenses?${params.toString()}`
    );
    if (!res.ok) throw new Error("Failed to fetch expenses");

    // return data
    const json = await res.json();
    return json;
  };

  // react query hook to fetch expenses
  const { data, isLoading, error } = useQuery({
    queryKey: ["expenses", swType, swId, swStartDate, swEndDate, swLimit],
    queryFn: fetchExpenses,
  });

  // any time the query data's change, update the swExpenses state (its a state we want to be able to change,
  // like deleting expenses, so we need a copy of the data as we dont want to mess with react-query hook's data)
  useEffect(() => {
    if (data?.expenses) {
      setSwExpenses(cloneDeep(data.expenses));
    }
  }, [data]);

  // YNAB's OAuth things
  const clientId = import.meta.env.VITE_YNAB_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_YNAB_REDIRECT_URI;
  const authUrl = `https://app.ynab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code`;

  // handling the login (we need to save the state before redirecting as it will get deleted)
  const handleLogin = () => {
    // saving state
    localStorage.setItem("swExpenses", JSON.stringify(swExpenses));
    // redirecting to ynab's OAuth page
    window.location.href = authUrl;
  };

  // rendering loading/error components if needed, based on the query's state
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error.message} />;

  // rendering
  return (
    <div className="main-col-container sw-expenses">
      <h1 className="sw-expenses-header">Splitwise expenses</h1>
      <div className="buttons-row-container">
        <button onClick={() => setStep("splitwise_range")}>Go back</button>
        <button className="grow-button" onClick={handleLogin}>
          Login to YNAB and export
        </button>
      </div>
      <ul>
        {swExpenses.map((expense) => (
          <SplitwiseExpense key={expense.id} expense={expense} />
        ))}
      </ul>
    </div>
  );
}
