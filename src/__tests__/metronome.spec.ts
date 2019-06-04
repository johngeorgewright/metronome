import Metronome, { bpmToMs } from '../metronome'
import { EventEmitter } from 'events'

jest.useFakeTimers()

test('bpmToMs()', () => {
  expect(bpmToMs(60)).toMatchInlineSnapshot(`1000`)
  expect(bpmToMs(84)).toMatchInlineSnapshot(`714.2857142857143`)
})

test('Metronome', () => {
  const metronome = new Metronome(80)
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
