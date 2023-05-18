import { openPopup } from "./modal.js";
import { initialCards } from "./constants.js";
import { cardsContainer } from "./index.js";

const fullScreen = document.querySelector(".popup__fullscreen");
const fullScreenImage = fullScreen.querySelector(".popup__fullscreen-image");
const fullScreenHeading = fullScreen.querySelector(
  ".popup__fullscreen-heading"
);

export function createCard(nameValue, linkValue) {
  const cardTemplate = document.querySelector("#card").content;
  if (linkValue) {
    const cardItem = cardTemplate.querySelector(".card").cloneNode(true);
    cardItem.querySelector(".card__image").src = linkValue;
    cardItem.querySelector(".card__image").alt = nameValue;
    cardItem.querySelector(".card__heading").textContent = nameValue;
    cardItem
      .querySelector(".card__like-button")
      .addEventListener("click", function (e) {
        e.target.classList.toggle("card__like-button_active");
      });
    cardItem
      .querySelector(".card__trash")
      .addEventListener("click", function (e) {
        e.target.closest(".card").remove();
      });
    cardItem
      .querySelector(".card__image")
      .addEventListener("click", function (e) {
        fullScreenImage.src = e.target.closest(".card__image").src;
        fullScreenImage.alt = e.target.closest(".card__image").alt;
        fullScreenHeading.textContent =
          e.target.closest(".card__image").nextElementSibling.textContent;
        openPopup(fullScreen);
      });
    return cardItem;
  } else {
    return "";
  }
}

export function addInitialCards() {
  for (let i = 0; i < initialCards.length; i++) {
    const nameValue = initialCards[i].name;
    const linkValue = initialCards[i].link;
    const newCard = createCard(nameValue, linkValue);
    cardsContainer.prepend(newCard);
  }
}
