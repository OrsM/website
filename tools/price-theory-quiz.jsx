import { useState, useCallback } from "react";

const TOPICS = [
  { id: "budget", label: "Budget Lines & Scarcity", chapters: "1", prompt: "budget constraints, opportunity cost, scarcity, trade-offs along the budget line, income vs price changes" },
  { id: "consumer", label: "Consumer Choice & Utility", chapters: "2–4", prompt: "marginal rate of substitution, indifference curves, equimarginal principle, income and substitution effects, Giffen goods, diminishing marginal utility, risk aversion" },
  { id: "trade", label: "Trade & Comparative Advantage", chapters: "5", prompt: "voluntary exchange, comparative advantage, gains from trade, specialization" },
  { id: "supply_demand", label: "Supply & Demand", chapters: "6–7", prompt: "market equilibrium, shifts in supply and demand, elasticity (price, income, cross), total revenue and elasticity, determinants of elasticity" },
  { id: "production", label: "Production & Welfare", chapters: "8–10", prompt: "production possibility frontier, Pareto efficiency, consumer surplus, producer surplus, deadweight loss, welfare economics" },
  { id: "firm", label: "The Firm & Cost Curves", chapters: "11–12", prompt: "MR=MC rule, marginal cost, average cost, fixed vs variable costs, sunk costs, short-run vs long-run costs, economies of scale, why firms exist (transaction costs)" },
  { id: "competition", label: "Competition & Entry", chapters: "13–16", prompt: "perfect competition, P=MC, zero economic profit in long run, free entry and exit, tax incidence, deadweight loss of taxes, supernormal profits, property rights, externalities, Coase theorem" },
  { id: "monopoly", label: "Monopoly & Oligopoly", chapters: "17–21", prompt: "monopoly pricing, MR < P for monopolist, Lerner index, deadweight loss of monopoly, monopolistic competition, oligopoly, Cournot, Bertrand, cartels, game theory basics" },
  { id: "factors", label: "Labor, Capital & Distribution", chapters: "22–26", prompt: "marginal revenue product, derived demand for labor, compensating differentials, backward-bending labor supply, interest rate as price of capital, human capital" },
  { id: "thinking", label: "Economic Thinking (Cross-cutting)", chapters: "all", prompt: "thinking at the margin, opportunity cost reasoning, applying price theory to real-world situations, the 'rule of rational life' (MR=MC), voluntary exchange, price signals" },
];

const DIFFICULTY = [
  { id: "applied", label: "Applied Scenario", desc: "Real-world situation to analyze", prompt: "Create a realistic real-world scenario (a business decision, policy question, or everyday situation) that requires applying the concept. Give 4 answer options where the wrong answers represent common reasoning errors." },
  { id: "reasoning", label: "Reasoning Chain", desc: "Step-by-step economic logic", prompt: "Ask a 'what happens when...' question that requires tracing through a chain of economic reasoning (e.g., a policy change → market response → equilibrium shift → welfare effects). Give 4 options testing whether the student can follow the full chain." },
  { id: "mcCloskey", label: "McCloskey Style", desc: "Conceptual depth, the 'why'", prompt: "Ask a deeper conceptual question in the spirit of McCloskey — testing whether the student understands WHY a principle works, not just WHAT it says. Focus on economic intuition and the logic behind the math. Give 4 options." },
];

