const userInput = $('.input-text');
const itemSection = $('.item-section');

$('.submit-button').on('click', handleSubmit);
$('.item-section').on('click', '.delete-button', deleteItem);

function handleSubmit(event) {
  event.preventDefault();
  postItem(userInput.val(), false)
}

function addItem(name, packed, id) {
  console.log(name, packed, id)
  itemSection.append(
    `<div class="card" value="${id}">
      <h1 class="card-name">${name}</h1>
      <form class="checkbox-form">
        <input class="checkbox" type="checkbox" value="${packed}"/>
        <label for="checkbox">Packed</label>
      </form>
      <button class="delete-button">Delete</button>
    </div>`
  );
}

function postItem(name, packed) {
  const data = {
    item: {
      name,
      packed: packed || false
    }
  }
  console.log(data)
  fetch('/api/v1/items', {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then(response => response.json())
    .then(item => {
      addItem(name, packed, item.id)
    })
}

function getItems() {
  fetch('/api/v1/items', {
    'headers': {
      'content-type': 'application/json'
    },
    'method': 'GET'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.items.forEach(item => {
      addItem(item.name, item.checked, item.id)
    })
  })
}

getItems();

function deleteItem() {
  $(this).parent().remove();
}