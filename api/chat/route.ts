import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      reply: text
    });
  } catch (error) {
    return Response.json({
      reply: "माफ़ कीजिए, कुछ तकनीकी समस्या आ रही है।"
    }, { status: 500 });
  }
}
