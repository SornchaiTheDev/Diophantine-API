const { nFormular, twoFormular } = require("./functions");

const find = ({ p, ans, xn = [], origin, final = [] }) => {
  if (p.length <= 2) {
    const reverse = xn.reverse();
    final.push(
      ...twoFormular(ans, origin.slice(0, 2)).map((result) => {
        return result.concat(reverse);
      })
    );

    return final;
  }
  nFormular(ans, p.slice(0, -1), p).map((result) => {
    let result_ans = ans - result * p[p.length - 1];

    find({
      p: p.slice(0, -1),
      ans: result_ans,
      xn: xn.concat(result === -0 ? Math.abs(result) : result),
      origin: p,
      final: final,
    });
  });

  return final;
};

module.exports.recursive = ({ p, ans, origin }) => {
  const results = find({ p: p, ans: ans, origin: p });
  console.log(results);
  const finalAns = results.filter((result) => {
    if (Number.isInteger(result.reduce((acc, now) => acc + now, 0)))
      return result;
  });

  finalAns.map((result) => {
    const distance = result.reduce((acc, now) => acc + now * now, 0);
    result.push({ distance });
  });

  const final = finalAns.sort(
    (a, b) => a[a.length - 1].distance - b[b.length - 1].distance
  );
  const twenty = finalAns
    .filter((data, index) => index < 20)
    .map((data) => data.slice(0, -1));

  const takeAllSameDistance = final.filter(
    (result, index) =>
      result[result.length - 1].distance ===
      final[0][final[0].length - 1].distance
  );
  return { results: twenty, final: takeAllSameDistance };
};
