const babel = require("@babel/core");
const sourcecode= `
  <h1>hello <span style={{color: "red"}}>world</span></h1>
`

const result = babel.transform(sourcecode, {
  plugins: [
    ["@babel/plugin-transform-react-jsx", {runtime: 'automatic'}]
  ] 
})

// console.log(result)
console.log(result.code)

// /*#__PURE__*/
// React.createElement("h1", null, "hello ", /*#__PURE__*/React.createElement("span", {
//   style: {
//     color: "red"
//   }
// }, "world"));


// import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// /*#__PURE__*/_jsxs("h1", {
//   children: ["hello ", /*#__PURE__*/_jsx("span", {
//     style: {
//       color: "red"
//     },
//     children: "world"
//   })]
// });

// React.createElement("h1", null, )