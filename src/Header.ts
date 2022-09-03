import { div, header } from "../lib/components/dom";

const Headercontainer = header(
  [
    div(["hello"], { class: "div", style: "color: red;" }),
    div(["world"], { class: "div", style: "color: blue;" }),
    div(["nice"], { class: "div", style: "color: green;" }),
  ],
  { class: "header-container" }
);

export default Headercontainer;
