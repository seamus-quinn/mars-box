const submitButton = $('.submit-button');
const userInput = $('.input-text');
const itemSection = $('.item-section');

submitButton.on('click', addItem);


function addItem(event) {
  event.preventDefault();
  console.log(itemSection)
  itemSection.append(
    `<div class="card">
      <h1 class="card-name">${userInput.val()}</h1>
      <form class="checkbox-form">
        <input class="checkbox" type="checkbox" />
        <label for="checkbox">Packed</label>
      </form>
      <button class="delete-button">Delete</button>
    </div>`
  );
}