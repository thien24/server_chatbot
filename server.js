// Import dotenv để tải các biến môi trường
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send("Welcome to the Chatbot API!");
})


// API để nhận yêu cầu và trả lời từ Chatbot
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Gửi yêu cầu đến Cohere API
    const response = await axios.post(
      process.env.ENDPOINT,  // Sử dụng endpoint từ biến môi trường
      {
        model: process.env.MODEL,  // Sử dụng model từ biến môi trường
        prompt: userMessage,  // Tin nhắn người dùng gửi
        max_tokens: 500,  // Số từ tối đa trong phản hồi
        temperature: 0.5,  // Điều chỉnh sự ngẫu nhiên trong phản hồi
        version: "2023-10-01",
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,  // Lấy API key từ biến môi trường
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Cohere:", response.data); // Log toàn bộ response từ Cohere

    // Kiểm tra nếu data.generations tồn tại và có phần tử 0
    if (response.data && response.data.generations && response.data.generations.length > 0) {
      const chatbotReply = response.data.generations[0].text.trim();  // Lấy phản hồi từ Cohere
      res.json({ reply: chatbotReply });
    } else {
      res.status(500).json({ error: "No valid response from AI." });
    }
  } catch (error) {
    console.error("Error during API request:", error);  // Log chi tiết lỗi
    res.status(500).json({ error: "Failed to get a response from AI." });
  }
});

// Lắng nghe trên port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
