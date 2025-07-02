import { useContext, useEffect } from "react";
import { GlobalContext } from "../App";

export default function SplitwiseLogin() {
  const { setStep, setSwExpenses } = useContext(GlobalContext);

  // a function to remove a certain param from the current url in the browser
  const removeParam = (param) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(param);

    const newUrl =
      window.location.pathname + (params.toString() ? `?${params}` : "");
    window.history.replaceState({}, "", newUrl);
  };

  // if we got redirected back to the app from another source (SW/YNAB's OAuth service),
  // check for a success param, and move to the appropriate step accordingly
  useEffect(() => {
    // getting params from the url
    const params = new URLSearchParams(window.location.search);
    const sw_success = params.get("sw_success");
    const ynab_success = params.get("ynab_success");
    // if splitwise authentication was succesful
    if (sw_success === "true") {
      // move to the 'splitwise' step
      setStep("splitwise");
      // deleting the 'sw_success' param from the url
      removeParam("sw_success");
    } else if (ynab_success === "true") {
      // if yhnab authentication was succesful

      // we redirected to YNAB's OAuth page, so need to load the pre-saved splitwise expenses
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

  // getting key and uri from the .env file
  const consumerKey = import.meta.env.VITE_SPLITWISE_CONSUMER_KEY;
  const redirectUri = `${
    import.meta.env.VITE_API_BASE_URL
  }/auth/splitwise/callback`;
  // setting the auth url to redirect into
  const authUrl = `https://secure.splitwise.com/oauth/authorize?response_type=code&client_id=${consumerKey}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  // this handles the login to splitwise (simply redirects to their OAuth url)
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
