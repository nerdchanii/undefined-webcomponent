import { div, header } from "../lib/components/dom";
const HedaerItem = createNode({
  type: "header",
  props: {
    class: "header-item",
  },
  children: [
    div(["hello"], { class: "div", style: "color: red;" }),
    div(["world"], { class: "div", style: "color: blue;" }),
    div(["nice"], { class: "div", style: "color: green;" }),
  ],
});

const Headercontainer = header([HedaerItem], { class: "header-container" });

export default Headercontainer;
