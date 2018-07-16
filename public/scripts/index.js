const userInput = $('.input-text');
const itemSection = $('.item-section');

$('.submit-button').on('click', addItem);
$('.item-section').on('click', '.delete-button', deleteItem);

function addItem(event) {
  event.preventDefault();
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

function deleteItem() {
  $(this).parent().remove();
}