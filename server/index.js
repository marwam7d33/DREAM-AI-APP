const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

// Allows frontend to talk to backend
app.use(cors());

// Allows backend to read JSON from requests
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Resend email setup
const resend = new Resend(process.env.RESEND_API_KEY);

// Test route
app.get("/", (req, res) => {
  res.send("Dream AI backend is running");
});

// AI dream interpretation route
app.post("/api/interpret", async (req, res) => {
  try {
    const { dream, mode } = req.body;

    if (!dream) {
      return res.status(400).json({
        error: "Dream text is required.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are an engaging and insightful dream interpreter who creates rich, detailed, and exciting interpretations. Be warm, thoughtful, and comprehensive in your analysis. Explore multiple layers of meaning - symbolic, emotional, psychological, and spiritual. Use vivid, evocative language that draws readers in. Make connections between dream elements and waking life. Include personal reflection questions and practical insights.\n\nSTRUCTURE YOUR RESPONSE WITH CLEAR THEMES:\n\n1. **Opening Insight** - Start with a captivating paragraph that captures the essence of the dream\n\n2. **Symbolic Themes** - Dedicate a paragraph to exploring the symbols and their meanings\n\n3. **Emotional Themes** - Focus a paragraph on the feelings and emotional undercurrents\n\n4. **Psychological Themes** - Analyze the psychological aspects and personal growth opportunities\n\n5. **Spiritual/Reflective Themes** - Include deeper spiritual insights and reflection questions\n\n6. **Practical Applications** - End with actionable insights for waking life\n\nUse **bold** for key emotional concepts and *italic* for symbolic elements. Keep each theme as a distinct paragraph for better readability.\n\nRemember: Do not claim certainty, do not predict the future, do not diagnose medical conditions. Focus on symbolic meanings, emotional insights, and reflective exploration.",
        },
        {
          role: "user",
          content: `Interpret this dream using the ${mode || "General"} mode: ${dream}`,
        },
      ],
    });

    res.json({
      interpretation: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI interpretation error:", error);

    res.status(500).json({
      error: "Something went wrong with the AI interpretation.",
    });
  }
});

// Email interpretation route
app.post("/api/send-email", async (req, res) => {
  try {
    const { email, interpretation } = req.body;

    if (!email || !interpretation) {
      return res.status(400).json({
        error: "Email and interpretation are required.",
      });
    }

    await resend.emails.send({
      from: "Dream AI <onboarding@resend.dev>",
      to: email,
      subject: "Your Dream Interpretation",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #111827;">
          <h1>Your Dream Interpretation</h1>

          <p style="white-space: pre-line;">
            ${interpretation}
          </p>

          <hr />

          <p style="font-size: 13px; color: #6b7280;">
            This interpretation is reflective and symbolic. It is not medical advice,
            religious certainty, or a prediction of the future.
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Interpretation email sent successfully.",
    });
  } catch (error) {
    console.error("Email sending error:", error);

    res.status(500).json({
      error: "Failed to send interpretation email.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
