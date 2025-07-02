import { useContext } from "react";
import { GlobalContext } from "../App";
import { useMutation } from "@tanstack/react-query";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";

export default function YnabExport() {
  const { setStep, swExpenses, ynabAccountId, ynabBudgetId } =
    useContext(GlobalContext);

  // a function to transfer current date to YNAB's date format
  const fixDateFormat = (oldDate) => {
    const [day, month, year] = oldDate.split("/");
    const midDate = `${year}-${month}-${day}`;
    const FinalDate = new Date(midDate).toISOString().split("T")[0];
    return FinalDate;
  };

  // a function to convert a double into YNAB's number format
  const fixNumberFormat = (oldNum) => Math.round(oldNum * 1000);

  // a function to turn a splitwise repayment into a ynab's subtransaction
  const repaymentToSubtransaction = (repayment) => {
    // making the 'memo' (description) of the transaction based on
    // if the user is landing the money or being lent.
    const memo = repayment.lender
      ? `${repayment.name} pays back to me`
      : `Paying to ${repayment.name}`;

    // pushing the newly formatted sub transaction
    const subtransaction = {
      amount: fixNumberFormat(repayment.amount),
      payee_id: null,
      payee_name: repayment.name,
      category_id: null,
      memo: memo,
    };
    return subtransaction;
  };

  // a function to turn a splitwise expense (saved in our state) into a ynab's transaction
  const expenseToTransaction = (expense) => {
    // if only 1 repayment, that means this expense is only with 1 person, so the main transaction's payee-name can hold this person's name.
    // otherwise, it will be null, and the payee_name will be in each subtransactions
    let payee_name = expense.repayments[0].name;
    const subtransactions = [];

    // converting repayments to subtransactions
    if (expense.repayments.length > 1) {
      // if more than one repayments, that means more than 1 payee,
      // thus me make the main transaction's payee null (each subtransaction will
      // have a payee_name of its own)
      payee_name = null;

      // converting repayments to subtransactions and pushing to the subtransactions array
      expense.repayments.forEach((repayment) =>
        subtransactions.push(repaymentToSubtransaction(repayment))
      );
    }

    // building the YNAB's transaction
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

  // a function to handle sending the transactions to YNAB
  const postData = async (data) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/ynab/budgets/${ynabBudgetId}/transactions`,
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

  // actually making the POST request
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error.message);
    },
  });

  // a function called when clicking the submit button
  const handleSubmit = () => {
    // turning splitwise expenses to YNAB transactions
    const transactions = swExpenses.map((expense) =>
      expenseToTransaction(expense)
    );
    // the payload is what we send to the API
    const payload = {
      transactions,
    }; // actual data to post
    // actually sending the payload (POST request)
    mutation.mutate(payload);
  };

  // rendering based on request - loading/error/success
  if (mutation.isPending) return <LoadingComponent />;
  if (mutation.isError)
    return <ErrorComponent message={mutation.error.message} />;
  if (mutation.isSuccess)
    return (
      <div className="main-col-container">
        <h1 id="expo-success">Export succesful!</h1>
        <p id="expo-success-p">
          Want to export more transactions? click the button!
        </p>
        <button onClick={() => setStep("splitwise")}>Back to the start</button>
      </div>
    );

  // maing rendering
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
