function sum(a) {
  let n = 0;
  while (a > 1) {
    n += a;
    a--;
  }
  return n;
}

let res = sum(6);
console.log(res)