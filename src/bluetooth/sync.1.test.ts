;(document.getElementById('request') as HTMLButtonElement).addEventListener(
  'click',
  async () => {
    await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    })
  }
)
