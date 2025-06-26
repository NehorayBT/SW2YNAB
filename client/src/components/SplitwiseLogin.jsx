import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../App";

export default function SplitwiseLogin() {
  const { setStep } = useContext(GlobalContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success === "true") {
      setStep("splitwise");
    }
  }, []);

  const consumerKey = import.meta.env.VITE_SPLITWISE_CONSUMER_KEY;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
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
