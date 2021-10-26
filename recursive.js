const { nFormular, twoFormular } = require("./functions");
/**
 *
 * expect :  [ 0, 7, 5 ], [ 15, -7, 5 ] ]
 *           [ [ -1, 10, 3 ], [ 14, -4, 3 ] ]
 *
 */

const find = ({ p, ans, xn = [], origin, final = [] }) => {
  // console.log(p);
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
    // console.log(result_ans);

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
const p = [3, 4, 5, 6];
const results = find({ p, ans: 7, origin: p });

results.map((result) => {
  const distance = result.reduce((acc, now) => acc + now * now, 0);
  result.push({ distance });
});

const final = results.sort(
  (a, b) => a[a.length - 1].distance - b[b.length - 1].distance
);
console.log(final[0]);
