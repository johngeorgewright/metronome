import { bpmToMs } from '../bpm'
import Metronome, { TimeSignature, Note } from '../metronome'

jest.useFakeTimers()

const testMetronome = (
  bpm: number,
  timeSignature: TimeSignature,
  ms: number,
  mark?: Note
) => {
  const spy = jest.fn()
  const metronome = new Metronome({ bpm, mark, timeSignature })

  metronome.on('beat', spy)
  metronome.start()
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenLastCalledWith(1)

  for (let i = 2; i <= timeSignature[0]; i++) {
    jest.advanceTimersByTime(ms)
    expect(spy).toHaveBeenCalledTimes(i)
    expect(spy).toHaveBeenLastCalledWith(i)
  }

  jest.advanceTimersByTime(ms)
  expect(spy).toHaveBeenCalledTimes(timeSignature[0] + 1)
  expect(spy).toHaveBeenLastCalledWith(1)
}

describe('Metronome', () => {
  test('80bpm 4/4 crochets', () => {
    testMetronome(80, [4, 4], bpmToMs(80))
  })

  test('55bpm 6/8 crochets', () => {
    testMetronome(55, [6, 8], bpmToMs(55) / 2, Note.Quarter)
  })

  test('55bpm 6/8 quavers', () => {
    testMetronome(55, [6, 8], bpmToMs(55), Note.Eighth)
  })

  test('180bpm 6/8 minims', () => {
    testMetronome(180, [6, 8], bpmToMs(180) / 4, Note.Minim)
  })
})
