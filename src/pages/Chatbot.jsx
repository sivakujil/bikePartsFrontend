import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: text,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting Gemini API." },
      ]);
    }

    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gemini 2.5 Flash Chatbot</h2>

      <div
        style={{
          width: "100%",
          height: "400px",
          border: "1px solid #ccc",
          padding: 10,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: 10 }}
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;
