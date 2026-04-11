import { useState, useEffect, useCallback } from "react";
import BackBar from "../../components/BackBar";
import { theme } from "../../theme";

const CHAPTERS = [
  { id: 1, part: "I", partTitle: "Demand", title: "The Budget Line" },
  { id: 2, part: "I", partTitle: "Demand", title: "The Consumer's Choice" },
  { id: 3, part: "I", partTitle: "Demand", title: "Measurement of Utility & Economics of Risk" },
  { id: 4, part: "I", partTitle: "Demand", title: "Indifference Curves and Demand" },
  { id: 5, part: "II", partTitle: "Exchange", title: "Trade" },
  { id: 6, part: "II", partTitle: "Exchange", title: "Using Market Supply and Demand" },
  { id: 7, part: "II", partTitle: "Exchange", title: "Measuring Supply and Demand" },
  { id: 8, part: "III", partTitle: "Production & Welfare", title: "Production Possibilities" },
  { id: 9, part: "III", partTitle: "Production & Welfare", title: "Economics of Welfare and Politics" },
  { id: 10, part: "III", partTitle: "Production & Welfare", title: "Consumers' Surplus" },
  { id: 11, part: "IV", partTitle: "Production & Markets", title: "The Firm" },
  { id: 12, part: "IV", partTitle: "Production & Markets", title: "Cost Curves of the Firm" },
  { id: 13, part: "IV", partTitle: "Production & Markets", title: "Competitive Industry" },
  { id: 14, part: "IV", partTitle: "Production & Markets", title: "Long-Run Supply & Entry" },
  { id: 15, part: "IV", partTitle: "Production & Markets", title: "Taxes" },
  { id: 16, part: "IV", partTitle: "Production & Markets", title: "Competition for Property Rights" },
  { id: 17, part: "V", partTitle: "Monopoly", title: "The Behavior of Monopoly" },
  { id: 18, part: "V", partTitle: "Monopoly", title: "Measuring Monopoly" },
  { id: 19, part: "V", partTitle: "Monopoly", title: "Welfare Economics of Monopoly" },
  { id: 20, part: "V", partTitle: "Monopoly", title: "Monopolistic Competition & Location" },
  { id: 21, part: "V", partTitle: "Monopoly", title: "Competition Among the Few" },
  { id: 22, part: "VI", partTitle: "Labor, Capital & Distribution", title: "Marginal Productivity & Labor Demand" },
  { id: 23, part: "VI", partTitle: "Labor, Capital & Distribution", title: "Marginal Productivity in Theory & Use" },
  { id: 24, part: "VI", partTitle: "Labor, Capital & Distribution", title: "Misallocation & Monopoly in Factor Markets" },
  { id: 25, part: "VI", partTitle: "Labor, Capital & Distribution", title: "The Supply of Labor" },
  { id: 26, part: "VI", partTitle: "Labor, Capital & Distribution", title: "Capital's Supply and Demand" },
];

