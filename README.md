# Splitwise-to-YNAB

A convenient web app that lets you import expenses from your Splitwise account straight into your YNAB account as transactions.  
As YNAB users, we love to keep every transaction descriptive, accurate, and clean—but sometimes that means manually importing each Splitwise expense ourselves, which takes time. This tool simply helps reduce that effort.

A **live demo** can be found [here](https://sw-2-ynab-client.vercel.app/)  
_Please note_: because the backend runs on a free tier, it may require you to wait a minute before continuing. A refresh is usually needed after the wait.

_**Important -**_ As quoted from the YNAB API documentation:  
> _"When an OAuth application is created, it will be placed in Restricted Mode initially.  
This means the application will be limited to obtaining 25 access tokens for users other than the OAuth application owner.  
Once this limit is reached, a message will be placed on the Authorization screen and new authorizations will be prohibited."_

This means the demo might stop working for new users in the future, unless the app is registered properly. If you plan on using the app beyond personal use, keep this in mind.

## Using the app

### Using the deployed app is simple:

1. **Splitwise login:**  
   Click the **'Login with Splitwise'** button. This will redirect you to Splitwise's OAuth page, where you'll log in and authorize access.

2. **Entities step:**  
   You’ll see two lists—Friends & Groups. These match your Splitwise account. Click the friend or group you want to import expenses from.

3. **Dates & Limit step:**  
   Refine the expense query.  
   - Leave it empty to import recent expenses (default limit: 20).  
   - Or, choose a start/end date and set a custom limit.  
   When ready, click **Submit**.

4. **Expenses step:**  
   The app shows the fetched expenses with their details:  
   - Date  
   - Description  
   - Your total share (green = positive, red = negative)  
   - Repayments per person involved  
   
   You can delete expenses you don’t want to import.  
   When done, click **'Login to YNAB and export'**.

   _**Note:**_ Expenses involving multiple people (i.e., with more than one repayment) will be imported as a single YNAB transaction with subtransactions.

5. **Budget step:**  
   Choose the budget you want to import to.

6. **Account step:**  
   Choose the account you want to import to, then continue.

7. **Export step:**  
   Final confirmation before exporting. Click **'Export transactions'** to approve.

And that’s it—your Splitwise expenses now appear in YNAB!

---

## Configuring & Deploying

### If you want to deploy this app yourself, follow these steps:

1. **Register on Splitwise API:**  
   [Register here](https://secure.splitwise.com/apps) by clicking **'Register your application'**.  
   Set the **Callback URL** to:  
   `<your.backend.url>/auth/splitwise/callback`  
   If deploying locally, use: `http://localhost:10000`.  
   Save your **consumer key** and **consumer secret**.

2. **Register on YNAB API:**  
   [Register here](https://app.ynab.com/settings/developer) by clicking **'New Application'** under **OAuth Applications**.  
   Save your **client ID** and **client secret**.

3. **Configure environment variables:**  
   Inside the main repo, there are two folders: `client` and `server`.

   - In `server/.env_example`, paste the relevant keys.  
     If running locally, the defaults should work. Otherwise, update `FRONTEND_URL`, `API_BASE_URL`, and `PORT`.  
     Rename the file to `.env`.

   - In `client/.env_example`, paste the relevant keys as well.  
     Again, if running locally, you can leave most as-is.  
     Otherwise, update `VITE_API_BASE_URL` to your backend URL.  
     Rename this file to `.env` too.

4. **Run the app locally:**  
   - In the `client` folder:  
     ```bash
     npm install
     npm run dev
     ```
     The terminal will print a local URL for the app.

   - In the `server` folder:  
     ```bash
     npm install
     node server.js
     ```

That’s it—your local app should now be running!

## Contributing

Contributions are welcome!  
Feel free to open issues, suggest features, or create pull requests.

If you're running into setup issues, check the `.env_example` files and deployment steps above. For anything else—feel free to reach out.

