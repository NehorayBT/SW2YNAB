import SplitwiseRepayment from "./SplitwiseRepayment";

export default function SplitwiseExpense({ expense }) {
  return (
    <li>
      <h2>
        {expense.description} | {expense.cost} | {expense.created_at}
      </h2>
      <ul>
        {expense.repayments.map((repayment, index) => (
          <SplitwiseRepayment key={index} repayment={repayment} />
        ))}
      </ul>
    </li>
  );
}
