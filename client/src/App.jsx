import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [dream, setDream] = useState("");
  const [mode, setMode] = useState("General");
  const [result, setResult] = useState("");
  const [email, setEmail] = useState("");
  const formatResult = (text) => {
    // Convert AI response to styled HTML with structured themes
    let formatted = text
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Convert *italic* to <em>
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Split into paragraphs and wrap each in theme sections
      .split("\n\n")
      .filter((p) => p.trim())
      .map((paragraph, index) => {
        // Create theme titles based on paragraph content
        let themeTitle = "";
        if (index === 0) {
          themeTitle = "Opening Insight";
        } else if (
          paragraph.toLowerCase().includes("flying") ||
          paragraph.toLowerCase().includes("symbol") ||
          paragraph.toLowerCase().includes("clouds")
        ) {
          themeTitle = "Symbolic Themes";
        } else if (
          paragraph.toLowerCase().includes("emotional") ||
          paragraph.toLowerCase().includes("feel") ||
          paragraph.toLowerCase().includes("sensation") ||
          paragraph.toLowerCase().includes("elation")
        ) {
          themeTitle = "Emotional Themes";
        } else if (
          paragraph.toLowerCase().includes("psychological") ||
          paragraph.toLowerCase().includes("mind") ||
          paragraph.toLowerCase().includes("personal growth") ||
          paragraph.toLowerCase().includes("ambitions")
        ) {
          themeTitle = "Psychological Themes";
        } else if (
          paragraph.toLowerCase().includes("spiritual") ||
          paragraph.toLowerCase().includes("introspection") ||
          paragraph.toLowerCase().includes("reflection") ||
          paragraph.toLowerCase().includes("divine")
        ) {
          themeTitle = "Spiritual & Reflective Themes";
        } else if (
          paragraph.toLowerCase().includes("practical") ||
          paragraph.toLowerCase().includes("consider") ||
          paragraph.toLowerCase().includes("ask yourself") ||
          paragraph.toLowerCase().includes("journaling")
        ) {
          themeTitle = "Practical Applications";
        } else {
          themeTitle = "Additional Insights";
        }

        return `<div class="theme-section"><h3 class="theme-title">${themeTitle}</h3><p class="theme-content">${paragraph.trim()}</p></div>`;
      })
      .join("");

    return formatted;
  };
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleInterpret = async () => {
    if (!dream.trim()) return;

    setLoading(true);
    setResult("");

    const response = await fetch(
      "https://dream-ai-app.onrender.com/api/interpret",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream, mode }),
      },
    );

    const data = await response.json();
    setResult(data.interpretation);
    setLoading(false);
  };

  const handleSendEmail = async () => {
    if (!email.trim() || !result.trim()) {
      alert("Please enter an email and get an interpretation first.");
      return;
    }

    setEmailSending(true);
    setEmailSent(false);

    try {
      const response = await fetch(
        "https://dream-ai-app.onrender.com/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, interpretation: result }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setEmail("");
        setTimeout(() => setEmailSent(false), 3000);
      } else {
        alert("Failed to send email: " + data.error);
      }
    } catch (error) {
      console.error("Email send error:", error);
      alert("Error sending email. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <main className="app">
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>

      <motion.section
        className="glass-shell"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="glass-card">
          <div className="glass-header">
            <p className="eyebrow">AI Dream Reflection</p>
            <h1>Understand the symbols behind your dreams</h1>
            <p className="subtitle">
              A calm, reflective space for exploring dream themes, emotions, and
              possible meanings.
            </p>
          </div>

          <div className="glass-card-inner">
            <div className="glass-form">
              <label htmlFor="mode-select">Interpretation Mode</label>
              <select
                id="mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option>General</option>
                <option>Psychological</option>
                <option>Islamic Reflection</option>
                <option>Symbolic</option>
              </select>

              <textarea
                placeholder="Describe your dream..."
                value={dream}
                onChange={(e) => setDream(e.target.value)}
              />
            </div>

            <div className="glass-actions">
              <button
                className={
                  mode === "General" ? "pill-button active" : "pill-button"
                }
                onClick={() => setMode("General")}
              >
                General
              </button>
              <button
                className={
                  mode === "Psychological"
                    ? "pill-button active"
                    : "pill-button"
                }
                onClick={() => setMode("Psychological")}
              >
                Psychological
              </button>
              <button
                className={
                  mode === "Islamic Reflection"
                    ? "pill-button active"
                    : "pill-button"
                }
                onClick={() => setMode("Islamic Reflection")}
              >
                Islamic
              </button>
              <button
                className={
                  mode === "Symbolic" ? "pill-button active" : "pill-button"
                }
                onClick={() => setMode("Symbolic")}
              >
                Symbolic
              </button>
            </div>

            <div className="wave-row">
              <span className="wave-line"></span>
              <span className="wave-point point-a"></span>
              <span className="wave-point point-b"></span>
              <span className="wave-point point-c"></span>
            </div>
          </div>
        </div>

        {result && (
          <motion.div
            className="result-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Your Interpretation</h2>
            <div dangerouslySetInnerHTML={{ __html: formatResult(result) }} />

            <div className="email-section">
              <div className="email-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
                <motion.button
                  className="email-button"
                  onClick={handleSendEmail}
                  disabled={emailSending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {emailSending ? "Sending..." : "Email Interpretation"}
                </motion.button>
              </div>
              {emailSent && (
                <motion.p
                  className="email-success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ✓ Interpretation sent successfully!
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        <motion.button
          className="interpret-button"
          onClick={handleInterpret}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Interpreting your dream..." : "Interpret Dream"}
        </motion.button>
      </motion.section>
    </main>
  );
}

export default App;
