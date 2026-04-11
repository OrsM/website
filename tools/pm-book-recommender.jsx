import { useState, useMemo } from "react";

const BOOKS_READ = [
  { title: "Thinking, Fast and Slow", rating: 5, cat: "Decision Making" },
  { title: "Getting Things Done", rating: 5, cat: "Productivity" },
  { title: "The Checklist Manifesto", rating: 5, cat: "Execution" },
  { title: "Influence: The Psychology of Persuasion", rating: 5, cat: "Persuasion" },
  { title: "The Hard Thing About Hard Things", rating: 5, cat: "Leadership" },
  { title: "Crucial Conversations", rating: 5, cat: "Communication" },
  { title: "Predictably Irrational", rating: 5, cat: "Decision Making" },
  { title: "Bad Blood", rating: 5, cat: "Case Study" },
  { title: "The Coaching Habit", rating: 5, cat: "Leadership" },
  { title: "Algorithms to Live By", rating: 5, cat: "Decision Making" },
  { title: "Turn the Ship Around!", rating: 5, cat: "Leadership" },
  { title: "The Power Broker", rating: 5, cat: "Leadership" },
  { title: "Moneyball", rating: 5, cat: "Strategy" },
  { title: "Skunk Works", rating: 5, cat: "Execution" },
  { title: "The Tipping Point", rating: 5, cat: "Strategy" },
  { title: "Outliers", rating: 5, cat: "Strategy" },
  { title: "Factfulness", rating: 5, cat: "Decision Making" },
  { title: "Storytelling with Data", rating: 4, cat: "Communication" },
  { title: "ReOrg: How to Get It Right", rating: 4, cat: "Org Design" },
  { title: "The Goal", rating: 4, cat: "Systems" },
  { title: "The Personal MBA", rating: 4, cat: "Business" },
  { title: "Atomic Habits", rating: 4, cat: "Productivity" },
  { title: "Zero to One", rating: 4, cat: "Strategy" },
  { title: "Shape Up", rating: 4, cat: "Product" },
  { title: "The Phoenix Project", rating: 4, cat: "Systems" },
  { title: "The Effective Executive", rating: 4, cat: "Leadership" },
  { title: "Making Things Happen", rating: 4, cat: "Execution" },
  { title: "Flow", rating: 4, cat: "Psychology" },
  { title: "Out of the Crisis", rating: 4, cat: "Systems" },
  { title: "It Doesn't Have to Be Crazy at Work", rating: 4, cat: "Culture" },
  { title: "The 48 Laws of Power", rating: 4, cat: "Persuasion" },
  { title: "Never Split the Difference", rating: 4, cat: "Communication" },
  { title: "The Great CEO Within", rating: 4, cat: "Leadership" },
  { title: "The Unaccountability Machine", rating: 4, cat: "Systems" },
  { title: "Creative Thinking", rating: 4, cat: "Strategy" },
  { title: "The Black Swan", rating: 4, cat: "Decision Making" },
];

