import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../App";

export default function Login() {
  const [formData, setFormData] = useState({
    Splitwise: "",
    YNAB: "",
  });

  useEffect(() => {}, []);

  const { setStep } = useContext(GlobalContext);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault(); // Prevent page reload
    sessionStorage.setItem("Splitwise", formData.Splitwise);
    sessionStorage.setItem("YNAB", formData.YNAB);
    setStep("splitwise");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Splitwise
          <input
            type="text"
            name="Splitwise"
            value={formData.Splitwise}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div>
        <label>
          YNAB
          <input
            type="text"
            name="YNAB"
            value={formData.YNAB}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
