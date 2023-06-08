const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/plus-cohort-25",
  headers: {
    authorization: "e00bece1-051d-4122-9ac3-6b73976b703d",
    "Content-Type": "application/json",
  },
};

export function getResponseData(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

export function request(url, options) {
  return fetch(url, options).then(getResponseData);
}

export function getUserInformation() {
  return request(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  });
}

export function getInitialCards() {
  return request(`${config.baseUrl}/cards`, {
    headers: config.headers,
  });
}

export function changeUserInformation(name, about) {
  return request(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    body: JSON.stringify({
      name: `${name}`,
      about: `${about}`,
    }),
    headers: config.headers,
  });
}

export function postNewCard(name, link) {
  return request(`${config.baseUrl}/cards`, {
    method: "POST",
    body: JSON.stringify({
      name: `${name}`,
      link: `${link}`,
    }),
    headers: config.headers,
  });
}

export function deleteCardFromServer(cardId) {
  return request(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
}

export function likeCardToServer(cardId) {
  return request(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  });
}

export function deleteLikeCardFromServer(cardId) {
  return request(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
}

export function changeUserAvatar(link) {
  return request(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    body: JSON.stringify({
      avatar: `${link}`,
    }),
    headers: config.headers,
  });
}
import { openPopup, closePopup, deletePopup, confirmDelete } from "./modal.js";
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

export function createCardItem(nameValue, linkValue) {
  const cardTemplate = document.querySelector("#card").content;
  const cardItem = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardItem.querySelector(".card__image");
  cardImage.src = linkValue;
  cardImage.alt = `img = ${nameValue}`;
  cardItem.querySelector(".card__heading").textContent = nameValue;
  return cardItem;
}

export function setCardLikes(cardItem, cardLikes) {
  const cardLikeCounter = cardItem.querySelector(".card__like-counter");
  cardLikeCounter.textContent = cardLikes.length;
  const myLike = cardLikes.some((item) => item._id === ownerId);
  if (myLike) {
    cardItem
      .querySelector(".card__like-button")
      .classList.add("card__like-button_active");
  }
}

export function addCardEventListeners(cardItem, cardId, cardLikes, cardOwner) {
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
      openPopup(deletePopup);
      confirmDelete()
        .then(() => {
          deleteCardFromServer(cardId)
            .then((res) => {
              console.log(res);
              closePopup(deletePopup);
              cardItem.remove();
            })
            .catch((err) => {
              console.log(err);
            });
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
      cardImageButton.nextElementSibling.textContent;
    openPopup(fullScreen);
  });
}
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
import { resetButtonState, clearFormErrors } from "./validate.js";
import { changeUserInformation, postNewCard, changeUserAvatar } from "./api.js";
import { createCard } from "./card.js";

export const cardsContainer = document.querySelector(".cards");

const popupCloseButton = document.querySelectorAll(".popup__close-button");
popupCloseButton.forEach((button) => {
  const popupNearest = button.closest(".popup");
  button.addEventListener("click", () => closePopup(popupNearest));
});

export function openPopup(popup) {
  popup.classList.add("popup_opened");
  const formElement = popup.querySelector(".form");
  if (formElement) {
    clearFormErrors(
      formElement,
      "form__input_type-error",
      "form__input-error_active"
    );
    formElement.reset();
  }

  document.addEventListener("keydown", closePopupEscape);
  popup.addEventListener("click", closePopupOverlay);
}

export function closePopup(popup) {
  popup.classList.remove("popup_opened");
  document.removeEventListener("keydown", closePopupEscape);
  popup.removeEventListener("click", closePopupOverlay);
}

function closePopupEscape(evt) {
  if (evt.key === "Escape") {
    const popup = document.querySelector(".popup_opened");
    closePopup(popup);
  }
}

function closePopupOverlay(evt) {
  if (evt.currentTarget === evt.target) {
    closePopup(evt.target);
  }
}

export const profileNameList = document.querySelector(".profile__name");
export const profileCaptionList = document.querySelector(".profile__caption");
export const profileAvatarList = document.querySelector(".profile__avatar");
const popupEditList = document.querySelector(".popup_edit-profile");
const formEditProfile = popupEditList.querySelector(".popup_form-edit");
const formName = formEditProfile.querySelector(".form__input_type_name");
const formAbout = formEditProfile.querySelector(".form__input_type_about");

const profileEditButtonList = document.querySelector(".profile__edit-button");

profileEditButtonList.addEventListener("click", () => {
  formName.value = profileNameList.textContent;
  formAbout.value = profileCaptionList.textContent;
  openPopup(popupEditList);
});

function updateButtonState(
  isLoading,
  btn,
  btnText = "Сохранить",
  loadingText = "Сохранение..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = btnText;
  }
}