const RECOMMENDATIONS = [
  {
    title: "The Art of Action",
    author: "Stephen Bungay",
    cat: "Leadership",
    pages: 226,
    why: "Your #1 pick. Tackles the alignment gap between strategy and execution — directly maps to leading without authority. Uses military history to show how intent-based leadership beats top-down control.",
    matchTags: ["Turn the Ship Around!", "The Goal", "Making Things Happen"],
    priority: 1,
  },
  {
    title: "Inspired",
    author: "Marty Cagan",
    cat: "Product",
    pages: 368,
    why: "The definitive product management playbook. Covers discovery, delivery, and how top product teams actually work. You liked Shape Up — this is the broader framework.",
    matchTags: ["Shape Up", "Zero to One", "The Phoenix Project"],
    priority: 1,
  },
  {
    title: "Empowered",
    author: "Marty Cagan & Chris Jones",
    cat: "Product",
    pages: 352,
    why: "Sequel to Inspired, focused on product leadership. How to build truly empowered product teams vs. feature factories. Directly relevant to influencing without owning the teams.",
    matchTags: ["Turn the Ship Around!", "The Coaching Habit", "Shape Up"],
    priority: 1,
  },
  {
    title: "Team Topologies",
    author: "Matthew Skelton & Manuel Pais",
    cat: "Org Design",
    pages: 240,
    why: "How org structure shapes software delivery. Four team types, three interaction modes. You rated ReOrg 4 stars — this is the modern tech-specific equivalent.",
    matchTags: ["ReOrg: How to Get It Right", "The Phoenix Project", "Out of the Crisis"],
    priority: 1,
  },
  {
    title: "Thinking in Bets",
    author: "Annie Duke",
    cat: "Decision Making",
    pages: 288,
    why: "You 5-starred The Biggest Bluff and love decision-making books. Annie Duke applies poker thinking to everyday decisions — separating decision quality from outcome quality.",
    matchTags: ["Thinking, Fast and Slow", "Predictably Irrational", "Algorithms to Live By"],
    priority: 2,
  },
  {
    title: "An Elegant Puzzle",
    author: "Will Larson",
    cat: "Leadership",
    pages: 288,
    why: "Systems thinking applied to engineering management. Covers sizing teams, managing technical debt, and succession planning. Pairs well with your love of The Goal and systems-oriented books.",
    matchTags: ["The Goal", "The Phoenix Project", "The Effective Executive"],
    priority: 1,
  },
  {
    title: "Staff Engineer",
    author: "Will Larson",
    cat: "Leadership",
    pages: 284,
    why: "Leading through influence, not authority — literally the book's thesis. Staff-plus engineers drive impact through technical vision and organizational leverage, not headcount.",
    matchTags: ["Turn the Ship Around!", "The Coaching Habit", "The Effective Executive"],
    priority: 2,
  },
  {
    title: "Measure What Matters",
    author: "John Doerr",
    cat: "Execution",
    pages: 320,
    why: "OKRs as alignment tool across cross-functional teams. Given your work in search quality and pricing strategy, structured goal-setting is directly actionable.",
    matchTags: ["The Checklist Manifesto", "Making Things Happen", "The Effective Executive"],
    priority: 2,
  },
  {
    title: "Working Backwards",
    author: "Colin Bryar & Bill Carr",
    cat: "Product",
    pages: 304,
    why: "Amazon's PR/FAQ and working backwards process, from insiders. You rated Bad Blood 5 stars — this is the positive mirror: how a specific process shaped trillion-dollar decisions.",
    matchTags: ["Bad Blood", "Zero to One", "The Hard Thing About Hard Things"],
    priority: 2,
  },
  {
    title: "The Advantage",
    author: "Patrick Lencioni",
    cat: "Culture",
    pages: 240,
    why: "Organizational health as the ultimate competitive advantage. Short, direct, practitioner-focused — fits your reading style. Covers alignment, clarity, and communication across teams.",
    matchTags: ["Crucial Conversations", "It Doesn't Have to Be Crazy at Work", "ReOrg: How to Get It Right"],
    priority: 2,
  },
  {
    title: "Good Strategy Bad Strategy",
    author: "Richard Rumelt",
    cat: "Strategy",
    pages: 336,
    why: "Cuts through strategy buzzwords to the kernel: diagnosis, guiding policy, coherent action. You love books that reveal hidden systems — this reveals the hidden emptiness of most 'strategy'.",
    matchTags: ["The Tipping Point", "Zero to One", "Moneyball"],
    priority: 1,
  },
  {
    title: "Radical Candor",
    author: "Kim Scott",
    cat: "Communication",
    pages: 272,
    why: "Caring personally while challenging directly. You rated Crucial Conversations 5 stars and The Coaching Habit 5 — this completes the trifecta for difficult conversations with peers and leadership.",
    matchTags: ["Crucial Conversations", "The Coaching Habit", "Never Split the Difference"],
    priority: 2,
  },
  {
    title: "Obviously Awesome",
    author: "April Dunford",
    cat: "Product",
    pages: 194,
    why: "Positioning as a deliberate, repeatable process. Short and practitioner-written. If you're shaping how search quality or pricing features are framed, this is directly useful.",
    matchTags: ["Influence: The Psychology of Persuasion", "Zero to One", "The Personal MBA"],
    priority: 3,
  },
  {
    title: "Escaping the Build Trap",
    author: "Melissa Perri",
    cat: "Product",
    pages: 200,
    why: "How organizations get stuck shipping features instead of solving problems. Short read that pairs well with Shape Up and addresses the strategic layer above it.",
    matchTags: ["Shape Up", "The Goal", "The Phoenix Project"],
    priority: 3,
  },
  {
    title: "Accelerate",
    author: "Forsgren, Humble & Kim",
    cat: "Systems",
    pages: 288,
    why: "Data-driven evidence linking DevOps practices to org performance. From the co-author of The Phoenix Project. You love evidence-based, rigorous books — this is Mastering 'Metrics for software delivery.",
    matchTags: ["The Phoenix Project", "Out of the Crisis", "Moneyball"],
    priority: 3,
  },
];

const CATS = [...new Set(RECOMMENDATIONS.map(r => r.cat))].sort();

const PRIORITY_LABELS = { 1: "Start here", 2: "Strong pick", 3: "Deep cut" };
const PRIORITY_COLORS = {
  1: { bg: "#1a2f1a", border: "#2d5a2d", text: "#6fcf6f", badge: "#2d5a2d" },
  2: { bg: "#1a2633", border: "#2a4a66", text: "#7bb8e0", badge: "#2a4a66" },
  3: { bg: "#2a2520", border: "#4a3f30", text: "#c4a87a", badge: "#4a3f30" },
};

