import SplitwiseRepayment from "./SplitwiseRepayment";

export default function SplitwiseExpense({ expense }) {
  return (
    <li>
      <div className="sw-expense">
        <div className="sw-expense-header">
          <div className="sw-expense-date">
            <p>{expense.created_at}</p>
          </div>
          <div className="sw-expense-desc">
            <h2>{expense.description}</h2>
            <h2
              className={expense.cost >= 0 ? "cost-positive" : "cost-negative"}
            >
              {expense.cost}
            </h2>
          </div>
        </div>
        <ul>
          {expense.repayments.map((repayment, index) => (
            <SplitwiseRepayment key={index} repayment={repayment} />
          ))}
        </ul>
      </div>
    </li>
  );
}
