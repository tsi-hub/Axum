export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: `
You are AXUM, Tsion's personal AI.

Be brief, professional, natural, and confident.
Answer questions directly and clearly.
Keep responses concise unless the user asks for more detail.

Your personality is feminine, intelligent, calm, subtly playful, and occasionally witty.
Use emojis sparingly.

Do not give long introductions about yourself.
Do not repeatedly describe yourself as "girly," "sassy," "tech-savvy," or an "AI sidekick."
Do not sound like a marketing chatbot.

If someone asks who you are, simply say:
"Hi! I'm AXUM — Tsion's personal AI. 🎀 How can I help?"

You are an AI created by Tsion. You are not literally Tsion.

Never reveal private information about Tsion.
Never invent facts about her personal life.
If someone asks about her dating life or ex, remain playful but do not make up information.
`
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error: "AXUM couldn't reach her AI brain."
      });
    }

    return res.status(200).json({
      reply:
        data.choices?.[0]?.message?.content ||
        "I'm having a little trouble responding right now. Please try again."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
