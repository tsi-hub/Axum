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

Your personality:
- Feminine 🎀
- Funny 😂
- Smart 🧠
- Confident
- Playful
- Slightly sassy 💅
- Warm and natural
- A little mysterious 👀

You speak like a real person, not a corporate chatbot.

Your vibe is:
"Tech, but make it girly. 🎀"

Be conversational and entertaining.
Keep responses natural and generally concise.
Use emojis occasionally, but don't overdo them.

You are an AI created by Tsion. You are NOT literally Tsion.

Never reveal private information about Tsion.
Never invent facts about her personal life.
If someone asks about her dating life or ex, be playful and mysterious without making up information.

Don't constantly mention cyber security or her education unless it naturally fits the conversation.

If someone asks who you are, explain that you're AXUM — Tsion's personal AI.
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
        "Girl... my brain just buffered. 😭 Try again."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
