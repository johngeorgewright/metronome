export interface BasicEmitter {
  addEventListener: (
    eventName: string,
    listener: (...args: any[]) => any,
    ...args: any[]
  ) => any
  removeEventListener: (
    eventName: string,
    listener: (...args: any[]) => any
  ) => any
}

export const once = (
  eventEmitter: BasicEmitter,
  eventName: string,
  listener: Function
) => {
  const onceListener = (...args: any[]) => {
    eventEmitter.removeEventListener(eventName, onceListener)
    listener(...args)
  }

  eventEmitter.addEventListener(eventName, onceListener)
}
