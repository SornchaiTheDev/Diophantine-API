const bezout = (int1, int2) => {
  let a = int1;
  let b = int2;
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

const firstStep = (xn, c) => {
  const ans = ngcd(...xn);

  return { var0: ans.result, gcd: ans.gcd, norm: Normequation(c, ...xn) };
};

const twocoordinate = (inputs, c, x0, norm, gcd) => {
  const x = inputs[0];
  const y = inputs[1];
  const t = Math.floor((norm - x0) / (y / gcd));
  const x1 = x0 + (y / gcd) * t;
  const y1 = (c - x * x1) / y;
  const x2 = x0 + (y / gcd) * (t + 1);
  const y2 = (c - x * x2) / y;
  return [x1, y1, x2, y2];
};

module.exports.twoFormular = (answer, inputs) => {
  const resultEqa = [];

  const thisequ = firstStep(inputs, answer);

  const coor = twocoordinate(
    inputs,
    answer,
    (thisequ.var0[0] * answer) / thisequ.gcd,
    thisequ.norm[0],
    thisequ.gcd
  );

  resultEqa.push(coor.slice(0, 2));
  resultEqa.push(coor.slice(2, 4));

  return resultEqa;
};

const ncoordinate = (x0, norm, gcd, initgcd) => {
  const t = Math.floor((norm - x0) / (-gcd / initgcd));
  const x1 = x0 - (gcd / initgcd) * t;
  const x2 = x0 - (gcd / initgcd) * (t + 1);
  return [x1, x2];
};

module.exports.nFormular = (ans, inputs, initinputs) => {
  const last = initinputs.length - 1;
  const thisequ = firstStep(initinputs, ans);
  const remain = firstStep(inputs, ans);

  const coor = ncoordinate(
    (thisequ.var0[last] * ans) / thisequ.gcd,
    thisequ.norm[last],
    remain.gcd,
    thisequ.gcd
  );

  return coor;
};
