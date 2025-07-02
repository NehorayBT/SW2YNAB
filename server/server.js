// server.js
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// the token used for all api-requests with splitwise
let splitwise_token = null;
// the token used for all api-requests with ynab
let ynab_token = null;
// the current user information in splitwise
let splitwise_current_user = null;

// for splitwise authentication
app.get("/auth/splitwise/callback", async (req, res) => {
  const { code } = req.query;

  // exchanging the token
  try {
    const tokenRes = await axios.post(
      "https://secure.splitwise.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.SPLITWISE_CONSUMER_KEY,
        client_secret: process.env.SPLITWISE_CONSUMER_SECRET,
        redirect_uri: `${process.env.API_BASE_URL}/auth/splitwise/callback`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Token received!
    const { access_token } = tokenRes.data;
    // for later use
    splitwise_token = access_token;
  } catch (err) {
    console.error("Error exchanging token:", err.response?.data || err);
    res.status(500).send("OAuth failed");
    return;
  }

  // getting user info (before redirecting)
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_current_user",
      {
        headers: {
          Authorization: `Bearer ${splitwise_token}`,
        },
      }
    );

    // saving current user
    splitwise_current_user = response.data.user;
    // redirecting
    res.redirect(`${process.env.FRONTEND_URL}?sw_success=true`);
  } catch (err) {
    console.error("Error fetching user info", err.response?.data || err);
    res.status(400).send("Failed to fetch user info");
  }
});

