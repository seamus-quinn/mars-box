const submitButton = document.querySelector('.submit-button');
const userInput = document.querySelector('.input-text');
const itemSection = document.querySelector('.item-section');

submitButton.addEventListener('click', addItem);



function addItem(event) {
  event.preventDefault();
  itemSection.innerHTML = userInput.value;
}