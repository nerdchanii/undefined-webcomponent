import { Node } from "./types";

export type EventListener = {
  type: string;
  listener: (e: Event) => void;
};

export const createEventListener = (
  type: string,
  listener: (e: Event) => void
) => {
  return {
    type,
    listener,
  };
};

export const eventCoupler = (
  node: Node,
  ...events: Array<EventListener | EventListener[]>
) => {
  const { props } = node;
  let eventsProps = {};
  for (const event of events) {
    if (Array.isArray(event)) {
      for (const e of event) {
        eventsProps = {
          ...eventsProps,
          [e.type]: e.listener,
        };
      }
    } else {
      eventsProps = {
        ...eventsProps,
        [event.type]: event.listener,
      };
    }
  }

  return {
    ...node,
    props: {
      ...props,
      eventsProps: eventsProps,
    },
  };
};

export const createEventCoupler = (
  ...events: Array<EventListener | EventListener[]>
) => {
  return (node: Node) => {
    return eventCoupler(node, ...events);
  };
};
