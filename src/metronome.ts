import { EventEmitter } from 'events'

export const bpmToMs = (bpm: number): number => (60 * 1000) / bpm

export default class Metronome extends EventEmitter {
  private bpm: number
  private intervalId: NodeJS.Timeout | void

  constructor(bpm: number) {
    super()
    this.bpm = bpm
    this.intervalId = void 0
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
    this.intervalId = setInterval(() => {
      this.emit('tick')
    }, bpmToMs(this.bpm))
  }

  stop() {
    this.emit('stop')
    if (this.intervalId) {
      this.intervalId = clearInterval(this.intervalId)
    }
  }
}
