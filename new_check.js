const { firstStep, twoFormular } = require("./functions");
const bezout = (int1, int2) => {
  let a = int1;
  let b = int2;

  let q = 0;
  let r = 1;
  let s1 = 1;
  let s2 = 0;
  let s3 = 1;
  let t1 = 0;
  let t2 = 1;
  let t3 = 0;

  while (r > 0) {
    q = Math.floor(a / b);
    r = a - q * b;
    s3 = s1 - q * s2;
    t3 = t1 - q * t2;

    if (r > 0) {
      a = b;
      b = r;
      s1 = s2;
      s2 = s3;
      t1 = t2;
      t2 = t3;
    }
  }

  return { b, sum: [s2, t2] };
};
const p = [3, 7, -8];
const ans = 15;

const ngcd = (...input) => {
  const orderNum = input.sort((a, b) => a - b);

  let round = 2;
  let result = [];
  let double = bezout(orderNum[0], orderNum[1]);
  let oddpos = 1;

  let lastNum = double.b;
  double.sum.map((num) => result.push(num));

  const inputLength = input.length;

  if (inputLength === 2) return { result, gcd: lastNum };

  while (true) {
    if (orderNum[round] === undefined) break;
    let ans = bezout(lastNum, orderNum[round]);
    lastNum = ans.b;
    ans.sum.map((num, index) => {
      if (index === 0) oddpos *= num;
      if (index % 2) return result.push(num);
    });
    round++;
  }

  const finalResult = result.map((value, index) => {
    if (index !== result.length - 1) return value * oddpos;
    return value;
  });

  return { result: finalResult, gcd: lastNum };
};

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

  //   console.log("n0 :" + n0, "Nnorm : " + Nnorm, "Alpha : " + alpha);
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
    n0: P0[P0.length - 1],
    Nnorm: norm[P0.length - 1],
    ans,
    gcd,
    initGCD,
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

const { gcd, norm } = firstStep(p, ans);

const results = solve({ p, ans, origin: p, initGCD: gcd, norm });
const finalAns = results.filter((result) => {
  if (Number.isInteger(result.reduce((acc, now) => acc + now, 0)))
    return result;
});
console.log(finalAns);
// results.map((data) => {
//   console.log(data);
//   console.log(data.reduce((acc, now, index) => acc + now * p[index], 0));
// });
