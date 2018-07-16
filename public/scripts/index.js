const submitButton = document.querySelector('.submit-button');
const userInput = document.querySelector('.input-text');
const itemSection = document.querySelector('.item-section');

submitButton.addEventListener('click', addItem);



function addItem(event) {
  event.preventDefault();
  const card = createCard(userInput.value);
  console.log(card);
  itemSection.innerHTML = card;
}

function createCard(userInput) {
  return `<div class="card">
      <h1 class="card-name">${userInput}</h1>
      <form class="checkbox-form">
        <input class="checkbox" type="checkbox" />
        <label for="checkbox">Packed</label>
      </form>
      <button class="delete-button">Delete</button>
    </div>`
}