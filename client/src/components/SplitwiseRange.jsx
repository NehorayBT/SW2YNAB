import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlobalContext } from "../App";
import SplitwiseExpense from "./SplitwiseExpense";

export default function SplitwiseRange() {
  const {
    setStep,
    swStartDate,
    setSwStartDate,
    swEndDate,
    setSwEndDate,
    swLimit,
    setSwLimit,
  } = useContext(GlobalContext);

  const handleSubmit = () => {
    // editing dates to match SW format (or stay empty if not added)

    const startDate =
      swStartDate == ""
        ? ""
        : new Date(swStartDate).toISOString().replace(/\.\d{3}Z$/, "Z");

    const endDate =
      swEndDate == ""
        ? ""
        : new Date(swEndDate).toISOString().replace(/\.\d{3}Z$/, "Z");

    // setting the new state of the dates (if needed)
    if (swStartDate != "") setSwStartDate(startDate);
    if (swEndDate != "") setSwEndDate(endDate);

    // logging
    console.log("Selected start date:", swStartDate);
    console.log("Selected end date:", swEndDate);
    console.log("Entered limit:", swLimit);

    setStep("splitwise_expenses");
  };

  return (
    <div>
      <input
        type="date"
        value={swStartDate}
        onChange={(e) => setSwStartDate(e.target.value)}
      />
      <input
        type="date"
        value={swEndDate}
        onChange={(e) => setSwEndDate(e.target.value)}
      />
      <input
        type="text"
        value={swLimit}
        onChange={(e) => setSwLimit(e.target.value)}
        placeholder="Limit"
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={() => setStep("splitwise")}>Go back</button>
    </div>
  );
}
