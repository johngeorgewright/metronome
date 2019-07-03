import Metronome from '../metronome'
import QRGenerator from 'qrcode'
import QRReader from '../qr-reader'
import { once } from '../util/events'

const metronome = new Metronome({ bpm: 74, timeSignature: [4, 4] })
metronome.on('beat', console.log)
metronome.start()

function syncMetronome(conn: RTCPeerConnection) {
  const sendChannel = conn.createDataChannel('sendChannel')

  const sendBeat = (beat: number) =>
    sendChannel.send(JSON.stringify({ message: 'beat', beat }))

  sendChannel.addEventListener('open', () => {
    metronome.on('beat', sendBeat)
  })

  sendChannel.addEventListener('close', () => {
    metronome.off('beat')
  })

  window.addEventListener('close', () => {
    sendChannel.close()
  })
}

async function createQR(): Promise<RTCPeerConnection> {
  const detailsQR = document.getElementById('details-qr') as HTMLCanvasElement

  const details: {
    ice?: RTCIceCandidate
    offer?: RTCSessionDescriptionInit
  } = {}

  const done = () => {
    const detailsStr = JSON.stringify(details, null, 2)
    QRGenerator.toCanvas(detailsQR, detailsStr)
  }

  const conn = new RTCPeerConnection()
  once(conn, 'icecandidate', ({ candidate }: RTCPeerConnectionIceEvent) => {
    console.log(candidate)
    if (candidate) {
      details.ice = candidate
      if (details.ice && details.offer) done()
    }
  })

  syncMetronome(conn)

  const offer = await conn.createOffer()
  await conn.setLocalDescription(offer)
  details.offer = offer
  if (details.offer && details.ice) done()

  return conn
}

function readAnswer(conn: RTCPeerConnection) {
  const qrReader = new QRReader(document.getElementById(
    'answer-qr'
  ) as HTMLDivElement)

  qrReader.once('captured', async clientDetails => {
    const answer = new RTCSessionDescription(JSON.parse(clientDetails))
    await conn.setRemoteDescription(answer)
  })

  qrReader.render()
}

;(document.getElementById(
  'create-details'
) as HTMLButtonElement).addEventListener('click', async () => {
  const conn = await createQR()

  once(
    document.getElementById('read-client-details') as HTMLButtonElement,
    'click',
    () => {
      readAnswer(conn)
    }
  )
})
