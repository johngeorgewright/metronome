;(async () => {
  await navigator.bluetooth.requestDevice({ acceptAllDevices: true })
})()
