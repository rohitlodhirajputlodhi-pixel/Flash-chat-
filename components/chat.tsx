"use client"

import { useState } from "react"

type Message = {
  text: string
  sender: "user" | "ai"
}

export function Chat() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! मैं Flash Chat हूँ। अपना सवाल लिखो।",
      sender: "ai",
    },
  ])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    const text = message.trim()

    if (!text || loading) return

    setMessages((old) => [
      ...old,
      { text, sender: "user" },
    ])

    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      })

      if (!response.ok) {
        throw new Error("API error")
      }

      const data = await response.json()

      setMessages((old) => [
        ...old,
        {
          text: data.reply || "मुझे जवाब नहीं मिला।",
          sender: "ai",
        },
      ])
    } catch {
      setMessages((old) => [
        ...old,
        {
          text: "अभी जवाब नहीं मिल पाया।",
          sender: "ai",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="mb-2 text-3xl font-bold">
        ⚡ Flash Chat
      </h1>

      <p className="mb-4">
        अपने सवाल लिखो और बातचीत शुरू करो
      </p>

      <div className="min-h-[400px] rounded-xl border p-4">
        {messages.map((item, index) => (
          <div
            key={index}
            className={
              item.sender === "user"
                ? "mb-3 text-right"
                : "mb-3 text-left"
            }
          >
            <span className="inline-block rounded-xl border p-3">
              {item.sender === "user" ? "👤 " : "🤖 "}
              {item.text}
            </span>
          </div>
        ))}

        {loading && (
          <p>🤖 जवाब लिख रहा है...</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage()
            }
          }}
          placeholder="अपना संदेश लिखो..."
          className="flex-1 rounded-xl border p-3"
        />

        <button
          onClick={sendMessage}
          className="rounded-xl border px-5"
        >
          Send
        </button>
      </div>
    </div>
  )
}