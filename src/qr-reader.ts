import jsQR from 'jsQR'
import { Point } from 'jsQR/dist/locator'
import { EventEmitter } from 'events'
import StrictEventEmitter from './strict-event-emitter'

export interface QRReaderEvents {
  captured: string
}

export default class QRReader {
  private readonly container: HTMLElement
  private readonly videoElement: HTMLVideoElement = document.createElement(
    'video'
  )
  private readonly canvasElement: HTMLCanvasElement = document.createElement(
    'canvas'
  )
  private readonly canvas: CanvasRenderingContext2D
  private readonly loadingElement: HTMLDivElement = document.createElement(
    'div'
  )
  private readonly emitter: StrictEventEmitter<
    QRReaderEvents
  > = new EventEmitter()

  constructor(container: HTMLElement) {
    this.container = container
    const canvas = this.canvasElement.getContext('2d')

    if (!canvas) {
      throw new Error('Cannot create a canvas')
    }

    this.canvas = canvas
  }

  readonly destroy = () => {
    this.container.innerHTML = ''
  }

  readonly on = this.emitter.on.bind(this.emitter)
  readonly once = this.emitter.on.bind(this.emitter)
  readonly off = this.emitter.removeListener.bind(this.emitter)

  async render() {
    this.container.innerHTML = ''
    this.loadingElement.innerText = '⌛ Loading video...'
    this.container.appendChild(this.loadingElement)
    this.videoElement.hidden = true
    this.container.appendChild(this.videoElement)
    this.container.appendChild(this.canvasElement)
    this.emitter.once('captured', this.destroy)

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })

    this.videoElement.srcObject = stream
    this.videoElement.setAttribute('playsinline', '') // required to tell iOS safari we don't want fullscreen
    this.videoElement.play()

    requestAnimationFrame(this.tick)
  }

  private drawLine(begin: Point, end: Point, color: string) {
    this.canvas.beginPath()
    this.canvas.moveTo(begin.x, begin.y)
    this.canvas.lineTo(end.x, end.y)
    this.canvas.lineWidth = 4
    this.canvas.strokeStyle = color
    this.canvas.stroke()
  }

  private readonly tick = () => {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      this.loadingElement.hidden = true
      this.canvasElement.hidden = false
      this.canvasElement.height = this.videoElement.videoHeight
      this.canvasElement.width = this.videoElement.videoWidth
      this.canvas.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      )

      const imageData = this.canvas.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      )

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })

      if (code) {
        this.drawLine(
          code.location.topLeftCorner,
          code.location.topRightCorner,
          '#FF3B58'
        )
        this.drawLine(
          code.location.topRightCorner,
          code.location.bottomRightCorner,
          '#FF3B58'
        )
        this.drawLine(
          code.location.bottomRightCorner,
          code.location.bottomLeftCorner,
          '#FF3B58'
        )
        this.drawLine(
          code.location.bottomLeftCorner,
          code.location.topLeftCorner,
          '#FF3B58'
        )

        if (code.data) {
          this.emitter.emit('captured', code.data)
          return
        }
      }
    }

    requestAnimationFrame(this.tick)
  }
}
