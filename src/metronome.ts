import { EventEmitter } from 'events'
import { bpmToMs } from './bpm'

export enum Note {
  Semibreve = 1,
  Whole = Semibreve,

  Minim = 2,
  Half = Minim,

  Crotchet = 4,
  Quarter = Crotchet,

  Quaver = 8,
  Eighth = Quaver
}

export type TimeSignature = [
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16,
  Note
]

export interface MetronomeOptions {
  bpm: number
  mark?: Note
  timeSignature: TimeSignature
}

export interface MetronomeEvents {
  beat: number
  'bar.complete': void
  'bar.start': void
  start: void
  stop: void
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
  private mark: Note
  private timeSignature: TimeSignature

  constructor({ bpm, mark = Note.Quarter, timeSignature }: MetronomeOptions) {
    super()
    this.bpm = bpm
    this.mark = mark
    this.timeSignature = timeSignature
  }

  private readonly tick = () => {
    const maxBeat = this.timeSignature[0]
    const beat = this.beat

    if (beat === 1) {
      this.emit('bar.start')
    }

    this.emit('beat', beat)

    if (beat === maxBeat) {
      this.emit('bar.complete')
      this.beat = 1
    } else {
      this.beat++
    }
  }

  private intervalInMS(): number {
    let ms = bpmToMs(this.bpm)

    return this.timeSignature[1] === this.mark
      ? ms
      : this.timeSignature[1] > this.mark
      ? ms / (this.timeSignature[1] - this.mark)
      : ms * (this.mark - this.timeSignature[1])
  }

  get running() {
    return !!this.intervalId
  }

  getBPM(): number {
    return this.bpm
  }

  setBPM(bpm: number) {
    this.bpm = bpm
    this.restart()
  }

  setTimeSignature(timeSignature: TimeSignature) {
    this.timeSignature = timeSignature
    this.restart()
  }

  getTimeSignature(): TimeSignature {
    return this.timeSignature
  }

  restart() {
    if (this.running) {
      this.stop()
      this.start()
    }
  }

  start() {
    this.emit('start')
    this.tick()
    this.intervalId = setInterval(this.tick, this.intervalInMS())
  }

  stop() {
    if (this.intervalId) {
      this.emit('stop')
      this.intervalId = clearInterval(this.intervalId)
    }
  }
}
