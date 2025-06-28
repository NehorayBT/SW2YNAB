import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../App";

export default function YnabLogin() {
  const { setStep } = useContext(GlobalContext);

  const consumerKey = process.env.SPLITWISE_CONSUMER_KEY;
  const redirectUri = "http://localhost:5000/auth/splitwise/callback";

  const authUrl = `https://secure.splitwise.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  return (
    <a href={authUrl}>
      <h1>{consumerKey}</h1>
      <button>Login with Splitwise</button>
    </a>
  );
}