// for ynab authentication
app.get("/auth/ynab/callback", async (req, res) => {
  const { code } = req.query;

  // exchanging the token
  try {
    const tokenRes = await axios.post(
      "https://app.ynab.com/oauth/token",
      new URLSearchParams({
        client_id: process.env.YNAB_CLIENT_ID,
        client_secret: process.env.YNAB_CLIENT_SECRET,
        redirect_uri: `${process.env.API_BASE_URL}/auth/ynab/callback`,
        grant_type: "authorization_code",
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Token received!
    const { access_token } = tokenRes.data;
    // for later use
    ynab_token = access_token;
    res.redirect(`${process.env.FRONTEND_URL}?ynab_success=true`);
  } catch (err) {
    console.error("Error exchanging token:", err.response?.data || err);
    res.status(500).send("OAuth failed");
    return;
  }
});

// ---YNAB-RELATED-API---

// for getting user's info
app.get("/api/ynab/user", async (req, res) => {
  // if ynab is not yet authenticated
  if (!ynab_token) return res.status(401).send("Not authenticated");

  // trying to get the user's info from ynab
  try {
    const response = await axios.get("https://api.ynab.com/v1/user", {
      headers: {
        Authorization: `Bearer ${ynab_token}`,
      },
    });
    // returning the data to the front-end
    res.json(response.data.data);
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch user info");
  }
});

// for getting user's budgets
app.get("/api/ynab/budgets", async (req, res) => {
  // if ynab is not yet authenticated
  if (!ynab_token) return res.status(401).send("Not authenticated");

  // trying to get the user's budgets from ynab
  try {
    const response = await axios.get("https://api.ynab.com/v1/budgets", {
      headers: {
        Authorization: `Bearer ${ynab_token}`,
      },
    });
    // returning the data to the front-end
    res.json(response.data.data);
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch budgets");
  }
});

// for getting user's bank accounts (for a specific budget)
app.get("/api/ynab/budgets/:budget_id/accounts", async (req, res) => {
  // if ynab is not yet authenticated
  if (!ynab_token) return res.status(401).send("Not authenticated");

  const { budget_id } = req.params;

  // trying to get the user's budgets from ynab
  try {
    const response = await axios.get(
      `https://api.ynab.com/v1/budgets/${budget_id}/accounts`,
      {
        headers: {
          Authorization: `Bearer ${ynab_token}`,
        },
      }
    );
    // returning the data to the front-end
    res.json(response.data.data);
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch budget's accounts'");
  }
});

// for posting the transactions to YNAB
app.post("/api/ynab/budgets/:budget_id/transactions", async (req, res) => {
  if (!ynab_token) return res.status(401).send("Not authenticated");

  const { budget_id } = req.params;
  const transactionsData = req.body;

  try {
    const response = await axios.post(
      `https://api.ynab.com/v1/budgets/${budget_id}/transactions`,
      transactionsData,
      {
        headers: {
          Authorization: `Bearer ${ynab_token}`,
          "Content-Type": "application/json", // usually needed for POST JSON
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.log(err.response.data);
    res.status(500).send("Failed to export transactions");
  }
});

// ---SPLITWISE-RELATED-API---

// for getting user's friends
app.get("/api/splitwise/friends", async (req, res) => {
  // if splitwise is not yet authenticated
  if (!splitwise_token) return res.status(401).send("Not authenticated");

  // trying to get the user's friends from splitwise
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_friends",
      {
        headers: {
          Authorization: `Bearer ${splitwise_token}`,
        },
      }
    );
    // returning the data to the front-end
    res.json(response.data);
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch friends");
  }
});

// for getting user's groups
app.get("/api/splitwise/groups", async (req, res) => {
  // if splitwise is not yet authenticated
  if (!splitwise_token) return res.status(401).send("Not authenticated");

  // trying to get the user's groups from splitwise
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_groups",
      {
        headers: {
          Authorization: `Bearer ${splitwise_token}`,
        },
      }
    );

    // filtering this one group
    let groups = response.data.groups;
    groups = groups.filter((group) => group.name !== "Non-group expenses");

    // returning the data to the front-end
    res.json({ groups });
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch groups");
  }
});

// turn ISO to regular date
const processDate = (date) => {
  newDate = new Date(date);

  const day = String(newDate.getUTCDate()).padStart(2, "0");
  const month = String(newDate.getUTCMonth() + 1).padStart(2, "0");
  const year = newDate.getUTCFullYear();

  const formatted = `${day}/${month}/${year}`;

  return formatted;
};

// given all users in the expense, and id of one user,
// returns the full name of the user
const idToName = (users, id) => {
  const user = users.find((user) => user.user_id === id).user;
  return user.first_name + " " + user.last_name;
};

// take only what matters from the expense
const processExpense = (expense) => {
  // if expense deleted, dont use it
  if (expense.deleted_at !== null) {
    return null;
  }

  const repayments = [];

  let cost = 0;
  expense.repayments.forEach((repayment) => {
    numericAmount = Number(repayment.amount);
    if (repayment.from === splitwise_current_user.id) {
      // if user is the one who pays (he owes the money to someone)
      repayments.push({
        amount: numericAmount, // how much money to pay
        name: idToName(expense.users, repayment.to), // the user we pay to
        lender: false, // we are in debt (we're not the lender)
      });
      cost -= numericAmount;
    } else if (repayment.to === splitwise_current_user.id) {
      // if user is the one who gets paid (someone owes him the money)
      repayments.push({
        amount: numericAmount, // how much money the user pay us
        name: idToName(expense.users, repayment.from), // the user that pays us
        lender: true, // other user is indebted to us (we're the lender)
      });
      cost += numericAmount;
    }
  });

  const processedExpense = {
    id: expense.id,
    description: expense.description,
    cost: cost,
    payment: expense.payment,
    repayments: repayments,
    created_at: processDate(expense.created_at),
    updated_at: processDate(expense.updated_at),
  };

  return processedExpense;
};

// for getting user's expenses
app.get("/api/splitwise/expenses", async (req, res) => {
  // if splitwise is not yet authenticated
  if (!splitwise_token) return res.status(401).send("Not authenticated");

  const queryParams = req.query;

  // trying to get the user's expenses from splitwise
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_expenses",
      {
        headers: {
          Authorization: `Bearer ${splitwise_token}`,
        },
        params: queryParams,
      }
    );

    // getting original expenses
    const expenses = response.data.expenses;
    // processing original expenses
    const processedExpenses = expenses
      .map((expense) => processExpense(expense))
      .filter((expense) => expense !== null);

    // returning the data to the front-end
    res.json({ expenses: processedExpenses });
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch expenses");
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running`);
});
