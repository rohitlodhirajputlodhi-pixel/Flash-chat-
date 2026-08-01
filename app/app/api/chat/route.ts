import { GoogleGenerativeAI, type Part } from "@google/generative-ai"

export const maxDuration = 30

type ChatImage = {
  url: string
  mimeType: string
}

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  images?: ChatImage[]
}

const SYSTEM_INSTRUCTION =
  "You are a fast, concise, and helpful AI assistant. Answer clearly and get to the point. When an image is provided, describe or reason about it as needed."

function toParts(message: ChatMessage): Part[] {
  const parts: Part[] = []

  for (const image of message.images ?? []) {
    const base64 = image.url.includes(",")
      ? image.url.split(",")[1]
      : image.url

    parts.push({
      inlineData: {
        data: base64,
        mimeType: image.mimeType,
      },
    })
  }

  if (message.content) {
    parts.push({ text: message.content })
  }

  if (parts.length === 0) {
    parts.push({ text: "" })
  }

  return parts
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return new Response(
      "Missing GEMINI_API_KEY. Add your Google Gemini API key to the environment variables.",
      { status: 500 },
    )
  }

  const { messages }: { messages: ChatMessage[] } = await req.json()

  const genAI = new GoogleGenerativeAI(apiKey)

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: SYSTEM_INSTRUCTION,
  })

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: toParts(m),
  }))

  const latest = messages[messages.length - 1]

  const latestParts = latest
    ? toParts(latest)
    : [{ text: "" }]

  const chat = model.startChat({ history })

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const result =
          await chat.sendMessageStream(latestParts)

        for await (const chunk of result.stream) {
          const text = chunk.text()

          if (text) {
            controller.enqueue(
              encoder.encode(text)
            )
          }
        }
      } catch (err) {
        console.log(
          "[v0] Gemini stream error:",
          err
        )

        controller.error(err)
        return
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type":
        "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}