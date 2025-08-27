const Placement = 0b001;
const Update = 0b010;

let flags = 0b00;
flags |= Placement;

flags |= Update;

console.log(flags.toString(2));
flags = flags & ~Placement;
console.log(flags.toString(2));

// 包含
console.log((flags & Placement) === Placement);
console.log((flags & Update) === Update);

// // 不包含

// console.log(flags)
// console.log((flags & Placement) === 0);
// console.log((flags & Update) === 0);

function test(a) {
  if (a > 3) {
    return "aaa";
  }
  console.log("jjjj");
}

console.log(test(4));
test(2);
