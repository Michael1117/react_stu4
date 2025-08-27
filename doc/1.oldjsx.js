const babel = require("@babel/core");
const sourcecode= `
  <h1>hello <span style={{color: "red"}}>world</span></h1>
`

const result = babel.transform(sourcecode, {
  plugins: [
    ["@babel/plugin-transform-react-jsx", {runtime: 'classic'}]
  ] 
})

// console.log(result)
console.log(result.code)

/*#__PURE__*/React.createElement("h1", null, "hello ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: "red"
  }
}, "world"));

// React.createElement("h1", null, )