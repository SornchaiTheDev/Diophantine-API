const prompt = require("prompt");
require = require("esm")(module);
const { firstStep } = require("./functions");

const nFormular = ({ n0, Nnorm, gcd, p }) => {
  const toalpha = p.length === 2 ? Math.abs(p[0]) : gcd;
  const alpha = toalpha / gcd;
  const results = [];

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

const solve = ({ p, origin, ans, initGCD, final = [], result = [], norm }) => {
  if (p.length <= 1) {
    const reverse = result.reverse();
    const answer = ans / origin[0];
    const final_re = [];
    final_re.push(answer);

    final.push(final_re.concat(reverse));

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
  }).map((nResult) => {
    const answer = ans - nResult * origin[P0.length - 1];

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

module.exports.check = ({ p, ans }) => {
  const { gcd, norm } = firstStep(p, ans);
  const results = solve({ p, ans, origin: p, initGCD: gcd, norm });
  const distances = [];
  const finalAns = results.filter((result) => {
    if (Number.isInteger(result.reduce((acc, now) => acc + now, 0)))
      return result;
  });
  finalAns.map((result) => {
    const distance = result.reduce((acc, now) => acc + now * now, 0);
    distances.push({ result, distance: distance });
  });

  const final = distances.sort((a, b) => a.distance - b.distance);
  const takeAllSameDistance = final.filter(
    (result, index) => result.distance === final[0].distance
  );

  return { finalAns, takeAllSameDistance };
};

// prompt.start();
// prompt.get(["input"], (err, result) => {
//   const { input } = result;
//   const inputs = input.split(",");
//   const p = inputs.slice(0, -1).map((data) => parseInt(data));
//   const ans = inputs[inputs.length - 1];

//   const distances = [];

//   const { gcd, norm } = firstStep(p, ans);

//   const results = solve({ p, ans, origin: p, initGCD: gcd, norm });

//   const finalAns = results.filter((result) => {
//     if (Number.isInteger(result.reduce((acc, now) => acc + now, 0)))
//       return result;
//   });
//   finalAns.map((result) => {
//     const distance = result.reduce((acc, now) => acc + now * now, 0);
//     distances.push({ result, distance: distance });
//   });
//   const final = distances.sort((a, b) => a.distance - b.distance);
//   console.log(final);
//   // results.map((data) => {
//   //   console.log(data);
//   //   console.log(data.reduce((acc, now, index) => acc + now * p[index], 0));
//   // });
// });
