document.addEventListener('DOMContentLoaded', () => {
  // DOM
  const giftsContainer = document.getElementById('gifts-container')
  const nameEditBox = document.getElementById('gift-name-input')
  const urlEditBox = document.getElementById('gift-image-input')
  const editForm = document.getElementById('new-gift-form')
  const searchInput = document.getElementById('filter-input')
  // Variables
  const giftsURL = 'http://localhost:3000/gifts'
  let dataStore = [] // fill this in intial GET to server
  // Fetches and Event Listeners
  // Initial Fetch to GET all gift data and RENDER on page
  fetch(giftsURL) // { method: 'GET' } is the default
    .then(r => r.json())
    .then(arrayOfGiftObjects => {
      dataStore = arrayOfGiftObjects // populating the dataStore
      let jsonAsHTML = dataStore.map((giftObject) => {
        return `<li id="gift-${giftObject.id}"><h2>${giftObject.name}</h2>
                <img src="${giftObject.image}">
                <button id=${giftObject.id} >Edit Me</button>
                <button data-id="${giftObject.id}">Delete Me</button></li>
                `
      })
      giftsContainer.innerHTML = jsonAsHTML.join('')
    })

  giftsContainer.addEventListener('click', (e) => {
    if (e.target.innerText === 'Edit Me') {
      let clickedGiftId = e.target.id
      editForm.dataset.id = clickedGiftId // assign this
      let clickedGift = dataStore.find((giftObject) => { return giftObject.id == clickedGiftId })
      // use clickedGift to populate edit fields in form
      nameEditBox.value = clickedGift.name
      urlEditBox.value = clickedGift.image
    } else if (e.target.innerText === 'Delete Me') {
      let giftToDeleteId = e.target.dataset.id
      // find the gift on the page to get rid of it - optimistcally
      let giftToDelete = document.getElementById(`gift-${giftToDeleteId}`)
      giftToDelete.remove()
      // remove from dataStore
      dataStore = dataStore.filter((gift) => {
        return gift.id != giftToDeleteId
      })
      // now fetch to update server - go to SPECIFIC gift's page
      fetch(`http://localhost:3000/gifts/${giftToDeleteId}`, {
        method: 'DELETE'
      })
    }
  })

  editForm.addEventListener('submit', e => {
    e.preventDefault()
    // e.target.dataset.id is the clicked gift's id which we assigned above
    // optimistically render
    let giftToUpdate = document.getElementById(`gift-${e.target.dataset.id}`)
    let h2 = giftToUpdate.querySelector('h2')
    h2.innerText = nameEditBox.value
    let nameToSendToServer = nameEditBox.value
    let img = giftToUpdate.querySelector('IMG')
    img.src = urlEditBox.value
    let imgToSendToServer = urlEditBox.value
    // MUST ALSO UPDATE THE DATA STORE
    let foundGift = dataStore.find((gift) => { return gift.id == e.target.dataset.id })
    foundGift.name = nameToSendToServer
    foundGift.image = imgToSendToServer
    // hit the server w the patch
    fetch(`http://localhost:3000/gifts/${e.target.dataset.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        "name": nameToSendToServer,
        "image": imgToSendToServer
      })
    })
  })

  // FILTER FUNCTIONALITY
  searchInput.addEventListener('input', (e) => {
    let userInput = searchInput.value.toLowerCase()
    let filtered = dataStore.filter((gift) => { return gift.name.includes(userInput) })
    // render the filtered data on to page
    let jsonAsHTML = filtered.map((giftObject) => {
      return `<li id="gift-${giftObject.id}"><h2>${giftObject.name}</h2>
              <img src="${giftObject.image}">
              <button id=${giftObject.id} >Edit Me</button>
              <button data-id="${giftObject.id}">Delete Me</button></li>
              `
    })
    giftsContainer.innerHTML = jsonAsHTML.join('')
  })


  // Helpers if you have time...

}) // DOMContentLoaded