const INITIAL_CARDS = [
  { id: 1, ch: 1, q: "What does the budget line represent?", a: "All combinations of two goods a consumer can afford given their income and prices. It shows the boundary of what's feasible — everything on or below the line is affordable.", type: "concept" },
  { id: 2, ch: 1, q: "What is the slope of the budget line, and what does it mean?", a: "The slope is −(P₁/P₂), the ratio of the two prices. It represents the rate at which the market allows you to trade one good for another — the opportunity cost of one good in terms of the other.", type: "concept" },
  { id: 3, ch: 1, q: "What happens to the budget line when income doubles?", a: "It shifts outward, parallel to itself. The slope doesn't change (prices haven't changed), but the consumer can now reach combinations that were previously unaffordable.", type: "reasoning" },
  { id: 4, ch: 1, q: "McCloskey says scarcity is the 'first fact of economic life.' What does this imply for any choice?", a: "Every choice has an opportunity cost. Choosing more of one thing means giving up something else. The budget line makes this trade-off visible and precise.", type: "insight" },
  { id: 5, ch: 1, q: "How does a price change in one good affect the budget line?", a: "The budget line pivots around the intercept of the other good. If good 1 gets cheaper, the line swings outward along the good-1 axis — you can buy more of it, but the maximum amount of good 2 stays the same.", type: "reasoning" },
  { id: 6, ch: 1, q: "What is the Law of Demand as derived from the budget line?", a: "As the price of a good falls, the consumer can afford more of it (the budget set expands in that direction), so quantity demanded increases.", type: "concept" },
  { id: 7, ch: 2, q: "What is the consumer's optimal choice, geometrically?", a: "The point where the highest attainable indifference curve is tangent to the budget line. At this point, the rate at which the consumer is willing to trade (MRS) equals the rate at which the market allows trading (price ratio).", type: "concept" },
  { id: 8, ch: 2, q: "What is the Marginal Rate of Substitution (MRS)?", a: "The rate at which a consumer is willing to give up one good to get more of another while staying equally happy. It's the slope of the indifference curve at any point. Diminishing MRS means you value extra units less as you get more.", type: "concept" },
  { id: 9, ch: 2, q: "Why does MRS = price ratio at the optimum?", a: "If MRS ≠ price ratio, the consumer could rearrange purchases and be better off. E.g., if MRS > P₁/P₂, the consumer values good 1 more than the market charges — buy more of it until MRS falls to equal the price ratio.", type: "reasoning" },
  { id: 10, ch: 2, q: "What is the 'equimarginal principle' in consumer choice?", a: "The consumer should allocate spending so that the marginal utility per dollar is equal across all goods: MU₁/P₁ = MU₂/P₂. Otherwise you could reallocate a dollar from the low-MU/P good to the high one and gain utility.", type: "concept" },
  { id: 11, ch: 3, q: "What is the difference between ordinal and cardinal utility?", a: "Ordinal utility only ranks preferences (A > B > C). Cardinal utility assigns measurable magnitudes (A gives 10 utils, B gives 6). Most of price theory works fine with ordinal utility alone.", type: "concept" },
  { id: 12, ch: 3, q: "Why does diminishing marginal utility explain risk aversion?", a: "If utility of wealth is concave (diminishing MU), the utility lost from losing $X exceeds the utility gained from winning $X. So a fair gamble (50/50 chance of +$X or −$X) makes you worse off in expected utility terms.", type: "reasoning" },
  { id: 13, ch: 3, q: "What is the expected utility hypothesis?", a: "People choose among risky options by maximizing the probability-weighted average of utilities of outcomes, not the probability-weighted average of monetary payoffs. This explains why people buy insurance despite negative expected monetary value.", type: "concept" },
  { id: 14, ch: 4, q: "What are the income effect and substitution effect of a price change?", a: "Substitution effect: the good is now relatively cheaper, so you buy more of it. Income effect: cheaper prices make you effectively richer, changing what you can buy overall. Together they explain the full response to price changes.", type: "concept" },
  { id: 15, ch: 4, q: "What is a Giffen good, and why is it theoretically possible?", a: "A good where demand rises when its price rises. This requires a negative income effect strong enough to overwhelm the substitution effect — only possible for inferior goods that dominate the budget.", type: "concept" },
  { id: 16, ch: 5, q: "Why does voluntary trade make both parties better off?", a: "Each person trades away things they value less for things they value more. If I value your apple more than my orange, and you feel the opposite, we both gain by trading. No one forces the exchange, so both must expect to benefit.", type: "insight" },
  { id: 17, ch: 5, q: "What is comparative advantage, and why does it drive trade?", a: "A person has comparative advantage in producing a good if their opportunity cost of that good is lower than someone else's. Even if one person is better at everything, both gain from specializing in their comparative advantage and trading.", type: "concept" },
  { id: 18, ch: 5, q: "How does trade among many people differ from two-person exchange?", a: "With many traders, prices emerge from the interaction of supply and demand rather than bilateral negotiation. The market price coordinates the plans of millions of buyers and sellers, each pursuing their own advantage.", type: "reasoning" },
  { id: 19, ch: 6, q: "What does it mean for a market to be in equilibrium?", a: "Quantity supplied equals quantity demanded at the prevailing price. No buyer or seller has reason to change their behavior. If price is above equilibrium, surplus pushes it down; below equilibrium, shortage pushes it up.", type: "concept" },
  { id: 20, ch: 6, q: "How do you analyze the effect of a new tax using supply and demand?", a: "A tax shifts the supply curve up by the tax amount. The new equilibrium has a higher price for buyers, lower net price for sellers, and lower quantity. The tax burden is shared according to relative elasticities.", type: "reasoning" },
  { id: 21, ch: 7, q: "What is price elasticity of demand?", a: "The percentage change in quantity demanded divided by the percentage change in price: ε = (%ΔQ)/(%ΔP). |ε| > 1 is elastic, |ε| < 1 is inelastic.", type: "concept" },
  { id: 22, ch: 7, q: "Why does elasticity matter more than slope?", a: "Slope depends on units of measurement. Elasticity is unit-free — it tells you the proportional response. A 10% price increase cutting quantity by 20% (elastic) is fundamentally different from cutting it by 2% (inelastic).", type: "insight" },
  { id: 23, ch: 7, q: "What determines whether demand is elastic or inelastic?", a: "Availability of substitutes (more subs → more elastic), share of budget (bigger share → more elastic), time horizon (longer → more elastic), and how narrowly the good is defined.", type: "concept" },
  { id: 24, ch: 7, q: "If demand is inelastic, what happens to total revenue when price rises?", a: "Total revenue increases. The price increase more than compensates for the small drop in quantity. This is why monopolists and cartels want to restrict output — they're operating on the inelastic portion of demand.", type: "reasoning" },
  { id: 25, ch: 8, q: "What does the Production Possibility Frontier (PPF) show?", a: "The maximum combinations of two goods an economy can produce given its resources and technology. Points on the frontier are efficient; inside is wasteful; outside is currently impossible.", type: "concept" },
  { id: 26, ch: 8, q: "Why is the PPF bowed outward (concave to the origin)?", a: "Because of increasing opportunity costs: resources aren't perfectly adaptable between uses. Moving resources from guns to butter, each extra unit of butter costs more guns as less-suitable resources are transferred.", type: "reasoning" },
  { id: 27, ch: 9, q: "What is Pareto efficiency?", a: "A situation where no one can be made better off without making someone else worse off. It's the economist's benchmark for efficiency. A competitive equilibrium is Pareto efficient under standard assumptions.", type: "concept" },
  { id: 28, ch: 9, q: "What is the problem with using GDP as a measure of welfare?", a: "GDP measures market production but misses non-market activity, distributional concerns, externalities, and subjective well-being. A policy could raise GDP while making most people worse off.", type: "insight" },
  { id: 29, ch: 10, q: "What is consumer surplus?", a: "The difference between what consumers are willing to pay and what they actually pay. Geometrically, it's the area below the demand curve and above the market price.", type: "concept" },
  { id: 30, ch: 10, q: "What is producer surplus, and how does it relate to consumer surplus?", a: "Producer surplus is the area above the supply curve and below the market price. Together, consumer + producer surplus = total surplus, which competitive markets maximize.", type: "concept" },
  { id: 31, ch: 11, q: "McCloskey calls MR = MC 'the rule of rational life.' Why?", a: "Any decision-maker should keep expanding an activity as long as the extra benefit (MR) exceeds the extra cost (MC). This applies to firms, workers, students — anywhere marginal thinking governs optimal behavior.", type: "insight" },
  { id: 32, ch: 11, q: "Why do firms exist instead of everything being done through markets?", a: "Transaction costs. Using the market for every input involves search, negotiation, and enforcement costs. Firms economize on these by bringing transactions inside the organization.", type: "concept" },
  { id: 33, ch: 11, q: "What is marginal cost, and why does it determine how much to produce?", a: "Marginal cost is the addition to total cost from producing one more unit. A profit-maximizing firm produces up to the point where MC = MR. Below that point, the extra revenue exceeds the extra cost.", type: "concept" },
  { id: 34, ch: 12, q: "What is the relationship between marginal cost and average cost?", a: "When MC < AC, average cost is falling. When MC > AC, AC is rising. MC intersects AC at AC's minimum — like a new test score above your average raises your GPA.", type: "concept" },
  { id: 35, ch: 12, q: "What's the difference between short-run and long-run cost curves?", a: "In the short run, some inputs are fixed. In the long run, all inputs are variable. Long-run AC is the envelope of all possible short-run AC curves — the cheapest way to produce each output level.", type: "concept" },
  { id: 36, ch: 12, q: "What are fixed costs vs. variable costs, and why are fixed costs irrelevant to output decisions?", a: "Fixed costs don't change with output. Variable costs do. Since fixed costs are the same whether you produce 0 or 1000 units, only marginal/variable costs matter for the produce-more-or-less decision.", type: "insight" },
  { id: 37, ch: 13, q: "What are the conditions for a perfectly competitive market?", a: "Many buyers and sellers, homogeneous product, free entry and exit, perfect information. Each firm is a price taker — it faces a horizontal demand curve at the market price.", type: "concept" },
  { id: 38, ch: 13, q: "Why does a competitive firm produce where P = MC?", a: "The firm can sell any quantity at the market price (P = MR). If P > MC for the next unit, producing it adds more revenue than cost. If P < MC, don't. The optimum is P = MC.", type: "reasoning" },
  { id: 39, ch: 14, q: "What does free entry imply about long-run profits in a competitive industry?", a: "Zero economic profit. If firms earn positive profits, new firms enter, increasing supply and driving price down until profits vanish. Long-run equilibrium: P = minimum AC.", type: "concept" },
  { id: 40, ch: 14, q: "What is the difference between economic profit and accounting profit?", a: "Economic profit subtracts ALL opportunity costs, including the return the owner could earn elsewhere. Accounting profit only subtracts explicit costs. Zero economic profit means the firm earns a normal return.", type: "concept" },
  { id: 41, ch: 15, q: "What determines who bears the burden of a tax — buyers or sellers?", a: "The relative elasticities. The more inelastic side bears more of the burden. This is true regardless of who legally pays the tax.", type: "concept" },
  { id: 42, ch: 15, q: "What is the deadweight loss of a tax?", a: "The loss of total surplus from trades that no longer happen because the tax raised the price above some buyers' willingness to pay and below some sellers' willingness to accept.", type: "concept" },
  { id: 43, ch: 16, q: "What are supernormal profits, and why do they get competed away?", a: "Profits above the normal return to capital. They attract entry and imitation. Competition bids up the cost of acquiring the source of the profits until the apparent extra profit is absorbed.", type: "concept" },
  { id: 44, ch: 16, q: "What are externalities, and how do they relate to property rights?", a: "Externalities are costs or benefits imposed on third parties. They arise when property rights are incomplete or unenforced. If rights are clear and transaction costs low, bargaining can resolve externalities (Coase theorem).", type: "concept" },
  { id: 45, ch: 17, q: "Why does a monopolist produce less and charge more than a competitive industry?", a: "A monopolist faces the entire downward-sloping market demand. To sell more, it must lower the price on ALL units, so MR < P. It produces where MR = MC, which is less output and higher price than P = MC.", type: "concept" },
  { id: 46, ch: 17, q: "What is marginal revenue for a monopolist, and why is it below the demand curve?", a: "MR = P + Q(dP/dQ). Since dP/dQ < 0, MR < P. Selling one more unit gains P but loses revenue on all previous units because the price must drop.", type: "reasoning" },
  { id: 47, ch: 18, q: "What is the Lerner Index of monopoly power?", a: "(P − MC)/P. It measures the markup over marginal cost as a fraction of price. In perfect competition, P = MC so the index is 0. It equals 1/|elasticity of demand|.", type: "concept" },
  { id: 48, ch: 19, q: "What is the deadweight loss of monopoly?", a: "Monopoly produces where MR = MC rather than P = MC, so some mutually beneficial trades don't happen. The lost surplus is a pure waste — not transferred to anyone.", type: "concept" },
  { id: 49, ch: 20, q: "What is monopolistic competition?", a: "Many firms selling differentiated products. Each faces a downward-sloping demand (some monopoly power from differentiation) but free entry drives long-run profits to zero.", type: "concept" },
  { id: 50, ch: 21, q: "What is the key strategic problem in oligopoly?", a: "Interdependence: each firm's optimal action depends on what rivals do. In Cournot, firms choose quantities simultaneously; in Bertrand, they choose prices. Collusion is tempting but unstable.", type: "concept" },
  { id: 51, ch: 21, q: "Why are cartels inherently unstable?", a: "Each member has an incentive to cheat by producing more than their quota (since P > MC at the cartel output). If all members cheat, the cartel collapses back toward competitive output.", type: "reasoning" },
  { id: 52, ch: 22, q: "What determines a firm's demand for labor?", a: "The marginal revenue product of labor (MRP_L = MP_L × MR). A firm hires workers up to the point where the extra revenue from one more worker equals the wage.", type: "concept" },
  { id: 53, ch: 22, q: "Why is labor demand a derived demand?", a: "Firms don't want labor for its own sake — they want it for what it produces. The demand for workers derives from the demand for the firm's output.", type: "insight" },
  { id: 54, ch: 25, q: "What is a compensating differential in wages?", a: "The extra pay needed to attract workers to unpleasant, dangerous, or inconvenient jobs. The wage premium compensates for the non-monetary disadvantage.", type: "concept" },
  { id: 55, ch: 25, q: "Why might a higher wage decrease the quantity of labor supplied?", a: "The backward-bending supply curve: at high wages, the income effect (richer, want more leisure) can dominate the substitution effect. You earn enough in fewer hours.", type: "reasoning" },
  { id: 56, ch: 26, q: "What is the interest rate in economic theory?", a: "The price of using capital (or equivalently, the price of consuming now vs. later). It equilibrates the supply of savings with the demand for investment and reflects the marginal productivity of capital.", type: "concept" },
  { id: 57, ch: 0, q: "McCloskey's core pedagogical claim: economics is a skill like bicycle riding. What does this mean for studying?", a: "You can't learn economics by reading about it — you learn by doing problems. Memorizing definitions isn't enough; you need to practice applying concepts to new situations until the reasoning becomes automatic.", type: "insight" },
  { id: 58, ch: 0, q: "What is the 'one big idea' that unifies price theory?", a: "Voluntary exchange at market prices coordinates self-interested individuals to produce socially beneficial outcomes — without anyone planning it. Prices carry information about scarcity and value.", type: "insight" },
  { id: 59, ch: 0, q: "What does 'thinking at the margin' mean and why is it central to price theory?", a: "Decisions are about the NEXT unit, not the total. Compare the marginal benefit to the marginal cost. All of price theory's key results (P = MC, MRS = price ratio, MRP = wage) are marginal conditions.", type: "insight" },
];

