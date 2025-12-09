import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, IconButton, Typography, Avatar, Paper, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../services/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant for bike parts. How can I help you today?", sender: "bot", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState("default");
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now(), text: input, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/chat/ai/send", {
        message: input,
        conversationId
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      bgcolor: "#151616ff",
      "@keyframes bounce": {
        "0%, 80%, 100%": { transform: "scale(0)" },
        "40%": { transform: "scale(1)" }
      }
    }}>

      {/* Header */}
      <Box sx={{ p: 2, bgcolor: "#e63900", color: "#fff", display: "flex", alignItems: "center" }}>
        <Avatar sx={{ mr: 2, bgcolor: "#867f88ff", color: "#e63900" }}>🤖</Avatar>
        <Box>
          <Typography variant="h6">AI Bike Parts Assistant</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Powered by AI • Ask me anything about bike parts!
          </Typography>
        </Box>
      </Box>

      {/* Chat messages */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        {messages.map(msg => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            {msg.sender === "bot" && (
              <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: "#e63900" }}>🤖</Avatar>
            )}
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                borderRadius: 2,
                maxWidth: "70%",
                bgcolor: msg.sender === "user" ? "#171b1fff" : "#1fb1bcff",
                color: msg.sender === "user" ? "#fff" : "#000",
                wordBreak: "break-word",
                position: "relative",
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  opacity: 0.6,
                  textAlign: msg.sender === "user" ? "right" : "left"
                }}
              >
                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
            {msg.sender === "user" && (
              <Avatar sx={{ ml: 1, width: 32, height: 32, bgcolor: "#007bff" }}>U</Avatar>
            )}
          </Box>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: "#e63900" }}>🤖</Avatar>
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#1fb1bcff",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">AI is typing</Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Box sx={{
                  width: 4, height: 4, bgcolor: "#666", borderRadius: "50%",
                  animation: "bounce 1.4s infinite ease-in-out both"
                }} />
                <Box sx={{
                  width: 4, height: 4, bgcolor: "#666", borderRadius: "50%",
                  animation: "bounce 1.4s infinite ease-in-out both 0.2s"
                }} />
                <Box sx={{
                  width: 4, height: 4, bgcolor: "#666", borderRadius: "50%",
                  animation: "bounce 1.4s infinite ease-in-out both 0.4s"
                }} />
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input bar */}
      <Box
        sx={{
          display: "flex",
          p: 2,
          bgcolor: "#958787ff",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          position: "sticky",
          bottom: 0,
        }}
      >
        <TextField
          placeholder="Ask me about bike parts, maintenance, or recommendations..."
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={isTyping}
          sx={{
            borderRadius: "50px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          sx={{
            ml: 1,
            bgcolor: "#e63900",
            "&:hover": { bgcolor: "#ff6a00" },
            color: "#fff",
            "&:disabled": { bgcolor: "#ccc" }
          }}
        >
          {isTyping ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
