import QRReader from './qr-reader'

const qr = new QRReader(document.getElementById('container') as HTMLDivElement)

qr.on('captured', (data: string) => {
  alert(data)
})

qr.render()
