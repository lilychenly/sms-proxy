const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Missing text parameter" });
        }

        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions', 
            {
                model: "deepseek-chat",
                messages: [{
                    role: "user",
                    content: `分析是否为恶意短信：\n"${text}"\n返回JSON：{"is_malicious": true/false, "reason": "原因"}`
                }],
                temperature: 0.7,
                max_tokens: 1000
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 设置端口并启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
