require("dotenv").config(); // credentials go here
const express = require("express");
const request = require("request");
const app = express();
const port = process.env.PORT || "5050";
const bodyParser = require('body-parser'); // JSON middleware to recognize the incoming request object as a JSON
const { v4: uuidv4 } = require('uuid'); // GUID generation helper
const { Client, Config, CheckoutAPI } = require("@adyen/api-library"); // import Adyen API library

// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config(); //instantiate config
config.apiKey = process.env.ADYEN_API_KEY; //set API key against config
const client = new Client({ config }); //instantiate client with configs
client.setEnvironment("TEST"); //set client environment
const checkout = new CheckoutAPI(client); //instantiate checkoutAPI with client configs

app.use(bodyParser.json())

// Create a payment session
app.post("/sessions", async (req, res) => {
  try {
    // unique ref for the transaction
    const orderNo = 'order_'+uuidv4();

    // Ideally the data passed here should come from shopper's cart details
    const response = await checkout.sessions({
      amount: {
        value: 50000, //this is in minor units
        currency: "USD"
      },
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
      reference: uuidv4(),
      returnUrl: `https://seanvanho.com?order_no=${orderNo}`,
      countryCode: "US"
    });
    res.json(response); 
    console.log('response: ', response)
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});


app.listen(port, () =>
  console.log("Web server listening on port", port)
);
