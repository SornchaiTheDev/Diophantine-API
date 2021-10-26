const express = require("express");
const app = express();
const { recursive } = require("./sol");
const cors = require("cors");

app.use(cors());
app.get("/", (req, res) => {
  const problem = req.query.problem.split(",");

  const p = problem.slice(0, -1).map((data) => parseInt(data));
  const ans = problem[problem.length - 1];
  const { results, final } = recursive({ p: p, ans: ans, origin: p });
  return res.json({ results, final });
});

app.listen(8080, () => {
  console.log("Server Start at Port 8080");
});
