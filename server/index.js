import express from "express";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    runtime: "node.js",
    ui: "react",
    product: "Career Metrics",
  });
});

app.get("/api/auth/providers", (_req, res) => {
  res.json({
    providers: [
      { id: "email", label: "Email" },
      { id: "google", label: "Google" },
      { id: "linkedin", label: "LinkedIn" },
    ],
  });
});

app.get("/api/insight-preview", (_req, res) => {
  res.json({
    headline: "High-alignment path detected",
    summary:
      "Strategy, AI systems thinking, and product leadership create the strongest compounding curve over the next 18 months.",
  });
});

app.listen(port, () => {
  console.log(`Career Metrics Node.js API listening on http://localhost:${port}`);
});
