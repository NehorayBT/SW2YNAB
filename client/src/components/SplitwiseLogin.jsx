import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../App";

export default function SplitwiseLogin() {
  const { setStep, setSwExpenses } = useContext(GlobalContext);

  const removeParam = (param) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(param);

    const newUrl =
      window.location.pathname + (params.toString() ? `?${params}` : "");
    window.history.replaceState({}, "", newUrl);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sw_success = params.get("sw_success");
    const ynab_success = params.get("ynab_success");
    if (sw_success === "true") {
      setStep("splitwise");
      // deleting the 'sw_success' param from the url
      removeParam("sw_success");
    } else if (ynab_success === "true") {
      // we redirected to YNAB's OAuth page, so no need to load the pre-saved splitwise expenses
      const localSwExpenses = localStorage.getItem("swExpenses");
      if (localSwExpenses) {
        setSwExpenses(JSON.parse(localSwExpenses));
      }
      // moving to the next step
      setStep("ynab_budgets");
      // deleting the 'ynab_success' param from the url
      removeParam("ynab_success");
    }
  }, []);

  const consumerKey = import.meta.env.VITE_SPLITWISE_CONSUMER_KEY;
  const redirectUri = import.meta.env.VITE_SPLITWISE_REDIRECT_URI;
  const authUrl = `https://secure.splitwise.com/oauth/authorize?response_type=code&client_id=${consumerKey}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  const handleLogin = () => {
    window.location.href = authUrl;
  };

  return (
    <div className="main-col-container">
      <h1 className="login-header">SPLITWISE to YNAB</h1>
      <button onClick={handleLogin}>Login with Splitwise</button>
    </div>
  );
}
