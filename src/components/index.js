import "../styles/index.css";
import { enableValidation } from "./validate.js";
import { createCard } from "./card.js";
import { addInitialCards } from "./card.js";
import { closePopup } from "./modal.js";
import { popupFormSubmit } from "./modal.js";
import { inputCardName } from "./modal.js";
import { inputCardLink } from "./modal.js";
import { popupTypeCard } from "./modal.js";

export const cardsContainer = document.querySelector(".cards");
addInitialCards();
enableValidation({
  formSelector: ".form",
  inputSelector: ".form__input",
  submitButtonSelector: ".form__button",
  inactiveButtonClass: "form__button_inactive",
  inputErrorClass: "form__input_type-error",
  errorClass: "form__input-error_active",
});

function handleSubmitformAddCard(e) {
  e.preventDefault();
  const nameValue = inputCardName.value;
  const linkValue = inputCardLink.value;
  const newCard = createCard(nameValue, linkValue);

  if (newCard) {
    cardsContainer.prepend(newCard);
  }

  closePopup(popupTypeCard);
}

popupFormSubmit.addEventListener("submit", handleSubmitformAddCard);
