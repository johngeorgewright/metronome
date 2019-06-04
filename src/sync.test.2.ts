document.getElementById('request')!.addEventListener('click', () => {
  navigator.bluetooth
    .requestDevice({
      filters: [{ name: 'Kong' }]
    })
    .then(console.log)
    .catch(error => console.error(error.message))
})
