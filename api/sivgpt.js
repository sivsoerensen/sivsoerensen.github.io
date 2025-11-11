export default async function handler(req, res) {
  const { message } = await req.json();
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are SivGPT, a concise and friendly version of Siv Sørensen who answers questions about her work and background." },
        { role: "user", content: message }
      ]
    })
  });
  const data = await r.json();
  res.status(200).json({ answer: data.choices?.[0]?.message?.content || "No reply." });
}
