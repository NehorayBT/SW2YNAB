// server.js
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());

splitwise_token = null;

app.get("/auth/splitwise/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post(
      "https://secure.splitwise.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.SPLITWISE_CONSUMER_KEY,
        client_secret: process.env.SPLITWISE_CONSUMER_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
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

    // You can now store the token, or redirect to React app with it
    res.redirect(`http://localhost:5173?success=true`);
  } catch (err) {
    console.error("Error exchanging token:", err.response?.data || err);
    res.status(500).send("OAuth failed");
  }
});

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
    // returning rhe data to the front-end
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

  // trying to get the user's friends from splitwise
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

    // returning rhe data to the front-end
    res.json({ groups });
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch groups");
  }
});

// for getting user's expenses
app.get("/api/splitwise/expenses", async (req, res) => {
  // if splitwise is not yet authenticated
  if (!splitwise_token) return res.status(401).send("Not authenticated");

  const { id, type } = req.query;
  // if id (friend's / group's ID) or type (is it a friend? is it a group?) are missing
  if (!id || !type) return res.status(400).send("Missing id or type");
  // needs to be an integer
  const numericId = Number(id);

  console.log(id);
  console.log(type);

  // trying to get the user's friends from splitwise
  try {
    const response = await axios.get(
      "https://secure.splitwise.com/api/v3.0/get_expenses",
      {
        headers: {
          Authorization: `Bearer ${splitwise_token}`,
        },
      }
    );

    // filtering by group/friend id
    let expenses = response.data.expenses;
    if (type == "friend") {
      expenses = expenses.filter((expense) => {
        // if the group_id of the expense is null (its a friendship expense) and one of the users in the friendship matches the id
        return (
          expense.group_id === null &&
          expense.users.some((user) => user.user_id === numericId)
        );
      });
    } else if (type == "group") {
      expenses = expenses.filter((expense) => expense?.group_id === numericId);
    } else {
      return res
        .status(399)
        .send("type doesn't match (needs to be either 'friend' or 'group'");
    }

    // returning rhe data to the front-end
    res.json({ expenses });
  } catch (err) {
    // error
    res.status(500).send("Failed to fetch groups");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
