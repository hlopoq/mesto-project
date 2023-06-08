import "../styles/index.css";
import { enableValidation } from "./validate.js";
import { createCard } from "./card.js";
import { getUserInformation, getInitialCards } from "./api.js";
import {
  cardsContainer,
  profileNameList,
  profileCaptionList,
  profileAvatarList,
} from "./modal.js";

export let ownerId = "";

Promise.all([getUserInformation(), getInitialCards()])
  .then(([updatedData, cards]) => {
    console.log(updatedData);
    console.log(cards);
    profileNameList.textContent = updatedData.name;
    profileCaptionList.textContent = updatedData.about;
    profileAvatarList.src = updatedData.avatar;
    ownerId = updatedData._id;
    cards.reverse();
    cards.forEach((cardData) => {
      const newCard = createCard(
        cardData.name,
        cardData.link,
        cardData._id,
        cardData.likes,
        cardData.owner
      );
      cardsContainer.prepend(newCard);
    });
  })
  .catch((err) => {
    console.log(err);
  });

enableValidation({
  formSelector: ".form",
  inputSelector: ".form__input",
  submitButtonSelector: ".form__button",
  inactiveButtonClass: "form__button_inactive",
  inputErrorClass: "form__input_type-error",
  errorClass: "form__input-error_active",
});
