export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    return Response.json({
      reply: `आपने लिखा: ${message}`,
    })
  } catch {
    return Response.json(
      {
        reply: "मैसेज पढ़ने में दिक्कत हुई।",
      },
      {
        status: 500,
      },
    )
  }
}