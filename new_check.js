const { firstStep, twoFormular } = require("./functions");

const p = [2, 3, 4, 5, 6];
const ans = 7;

/**
 *
 * 3x+4y+5z = 6
 * 3x+4y = 6-5z
 * find z1-zn from z0-znorm (range alpha)
 * back to 3x+4y = w
 * use 2 formular to solve
 *
 *
 */

const nFormular = ({ n0, Nnorm, gcd, initGCD }) => {
  const alpha = gcd / initGCD;
  const results = [];

  console.log("n0 :" + n0, "Nnorm : " + Nnorm, "Alpha : " + alpha);
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
  //   console.log(results);

  return results;
};

const solve = ({ p, origin, ans, initGCD, final = [], result = [], norm }) => {
  if (p.length <= 2) {
    const reverse = result.reverse();

    final.push(
      ...twoFormular(ans, origin.slice(0, 2)).map((result) => {
        return result.concat(reverse);
      })
    );

    return final;
  }

  const { var0, gcd } = firstStep(p, ans);
  const P0 = var0.map((value) => (value * ans) / initGCD);

  nFormular({
    n0: P0[P0.length - 1],
    Nnorm: norm[P0.length - 1],
    ans,
    gcd,
    initGCD,
  }).map((nResult) => {
    // console.log(nResult);
    const answer = ans - nResult * origin[P0.length - 1];
    // console.log("ans : " + answer);
    // console.log(nResult);

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

const { gcd, norm } = firstStep(p, ans);

const results = solve({ p, ans, origin: p, initGCD: gcd, norm });
console.log(results);
console.log(results.length);
// results.map((data) => {
//   console.log(data);
//   console.log(data.reduce((acc, now, index) => acc + now * p[index], 0));
// });
