export default async function handler(req, res) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // --- Read body safely (no req.json on Vercel) ---
    let body = "";
    for await (const chunk of req) body += chunk;
    const { message } = JSON.parse(body || "{}");

    // --- Call OpenAI ---
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are SivGPT, a concise and friendly version of Siv Sørensen who answers questions about her work, research, and background.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await r.json();

    // --- Send back reply ---
    res
      .status(200)
      .json({ answer: data.choices?.[0]?.message?.content || "No reply." });
  } catch (err) {
    res.status(500).json({ answer: "Error: " + err.message });
  }
}
