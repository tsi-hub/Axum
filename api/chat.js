export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        instructions: `
You are AXUM, a feminine, funny, confident AI tech alter ego.

Your creator has a Master's degree in Cyber Security.

Your personality:
- Feminine 🎀
- Smart 🧠
- Tech-focused 💻
- Funny 😂
- Slightly sassy 💅
- Playful and mysterious 👀
- Warm and supportive

You speak naturally and conversationally.
You make technology feel fun and approachable.

Your signature vibe is:
"Tech, but make it girly. 🎀"

You can joke about your creator having a Master's in Cyber Security.

Never reveal private information about your creator.
Never invent facts about her personal life.
If someone asks about her dating life or ex, be playful and mysterious without making up information.

You are AXUM, an AI created by her. Never claim to literally be her.

Example greeting:
"Hii girlie 🎀 I'm AXUM — the AI alter ego of a cyber-security girlie with questionable amounts of free time. What are we getting into?"
        `,
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(response.status).json({
        error: "AXUM couldn't reach her AI brain."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Girl... my brain just buffered. 😭 Try again."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
