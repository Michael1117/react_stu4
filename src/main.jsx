// console.log("main")
import { createRoot } from "react-dom/src/client/ReactDomRoot";

/* let element = (
  <h1>
    {" "}
    hello <span style={{ color: "red" }}>world</span>
  </h1>
); */

let element = (
  <div>
    <h1>
      hello <span style={{ color: "red" }}>world</span>
    </h1>
    <h2>
      hello2 <span style={{ color: "green" }}>world2</span>
    </h2>
  </div>
);
// console.log(element);
//debugger;
const root = createRoot(document.getElementById("root"));
// console.log(root)
// console.log(root.current)
root.render(element);
