const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})


// OR HERE!
document.addEventListener("DOMContentLoaded", function(){
  console.log("DOM")
  let stableParent = document.getElementById("toy-collection")

  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(toys => toys.forEach(function(toy){
    stableParent.append(createDiv(toy))
  }))

  let addToyForm = document.querySelector(".add-toy-form")
  addToyForm.addEventListener("submit", addToyFormInputs)

  stableParent.addEventListener("click", multiEventHandler)

  // let editToyForm = document.querySelector(".edit-toy-form")
  // editToyForm.addEventListener("submit", editToyFormInputs)

  })


function createDiv(toy){
  console.log("hello")
  let cardDiv = document.createElement("div")
  cardDiv.className = "card"
  cardDiv.dataset.id = toy.id
  let h2 = document.createElement("h2")
  h2.innerText = toy.name
  let toyImg = document.createElement("img")
  toyImg.className = "toy-avatar"
  toyImg.src = toy.image
  let p = document.createElement("p")
  p.innerText = `${toy.likes} Likes`
  let button = document.createElement("button")
  button.className = "like-btn"
  button.innerText = "Like <3"

  let editBtn = document.createElement("button")
  editBtn.className = "edit-btn"
  editBtn.innerText = "Edit"

  let deleteBtn = document.createElement("button")
  deleteBtn.className = "delete-btn"
  deleteBtn.innerText = "X"

  cardDiv.append(h2, toyImg, p, button, editBtn, deleteBtn)
  return cardDiv
}

function addToyFormInputs(event){
  event.preventDefault()

  let newToyName = event.target.name.value
  console.log(event.target.image)
  let newToyImage = event.target.image.value

  postToy(newToyName, newToyImage)
  event.target.reset()
}

function postToy(name, img) {
    let stableParent = document.getElementById("toy-collection")
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name:name, image:img, likes:0})
  }).then(res => res.json())
  .then(newData => stableParent.append(createDiv(newData)))
}

function multiEventHandler(event){

  if(event.target.className === "like-btn"){

    let id = parseInt(event.target.parentNode.dataset.id)
    let pTag = event.target.parentNode.querySelector("p")
    let likesNum = parseInt(pTag.innerText.split(" ")[0])
    likesNum++

    editLikes(id, likesNum, pTag)

  } else if (event.target.className === "edit-btn") {
    let editId = event.target.parentNode.dataset.id
    let editName = event.target.parentNode.querySelector("h2").innerText
    let editImage = event.target.parentNode.querySelector("img").src
    editForm(editId, editName, editImage)
    let editToyForm = document.querySelector(".edit-toy-form")
    editToyForm.addEventListener("submit", editToyFormInputs)
  } else if (event.target.className === "delete-btn"){
    let deleteId = parseInt(event.target.parentNode.dataset.id)
    let cardNode = event.target.parentNode
    deleteCard(deleteId, cardNode)
  }
}

function editLikes(id, likesNum, pTag){
  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({likes: likesNum})
  }).then(res => res.json())
  .then(toyObj => {
    pTag.innerText = `${toyObj.likes} Likes`
  })

}

function editForm(editId, editName, editImage){
  let formDiv = document.querySelector(".container")
  let editForm = document.createElement("form")
  editForm.className = "edit-toy-form"
  let h3 = document.createElement("h3")
  h3.innerText = "Edit a toy!"

  let span = document.createElement("span")
  span.style = "display:none"
  span.innerText = editId

  let inputName = document.createElement("input")
  inputName.type = "text"
  inputName.name = "editName"
  inputName.value = editName
  inputName.className = "input-text"

  let inputImage = document.createElement("input")
  inputImage.type = "text"
  inputImage.name = "editImage"
  inputImage.value = editImage
  inputImage.className = "input-text"

  let inputSubmit = document.createElement("input")
  inputSubmit.type = "submit"
  inputSubmit.name = "submit"
  inputSubmit.value = "Edit A Toy"
  inputSubmit.className = "submit"

  let br = document.createElement("br")

  editForm.append(span, h3, inputName, br, inputImage, br, inputSubmit)
  formDiv.append(editForm)

}
function editToyFormInputs(event){

  event.preventDefault()
  let editToyId = parseInt(event.target.querySelector("span").innerText)
  let editToyName = event.target.editName.value
  let editToyImage = event.target.editImage.value
  event.target.reset()
  updateAndShow(editToyId, editToyName, editToyImage)
}

function updateAndShow(editToyId, editToyName, editToyImage) {

  fetch(`http://localhost:3000/toys/${editToyId}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name: editToyName, image: editToyImage})
  }).then(res => res.json())
  .then(editedToy => {

    let theDiv = document.querySelector(`[data-id = '${editToyId}']`)
      theDiv.querySelector("h2").innerText = editToyName
      theDiv.querySelector("img").src = editToyImage
  })
}

function deleteCard(deleteId, cardNode) {
  fetch(`http://localhost:3000/toys/${deleteId}`, { method: "DELETE" })
    .then(res => {
      cardNode.remove()
    })
}
