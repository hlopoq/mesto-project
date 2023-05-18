import "./styles/index.css";
import { enableValidation } from "./components/validate.js";
import { createCard } from "./components/card.js";
import { addInitialCards } from "./components/card.js";
import { closePopup } from "./components/modal.js";
import { popupFormSubmit } from "./components/modal.js";
import { inputCardName } from "./components/modal.js";
import { inputCardLink } from "./components/modal.js";
import { popupTypeCard } from "./components/modal.js";

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
