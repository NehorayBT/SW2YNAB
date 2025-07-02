import { useContext } from "react";
import { GlobalContext } from "../App";
import SplitwiseRepayment from "./SplitwiseRepayment";

export default function SplitwiseExpense({ expense }) {
  const { swExpenses, setSwExpenses } = useContext(GlobalContext);

  const handleClick = () => {
    const filteredExpenses = swExpenses.filter(
      (item) => item.id !== expense.id
    );
    setSwExpenses(filteredExpenses);
  };
  return (
    <div className="sw-expense">
      <div className="sw-expense-header">
        <div className="sw-expense-date">
          <p>{expense.created_at}</p>
          <button onClick={handleClick}>x</button>
        </div>
        <div className="sw-expense-desc">
          <div className="sw-expense-desc-inside">
            <h2>{expense.description}</h2>
            <h2
              className={expense.cost >= 0 ? "cost-positive" : "cost-negative"}
            >
              {expense.cost}
            </h2>
          </div>
        </div>
      </div>
      <ul>
        {expense.repayments.map((repayment, index) => (
          <SplitwiseRepayment key={index} repayment={repayment} />
        ))}
      </ul>
    </div>
  );
}
