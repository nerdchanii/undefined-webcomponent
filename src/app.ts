import { createNode } from "../lib/core/createNode";
import { span, div, a } from "../lib/components/dom";
import Headercontainer from "./Header";
// App
const App = createNode({
  type: "div",
  props: {
    class: "apps",
  },
  children: [
    Headercontainer,
    div([
      span([a(["hello"], { href: "http://nerdchanii.github.io" })], {
        class: "span",
        style: "color: red;",
      }),
    ]),
    div(["2"], { class: "div", style: "color: blue;" }),
    div(["yeah"], { class: "div", style: "color: red;" }),
    div(["hello"], { class: "div", style: "color: black;" }),
    div(["nice"], { class: "div", style: "color: navy;" }),
  ],
});

export default App;
console.log(App);
