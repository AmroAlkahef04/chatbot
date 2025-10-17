// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// POST /chat
app.post("/chat", async (req, res) => {
  const { company, message } = req.body;

  if (!message) {
    return res.json({ reply: "Please include a message." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct", // or another available model
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for ${company}. Answer concisely and clearly.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ reply: data.choices[0].message.content });
    } else if (data.error) {
      console.error("OpenRouter API error:", data.error);
      res.json({ reply: "OpenRouter API error. Please check your API key or model." });
    } else {
      res.json({ reply: "No response received from model." });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.json({ reply: "Error connecting to chatbot." });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Chatbot (OpenRouter) API is running ✅");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Chatbot (OpenRouter) running on port ${PORT}`);
});
