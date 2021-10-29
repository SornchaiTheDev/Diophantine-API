const express = require("express");
const app = express();
const { recursive } = require("./sol");
const { check } = require("./new_check");
const { hasAns } = require("./functions");
const cors = require("cors");

app.use(cors());
app.get("/", (req, res) => {
  const problem = req.query.p.split(",");
  const p = problem.slice(0, -1).map((data) => parseInt(data));
  const ans = problem[problem.length - 1];

  if (!hasAns(p, ans)) return res.json({ err: "NO_ANS" });

  let result;
  if (req.query.type === "problem") {
    const { results, final, firstStep } = recursive({
      p: p,
      ans: ans,
      origin: p,
    });
    result = { results, final, firstStep };
  } else {
    const checking = check({ p, ans });
    result = checking;
  }
  return res.json(result);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server Start at Port 8080");
});
