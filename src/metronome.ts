import { EventEmitter } from 'events'
import { bpmToMs } from './bpm'

export type TimeSignature = [number, number]

export interface MetronomeOptions {
  bpm: number
  timeSignature: TimeSignature
}

export interface MetronomeEvents {
  'bar.complete': void
  'bar.start': void
  start: void
  stop: void
  tick: number
}

export default interface Metronome {
  emit<EventName extends keyof MetronomeEvents>(
    ...args: MetronomeEvents[EventName] extends void
      ? [EventName]
      : [EventName, MetronomeEvents[EventName]]
  ): boolean

  addEventListener<EventName extends keyof MetronomeEvents>(
    eventName: EventName,
    listener: (param: MetronomeEvents[EventName]) => void
  ): this

  on<EventName extends keyof MetronomeEvents>(
    eventName: EventName,
    listener: (param: MetronomeEvents[EventName]) => void
  ): this

  once<EventName extends keyof MetronomeEvents>(
    eventName: EventName,
    listener: (param: MetronomeEvents[EventName]) => void
  ): this

  removeListener<EventName extends keyof MetronomeEvents>(
    eventName: EventName,
    listener: (param: MetronomeEvents[EventName]) => void
  ): this

  removeAllListeners<EventName extends keyof MetronomeEvents>(
    eventName: EventName
  ): this

  eventNames<EventName extends keyof MetronomeEvents>(): EventName[]
}

export default class Metronome extends EventEmitter {
  private beat: number = 1
  private bpm: number
  private intervalId: NodeJS.Timeout | void = void 0
  private timeSignature: TimeSignature

  constructor({ bpm, timeSignature }: MetronomeOptions) {
    super()
    this.bpm = bpm
    this.timeSignature = timeSignature
  }

  private readonly tick = () => {
    const maxBeat = this.timeSignature[0]
    const beat = this.beat

    if (beat === 1) {
      this.emit('bar.start')
    }

    this.emit('tick', beat)

    if (beat === maxBeat) {
      this.emit('bar.complete')
      this.beat = 1
    } else {
      this.beat++
    }
  }

  get running() {
    return !!this.intervalId
  }

  setBPM(bpm: number) {
    this.bpm = bpm

    if (this.running) {
      this.restart()
    }
  }

  restart() {
    this.stop()
    this.start()
  }

  start() {
    this.emit('start')
    this.intervalId = setInterval(this.tick, bpmToMs(this.bpm))
  }

  stop() {
    if (this.intervalId) {
      this.emit('stop')
      this.intervalId = clearInterval(this.intervalId)
    }
  }
}
