import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return Response.json(
        {
          reply: "Gemini API key नहीं मिली।",
        },
        {
          status: 500,
        },
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    })

    const result = await model.generateContent(message)

    const reply = result.response.text()

    return Response.json({
      reply,
    })
  } catch (error) {
    console.error("Gemini error:", error)

    return Response.json(
      {
        reply: "अभी AI जवाब नहीं दे पाया।",
      },
      {
        status: 500,
      },
    )
  }
}