const INTERVALS = [0, 1, 3, 7, 14, 30];
const STORAGE_CARDS = "pt-flashcards-cards";
const STORAGE_PROGRESS = "pt-flashcards-progress";

export default function PriceTheoryFlashcards() {
  const [cards, setCards] = useState([]);
  const [progress, setProgress] = useState({});
  const [view, setView] = useState("home");
  const [studyChapter, setStudyChapter] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ ch: 1, q: "", a: "" });
  const [loaded, setLoaded] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });
  const [studyQueue, setStudyQueue] = useState([]);

  useEffect(() => {
    try {
      const cr = localStorage.getItem(STORAGE_CARDS);
      const pr = localStorage.getItem(STORAGE_PROGRESS);
      setCards(cr ? JSON.parse(cr) : INITIAL_CARDS);
      setProgress(pr ? JSON.parse(pr) : {});
    } catch {
      setCards(INITIAL_CARDS);
      setProgress({});
    }
    setLoaded(true);
  }, []);

  const save = useCallback((c, p) => {
    try {
      localStorage.setItem(STORAGE_CARDS, JSON.stringify(c));
      localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(p));
    } catch (e) { console.error(e); }
  }, []);

  const getCardProgress = (id) => progress[id] || { level: 0, due: 0, reviews: 0 };

  const getDueCards = (chFilter) => {
    const now = Date.now();
    return cards.filter(c => {
      if (chFilter !== null && chFilter !== undefined && c.ch !== chFilter && c.ch !== 0) return false;
      const p = getCardProgress(c.id);
      return p.due <= now || p.reviews === 0;
    });
  };

  const startStudy = (ch) => {
    const due = getDueCards(ch);
    const queue = due.length === 0
      ? (ch !== null ? cards.filter(c => c.ch === ch || c.ch === 0) : [...cards]).sort(() => Math.random() - 0.5)
      : due.sort(() => Math.random() - 0.5);
    setStudyQueue(queue);
    setStudyChapter(ch);
    setCurrentIdx(0);
    setFlipped(false);
    setSessionStats({ reviewed: 0, correct: 0 });
    setView("study");
  };

  const handleResponse = (quality) => {
    const card = studyQueue[currentIdx];
    const p = { ...getCardProgress(card.id) };
    if (quality >= 2) p.level = Math.min(p.level + 1, INTERVALS.length - 1);
    else if (quality === 0) p.level = 0;
    p.reviews += 1;
    p.due = Date.now() + INTERVALS[p.level] * 24 * 60 * 60 * 1000;
    const newProgress = { ...progress, [card.id]: p };
    setProgress(newProgress);
    setSessionStats(s => ({ reviewed: s.reviewed + 1, correct: quality >= 2 ? s.correct + 1 : s.correct }));
    save(cards, newProgress);
    if (currentIdx < studyQueue.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setFlipped(false);
    } else {
      setView("done");
    }
  };

  const addCard = () => {
    if (!newCard.q.trim() || !newCard.a.trim()) return;
    const id = Math.max(0, ...cards.map(c => c.id)) + 1;
    const updated = [...cards, { id, ch: newCard.ch, q: newCard.q, a: newCard.a, type: "custom" }];
    setCards(updated);
    setNewCard({ ch: newCard.ch, q: "", a: "" });
    save(updated, progress);
  };

  const resetProgress = () => {
    setProgress({});
    save(cards, {});
  };

  const totalCards = cards.length;
  const masteredCards = Object.values(progress).filter(p => p.level >= 4).length;
  const dueNow = getDueCards(null).length;

  const chapterStats = (ch) => {
    const chCards = cards.filter(c => c.ch === ch);
    const mastered = chCards.filter(c => (progress[c.id]?.level || 0) >= 4).length;
    const due = chCards.filter(c => { const p = getCardProgress(c.id); return p.due <= Date.now() || p.reviews === 0; }).length;
    return { total: chCards.length, mastered, due };
  };

  const s = {
    page: { background: theme.bg, minHeight: "100vh", fontFamily: theme.fontSans, color: theme.text },
    inner: { maxWidth: "520px", margin: "0 auto", padding: "32px 24px" },
    statBox: { background: theme.bgSubtle, border: `1px solid ${theme.border}`, padding: "14px", borderRadius: theme.radius, textAlign: "center" },
    statNum: { fontSize: "28px", fontWeight: "600", color: theme.text },
    statLabel: { fontSize: "11px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" },
    btn: (fill) => ({
      background: fill ? theme.text : "transparent", border: `1px solid ${fill ? theme.text : theme.border}`,
      color: fill ? theme.bg : theme.textMuted, padding: "10px 20px", fontSize: "14px",
      fontFamily: theme.fontSans, cursor: "pointer", borderRadius: theme.radius,
    }),
    card: { background: theme.bgSubtle, border: `1px solid ${theme.border}`, padding: "28px", minHeight: "200px", borderRadius: theme.radius, marginBottom: "20px" },
    responseBtn: (label) => {
      const styles = {
        "Again": { background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMuted },
        "Hard": { background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMuted },
        "Good": { background: theme.bgSubtle, border: `1px solid ${theme.text}`, color: theme.text },
        "Easy": { background: theme.text, border: `1px solid ${theme.text}`, color: theme.bg },
      };
      return { ...styles[label], padding: "12px 8px", fontSize: "13px", fontFamily: theme.fontSans, cursor: "pointer", borderRadius: theme.radius };
    },
  };

  if (!loaded) return (
    <div style={{ ...s.page, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p style={{ color: theme.textMuted }}>Loading...</p>
    </div>
  );

  // HOME
  if (view === "home") return (
    <div style={s.page}>
      <BackBar />
      <div style={s.inner}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Price Theory</h1>
        <p style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "24px" }}>McCloskey — Spaced Repetition Flashcards</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <div style={s.statBox}><div style={s.statNum}>{totalCards}</div><div style={s.statLabel}>Cards</div></div>
          <div style={s.statBox}><div style={s.statNum}>{masteredCards}</div><div style={s.statLabel}>Mastered</div></div>
          <div style={s.statBox}><div style={s.statNum}>{dueNow}</div><div style={s.statLabel}>Due</div></div>
        </div>

        <button onClick={() => startStudy(null)} style={{ ...s.btn(true), width: "100%", padding: "14px", fontSize: "15px", marginBottom: "32px" }}>
          Study All Due ({dueNow || "review"})
        </button>

        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: theme.textMuted, marginBottom: "12px" }}>Chapters</div>

        {["I","II","III","IV","V","VI"].map(part => {
          const partChapters = CHAPTERS.filter(c => c.part === part);
          return (
            <div key={part} style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: theme.textMuted, marginBottom: "6px", fontWeight: "600" }}>
                Part {part} · {partChapters[0]?.partTitle}
              </div>
              {partChapters.map(ch => {
                const stats = chapterStats(ch.id);
                const pct = stats.total > 0 ? Math.round(stats.mastered / stats.total * 100) : 0;
                return (
                  <div
                    key={ch.id}
                    onClick={() => startStudy(ch.id)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: theme.bgSubtle, marginBottom: "2px", cursor: "pointer", borderRadius: theme.radius }}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "13px", color: theme.textMuted }}>{ch.id}. </span>
                      <span style={{ fontSize: "14px" }}>{ch.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      {stats.total > 0 && (
                        <div style={{ width: "40px", height: "3px", background: theme.border, borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: theme.text }} />
                        </div>
                      )}
                      <span style={{ fontSize: "12px", color: theme.textMuted, minWidth: "20px", textAlign: "right" }}>{stats.total > 0 ? stats.total : "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button onClick={() => setView("add")} style={s.btn(false)}>+ Add Card</button>
          <button onClick={resetProgress} style={s.btn(false)}>Reset Progress</button>
        </div>
      </div>
    </div>
  );

  // STUDY
  if (view === "study") {
    if (studyQueue.length === 0) return (
      <div style={s.page}><BackBar /><div style={s.inner}><p style={{ color: theme.textMuted }}>No cards to study.</p><button onClick={() => setView("home")} style={s.btn(false)}>Back</button></div></div>
    );

    const card = studyQueue[currentIdx];
    const ch = CHAPTERS.find(c => c.id === card.ch);
    const p = getCardProgress(card.id);

    return (
      <div style={s.page}>
        <BackBar />
        <div style={s.inner}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: "13px", fontFamily: theme.fontSans }}>← Back</button>
            <span style={{ fontSize: "13px", color: theme.textMuted }}>{currentIdx + 1} / {studyQueue.length}</span>
          </div>

          <div style={{ marginBottom: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
            {ch && <span style={{ fontSize: "11px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Ch {card.ch} · {ch.title}</span>}
            {card.ch === 0 && <span style={{ fontSize: "11px", color: theme.textMuted, textTransform: "uppercase" }}>Cross-cutting</span>}
            <span style={{ fontSize: "10px", color: theme.textMuted, border: `1px solid ${theme.border}`, padding: "1px 6px", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.type || "concept"}</span>
          </div>

          <div style={{ width: "100%", height: "2px", background: theme.border, marginBottom: "20px" }}>
            <div style={{ width: `${((currentIdx + 1) / studyQueue.length) * 100}%`, height: "100%", background: theme.text, transition: "width 0.3s" }} />
          </div>

          <div onClick={() => !flipped && setFlipped(true)} style={{ ...s.card, cursor: flipped ? "default" : "pointer" }}>
            <div style={{ fontSize: "11px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>{flipped ? "Answer" : "Question"}</div>
            <div style={{ fontSize: "17px", lineHeight: "1.6" }}>{flipped ? card.a : card.q}</div>
            {!flipped && <div style={{ fontSize: "12px", color: theme.textMuted, marginTop: "20px", textAlign: "center" }}>tap to reveal</div>}
          </div>

          {flipped && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
              {["Again","Hard","Good","Easy"].map((label, i) => (
                <button key={label} onClick={() => handleResponse(i)} style={s.responseBtn(label)}>{label}</button>
              ))}
            </div>
          )}

          <div style={{ fontSize: "11px", color: theme.textMuted, marginTop: "12px", textAlign: "center" }}>
            Level {p.level} · {p.reviews} review{p.reviews !== 1 ? "s" : ""} · Next in {INTERVALS[Math.min(p.level + 1, INTERVALS.length - 1)]}d
          </div>
        </div>
      </div>
    );
  }

  // DONE
  if (view === "done") {
    const pct = sessionStats.reviewed > 0 ? Math.round(sessionStats.correct / sessionStats.reviewed * 100) : 0;
    return (
      <div style={s.page}>
        <BackBar />
        <div style={{ ...s.inner, textAlign: "center", paddingTop: "80px" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>✓</div>
          <h2 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "24px" }}>Session Complete</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "32px" }}>
            <div><div style={{ fontSize: "32px", fontWeight: "600" }}>{sessionStats.reviewed}</div><div style={{ fontSize: "12px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Reviewed</div></div>
            <div><div style={{ fontSize: "32px", fontWeight: "600" }}>{pct}%</div><div style={{ fontSize: "12px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Correct</div></div>
          </div>
          <button onClick={() => setView("home")} style={{ ...s.btn(true), padding: "12px 32px" }}>Back to Overview</button>
        </div>
      </div>
    );
  }

  // ADD CARD
  if (view === "add") return (
    <div style={s.page}>
      <BackBar />
      <div style={s.inner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "500", margin: 0 }}>Add Card</h2>
          <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontFamily: theme.fontSans, fontSize: "13px" }}>← Back</button>
        </div>

        <label style={{ fontSize: "12px", color: theme.textMuted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Chapter</label>
        <select value={newCard.ch} onChange={e => setNewCard({ ...newCard, ch: parseInt(e.target.value) })}
          style={{ width: "100%", padding: "10px", background: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, fontSize: "14px", fontFamily: theme.fontSans, marginBottom: "16px", borderRadius: theme.radius }}>
          <option value={0}>Cross-cutting</option>
          {CHAPTERS.map(ch => <option key={ch.id} value={ch.id}>{ch.id}. {ch.title}</option>)}
        </select>

        <label style={{ fontSize: "12px", color: theme.textMuted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Question</label>
        <textarea value={newCard.q} onChange={e => setNewCard({ ...newCard, q: e.target.value })} rows={3}
          style={{ width: "100%", padding: "10px", background: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, fontSize: "14px", fontFamily: theme.fontSans, marginBottom: "16px", borderRadius: theme.radius, resize: "vertical", boxSizing: "border-box" }} />

        <label style={{ fontSize: "12px", color: theme.textMuted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Answer</label>
        <textarea value={newCard.a} onChange={e => setNewCard({ ...newCard, a: e.target.value })} rows={4}
          style={{ width: "100%", padding: "10px", background: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, fontSize: "14px", fontFamily: theme.fontSans, marginBottom: "16px", borderRadius: theme.radius, resize: "vertical", boxSizing: "border-box" }} />

        <button onClick={addCard} style={{ ...s.btn(true), width: "100%", padding: "14px" }}>Add Card</button>
      </div>
    </div>
  );

  return null;
}
