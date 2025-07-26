import React, { useState } from "react";

function GeminiApp() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiKey = "AIzaSyDpdouEBBAxyu7w6P-IbcSAoYcOkHHZ5fc";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      console.log(data);

      const resultText = data.candidates[0].content.parts[0].text;
      setResponse(resultText);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error calling Gemini API");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gemini AI Test</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Gemini something..."
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default GeminiApp;
