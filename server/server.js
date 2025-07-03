// server.js
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// for storing sessions id (unique to each user of the app, one for each platform).
// those id's gives us the mapping to corresponding sw/ynab tokens.
const splitwise_sessions = new Map();
const ynab_sessions = new Map();

// creates a new sw session, containing the splitwise token. returns the session id.
const createSplitwiseSession = (splitwise_token) => {
  // a unique session id to identify this specific user (user of OUR app)
  const sessionID = crypto.randomUUID();
  // creating a JWT token with the sessionID
  splitwise_sessions[sessionID] = {
    splitwise_token,
  };
  return sessionID;
};

// creates a new sw session, containing the splitwise token. returns the session id.
const createYnabSession = (ynab_token) => {
  // a unique session id to identify this specific user (user of OUR app)
  const sessionID = crypto.randomUUID();
  // creating a JWT token with the sessionID
  ynab_sessions[sessionID] = {
    ynab_token,
  };
  return sessionID;
};

const ensureSessionFromReq = (req, res, next, sessions) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Session ")) {
    // remove "Session " prefix
    const sessionID = authHeader.slice(8);

    // check if session exist (by sessionID)
    if (sessions[sessionID]) {
      // attach the session data (sw/ynab tokens, sw_user info) to the request
      req.session = sessions[sessionID];
      // attach the sessionID itself to the request
      req.sessionID = sessionID;
      return next();
    }
  }
  // No valid session found
  res.status(401).send("Splitwise not authenticated");
};

const ensureSplitwiseAuth = (req, res, next) => {
  return ensureSessionFromReq(req, res, next, splitwise_sessions);
};

const ensureYNABAuth = (req, res, next) => {
  return ensureSessionFromReq(req, res, next, ynab_sessions);
};

// for splitwise authentication
app.get("/auth/splitwise/callback", async (req, res) => {
  const { code } = req.query;

  let sessionID = null;

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
    // creating a new session and saving its id in sessionID
    sessionID = createSplitwiseSession(access_token);
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
          Authorization: `Bearer ${splitwise_sessions[sessionID].splitwise_token}`,
        },
      }
    );

    // saving current user
    splitwise_sessions[sessionID].splitwise_current_user = response.data.user;

    // redirecting and transfering the sessionID
    res.redirect(
      `${process.env.FRONTEND_URL}?sw_success=true&sw_session_id=${sessionID}`
    );
  } catch (err) {
    console.error("Error fetching user info", err.response?.data || err);
    res.status(400).send("Failed to fetch user info");
  }
});

// for ynab authentication
app.get("/auth/ynab/callback", async (req, res) => {
  const { code } = req.query;

  let sessionID = null;

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
    sessionID = createYnabSession(access_token);
    res.redirect(
      `${process.env.FRONTEND_URL}?ynab_success=true&ynab_session_id=${sessionID}`
    );
  } catch (err) {
    console.error("Error exchanging token:", err.response?.data || err);
    res.status(500).send("OAuth failed");
    return;
  }
});

// ---YNAB-RELATED-API---

// for getting user's info

// DELETE ME ########################################################################
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
// DELETE ME ########################################################################

// for getting user's budgets
app.get("/api/ynab/budgets", ensureYNABAuth, async (req, res) => {
  // trying to get the user's budgets from ynab
  try {
    const response = await axios.get("https://api.ynab.com/v1/budgets", {
      headers: {
        Authorization: `Bearer ${req.session.ynab_token}`,
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
app.get(
  "/api/ynab/budgets/:budget_id/accounts",
  ensureYNABAuth,
  async (req, res) => {
    const { budget_id } = req.params;

    // trying to get the user's budgets from ynab
    try {
      const response = await axios.get(
        `https://api.ynab.com/v1/budgets/${budget_id}/accounts`,
        {
          headers: {
            Authorization: `Bearer ${req.session.ynab_token}`,
          },
        }
      );
      // returning the data to the front-end
      res.json(response.data.data);
    } catch (err) {
      // error
      res.status(500).send("Failed to fetch budget's accounts'");
    }
  }
);

// for posting the transactions to YNAB
app.post(
  "/api/ynab/budgets/:budget_id/transactions",
  ensureYNABAuth,
  async (req, res) => {
    const { budget_id } = req.params;
    const transactionsData = req.body;

    try {
      const response = await axios.post(
        `https://api.ynab.com/v1/budgets/${budget_id}/transactions`,
        transactionsData,
        {
          headers: {
            Authorization: `Bearer ${req.session.ynab_token}`,
            "Content-Type": "application/json", // usually needed for POST JSON
          },
        }
      );

      res.json(response.data);
    } catch (err) {
      console.log(err.response.data);
      res.status(500).send("Failed to export transactions");
    }
  }
);

// ---SPLITWISE-RELATED-API---

// for getting user's friends
app.get("/api/splitwise/friends", ensureSplitwiseAuth, async (req, res) => {
  // if splitwise is not yet authenticated
  if (!req.session.splitwise_token)
    return res.status(401).send("Splitwise not authenticated");

  // trying to get the user's friends from splitwise
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_friends",
      {
        headers: {
          Authorization: `Bearer ${req.session.splitwise_token}`,
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
app.get("/api/splitwise/groups", ensureSplitwiseAuth, async (req, res) => {
  // if splitwise is not yet authenticated
  if (!req.session.splitwise_token)
    return res.status(401).send("Not authenticated");

  // trying to get the user's groups from splitwise
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_groups",
      {
        headers: {
          Authorization: `Bearer ${req.session.splitwise_token}`,
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
const processExpense = (expense, current_user_id) => {
  // if expense deleted, dont use it
  if (expense.deleted_at !== null) {
    return null;
  }

  const repayments = [];

  let cost = 0;
  expense.repayments.forEach((repayment) => {
    numericAmount = Number(repayment.amount);
    if (repayment.from === current_user_id) {
      // if user is the one who pays (he owes the money to someone)
      repayments.push({
        amount: numericAmount, // how much money to pay
        name: idToName(expense.users, repayment.to), // the user we pay to
        lender: false, // we are in debt (we're not the lender)
      });
      cost -= numericAmount;
    } else if (repayment.to === current_user_id) {
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
app.get("/api/splitwise/expenses", ensureSplitwiseAuth, async (req, res) => {
  const queryParams = req.query;

  // trying to get the user's expenses from splitwise
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_expenses",
      {
        headers: {
          Authorization: `Bearer ${req.session.splitwise_token}`,
        },
        params: queryParams,
      }
    );

    // getting original expenses
    const expenses = response.data.expenses;
    // processing original expenses
    const processedExpenses = expenses
      .map((expense) =>
        processExpense(expense, req.session.splitwise_current_user.id)
      )
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