export function handleFormSubmit(request, evt, loadingText = "Сохранение...") {
  evt.preventDefault();
  const submitBtn = evt.target.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  updateButtonState(true, submitBtn, originalText, loadingText);
  request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    })
    .finally(() => {
      updateButtonState(false, submitBtn, originalText);
    });
}

function handleSubmitformEditProfile(evt) {
  function sendRequest() {
    return changeUserInformation(formName.value, formAbout.value).then(
      (updatedData) => {
        profileNameList.textContent = updatedData.name;
        profileCaptionList.textContent = updatedData.about;
        profileAvatarList.src = updatedData.avatar;
        closePopup(popupEditList);
      }
    );
  }
  handleFormSubmit(sendRequest, evt);
}
formEditProfile.addEventListener("submit", handleSubmitformEditProfile);

export const popupTypeCard = document.querySelector(".popup_type-card");
export const popupFormSubmit =
  popupTypeCard.querySelector(".popup_form-submit");
export const inputCardName = popupFormSubmit.querySelector(
  ".form__input_card-name"
);
export const inputCardLink = popupFormSubmit.querySelector(".form__input_link");
const buttonElement = popupFormSubmit.querySelector(".form__button");

const addButton = document.querySelector(".profile__add-button");
addButton.addEventListener("click", () => {
  popupFormSubmit.reset();
  resetButtonState(buttonElement, "form__button_inactive");
  openPopup(popupTypeCard);
});

function handleSubmitformAddCard(evt) {
  function sendRequest() {
    return postNewCard(inputCardName.value, inputCardLink.value).then(
      (cardData) => {
        const newCard = createCard(
          cardData.name,
          cardData.link,
          cardData._id,
          cardData.likes,
          cardData.ownere
        );
        cardsContainer.prepend(newCard);
        closePopup(popupTypeCard);
      }
    );
  }
  handleFormSubmit(sendRequest, evt);
}

popupFormSubmit.addEventListener("submit", handleSubmitformAddCard);

export const avatarPopupWindow = document.querySelector(".popup_edit-avatar");
export const avatarFormElement =
  avatarPopupWindow.querySelector(".popup_form-avatar");
export const avatarLinkInputField =
  avatarFormElement.querySelector(".form__input_link");
const changeAvatarButton = avatarFormElement.querySelector(".form__button");

const openAvatarPopupButton = document.querySelector(".profile__avatar-button");
openAvatarPopupButton.addEventListener("click", () => {
  avatarFormElement.reset();
  changeAvatarButton.classList.add("form__button_inactive");
  changeAvatarButton.disabled = true;
  openPopup(avatarPopupWindow);
});

function handleAvatarChangeSubmit(evt) {
  function sendRequest() {
    return changeUserAvatar(avatarLinkInputField.value).then((avatarData) => {
      profileAvatarList.src = avatarData.avatar;
      closePopup(avatarPopupWindow);
    });
  }
  handleFormSubmit(sendRequest, evt);
}

avatarFormElement.addEventListener("submit", handleAvatarChangeSubmit);

export const deletePopup = document.querySelector(".popup_delete-card");
const deleteButton = deletePopup.querySelector(".form__button");
export function confirmDelete() {
  return new Promise((resolve) => {
    deleteButton.onclick = function () {
      resolve();
    };
  });
}
const showError = (
  formElement,
  inputElement,
  errorMessage,
  inputErrorClass,
  errorClass
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.classList.add(errorClass);
  errorElement.textContent = errorMessage;
};

const hideError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";
};

export function clearFormErrors(formElement, inputErrorClass, errorClass) {
  const inputList = Array.from(formElement.querySelectorAll(".form__input"));
  const errorList = Array.from(
    formElement.querySelectorAll(".form__input-error")
  );

  inputList.forEach((inputElement) => {
    inputElement.classList.remove(inputErrorClass);
  });

  errorList.forEach((errorElement) => {
    errorElement.textContent = "";
    errorElement.classList.remove(errorClass);
  });
}

const checkInputValidity = (
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      inputErrorClass,
      errorClass
    );
  } else {
    hideError(formElement, inputElement, inputErrorClass, errorClass);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

export function resetButtonState(buttonElement, inactiveButtonClass) {
  buttonElement.classList.add(inactiveButtonClass);
  buttonElement.disabled = true;
}

function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    resetButtonState(buttonElement, inactiveButtonClass);
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

const setEventListeners = (
  formElement,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass
) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function (e) {
      toggleButtonState(inputList, buttonElement, inactiveButtonClass);
      checkInputValidity(
        formElement,
        inputElement,
        inputErrorClass,
        errorClass
      );
    });
  });
};

export function enableValidation({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass,
}) {
  const formList = Array.from(document.querySelectorAll(formSelector));
  formList.forEach((formElement) => {
    setEventListeners(
      formElement,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
      inputErrorClass,
      errorClass
    );
  });
}
