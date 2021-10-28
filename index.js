const express = require("express");
const app = express();
const { recursive } = require("./sol");
const { check } = require("./new_check");
const cors = require("cors");

app.use(cors());
app.get("/", (req, res) => {
  console.log(req.query);
  if (req.query.type === "problem") {
    const problem = req.query.p.split(",");

    const p = problem.slice(0, -1).map((data) => parseInt(data));
    const ans = problem[problem.length - 1];
    const { results, final, firstStep } = recursive({
      p: p,
      ans: ans,
      origin: p,
    });
    return res.json({ results, final, firstStep });
  } else {
    const problem = req.query.p.split(",");
    const p = problem.slice(0, -1).map((data) => parseInt(data));
    const ans = problem[problem.length - 1];
    console.log(p);
    const checking = check({ p, ans });
    res.json(checking);
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server Start at Port 8080");
});
