;(document.getElementById('go') as HTMLButtonElement).addEventListener(
  'click',
  async () => {
    const { offer: offerDetails, ice: iceDetails } = JSON.parse(
      (document.getElementById('details') as HTMLTextAreaElement).value
    )

    console.info('sdp', offerDetails)
    console.info('ice', iceDetails)

    const conn = new RTCPeerConnection()
    const offer = new RTCSessionDescription(offerDetails)
    const ice = new RTCIceCandidate(iceDetails)

    await conn.setRemoteDescription(offer)
    const answer = await conn.createAnswer()
    ;(document.getElementById(
      'answer'
    ) as HTMLPreElement).innerHTML = JSON.stringify(answer, null, 2)

    conn.setLocalDescription(answer)

    await conn.addIceCandidate(ice)

    conn.ondatachannel = ({ channel }) => {
      channel.onmessage = message => {
        console.log(message)
      }

      channel.onclose = () => {
        console.log('Closed!!')
      }
    }
  }
)
