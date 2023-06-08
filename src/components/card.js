import { openPopup } from "./modal.js";
import { ownerId } from "./index.js";
import {
  deleteCardFromServer,
  likeCardToServer,
  deleteLikeCardFromServer,
} from "./api.js";

const fullScreen = document.querySelector(".popup__fullscreen");
const fullScreenImage = fullScreen.querySelector(".popup__fullscreen-image");
const fullScreenHeading = fullScreen.querySelector(
  ".popup__fullscreen-heading"
);

export function createCard(nameValue, linkValue, cardId, cardLikes, cardOwner) {
  if (!linkValue) {
    return "";
  }
  const cardItem = createCardItem(nameValue, linkValue);
  setCardLikes(cardItem, cardLikes);
  addCardEventListeners(cardItem, cardId, cardLikes, cardOwner);
  return cardItem;
}

function createCardItem(nameValue, linkValue) {
  const cardTemplate = document.querySelector("#card").content;
  const cardItem = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardItem.querySelector(".card__image");
  cardImage.src = linkValue;
  cardImage.alt = `img = ${nameValue}`;
  cardItem.querySelector(".card__heading").textContent = nameValue;
  return cardItem;
}

function setCardLikes(cardItem, cardLikes) {
  const cardLikeCounter = cardItem.querySelector(".card__like-counter");
  cardLikeCounter.textContent = cardLikes.length;
  const myLike = cardLikes.some((item) => item._id === ownerId);
  if (myLike) {
    cardItem
      .querySelector(".card__like-button")
      .classList.add("card__like-button_active");
  }
}

function addCardEventListeners(cardItem, cardId, cardLikes, cardOwner) {
  const cardLikeButton = cardItem.querySelector(".card__like-button");
  cardLikeButton.addEventListener("click", () => {
    if (!cardLikeButton.classList.contains("card__like-button_active")) {
      likeCardToServer(cardId)
        .then((res) => {
          cardItem.querySelector(".card__like-counter").textContent =
            res.likes.length;
          cardLikeButton.classList.add("card__like-button_active");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      deleteLikeCardFromServer(cardId)
        .then((res) => {
          cardItem.querySelector(".card__like-counter").textContent =
            res.likes.length;
          cardLikeButton.classList.remove("card__like-button_active");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const cardDeleteButton = cardItem.querySelector(".card__trash");
  if (cardOwner._id === ownerId) {
    cardDeleteButton.addEventListener("click", () => {
      deleteCardFromServer(cardId)
        .then((res) => {
          console.log(res);
          cardItem.remove();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    cardDeleteButton.classList.add("card__trash_hidden");
  }
  const cardImageButton = cardItem.querySelector(".card__image");
  cardImageButton.addEventListener("click", () => {
    fullScreenImage.src = cardImageButton.src;
    fullScreenImage.alt = cardImageButton.alt;
    fullScreenHeading.textContent =
      cardItem.querySelector(".card__heading").textContent;
    openPopup(fullScreen);
  });
}
