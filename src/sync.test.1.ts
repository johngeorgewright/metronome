import Metronome from './metronome'

const metronome = new Metronome({ bpm: 74, timeSignature: [4, 4] })
metronome.on('beat', console.log)
metronome.start()

function createDetails() {
  const connectButton = document.getElementById('go') as HTMLButtonElement
  const clientDetails = document.getElementById('answer') as HTMLTextAreaElement

  clientDetails.value = ''

  const details: {
    ice?: RTCIceCandidate
    offer?: RTCSessionDescriptionInit
  } = {}

  const done = () => {
    ;(document.getElementById(
      'details'
    ) as HTMLPreElement).innerHTML = JSON.stringify(details, null, 2)
  }

  const conn = new RTCPeerConnection()
  conn.onicecandidate = event => {
    if (event.candidate) {
      details.ice = event.candidate
      if (details.ice && details.offer) done()
    }
  }

  const sendChannel = conn.createDataChannel('sendChannel')

  const sendBeat = (beat: number) =>
    sendChannel.send(JSON.stringify({ message: 'beat', beat }))

  sendChannel.onopen = () => {
    metronome.on('beat', sendBeat)
  }

  sendChannel.onclose = () => {
    metronome.off('beat')
  }

  window.addEventListener('close', () => {
    sendChannel.close()
  })

  const connect = async () => {
    connectButton.removeEventListener('click', connect)
    const answer = new RTCSessionDescription(JSON.parse(clientDetails.value))
    await conn.setRemoteDescription(answer)
  }

  connectButton.addEventListener('click', connect)
  ;(async () => {
    const offer = await conn.createOffer()
    await conn.setLocalDescription(offer)
    details.offer = offer
    if (details.offer && details.ice) done()
  })()
}

;(document.getElementById(
  'create-details'
) as HTMLButtonElement).addEventListener('click', createDetails)
