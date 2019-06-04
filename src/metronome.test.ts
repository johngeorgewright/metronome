import Metronome, { Note } from './metronome'
import readLine from 'readline'

const metronome = new Metronome({ bpm: 174, timeSignature: [6, Note.Eighth] })

metronome
  .on('beat', beat => {
    process.stdout.write(beat.toString())
  })
  .on('bar.start', () => {
    readLine.clearLine(process.stdout, -1)
    readLine.moveCursor(process.stdout, -metronome.getTimeSignature()[0], 0)
  })
  .start()
