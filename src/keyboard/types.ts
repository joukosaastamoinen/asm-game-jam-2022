export type EventType = "keyup" | "keydown";

export type Event = {
  key: string;
  preventDefault: () => void;
};

export type Keyboard = {
  on: (eventName: EventType, callback: (event: Event) => void) => void;
  off: (eventName: EventType, callback: (event: Event) => void) => void;
  getKeysDown: () => string[];
};
