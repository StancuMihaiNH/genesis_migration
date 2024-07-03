export enum EVENT {
  VALUE_CHANGE = "VALUE_CHANGE",
}
const events: { [key: string]: Function[] } = {};
const EventEmitter = {
  dispatch: function (event: EVENT, data: any) {
    if (!events[event]) return;
    events[event].forEach((callback) => callback(data));
  },
  subscribe: function (event: EVENT, callback: Function) {
    if (!events[event]) events[event] = [];
    events[event].push(callback);
  },
};

export default EventEmitter;
