export default function SplitwiseRepayment({ repayment, index }) {
  return (
    <li>
      {repayment.name} | {repayment.amount} |{" "}
      {repayment.lender ? "plus" : "minus"}
    </li>
  );
}
