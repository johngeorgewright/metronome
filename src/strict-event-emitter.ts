export default interface StrictEventEmitter<Events> {
  emit<EventName extends keyof Events>(
    ...args: Events[EventName] extends void
      ? [EventName]
      : [EventName, Events[EventName]]
  ): boolean

  addListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: (param: Events[EventName]) => void
  ): this

  on<EventName extends keyof Events>(
    eventName: EventName,
    listener: (param: Events[EventName]) => void
  ): this

  once<EventName extends keyof Events>(
    eventName: EventName,
    listener: (param: Events[EventName]) => void
  ): this

  removeListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: (param: Events[EventName]) => void
  ): this

  removeAllListeners<EventName extends keyof Events>(
    eventName?: EventName
  ): this
}
