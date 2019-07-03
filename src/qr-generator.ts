import QRCode from 'qrcode'

export default class QRGenerator {
  private readonly canvasElement: HTMLCanvasElement = document.createElement(
    'canvas'
  )
  private readonly container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  destroy() {
    this.container.innerHTML = ''
  }

  render(data: { [key: string]: any }) {
    this.destroy()
    QRCode.toCanvas(this.canvasElement, JSON.stringify(data))
  }
}
