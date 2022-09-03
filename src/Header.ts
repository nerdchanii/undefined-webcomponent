import { div, header, span } from "../lib/components/dom";
import {
  createEventListener,
  eventCoupler,
  createEventCoupler,
} from "../lib/core/events";

/**
 * 이벤트 리스너 추가
 */
const onClick = createEventListener("click", (e) => {
  console.log(e, "jiaa");
});

const onFocus = createEventListener("drag", (e) => {
  console.log("drag", e);
});

/**
 * 커플러를 만들기
 */
const ec = createEventCoupler(onClick);
const ec2 = createEventCoupler([onFocus]);

const Headercontainer = header([
  /**
   * 커플러를 가져다가 이벤트에 직접 연결 단일 인자 받기
   */
  eventCoupler(div(["hello"]), onClick),
  /**
   * 커플러를 가져다가 이벤트에 직접 연결 배열로 받기
   */
  eventCoupler(div(["world"]), [onClick]),
  /**
   * 커플러를 만들어서 이벤트 연결
   */
  div(["somethind", ec(span(["hello"]))]),
  ec2(div(["kkkk"])),
]);

export default Headercontainer;
