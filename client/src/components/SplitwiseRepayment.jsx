export default function SplitwiseRepayment({ repayment }) {
  const factor = repayment.lender ? 1 : -1;

  return (
    <li>
      <div className="sw-repayment">
        <p>{repayment.name}</p>
        <h3 className={factor == 1 ? "cost-positive" : "cost-negative"}>
          {repayment.amount * factor}
        </h3>
        {/* {repayment.name} | {repayment.amount} |{" "}
        {repayment.lender ? "plus" : "minus"} */}
      </div>
    </li>
  );
}