export default function App() {
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [sortBy, setSortBy] = useState("priority");
  const [expandedId, setExpandedId] = useState(null);
  const [view, setView] = useState("recs");

  const toggleCat = (cat) => {
    setSelectedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...RECOMMENDATIONS];
    if (selectedCats.size > 0) list = list.filter(r => selectedCats.has(r.cat));
    if (sortBy === "priority") list.sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title));
    else if (sortBy === "pages") list.sort((a, b) => a.pages - b.pages);
    else if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [selectedCats, sortBy]);

  const catCounts = useMemo(() => {
    const counts = {};
    BOOKS_READ.forEach(b => { counts[b.cat] = (counts[b.cat] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1114",
      color: "#c8ccd4",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      padding: "24px 16px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            color: "#e8eaed",
            margin: 0,
            lineHeight: 1.2,
          }}>
            PM Reading List
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "6px 0 0" }}>
            Based on {BOOKS_READ.length} leadership & business books you've read · {BOOKS_READ.filter(b => b.rating === 5).length} rated ★★★★★
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #1e2128" }}>
          {[["recs", `Recommendations (${RECOMMENDATIONS.length})`], ["read", `Already Read (${BOOKS_READ.length})`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{
                background: "none",
                border: "none",
                borderBottom: view === key ? "2px solid #6fcf6f" : "2px solid transparent",
                color: view === key ? "#e8eaed" : "#6b7280",
                fontSize: 14,
                fontWeight: 500,
                padding: "8px 16px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {view === "read" ? (
          /* Already Read View */
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {Object.entries(catCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <span key={cat} style={{
                  fontSize: 12,
                  padding: "3px 10px",
                  borderRadius: 12,
                  background: "#1a1d24",
                  border: "1px solid #2a2e38",
                  color: "#9ca3af",
                }}>
                  {cat} ({count})
                </span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {BOOKS_READ.sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title)).map((b, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "#16181d",
                  borderRadius: 8,
                  border: "1px solid #1e2128",
                }}>
                  <span style={{ fontSize: 14, color: "#d1d5db", flex: 1 }}>{b.title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: "#6b7280", background: "#1a1d24", padding: "2px 8px", borderRadius: 8 }}>{b.cat}</span>
                    <span style={{ fontSize: 13, color: b.rating === 5 ? "#f59e0b" : "#9ca3af", letterSpacing: -1 }}>
                      {"★".repeat(b.rating)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Recommendations View */
          <div>
            {/* Filters */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {CATS.map(cat => {
                  const active = selectedCats.has(cat);
                  return (
                    <button key={cat} onClick={() => toggleCat(cat)} style={{
                      fontSize: 12,
                      padding: "4px 12px",
                      borderRadius: 14,
                      background: active ? "#2d5a2d" : "#16181d",
                      border: `1px solid ${active ? "#4a8a4a" : "#2a2e38"}`,
                      color: active ? "#a3e4a3" : "#9ca3af",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}>
                      {cat}
                    </button>
                  );
                })}
                {selectedCats.size > 0 && (
                  <button onClick={() => setSelectedCats(new Set())} style={{
                    fontSize: 12, padding: "4px 12px", borderRadius: 14,
                    background: "none", border: "1px solid #3a2020", color: "#e07070",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>✕ Clear</button>
                )}
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Sort:</span>
                {[["priority", "Priority"], ["pages", "Shortest"], ["title", "A–Z"]].map(([key, label]) => (
                  <button key={key} onClick={() => setSortBy(key)} style={{
                    fontSize: 12, padding: "3px 10px", borderRadius: 10,
                    background: sortBy === key ? "#1e2128" : "transparent",
                    border: sortBy === key ? "1px solid #2a2e38" : "1px solid transparent",
                    color: sortBy === key ? "#d1d5db" : "#6b7280",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((rec, i) => {
                const pc = PRIORITY_COLORS[rec.priority];
                const expanded = expandedId === i;
                return (
                  <div
                    key={rec.title}
                    onClick={() => setExpandedId(expanded ? null : i)}
                    style={{
                      background: expanded ? pc.bg : "#16181d",
                      border: `1px solid ${expanded ? pc.border : "#1e2128"}`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            padding: "2px 7px",
                            borderRadius: 4,
                            background: pc.badge,
                            color: pc.text,
                          }}>
                            {PRIORITY_LABELS[rec.priority]}
                          </span>
                          <span style={{ fontSize: 11, color: "#6b7280" }}>{rec.cat}</span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#e8eaed", lineHeight: 1.3 }}>
                          {rec.title}
                        </h3>
                        <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>
                          {rec.author} · {rec.pages}p
                        </p>
                      </div>
                      <span style={{ fontSize: 18, color: "#4b5563", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 4 }}>
                        ▾
                      </span>
                    </div>

                    {expanded && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${pc.border}` }}>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#b0b6c0" }}>
                          {rec.why}
                        </p>
                        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#6b7280", marginRight: 4 }}>Because you liked:</span>
                          {rec.matchTags.map(tag => (
                            <span key={tag} style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: 8,
                              background: "#1a1d24",
                              border: "1px solid #2a2e38",
                              color: "#9ca3af",
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <p style={{ fontSize: 12, color: "#4b5563", marginTop: 24, textAlign: "center" }}>
              Recommendations based on {BOOKS_READ.length} PM/business books from your Goodreads library
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
