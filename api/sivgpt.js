export const config = {
  runtime: "nodejs",  // ensures Node.js runtime, not Edge
};


export default async function handler(req, res) {
  // --- Handle non-POSTs and preflight ---
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // --- Read raw request body safely (no req.json in Vercel edge) ---
  let body = "";
  for await (const chunk of req) body += chunk;
  const { message } = JSON.parse(body || "{}");

  try {
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

    // --- CORS headers for browser access ---
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // --- Send response ---
    res.status(200).json({
      answer: data.choices?.[0]?.message?.content || "No reply.",
    });
  } catch (err) {
    res.status(500).json({
      answer: "Error: " + err.message,
    });
  }
}
