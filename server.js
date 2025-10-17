// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Route: POST /chat
app.post("/chat", async (req, res) => {
  const { company, message } = req.body;

  if (!message) {
    return res.json({ reply: "Please include a message." });
  }

  try {
    // --- Hugging Face free model endpoint ---
    const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
    const HF_API_KEY = process.env.HF_API_KEY; // from your .env

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `You are a chatbot for ${company}. The user says: ${message}`,
        parameters: { max_new_tokens: 200, temperature: 0.7 },
      }),
    });

    // Hugging Face can return either an array or an error string
    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      res.json({ reply: data[0].generated_text });
    } else if (data.error) {
      console.error("Hugging Face error:", data.error);
      res.json({ reply: "The model is sleeping or busy. Try again in a few seconds." });
    } else {
      res.json({ reply: "No response from the model." });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.json({ reply: "Error connecting to chatbot." });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Chatbot API is running ✅");
});

// Render / local port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Chatbot running on port ${PORT}`);
});
