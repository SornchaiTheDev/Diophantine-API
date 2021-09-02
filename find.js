const prompt = require("prompt");
require = require("esm")(module);

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

const twoFormular = (answer, inputs) => {
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

const nFormular = (ans, inputs, initinputs) => {
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

prompt.start();
prompt.get(["input"], (err, result) => {
  console.time();
  const { input } = result;
  const inputs = input.split(",");
  const xn = inputs.slice(0, -1).map((data) => parseInt(data));
  const answer = inputs[inputs.length - 1];
  const results = [];

  if (xn.length === 2) {
    console.log(nFormular(5, [2, 3], [2, 3, 4], 1));
  }
  if (xn.length === 3) {
    nFormular(answer, xn.slice(0, -1), xn, answer).map((result1, index) => {
      const ans = answer - result1 * xn[xn.length - 1];

      twoFormular(ans, [xn[0], xn[1]]).map((result) =>
        results.push(result.concat(result1))
      );
    });
  }
  if (xn.length === 4) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1, lastans) => {
      let ans = answer - result1 * xn[xn.length - 1];

      nFormular(ans, xn.slice(0, -2), xn).map((result2) => {
        let anss = ans - result2 * xn[xn.length - 2];

        results.push(
          ...twoFormular(anss, [xn[0], xn[1]]).map((res) =>
            res.concat(result2, result1)
          )
        );
      });
    });
  }
  if (xn.length === 5) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1, lastans) => {
      const ans = answer - result1 * xn[xn.length - 1];
      nFormular(ans, xn.slice(0, -2), xn).map((result2) => {
        const anss = ans - result2 * xn[xn.length - 2];
        nFormular(ans, xn.slice(0, -3), xn).map((result3) => {
          const ansss = anss - result3 * xn[xn.length - 3];
          results.push(
            ...twoFormular(ansss, [xn[0], xn[1]]).map((res) =>
              res.concat(result3, result2, result1)
            )
          );
        });
      });
    });
  }

  if (xn.length === 6) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            results.push(
              ...twoFormular(ans4, [xn[0], xn[1]]).map((res) =>
                res.concat(result4, result3, result2, result1)
              )
            );
          });
        });
      });
    });
  }

  if (xn.length === 7) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -4), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              results.push(
                ...twoFormular(ans5, [xn[0], xn[1]]).map((res) =>
                  res.concat(result5, result4, result3, result2, result1)
                )
              );
            });
          });
        });
      });
    });
  }

  if (xn.length === 8) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                results.push(
                  ...twoFormular(ans6, [xn[0], xn[1]]).map((res) =>
                    res.concat(
                      result6,
                      result5,
                      result4,
                      result3,
                      result2,
                      result1
                    )
                  )
                );
              });
            });
          });
        });
      });
    });
  }

  if (xn.length === 9) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  results.push(
                    ...twoFormular(ans7, [xn[0], xn[1]]).map((res) =>
                      res.concat(
                        result7,
                        result6,
                        result5,
                        result4,
                        result3,
                        result2,
                        result1
                      )
                    )
                  );
                });
              });
            });
          });
        });
      });
    });
  }

  if (xn.length === 10) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    results.push(
                      ...twoFormular(ans8, [xn[0], xn[1]]).map((res) =>
                        res.concat(
                          result8,
                          result7,
                          result6,
                          result5,
                          result4,
                          result3,
                          result2,
                          result1
                        )
                      )
                    );
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 11) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      results.push(
                        ...twoFormular(ans9, [xn[0], xn[1]]).map((res) =>
                          res.concat(
                            result9,
                            result8,
                            result7,
                            result6,
                            result5,
                            result4,
                            result3,
                            result2,
                            result1
                          )
                        )
                      );
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 12) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        results.push(
                          ...twoFormular(ans10, [xn[0], xn[1]]).map((res) =>
                            res.concat(
                              result10,
                              result9,
                              result8,
                              result7,
                              result6,
                              result5,
                              result4,
                              result3,
                              result2,
                              result1
                            )
                          )
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 13) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            results.push(
                              ...twoFormular(ans11, [xn[0], xn[1]]).map((res) =>
                                res.concat(
                                  result11,
                                  result10,
                                  result9,
                                  result8,
                                  result7,
                                  result6,
                                  result5,
                                  result4,
                                  result3,
                                  result2,
                                  result1
                                )
                              )
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 14) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                results.push(
                                  ...twoFormular(ans12, [xn[0], xn[1]]).map(
                                    (res) =>
                                      res.concat(
                                        result12,
                                        result11,
                                        result10,
                                        result9,
                                        result8,
                                        result7,
                                        result6,
                                        result5,
                                        result4,
                                        result3,
                                        result2,
                                        result1
                                      )
                                  )
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 15) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                nFormular(ans12, xn.slice(0, -13), xn).map(
                                  (result13) => {
                                    const ans13 =
                                      ans12 - result13 * xn[xn.length - 13];
                                    results.push(
                                      ...twoFormular(ans13, [xn[0], xn[1]]).map(
                                        (res) =>
                                          res.concat(
                                            result13,
                                            result12,
                                            result11,
                                            result10,
                                            result9,
                                            result8,
                                            result7,
                                            result6,
                                            result5,
                                            result4,
                                            result3,
                                            result2,
                                            result1
                                          )
                                      )
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 16) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                nFormular(ans12, xn.slice(0, -13), xn).map(
                                  (result13) => {
                                    const ans13 =
                                      ans12 - result13 * xn[xn.length - 13];
                                    nFormular(ans13, xn.slice(0, -14), xn).map(
                                      (result14) => {
                                        const ans14 =
                                          ans13 - result14 * xn[xn.length - 14];
                                        results.push(
                                          ...twoFormular(ans14, [
                                            xn[0],
                                            xn[1],
                                          ]).map((res) =>
                                            res.concat(
                                              result14,
                                              result13,
                                              result12,
                                              result11,
                                              result10,
                                              result9,
                                              result8,
                                              result7,
                                              result6,
                                              result5,
                                              result4,
                                              result3,
                                              result2,
                                              result1
                                            )
                                          )
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 17) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                nFormular(ans12, xn.slice(0, -13), xn).map(
                                  (result13) => {
                                    const ans13 =
                                      ans12 - result13 * xn[xn.length - 13];
                                    nFormular(ans13, xn.slice(0, -14), xn).map(
                                      (result14) => {
                                        const ans14 =
                                          ans13 - result14 * xn[xn.length - 14];
                                        nFormular(
                                          ans14,
                                          xn.slice(0, -15),
                                          xn
                                        ).map((result15) => {
                                          const ans15 =
                                            ans14 -
                                            result15 * xn[xn.length - 15];
                                          results.push(
                                            ...twoFormular(ans15, [
                                              xn[0],
                                              xn[1],
                                            ]).map((res) =>
                                              res.concat(
                                                result15,
                                                result14,
                                                result13,
                                                result12,
                                                result11,
                                                result10,
                                                result9,
                                                result8,
                                                result7,
                                                result6,
                                                result5,
                                                result4,
                                                result3,
                                                result2,
                                                result1
                                              )
                                            )
                                          );
                                        });
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 18) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                nFormular(ans12, xn.slice(0, -13), xn).map(
                                  (result13) => {
                                    const ans13 =
                                      ans12 - result13 * xn[xn.length - 13];
                                    nFormular(ans13, xn.slice(0, -14), xn).map(
                                      (result14) => {
                                        const ans14 =
                                          ans13 - result14 * xn[xn.length - 14];
                                        nFormular(
                                          ans14,
                                          xn.slice(0, -15),
                                          xn
                                        ).map((result15) => {
                                          const ans15 =
                                            ans14 -
                                            result15 * xn[xn.length - 15];
                                          nFormular(
                                            ans15,
                                            xn.slice(0, -16),
                                            xn
                                          ).map((result16) => {
                                            const ans16 =
                                              ans15 -
                                              result16 * xn[xn.length - 16];
                                            results.push(
                                              ...twoFormular(ans16, [
                                                xn[0],
                                                xn[1],
                                              ]).map((res) =>
                                                res.concat(
                                                  result16,
                                                  result15,
                                                  result14,
                                                  result13,
                                                  result12,
                                                  result11,
                                                  result10,
                                                  result9,
                                                  result8,
                                                  result7,
                                                  result6,
                                                  result5,
                                                  result4,
                                                  result3,
                                                  result2,
                                                  result1
                                                )
                                              )
                                            );
                                          });
                                        });
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 19) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                nFormular(ans12, xn.slice(0, -13), xn).map(
                                  (result13) => {
                                    const ans13 =
                                      ans12 - result13 * xn[xn.length - 13];
                                    nFormular(ans13, xn.slice(0, -14), xn).map(
                                      (result14) => {
                                        const ans14 =
                                          ans13 - result14 * xn[xn.length - 14];
                                        nFormular(
                                          ans14,
                                          xn.slice(0, -15),
                                          xn
                                        ).map((result15) => {
                                          const ans15 =
                                            ans14 -
                                            result15 * xn[xn.length - 15];
                                          nFormular(
                                            ans15,
                                            xn.slice(0, -16),
                                            xn
                                          ).map((result16) => {
                                            const ans16 =
                                              ans15 -
                                              result16 * xn[xn.length - 16];
                                            nFormular(
                                              ans16,
                                              xn.slice(0, -17),
                                              xn
                                            ).map((result17) => {
                                              const ans17 =
                                                ans16 -
                                                result17 * xn[xn.length - 17];
                                              results.push(
                                                ...twoFormular(ans17, [
                                                  xn[0],
                                                  xn[1],
                                                ]).map((res) =>
                                                  res.concat(
                                                    result17,
                                                    result16,
                                                    result15,
                                                    result14,
                                                    result13,
                                                    result12,
                                                    result11,
                                                    result10,
                                                    result9,
                                                    result8,
                                                    result7,
                                                    result6,
                                                    result5,
                                                    result4,
                                                    result3,
                                                    result2,
                                                    result1
                                                  )
                                                )
                                              );
                                            });
                                          });
                                        });
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 20) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                nFormular(ans12, xn.slice(0, -13), xn).map(
                                  (result13) => {
                                    const ans13 =
                                      ans12 - result13 * xn[xn.length - 13];
                                    nFormular(ans13, xn.slice(0, -14), xn).map(
                                      (result14) => {
                                        const ans14 =
                                          ans13 - result14 * xn[xn.length - 14];
                                        nFormular(
                                          ans14,
                                          xn.slice(0, -15),
                                          xn
                                        ).map((result15) => {
                                          const ans15 =
                                            ans14 -
                                            result15 * xn[xn.length - 15];
                                          nFormular(
                                            ans15,
                                            xn.slice(0, -16),
                                            xn
                                          ).map((result16) => {
                                            const ans16 =
                                              ans15 -
                                              result16 * xn[xn.length - 16];
                                            nFormular(
                                              ans16,
                                              xn.slice(0, -17),
                                              xn
                                            ).map((result17) => {
                                              const ans17 =
                                                ans16 -
                                                result17 * xn[xn.length - 17];
                                              nFormular(
                                                ans17,
                                                xn.slice(0, -18),
                                                xn
                                              ).map((result18) => {
                                                const ans18 =
                                                  ans17 -
                                                  result18 * xn[xn.length - 18];
                                                results.push(
                                                  ...twoFormular(ans18, [
                                                    xn[0],
                                                    xn[1],
                                                  ]).map((res) =>
                                                    res.concat(
                                                      result18,
                                                      result17,
                                                      result16,
                                                      result15,
                                                      result14,
                                                      result13,
                                                      result12,
                                                      result11,
                                                      result10,
                                                      result9,
                                                      result8,
                                                      result7,
                                                      result6,
                                                      result5,
                                                      result4,
                                                      result3,
                                                      result2,
                                                      result1
                                                    )
                                                  )
                                                );
                                              });
                                            });
                                          });
                                        });
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  if (xn.length === 21) {
    nFormular(answer, xn.slice(0, -1), xn).map((result1) => {
      const ans1 = answer - result1 * xn[xn.length - 1];
      nFormular(ans1, xn.slice(0, -2), xn).map((result2) => {
        const ans2 = ans1 - result2 * xn[xn.length - 2];
        nFormular(ans2, xn.slice(0, -3), xn).map((result3) => {
          const ans3 = ans2 - result3 * xn[xn.length - 3];
          nFormular(ans3, xn.slice(0, -4), xn).map((result4) => {
            const ans4 = ans3 - result4 * xn[xn.length - 4];
            nFormular(ans4, xn.slice(0, -5), xn).map((result5) => {
              const ans5 = ans4 - result5 * xn[xn.length - 5];
              nFormular(ans5, xn.slice(0, -6), xn).map((result6) => {
                const ans6 = ans5 - result6 * xn[xn.length - 6];
                nFormular(ans6, xn.slice(0, -7), xn).map((result7) => {
                  const ans7 = ans6 - result7 * xn[xn.length - 7];
                  nFormular(ans7, xn.slice(0, -8), xn).map((result8) => {
                    const ans8 = ans7 - result8 * xn[xn.length - 8];
                    nFormular(ans8, xn.slice(0, -9), xn).map((result9) => {
                      const ans9 = ans8 - result9 * xn[xn.length - 9];
                      nFormular(ans9, xn.slice(0, -10), xn).map((result10) => {
                        const ans10 = ans9 - result10 * xn[xn.length - 10];
                        nFormular(ans10, xn.slice(0, -11), xn).map(
                          (result11) => {
                            const ans11 = ans10 - result11 * xn[xn.length - 11];
                            nFormular(ans11, xn.slice(0, -12), xn).map(
                              (result12) => {
                                const ans12 =
                                  ans11 - result12 * xn[xn.length - 12];
                                nFormular(ans12, xn.slice(0, -13), xn).map(
                                  (result13) => {
                                    const ans13 =
                                      ans12 - result13 * xn[xn.length - 13];
                                    nFormular(ans13, xn.slice(0, -14), xn).map(
                                      (result14) => {
                                        const ans14 =
                                          ans13 - result14 * xn[xn.length - 14];
                                        nFormular(
                                          ans14,
                                          xn.slice(0, -15),
                                          xn
                                        ).map((result15) => {
                                          const ans15 =
                                            ans14 -
                                            result15 * xn[xn.length - 15];
                                          nFormular(
                                            ans15,
                                            xn.slice(0, -16),
                                            xn
                                          ).map((result16) => {
                                            const ans16 =
                                              ans15 -
                                              result16 * xn[xn.length - 16];
                                            nFormular(
                                              ans16,
                                              xn.slice(0, -17),
                                              xn
                                            ).map((result17) => {
                                              const ans17 =
                                                ans16 -
                                                result17 * xn[xn.length - 17];
                                              nFormular(
                                                ans17,
                                                xn.slice(0, -18),
                                                xn
                                              ).map((result18) => {
                                                const ans18 =
                                                  ans17 -
                                                  result18 * xn[xn.length - 18];
                                                nFormular(
                                                  ans18,
                                                  xn.slice(0, -19),
                                                  xn
                                                ).map((result19) => {
                                                  const ans19 =
                                                    ans18 -
                                                    result19 *
                                                      xn[xn.length - 19];
                                                  results.push(
                                                    ...twoFormular(ans19, [
                                                      xn[0],
                                                      xn[1],
                                                    ]).map((res) =>
                                                      res.concat(
                                                        result19,
                                                        result18,
                                                        result17,
                                                        result16,
                                                        result15,
                                                        result14,
                                                        result13,
                                                        result12,
                                                        result11,
                                                        result10,
                                                        result9,
                                                        result8,
                                                        result7,
                                                        result6,
                                                        result5,
                                                        result4,
                                                        result3,
                                                        result2,
                                                        result1
                                                      )
                                                    )
                                                  );
                                                });
                                              });
                                            });
                                          });
                                        });
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  if (xn.length > 2) {
  }

  //find from result
  // const findans = results.map((result) => result.toString());

  // console.log(findans);

  // console.log(findans.find((data) => data === "-3,-3,-3,0,-3,2,-2"));

  const ans = results.map((result, index) => {
    return result
      .map((pos, index) => ({ pos: pos * pos, index: index }))
      .reduce((acc, current) => acc + current.pos, 0);
  });

  const anss = ans.map((value, index) => results[index].concat({ pos: value }));

  const final = anss.sort((a, b) => a[a.length - 1].pos - b[b.length - 1].pos);

  console.log(results);
  // console.log(results.slice(0, 10));

  const variables = [...xn];
  "abcdefghijklmnopqrstuvwxyz".split("").map((variable, index) => {
    if (index < variables.length)
      variables[index] = `${variables[index]}${variable}`;
  });

  const showans = final[0]
    .slice(0, -1)
    .map((ans, index) => `(${xn[index]})(${ans})`);

  console.log("sum : " + final[0][final[0].length - 1].pos);
  console.log("-----------");
  console.log(final[0].slice(0, -1));
  console.log("-----------");
  console.log(variables.join("+") + "=" + answer);
  console.log(showans.join("+") + "=" + answer);
  console.log("-----------");

  console.timeEnd();
});
