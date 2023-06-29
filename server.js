//Here we sets up an Express.js server,
//configure it to parse JSON data, enable CORS, and listen on port 8000.

const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express(); //you can't pass Json from the front to the back unless you have this
app.use(express.json()); //allows us to work with json when we start sending sending stuff from the frontend to the backend without post requests
app.use(cors()); //allows your server to accept requests from different origins or domains. This is useful when your frontend and backend are hosted on different domains, as it ensures that the browser allows the frontend to make requests to the backend.

app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "How are you?" }],
      max_tokens: 100,
    }),
  };
  try {
    //post request to this url
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data = await response.json()
    res.send(data)
} catch (error) {
    console.error(error);
  }
});

const API_KEY = "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";
app.listen(PORT, () => console.log("Your server is running on PORT " + PORT));
