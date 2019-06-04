import Metronome from './metronome'
import readLine from 'readline'

const metronome = new Metronome({ bpm: 174, timeSignature: [4, 4] })

metronome.on('tick', beat => {
  process.stdout.write(beat.toString())
})

metronome.on('bar.start', () => {
  readLine.clearLine(process.stdout, -1)
  readLine.moveCursor(process.stdout, -4, 0)
})

metronome.start()