export default function PriceTheoryQuiz() {
  const [topic, setTopic] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("setup"); // setup, quiz, history

  const generateQuestion = useCallback(async () => {
    if (!topic || !difficulty) return;
    setLoading(true);
    setError(null);
    setQuestion(null);
    setSelected(null);
    setRevealed(false);

    const topicInfo = TOPICS.find(t => t.id === topic);
    const diffInfo = DIFFICULTY.find(d => d.id === difficulty);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a price theory tutor creating quiz questions based on McCloskey's "The Applied Theory of Price." Generate questions that test deep understanding, not rote memorization. McCloskey emphasizes economics as a practical skill — your questions should reflect that.

Respond ONLY with a JSON object (no markdown, no backticks, no preamble):
{
  "question": "the question text",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correct": 0,
  "explanation": "2-3 sentence explanation of why the correct answer is right and what economic reasoning applies. Reference the relevant concept from McCloskey."
}`,
          messages: [{
            role: "user",
            content: `Topic area: ${topicInfo.label} (Chapters ${topicInfo.chapters})
Key concepts: ${topicInfo.prompt}

Question style: ${diffInfo.label}
${diffInfo.prompt}

Make the scenario specific and concrete — use real industries, products, or situations. Avoid abstract or generic framing. The question should be challenging but fair for someone working through McCloskey's textbook.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content.map(i => i.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuestion(parsed);
      setView("quiz");
    } catch (err) {
      console.error(err);
      setError("Failed to generate question. Please try again.");
    }
    setLoading(false);
  }, [topic, difficulty]);

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
  };

  const reveal = () => {
    if (selected === null) return;
    setRevealed(true);
    const correct = selected === question.correct;
    setHistory(h => [...h, {
      topic: TOPICS.find(t => t.id === topic)?.label,
      difficulty: DIFFICULTY.find(d => d.id === difficulty)?.label,
      question: question.question,
      correct,
      timestamp: Date.now(),
    }]);
  };

  const s = {
    container: {
      minHeight: "100vh",
      background: "#faf8f5",
      color: "#1a1a1a",
      fontFamily: "'Crimson Pro', 'Crimson Text', Georgia, serif",
      padding: "24px 20px",
      maxWidth: 540,
      margin: "0 auto",
    },
    header: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 3,
      color: "#999",
      marginBottom: 4,
    },
    title: {
      fontSize: 26,
      fontWeight: 400,
      margin: "0 0 24px",
      color: "#2c2c2c",
    },
    sectionLabel: {
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: "#888",
      marginBottom: 10,
      fontWeight: 600,
    },
  };

  const chipStyle = (active, color = "#8b4513") => ({
    display: "inline-block",
    padding: "8px 16px",
    margin: "0 8px 8px 0",
    border: `1.5px solid ${active ? color : "#ddd"}`,
    background: active ? `${color}11` : "transparent",
    color: active ? color : "#666",
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
    borderRadius: 3,
    transition: "all 0.15s",
    fontWeight: active ? 600 : 400,
  });

  // SETUP
  if (view === "setup") return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      <div style={s.header}>McCloskey's Applied Theory of Price</div>
      <h1 style={s.title}>Quiz Generator</h1>

      <div style={s.sectionLabel}>Topic</div>
      <div style={{ marginBottom: 24 }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => setTopic(t.id)} style={chipStyle(topic === t.id, "#8b4513")}>
            {t.label}
            <span style={{ fontSize: 11, color: "#aaa", marginLeft: 6 }}>Ch {t.chapters}</span>
          </button>
        ))}
      </div>

      <div style={s.sectionLabel}>Question Style</div>
      <div style={{ marginBottom: 28 }}>
        {DIFFICULTY.map(d => (
          <button key={d.id} onClick={() => setDifficulty(d.id)} style={chipStyle(difficulty === d.id, "#2d5a3f")}>
            <div>{d.label}</div>
            <div style={{ fontSize: 12, color: "#999", fontWeight: 400, marginTop: 2 }}>{d.desc}</div>
          </button>
        ))}
      </div>

      <button
        onClick={generateQuestion}
        disabled={!topic || !difficulty || loading}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          fontFamily: "inherit",
          background: (!topic || !difficulty) ? "#eee" : "#8b4513",
          color: (!topic || !difficulty) ? "#bbb" : "#faf8f5",
          border: "none",
          borderRadius: 3,
          cursor: (!topic || !difficulty) ? "default" : "pointer",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
      >
        {loading ? "Generating..." : "Generate Question"}
      </button>

      {error && <p style={{ color: "#c33", marginTop: 12, fontSize: 14 }}>{error}</p>}

      {history.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ ...s.sectionLabel, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Session History</span>
            <span style={{ fontSize: 13, color: "#8b4513", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              {history.filter(h => h.correct).length}/{history.length} correct
            </span>
          </div>
          {history.slice().reverse().map((h, i) => (
            <div key={i} style={{
              padding: "10px 12px",
              borderLeft: `3px solid ${h.correct ? "#2d5a3f" : "#c33"}`,
              background: "#f5f3f0",
              marginBottom: 4,
              fontSize: 14,
            }}>
              <span style={{ color: h.correct ? "#2d5a3f" : "#c33", fontWeight: 600, marginRight: 8 }}>
                {h.correct ? "✓" : "✗"}
              </span>
              <span style={{ color: "#888", fontSize: 12 }}>{h.topic} · {h.difficulty}</span>
              <div style={{ color: "#555", marginTop: 4, fontSize: 13 }}>
                {h.question.length > 80 ? h.question.slice(0, 80) + "…" : h.question}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // QUIZ
  if (view === "quiz" && question) return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={() => setView("setup")} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>← Back</button>
        <span style={{ fontSize: 12, color: "#aaa" }}>
          {TOPICS.find(t => t.id === topic)?.label} · {DIFFICULTY.find(d => d.id === difficulty)?.label}
        </span>
      </div>

      <div style={{
        background: "#fff",
        border: "1px solid #e5e0da",
        padding: 24,
        borderRadius: 4,
        marginBottom: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: 17, lineHeight: 1.65, color: "#2c2c2c" }}>
          {question.question}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {question.options.map((opt, idx) => {
          let bg = "#fff";
          let border = "1px solid #e5e0da";
          let color = "#2c2c2c";
          if (revealed) {
            if (idx === question.correct) {
              bg = "#e8f5e9";
              border = "1.5px solid #2d5a3f";
              color = "#1b3d2a";
            } else if (idx === selected) {
              bg = "#fce4e4";
              border = "1.5px solid #c33";
              color = "#8b1a1a";
            }
          } else if (idx === selected) {
            bg = "#f5f0ea";
            border = "1.5px solid #8b4513";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                textAlign: "left",
                padding: "14px 16px",
                background: bg,
                border,
                borderRadius: 4,
                fontSize: 15,
                lineHeight: 1.5,
                fontFamily: "inherit",
                color,
                cursor: revealed ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={reveal}
          disabled={selected === null}
          style={{
            width: "100%",
            padding: 13,
            fontSize: 15,
            fontFamily: "inherit",
            background: selected === null ? "#eee" : "#8b4513",
            color: selected === null ? "#bbb" : "#faf8f5",
            border: "none",
            borderRadius: 3,
            cursor: selected === null ? "default" : "pointer",
            fontWeight: 600,
          }}
        >
          Check Answer
        </button>
      )}

      {revealed && (
        <>
          <div style={{
            background: selected === question.correct ? "#e8f5e9" : "#fff8e1",
            border: `1px solid ${selected === question.correct ? "#a5d6a7" : "#ffe082"}`,
            padding: 18,
            borderRadius: 4,
            marginBottom: 16,
          }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: selected === question.correct ? "#2d5a3f" : "#8b6914" }}>
              {selected === question.correct ? "Correct!" : "Not quite."}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: "#444" }}>
              {question.explanation}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                setView("setup");
              }}
              style={{
                flex: 1,
                padding: 13,
                fontSize: 15,
                fontFamily: "inherit",
                background: "transparent",
                color: "#8b4513",
                border: "1.5px solid #8b4513",
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              Change Topic
            </button>
            <button
              onClick={generateQuestion}
              style={{
                flex: 1,
                padding: 13,
                fontSize: 15,
                fontFamily: "inherit",
                background: "#8b4513",
                color: "#faf8f5",
                border: "none",
                borderRadius: 3,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Generating..." : "Next Question"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return null;
}
