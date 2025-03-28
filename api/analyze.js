import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text parameter" });
    }

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `分析是否为恶意短信：\n"${text}"\n返回JSON：{"is_malicious": true/false, "reason": "原因"}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    res.status(200).json(JSON.parse(response.data.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
