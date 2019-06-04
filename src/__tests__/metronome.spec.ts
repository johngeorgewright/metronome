import { bpmToMs } from '../bpm'
import Metronome from '../metronome'
import { EventEmitter } from 'events'

jest.useFakeTimers()

test('Metronome', () => {
  const metronome = new Metronome({ bpm: 80, timeSignature: [4, 4] })
  const ms = bpmToMs(80)
  expect(metronome).toBeInstanceOf(EventEmitter)

  const spy = jest.fn()
  metronome.on('tick', spy)
  metronome.start()

  expect(spy).not.toHaveBeenCalled()
  jest.advanceTimersByTime(ms)
  expect(spy).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(ms)
  expect(spy).toHaveBeenCalledTimes(2)
})
