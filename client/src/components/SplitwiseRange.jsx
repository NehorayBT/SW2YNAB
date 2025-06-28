import { useContext } from "react";
import { GlobalContext } from "../App";

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

  // when clicking submit
  const handleSubmit = () => {
    // editing dates to match SW format (or stay empty if not added)

    // formating start-date
    const startDate =
      swStartDate == ""
        ? ""
        : new Date(swStartDate).toISOString().replace(/\.\d{3}Z$/, "Z");

    // formatting end-date
    const endDate =
      swEndDate == ""
        ? ""
        : new Date(swEndDate).toISOString().replace(/\.\d{3}Z$/, "Z");

    // setting the new state of the dates (if needed)
    if (swStartDate != "") setSwStartDate(startDate);
    if (swEndDate != "") setSwEndDate(endDate);

    setStep("splitwise_expenses");
  };

  return (
    <div className="main-col-container sw-range">
      <div className="range-header">
        <h1>choose Dates & Limit</h1>
        <p>You can leave them blank if irrelevant</p>
      </div>
      <div className="row-container">
        <div className="narrow-col-container">
          <p>Start date</p>
          <input
            type="date"
            value={swStartDate}
            onChange={(e) => setSwStartDate(e.target.value)}
          />
        </div>
        <div className="narrow-col-container">
          <p>End date</p>
          <input
            type="date"
            value={swEndDate}
            onChange={(e) => setSwEndDate(e.target.value)}
          />
        </div>
        <div className="narrow-col-container">
          <p>Limit</p>
          <input
            type="number"
            value={swLimit}
            onChange={(e) => setSwLimit(e.target.value)}
            placeholder="Limit"
          />
        </div>
      </div>
      <div className="row-container">
        <button onClick={() => setStep("splitwise")}>Go back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
