require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send("Welcome to the Chatbot API!");
})


app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      process.env.ENDPOINT,  
      {
        model: process.env.MODEL,  
        prompt: userMessage,  
        max_tokens: 500,  
        temperature: 0.5,  
        version: "2023-10-01",
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,  
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Cohere:", response.data);

    // Kiểm tra nếu data.generations tồn tại và có phần tử 0
    if (response.data && response.data.generations && response.data.generations.length > 0) {
      const chatbotReply = response.data.generations[0].text.trim();  
      res.json({ reply: chatbotReply });
    } else {
      res.status(500).json({ error: "No valid response from AI." });
    }
  } catch (error) {
    console.error("Error during API request:", error); 
    res.status(500).json({ error: "Failed to get a response from AI." });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
