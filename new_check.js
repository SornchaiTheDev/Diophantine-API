const prompt = require("prompt");
require = require("esm")(module);
const { firstStep } = require("./functions");

const nFormular = ({ n0, Nnorm, gcd, initGCD, p }) => {
  // console.log("P len:" + p.length);
  // console.log("GCD :" + gcd);

  // console.log(p[0]);
  const toalpha = p.length === 2 ? Math.abs(p[0]) : gcd;
  const alpha = toalpha / gcd;
  const results = [];

  // console.log("toalpha :" + toalpha);
  // console.log("n0 :" + n0, "Nnorm : " + Nnorm, "Alpha : " + alpha);
  let round = 0;
  let x = n0;
  if (x > Nnorm) {
    while (x > Nnorm) {
      results.push(x);
      x -= alpha;
      round++;
    }
    for (let i = 0; i <= round; i++) {
      results.push(x);
      x -= alpha;
    }
  } else {
    while (x < Nnorm) {
      results.push(x);
      x += alpha;
      round++;
    }
    for (let i = 0; i <= round; i++) {
      results.push(x);
      x += alpha;
    }
  }

  return results;
};

const solve = ({
  n0,
  p,
  origin,
  ans,
  initGCD,
  final = [],
  result = [],
  norm,
}) => {
  if (p.length <= 1) {
    const reverse = result.reverse();
    const answer = ans / origin[0];
    const final_re = [];
    final_re.push(answer);

    final.push(final_re.concat(reverse));

    // final.push(
    //   ...twoFormular(ans, origin.slice(0, 2)).map((result) => {
    //     return result.concat(reverse);
    //   })
    // );

    return final;
  }

  const { var0, gcd } = firstStep(p, ans);
  const P0 = var0.map((value) => (value * ans) / initGCD);

  nFormular({
    p,
    n0: P0[P0.length - 1],
    Nnorm: norm[P0.length - 1],
    ans,
    gcd,
    initGCD,
  }).map((nResult) => {
    const answer = ans - nResult * origin[P0.length - 1];
    // console.log(p.slice(0, -1));
    solve({
      p: p.slice(0, -1),
      ans: answer,
      origin,
      initGCD: gcd,
      result: result.concat(nResult),
      final,
      norm,
    });
  });

  return final;
};

// prompt.start();
// prompt.get(["input"], (err, result) => {
//   const { input } = result;
//   const inputs = input.split(",");
//   const p = inputs.slice(0, -1).map((data) => parseInt(data));
//   const ans = inputs[inputs.length - 1];

//   const { gcd, norm } = firstStep(p, ans);

//   const results = solve({ p, ans, origin: p, initGCD: gcd, norm });
//   console.log(results);
//   // results.map((data) => console.log(data));

//   // const finalAns = results.filter((result) => {
//   //   if (Number.isInteger(result.reduce((acc, now) => acc + now, 0)))
//   //     return result;
//   // });
//   // console.log(finalAns);
//   // results.map((data) => {
//   //   console.log(data);
//   //   console.log(data.reduce((acc, now, index) => acc + now * p[index], 0));
//   // });
// });

module.exports.check = ({ p, ans }) => {
  const { gcd, norm } = firstStep(p, ans);
  const results = solve({ p, ans, origin: p, initGCD: gcd, norm });
  const finalAns = results.filter((result) => {
    if (Number.isInteger(result.reduce((acc, now) => acc + now, 0)))
      return result;
  });
  return finalAns;
};
