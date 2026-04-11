import { useState, useCallback } from "react";
import BackBar from "../../components/BackBar";
import { theme } from "../../theme";

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
  const [view, setView] = useState("setup");

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
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
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

Make the scenario specific and concrete — use real industries, products, or situations. Avoid abstract or generic framing.`,
          }],
        }),
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

  const handleSelect = (idx) => { if (!revealed) setSelected(idx); };

  const reveal = () => {
    if (selected === null) return;
    setRevealed(true);
    setHistory(h => [...h, {
      topic: TOPICS.find(t => t.id === topic)?.label,
      difficulty: DIFFICULTY.find(d => d.id === difficulty)?.label,
      question: question.question,
      correct: selected === question.correct,
    }]);
  };

  const s = {
    page: { background: theme.bg, minHeight: "100vh", fontFamily: theme.fontSans, color: theme.text },
    inner: { maxWidth: "560px", margin: "0 auto", padding: "32px 24px" },
    label: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: theme.textMuted, marginBottom: "10px" },
    chip: (active) => ({
      display: "inline-block", padding: "8px 14px", margin: "0 8px 8px 0",
      border: `1px solid ${active ? theme.text : theme.border}`,
      background: active ? theme.bgSubtle : "transparent",
      color: active ? theme.text : theme.textMuted,
      fontSize: "13px", fontFamily: theme.fontSans, cursor: "pointer", borderRadius: theme.radius,
      fontWeight: active ? "500" : "400",
    }),
    btn: (fill, disabled) => ({
      width: "100%", padding: "13px", fontSize: "14px", fontFamily: theme.fontSans,
      background: disabled ? theme.bgSubtle : fill ? theme.text : "transparent",
      color: disabled ? theme.textMuted : fill ? theme.bg : theme.text,
      border: `1px solid ${disabled ? theme.border : theme.text}`,
      borderRadius: theme.radius, cursor: disabled ? "default" : "pointer", fontWeight: "500",
    }),
    option: (idx) => {
      if (revealed) {
        if (idx === question.correct) return { bg: theme.bgSubtle, border: `1.5px solid ${theme.text}`, color: theme.text };
        if (idx === selected) return { bg: theme.bgSubtle, border: `1.5px solid ${theme.border}`, color: theme.textMuted };
      } else if (idx === selected) {
        return { bg: theme.bgSubtle, border: `1.5px solid ${theme.text}`, color: theme.text };
      }
      return { bg: theme.bg, border: `1px solid ${theme.border}`, color: theme.text };
    },
  };

  if (view === "setup") return (
    <div style={s.page}>
      <BackBar />
      <div style={s.inner}>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: theme.textMuted, marginBottom: "4px" }}>McCloskey's Applied Theory of Price</div>
        <h1 style={{ fontSize: "22px", fontWeight: "500", margin: "0 0 28px", letterSpacing: "-0.01em" }}>Quiz Generator</h1>

        <div style={s.label}>Topic</div>
        <div style={{ marginBottom: "24px" }}>
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setTopic(t.id)} style={s.chip(topic === t.id)}>
              {t.label}
              <span style={{ fontSize: "11px", color: theme.textMuted, marginLeft: "6px" }}>Ch {t.chapters}</span>
            </button>
          ))}
        </div>

        <div style={s.label}>Question Style</div>
        <div style={{ marginBottom: "28px" }}>
          {DIFFICULTY.map(d => (
            <button key={d.id} onClick={() => setDifficulty(d.id)} style={s.chip(difficulty === d.id)}>
              <div>{d.label}</div>
              <div style={{ fontSize: "11px", color: theme.textMuted, fontWeight: "400", marginTop: "2px" }}>{d.desc}</div>
            </button>
          ))}
        </div>

        <button onClick={generateQuestion} disabled={!topic || !difficulty || loading} style={s.btn(true, !topic || !difficulty)}>
          {loading ? "Generating..." : "Generate Question"}
        </button>

        {error && <p style={{ color: theme.text, marginTop: "12px", fontSize: "13px", border: `1px solid ${theme.border}`, padding: "12px", borderRadius: theme.radius }}>{error}</p>}

        {history.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <div style={{ ...s.label, display: "flex", justifyContent: "space-between" }}>
              <span>Session History</span>
              <span style={{ fontSize: "13px", color: theme.text, fontWeight: "500", textTransform: "none", letterSpacing: 0 }}>
                {history.filter(h => h.correct).length}/{history.length} correct
              </span>
            </div>
            {history.slice().reverse().map((h, i) => (
              <div key={i} style={{ padding: "10px 12px", borderLeft: `2px solid ${h.correct ? theme.text : theme.border}`, background: theme.bgSubtle, marginBottom: "4px", fontSize: "13px" }}>
                <span style={{ fontWeight: "600", marginRight: "8px" }}>{h.correct ? "✓" : "✗"}</span>
                <span style={{ color: theme.textMuted, fontSize: "11px" }}>{h.topic} · {h.difficulty}</span>
                <div style={{ color: theme.textMuted, marginTop: "4px", fontSize: "12px" }}>
                  {h.question.length > 80 ? h.question.slice(0, 80) + "…" : h.question}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (view === "quiz" && question) return (
    <div style={s.page}>
      <BackBar />
      <div style={s.inner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={() => setView("setup")} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: "13px", fontFamily: theme.fontSans }}>← Back</button>
          <span style={{ fontSize: "12px", color: theme.textMuted }}>
            {TOPICS.find(t => t.id === topic)?.label} · {DIFFICULTY.find(d => d.id === difficulty)?.label}
          </span>
        </div>

        <div style={{ background: theme.bgSubtle, border: `1px solid ${theme.border}`, padding: "24px", borderRadius: theme.radius, marginBottom: "20px" }}>
          <div style={{ fontSize: "16px", lineHeight: "1.65" }}>{question.question}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {question.options.map((opt, idx) => {
            const os = s.option(idx);
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                textAlign: "left", padding: "14px 16px", background: os.bg, border: os.border,
                borderRadius: theme.radius, fontSize: "14px", lineHeight: "1.5",
                fontFamily: theme.fontSans, color: os.color, cursor: revealed ? "default" : "pointer",
              }}>
                {revealed && idx === question.correct && <span style={{ marginRight: "8px" }}>✓</span>}
                {revealed && idx === selected && idx !== question.correct && <span style={{ marginRight: "8px" }}>✗</span>}
                {opt}
              </button>
            );
          })}
        </div>

        {!revealed && (
          <button onClick={reveal} disabled={selected === null} style={s.btn(true, selected === null)}>
            Check Answer
          </button>
        )}

        {revealed && (
          <>
            <div style={{ background: theme.bgSubtle, border: `1px solid ${theme.border}`, padding: "18px", borderRadius: theme.radius, marginBottom: "16px" }}>
              <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>
                {selected === question.correct ? "Correct" : "Not quite"}
              </div>
              <div style={{ fontSize: "14px", lineHeight: "1.6", color: theme.textMuted }}>{question.explanation}</div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setView("setup")} style={{ ...s.btn(false, false), flex: 1 }}>Change Topic</button>
              <button onClick={generateQuestion} style={{ ...s.btn(true, false), flex: 1 }}>
                {loading ? "Generating..." : "Next Question"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return null;
}
