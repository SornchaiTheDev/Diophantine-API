const prompt = require("prompt");
require = require("esm")(module);
var Combinatorics = require("js-combinatorics");

const bezout = (int1, int2) => {
  let a = int1,
    originala = int1;
  let b = int2,
    originalb = int2;
  let q = Math.floor(a / b),
    r = a % b,
    s1 = 1,
    s2 = 0,
    s3 = s1 - q * s2,
    t1 = 0;
  t2 = 1;
  t3 = t1 - q * t2;
  while (true) {
    if (r === 0) break;
    a = b;
    b = r;
    r = a % b;
    q = Math.floor(a / b);
    s1 = s2;
    s2 = s3;
    s3 = s1 - q * s2;
    t1 = t2;
    t2 = t3;
    t3 = t1 - q * t2;
    // console.log(`${b} = (${s2})(${originala}) + (${t2})(${originalb})`);
  }

  return { b, sum: [s2, t2] };
};

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

const Normequation = (c, ...values) => {
  let sum = values.reduce((prev, current) => Math.pow(current, 2) + prev, 0);

  let sigmaAll = values.map((variable) => {
    return parseFloat(((variable * c) / sum).toFixed(4));
  });
  return sigmaAll;
};

const findTwoPos = (input, inputs, find, P0, norm) => {
  const remain = inputs.filter((data) => data !== input);

  const alpha = remain[0] / find.gcd;
  let round = 0;

  const results = [];

  let x = P0;

  if (x > norm) {
    while (x > norm) {
      results.push(x);
      x -= alpha;
      round++;
    }
    for (let i = 0; i <= round; i++) {
      results.push(x);
      x -= alpha;
    }
  } else {
    while (x < norm) {
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

const findNPos = (remain, find, P0, norm) => {
  const alpha = remain / find.gcd;

  const results = [];

  let round = 0;
  let x = P0;
  if (x > norm) {
    while (x > norm) {
      results.push(x);
      x -= alpha;
      round++;
    }
    for (let i = 0; i <= round; i++) {
      results.push(x);
      x -= alpha;
    }
  } else {
    while (x < norm) {
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

prompt.start();
prompt.get(["input"], (err, result) => {
  console.time();
  const { input } = result;
  const inputs = input.split(",");
  const xn = inputs.slice(0, -1).map((data) => parseInt(data));
  const answer = inputs[inputs.length - 1];
  const find = ngcd(...xn);
  const P0 = find.result.map((value) => (value * answer) / find.gcd);
  const norm = Normequation(answer, ...xn);

  const allPos = new Array(100).fill([]);

  if (xn.length === 2) {
    xn.map((value, index) =>
      findTwoPos(value, xn, find, P0[index], norm[index]).map(
        (result, index) => (allPos[index] = [...allPos[index], result])
      )
    );
  } else {
    const remain = ngcd(...xn.slice(0, -1)).gcd;
    let allPos = [];
    let x = [];
    let y = [];
    const nPos = [];

    xn.map((value, index) => {
      if (index > 1) {
        nPos.push(findNPos(remain, find, P0[2], norm[2]));
        // console.log(results);

        // findNPos(remain, find, P0[2], norm[2]).map(
        //   (result, index) => (allPos[index] = [...allPos[index], result])
        // );
      } else {
        if (index === 0)
          x = findTwoPos(value, xn, find, P0[index], norm[index]);
        if (index === 1)
          y = findTwoPos(value, xn, find, P0[index], norm[index]);
        // findTwoPos(value, xn, find, P0[index], norm[index]).map(
        //   (result, index) => (allPos[index] = [...allPos[index], result])
        // );
      }
    });
    x.map((value, index) => {
      allPos[index] = [value, y[index]];
    });
    let save = [];
    let result = [];
    console.log(nPos);
    while (nPos.length > 0) {
      nPos[0].map((n) => {
        allPos.map((data) => save.push([...data, n]));
      });
      nPos.shift();
      if (nPos.length === 0) result = save;
      allPos = save;
      save = [];
    }

    result.map((data) => console.log(data));
  }

  // console.log(allPos);
  // console.log(allPos.filter((value) => value.length === allPos[0].length));

  console.timeEnd();
});
