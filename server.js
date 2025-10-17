import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { company, message } = req.body;

  const companyProfiles = {
    akio: "Akio Design is a creative studio in Osaka specializing in branding and motion design.",
    nova: "NovaVision Studio focuses on web design and digital marketing.",
    default: "You are a helpful business assistant that answers politely and clearly."
  };
  const context = companyProfiles[company] || companyProfiles.default;
  const prompt = `${context}\nUser: ${message}\nAssistant:`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No reply generated.";

    res.json({ reply });
  } catch (err) {
    console.error("OpenRouter error:", err.message);
    res.json({ reply: "Error connecting to chatbot." });
  }
});

app.listen(3000, () =>
  console.log("✅ Chatbot (OpenRouter) running on port 3000")
);
