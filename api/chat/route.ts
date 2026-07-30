export async function POST(request: Request) {
  const { message } = await request.json()

  return Response.json({
    reply: `आपने लिखा: ${message}`
  })
}