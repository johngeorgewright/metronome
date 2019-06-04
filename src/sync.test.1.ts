import Metronome from './metronome'

const metronome = new Metronome({ bpm: 74, timeSignature: [4, 4] })
metronome.on('beat', console.log)
metronome.start()

const conn = new RTCPeerConnection()
conn.ondatachannel = () => {
  console.log('data')
}

conn.onicecandidate = event =>
  event.candidate && conn.addIceCandidate(event.candidate).catch(console.error)
