// FETCH AND AJAX
document.addEventListener('DOMContentLoaded', () => { // event object is optional here
// ******** DOM ELEMENTS ***************
  const editGiftForm = document.getElementById('new-gift-form')
  let giftsContainer = document.getElementById('gift-container')
  const giftNameInput = document.getElementById('gift-name-input')
  const giftImgInput = document.getElementById('gift-image-input')
  const searchBox = document.getElementById('search-box') // make use of this in the search deliverable
// ********** VARIABLES ***************
  const giftsURL = 'http://localhost:3000/gifts'
 // fill this in the get request
 let allGifts = ''
// ********** FETCHES & EVENT LISTENERS **********
  fetch(giftsURL, { method: 'GET' })
    .then(r => r.json())
    .then(arrayOfGiftObjects => {
      allGifts = arrayOfGiftObjects
      console.log(allGifts);
      // console.log(parsedJSON);
      arrayOfGiftObjects.forEach((giftObject) => {
        giftsContainer.innerHTML += `<div data-id="${giftObject.id}">
                                      <h3>${giftObject.name}</h3>
                                      <img src=${giftObject.image}>
                                      <button data-id="${giftObject.id}" class="edit" type="button">Edit Me!</button>
                                      <button data-id="${giftObject.id}" class="delete" type="button">Delete</button>
                                      </div>
                                      `
      })
    }) // end of fetch

    // event listener for CLICKING the EDIT BUTTON OR DELETE
    // we didn't update our data yet!
    giftsContainer.addEventListener('click', e => {
      const clickedGiftId = e.target.dataset.id
      if (e.target.className === 'edit') { // when we click EDIT button
        fetch(`http://localhost:3000/gifts/${clickedGiftId}`)
          .then(r => r.json())
          .then(foundGift => {
            // find input fields for the form and pre fill them
            giftNameInput.value = foundGift.name
            giftImgInput.value = foundGift.image
            editGiftForm.dataset.id = clickedGiftId
            console.log(editGiftForm.dataset.id); // save the id of the clicked image in a dataset on the edit form u will then submit on
          })
      } else if (e.target.className === 'delete') {

        giftsContainer.querySelector(`[data-id='${clickedGiftId}']`).remove() // optimistically render the edit

        fetch(`http://localhost:3000/gifts/${clickedGiftId}`, {
          method: 'DELETE'
        })
        .then(r => r.json())
        .then(console.log) // pessimistically would be inside this then
      }
    }) // end of edit click event listener

    // patching/fetch event listener for when u submit on edit form
    editGiftForm.addEventListener('submit', e => {
      e.preventDefault()
      // console.log(e);
      fetch(`http://localhost:3000/gifts/${e.target.dataset.id}`, { // id stored in the form itself that we assigned with editGiftForm.dataset.id = clickedGiftId
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: giftNameInput.value,
          image: giftImgInput.value
        })
      }) // fetch
      .then(r => r.json())
      .then(editedGiftObj => {
        // console.log(editedGiftObj);
        // append to DOM - find the one gift and update it
        console.log(editedGiftObj.id);
        let divOfGiftToUpdate = document.getElementById(`${editedGiftObj.id}`)
        divOfGiftToUpdate.querySelector('h3').innerText = editedGiftObj.name
        divOfGiftToUpdate.querySelector('img').src = editedGiftObj.image
      })
    }) // submit event listener

      // search for and filter particular gifts with names that include a particular search query.
      searchBox.addEventListener('input', e => {
        const userInput = e.target.value
        // console.log(userInput);
        const filteredGifts = allGifts.filter((gift) => {
          return gift.name.includes(userInput) // filtered the array in memory
        })
        // now render it in the DOM!
        const giftHTML = filteredGifts.map((giftObject) => {
          return `
                  <div data-id="${giftObject.id}">
                    <h3>${giftObject.name}</h3>
                    <img src=${giftObject.image}>
                    <button data-id="${giftObject.id}" class="edit" type="button">Edit Me!</button>
                    <button data-id="${giftObject.id}" class="delete" type="button">Delete</button>
                  </div>
                  `
        })
        giftsContainer.innerHTML = giftHTML.join('')
      }) // search box event listener

}) // end of DOMContentLoaded

// TODO:
