import { useContext } from "react";
import { GlobalContext } from "../App";
import { useMutation } from "@tanstack/react-query";

export default function YnabExport() {
  const { swExpenses, ynabAccountId, ynabBudgetId } = useContext(GlobalContext);

  const fixDateFormat = (oldDate) => {
    const [day, month, year] = oldDate.split("/");
    const midDate = `${year}-${month}-${day}`;
    const FinalDate = new Date(midDate).toISOString().split("T")[0];
    return FinalDate;
  };

  const fixNumberFormat = (oldNum) => Math.round(oldNum * 1000);

  const expenseToTransaction = (expense) => {
    // if only 1 repayment, that means this expense is only with 1 person, so the main transaction's payee-name can hold this person's name.
    // otherwise, it will be null, and the payee_name will be in each subtransactions
    let payee_name = expense.repayments[0].name;
    const subtransactions = [];

    // converting repayments to subtransactions
    if (expense.repayments.length > 1) {
      payee_name = null;
      expense.repayments.forEach((repayment) => {
        const memo = repayment.lender
          ? `${repayment.name} pays back to me`
          : `Paying to ${repayment.name}`;

        subtransactions.push({
          amount: fixNumberFormat(repayment.amount),
          payee_id: null,
          payee_name: repayment.name,
          category_id: null,
          memo: memo,
        });
      });
    }

    const transaction = {
      account_id: ynabAccountId,
      date: fixDateFormat(expense.created_at),
      amount: fixNumberFormat(expense.cost),
      payee_id: null,
      payee_name: payee_name,
      category_id: null,
      memo: expense.description,
      cleared: "uncleared",
      approved: false,
      flag_color: null,
      subtransactions,
      import_id: null,
    };

    return transaction;
  };

  const postData = async (data) => {
    const res = await fetch(
      `http://localhost:5000/api/ynab/budgets/${ynabBudgetId}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) throw new Error("Failed to export transactions");
    return res.json();
  };

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error.message);
    },
  });

  const handleSubmit = () => {
    const transactions = swExpenses.map((expense) =>
      expenseToTransaction(expense)
    );
    const payload = {
      transactions,
    }; // actual data to post
    mutation.mutate(payload);
  };

  if (mutation.isPending)
    return (
      <div className="main-col-container">
        <h1>Exporting transactions</h1>
      </div>
    );
  if (mutation.isSuccess)
    return (
      <div className="main-col-container">
        <h1>Export succesful!</h1>
      </div>
    );
  if (mutation.isError)
    return (
      <div className="main-col-container">
        <h1>Error</h1>
        <h2>{mutation.error.message}</h2>
      </div>
    );

  return (
    <div className="main-col-container">
      <h1 className="export-header">Export to YNAB</h1>
      <p className="export-p">
        You're going to export {swExpenses.length} transactions to YNAB. do you
        aprove?
      </p>
      <button onClick={handleSubmit}>Export transactions</button>
    </div>
  );
}
