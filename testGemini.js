import fetch from "node-fetch";

const API_KEY = "AIzaSyDXsdBNjnlsRxDoNWyhvsXMk9XfAr_MsTQ"; // your key

const runTest = async () => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello from Node.js test!" }] }],
      }),
    }
  );

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
};

runTest().catch(console.error);
