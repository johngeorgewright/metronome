import QRReader from '../qr-reader'
import QRGenerator from '../qr-generator'

async function connect({
  offer: offerDetails,
  ice: iceDetails
}: {
  offer: RTCSessionDescriptionInit
  ice: RTCIceCandidateInit
}): Promise<{ conn: RTCPeerConnection; answer: RTCSessionDescriptionInit }> {
  const conn = new RTCPeerConnection()
  const offer = new RTCSessionDescription(offerDetails)
  const ice = new RTCIceCandidate(iceDetails)

  await conn.setRemoteDescription(offer)
  const answer = await conn.createAnswer()
  conn.setLocalDescription(answer)
  await conn.addIceCandidate(ice)

  return { conn, answer }
}

function listen(conn: RTCPeerConnection) {
  conn.addEventListener('datachannel', ({ channel }) => {
    channel.addEventListener('message', message => {
      console.log(message)
    })

    channel.addEventListener('close', () => {
      console.log('Closed!!')
    })
  })
}

function createAnswerQR(
  conn: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
) {
  const qrGenerator = new QRGenerator(document.getElementById(
    'answer-qr'
  ) as HTMLDivElement)

  const destroy = () => {
    conn.removeEventListener('datachannel', destroy)
    qrGenerator.destroy()
  }

  conn.addEventListener('datachannel', destroy)
  qrGenerator.render(answer)
}

;(document.getElementById('read-qr') as HTMLButtonElement).addEventListener(
  'click',
  () => {
    const qrReader = new QRReader(document.getElementById(
      'qr-reader'
    ) as HTMLDivElement)

    qrReader.once('captured', async (data: string) => {
      const { conn, answer } = await connect(JSON.parse(data))
      listen(conn)
      createAnswerQR(conn, answer)
    })

    qrReader.render()
  }
)
