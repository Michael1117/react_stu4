// 在React进行DOM DIFF的时候会计算要执行的操作

const Placement = 0b001;
const Update = 0b010;

let flags = 0b00;
// 增加操作

flags |= Placement;

console.log(flags.toString(2));
flags |= Update;

console.log(flags.toString(2));

flags = flags & ~Placement;

console.log(flags.toString(2));

//  0b00 0b001
console.log((flags & Placement) === 0);

// 判断是否包含
console.log((flags & Placement) === Placement);
console.log((flags & Update) === Update);

// 不包含 Placement
console.log((flags & Placement) === 0);
// 不包含 Update
console.log((flags & Update) === 0);
