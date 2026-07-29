"use client"

import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  function sendMessage() {
    if (message.trim() === "") return

    setMessages([...messages, message])
    setMessage("")
  }

  return (
    <main style={{
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial"
    }}>
      <h1>⚡ Flash Chat</h1>
      <p>अपने सवाल लिखो और बातचीत शुरू करो</p>

      <div style={{
        minHeight: "350px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "15px",
        marginTop: "20px"
      }}>
        {messages.length === 0 ? (
          <p>👋 Hello! मैं Flash Chat हूँ।</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index}>👤 {msg}</p>
          ))
        )}
      </div>

      <div style={{
        display: "flex",
        gap: "10px",
        marginTop: "15px"
      }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage()
          }}
          placeholder="अपना संदेश लिखो..."
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            border: "none"
          }}
        >
          Send
        </button>
      </div>
    </main>
  )
}