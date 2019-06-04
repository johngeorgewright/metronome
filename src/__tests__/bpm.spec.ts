import { bpmToMs } from '../bpm'

test('bpmToMs()', () => {
  expect(bpmToMs(60)).toMatchInlineSnapshot(`1000`)
  expect(bpmToMs(84)).toMatchInlineSnapshot(`714.2857142857143`)
})
